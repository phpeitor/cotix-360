<?php
session_start();
require_once __DIR__ . '/../database/conexion.php';

class Cotizacion {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    public function begin(): void
    {
        $this->conn->beginTransaction();
    }

    public function commit(): void
    {
        $this->conn->commit();
    }

    public function rollback(): void
    {
        if ($this->conn->inTransaction()) {
            $this->conn->rollBack();
        }
    }

    public function table_cotizacion(string $fec_ini, string $fec_fin): array
    {
        $where = "c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)";

        if (!in_array($_SESSION['session_cargo'], [1, 3])) {
            $where .= " AND c.usuario_id = :usuario_id";
        }

        $sql = "
            SELECT
                c.id,
                p.usuario,
                c.estado,
                c.created_at,
                c.updated_at,
                c.cuota,
                COALESCE(SUM(cd.cantidad), 0) AS total_items,
                GROUP_CONCAT(
                    CONCAT(cd.modelo, ' x ', COALESCE(cd.cantidad, 0))
                    ORDER BY cd.modelo
                    SEPARATOR ' | '
                ) AS items
            FROM cotizaciones c
            LEFT JOIN cotizacion_detalle cd ON cd.cotizacion_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            WHERE $where
            GROUP BY
                c.id, p.usuario, c.estado, c.created_at, c.updated_at, c.cuota
            ORDER BY c.id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!in_array($_SESSION['session_cargo'], [1, 3])) {
            $stmt->bindValue(':usuario_id', $_SESSION['session_id'], PDO::PARAM_INT);
        }

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$rows) {
            return [];
        }

        $ids = array_map(static fn(array $r): int => (int)$r['id'], $rows);
        $detailsByCotizacion = $this->getDetallesForCotizaciones($ids);
        $fleteTable = $this->getFleteTable();
        $gastoTable = $this->getGastoTable();

        foreach ($rows as &$row) {
            $cotizacionId = (int)$row['id'];
            $detalles = $detailsByCotizacion[$cotizacionId] ?? [];

            $totalFob = 0.0;
            $pesosPorPais = [];

            foreach ($detalles as $detalle) {
                $qty = (int)$detalle['cantidad'];
                $peso = (float)$detalle['peso'];
                $precio = (float)$detalle['precio_unitario'];
                $margen = $this->getMargenByGrupo($detalle['grupo'] ?? '');
                $precioDscto = $precio * (1 - $margen);

                $totalFob += $precioDscto * $qty;

                $pais = $this->normalizarPais($detalle['pais_origen'] ?? '');
                if (!isset($pesosPorPais[$pais])) {
                    $pesosPorPais[$pais] = 0.0;
                }
                $pesosPorPais[$pais] += $peso * $qty;
            }

            $totalFlete = 0.0;
            foreach ($pesosPorPais as $pais => $pesoTotal) {
                $totalFlete += $this->calcularFletePorPais($pais, (float)$pesoTotal, $fleteTable);
            }

            $gasto = $this->calcularGasto($totalFob, $gastoTable);
            $totalPeruBase = round($totalFob + $totalFlete + $gasto, 2);
            $row['total_peru'] = $totalPeruBase;

            // Calcular interés financiero si existe cuota
            $interesFinanciamiento = 0.0;
            $cuotaValida = !empty($row['cuota']) && is_numeric($row['cuota']);
            if ($cuotaValida) {
                $cuota = (float)$row['cuota'];
                $totalCuotas = $cuota * 5;
                $interesFinanciamiento = max(0, round($totalCuotas - $totalPeruBase, 2));
            }
            $row['interes_financiamiento'] = $interesFinanciamiento;
        }
        unset($row);

        return $rows;
    }

    private function getDetallesForCotizaciones(array $ids): array
    {
        if (!$ids) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $sql = "SELECT cotizacion_id, cantidad, peso, precio_unitario, grupo, pais_origen
                FROM cotizacion_detalle
                WHERE cotizacion_id IN ($placeholders)";

        $stmt = $this->conn->prepare($sql);
        foreach (array_values($ids) as $idx => $id) {
            $stmt->bindValue($idx + 1, (int)$id, PDO::PARAM_INT);
        }
        $stmt->execute();

        $out = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $cid = (int)$row['cotizacion_id'];
            if (!isset($out[$cid])) {
                $out[$cid] = [];
            }
            $out[$cid][] = $row;
        }

        return $out;
    }

    private function getFleteTable(): array
    {
        $sql = "SELECT pais, peso, flete FROM flete";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    private function getGastoTable(): array
    {
        $sql = "SELECT valor_inicial, valor_final, costo FROM gastos ORDER BY valor_inicial ASC";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    private function getMargenByGrupo(?string $grupo): float
    {
        if (!$grupo) {
            return 0.32;
        }

        if (preg_match('/\d+/', (string)$grupo, $m) !== 1) {
            return 0.32;
        }

        $n = (int)$m[0];
        $map = [
            0 => 0.00,
            1 => 0.15,
            2 => 0.25,
            3 => 0.28,
            4 => 0.30,
            5 => 0.31,
            6 => 0.33,
            7 => 0.35,
            8 => 0.36,
            9 => 0.40,
            10 => 0.45,
            11 => 0.50,
            12 => 0.55,
        ];

        return $map[$n] ?? 0.32;
    }

    private function normalizarPais(?string $pais): string
    {
        return strtoupper(trim((string)$pais)) === 'USA' ? 'USA' : 'CHINA';
    }

    private function calcularFletePorPais(string $pais, float $pesoTotal, array $fleteTable): float
    {
        $paisCalc = $this->normalizarPais($pais);
        $tarifas = array_values(array_filter($fleteTable, static fn(array $r): bool => ($r['pais'] ?? '') === $paisCalc));

        if (!$tarifas) {
            $tarifas = array_values(array_filter($fleteTable, static fn(array $r): bool => ($r['pais'] ?? '') === 'CHINA'));
        }

        if (!$tarifas) {
            return 0.0;
        }

        usort($tarifas, static fn(array $a, array $b): int => ((float)$a['peso']) <=> ((float)$b['peso']));

        foreach ($tarifas as $row) {
            if ($pesoTotal <= (float)$row['peso']) {
                return (float)$row['flete'];
            }
        }

        return (float)$tarifas[count($tarifas) - 1]['flete'];
    }

    private function calcularGasto(float $totalFob, array $gastoTable): float
    {
        if (!$gastoTable) {
            return 0.0;
        }

        foreach ($gastoTable as $row) {
            $min = (float)$row['valor_inicial'];
            $max = (float)$row['valor_final'];
            if ($totalFob >= $min && $totalFob <= $max) {
                return (float)$row['costo'];
            }
        }

        return (float)$gastoTable[count($gastoTable) - 1]['costo'];
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT c.*,p.usuario, p2.usuario as usu_upd
                FROM cotizaciones c
                LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
                LEFT JOIN personal p2 on p2.IDPERSONAL=c.usuario_upd
                WHERE MD5(id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerDetallePorHash(string $hash): array {
        $sql = "SELECT *
                FROM cotizacion_detalle
                WHERE MD5(cotizacion_id) = :hash";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado(int $id, string $estado, int $usuario_upd): bool {
        $sql = "UPDATE cotizaciones 
                SET estado = :estado, updated_at = :updated_at, usuario_upd = :usuario_upd
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':estado', $estado);
        $stmt->bindValue(':usuario_upd', $usuario_upd);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function obtener_financiamiento(int $id): ?array
    {
        $sql = "SELECT id, tasa, cuota FROM cotizaciones WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function guardar_financiamiento(int $id, float $tasa, float $cuota, int $usuario_upd): bool
    {
        $sql = "UPDATE cotizaciones
                SET tasa = :tasa,
                    cuota = :cuota,
                    updated_at = :updated_at,
                    usuario_upd = :usuario_upd
                WHERE id = :id
                  AND tasa IS NULL
                  AND cuota IS NULL";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tasa', $tasa);
        $stmt->bindValue(':cuota', $cuota);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':usuario_upd', $usuario_upd, PDO::PARAM_INT);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function g_cotizacion(array $data): int
    {
        $sql = "INSERT INTO cotizaciones
                (usuario_id, estado, created_at)
                VALUES
                (:usuario_id, :estado, :created_at)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':usuario_id', (int)$data['usuario_id'], PDO::PARAM_INT);
        $stmt->bindValue(':estado', $data['estado'] ?? 'Borrador');
        $stmt->bindValue(':created_at', $this->nowLima);

        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function g_cotizacion_detalle(array $data): int
    {
        $sql = "INSERT INTO cotizacion_detalle
            (cotizacion_id, item_id, modelo, descripcion, categoria, grupo,
            cantidad, peso, precio_unitario, status, pais_origen, margen)
            VALUES
            (:cotizacion_id, :item_id, :modelo, :descripcion, :categoria, :grupo,
            :cantidad, :peso, :precio_unitario, :status, :pais_origen, :margen)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':cotizacion_id', (int)$data['cotizacion_id'], PDO::PARAM_INT);
        $stmt->bindValue(':item_id', (int)$data['item_id'], PDO::PARAM_INT);
        $stmt->bindValue(':modelo', $data['modelo'] ?? '');
        $stmt->bindValue(':descripcion', $data['descripcion'] ?? '');
        $stmt->bindValue(':categoria', $data['categoria'] ?? '');
        $stmt->bindValue(':grupo', $data['grupo'] ?? '');
        $stmt->bindValue(':cantidad', (int)($data['cantidad'] ?? 1), PDO::PARAM_INT);
        $stmt->bindValue(':peso', $data['peso'] ?? 0);
        $stmt->bindValue(':precio_unitario', $data['precio_unitario'] ?? 0);
        $stmt->bindValue(':status', $data['status'] ?? 'Active');
        $stmt->bindValue(':pais_origen', $data['pais_origen'] ?? '');
        $stmt->bindValue(':margen', $data['margen'] ?? 0);

        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

}
?>