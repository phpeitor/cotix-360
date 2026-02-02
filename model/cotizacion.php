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
                COUNT(cd.id) AS total_items,
                GROUP_CONCAT(
                    CONCAT(cd.modelo, ': ', cd.descripcion)
                    ORDER BY cd.modelo
                    SEPARATOR ' | '
                ) AS items
            FROM cotizaciones c
            LEFT JOIN cotizacion_detalle cd ON cd.cotizacion_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            WHERE $where
            GROUP BY
                c.id, p.usuario, c.estado, c.created_at, c.updated_at
            ORDER BY c.id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!in_array($_SESSION['session_cargo'], [1, 3])) {
            $stmt->bindValue(':usuario_id', $_SESSION['session_id'], PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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