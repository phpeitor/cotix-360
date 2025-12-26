<?php
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

    public function table_carga(): array{
         $sql = "SELECT *
                FROM carga
                where estado=1
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
            cantidad, peso, precio_unitario, status)
            VALUES
            (:cotizacion_id, :item_id, :modelo, :descripcion, :categoria, :grupo,
            :cantidad, :peso, :precio_unitario, :status)";

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

        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

}
?>