<?php
require_once __DIR__ . '/../database/conexion.php';

class Receta {
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

    public function guardarCabecera(array $data): int
    {
        $sql = "INSERT INTO recetas (
                    usuario_id,
                    estado,
                    created_at,
                    updated_at,
                    usuario_upd,
                    tipo_cambio
                ) VALUES (
                    :usuario_id,
                    :estado,
                    :created_at,
                    :updated_at,
                    :usuario_upd,
                    :tipo_cambio
                )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':usuario_id', (int)($data['usuario_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':estado', (string)($data['estado'] ?? 'Enviada'), PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':updated_at', $this->nowLima);

        if (array_key_exists('usuario_upd', $data) && $data['usuario_upd'] !== null) {
            $stmt->bindValue(':usuario_upd', (int)$data['usuario_upd'], PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':usuario_upd', null, PDO::PARAM_NULL);
        }

        $stmt->bindValue(':tipo_cambio', (float)($data['tipo_cambio'] ?? 0));

        $stmt->execute();

        return (int)$this->conn->lastInsertId();
    }

    public function guardarDetalle(array $data): bool
    {
        $sql = "INSERT INTO receta_detalle (
                    receta_id,
                    item_id,
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    marca,
                    modelo,
                    nombre,
                    descripcion,
                    uni_medida,
                    precio,
                    moneda,
                    tipo,
                    created_at,
                    cantidad
                ) VALUES (
                    :receta_id,
                    :item_id,
                    :categoria,
                    :sub_cat_1,
                    :sub_cat_2,
                    :marca,
                    :modelo,
                    :nombre,
                    :descripcion,
                    :uni_medida,
                    :precio,
                    :moneda,
                    :tipo,
                    :created_at,
                    :cantidad
                )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':item_id', (int)($data['item_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':categoria', (string)($data['categoria'] ?? ''));
        $stmt->bindValue(':sub_cat_1', (string)($data['sub_cat_1'] ?? ''));
        $stmt->bindValue(':sub_cat_2', (string)($data['sub_cat_2'] ?? ''));
        $stmt->bindValue(':marca', (string)($data['marca'] ?? ''));
        $stmt->bindValue(':modelo', (string)($data['modelo'] ?? ''));
        $stmt->bindValue(':nombre', (string)($data['nombre'] ?? ''));
        $stmt->bindValue(':descripcion', (string)($data['descripcion'] ?? ''));
        $stmt->bindValue(':uni_medida', (string)($data['uni_medida'] ?? ''));
        $stmt->bindValue(':precio', (float)($data['precio'] ?? 0));
        $stmt->bindValue(':moneda', (string)($data['moneda'] ?? ''));
        $stmt->bindValue(':tipo', (string)($data['tipo'] ?? ''));
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':cantidad', (int)($data['cantidad'] ?? 0), PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function table_receta(string $fec_ini, string $fec_fin): array
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
                c.tasa,
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
                c.id, p.usuario, c.estado, c.created_at, c.updated_at, c.tasa, c.cuota
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

            // Calcular interés financiero igual que en el modal (sumando interés por periodo redondeado).
            $interesFinanciamiento = $this->calcularInteresFinanciamiento(
                $row['tasa'] ?? null,
                $row['cuota'] ?? null,
                $totalPeruBase,
                5
            );
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
}