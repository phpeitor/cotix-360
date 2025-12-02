<?php
require_once "../database/conexion.php";

class Item {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    public function baja(int $id): bool {
        $sql = "UPDATE item 
                SET estado = 0
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function guardar(array $data): int {
        $sql = "INSERT INTO item (
                    modelo,
                    precio_unitario,
                    moneda,
                    grupo_descuento,
                    descripcion,
                    categoria_producto,
                    clase_producto,
                    pais_origen,
                    peso,
                    status,
                    proveedor,
                    origen
                )
                VALUES 
                (:modelo, :precio_unitario, :moneda, :grupo_descuento, :descripcion, :categoria_producto, :clase_producto, :pais_origen, :peso, :status, :proveedor, :origen)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':modelo',   $data['modelo'] ?? '');
        $stmt->bindValue(':precio_unitario', $data['precio_unitario'] ?? '');
        $stmt->bindValue(':moneda',     $data['moneda'] ?? '');
        $stmt->bindValue(':grupo_descuento', $data['grupo_descuento'] ?? '');
        $stmt->bindValue(':descripcion',  $data['descripcion'] ?? '');
        $stmt->bindValue(':categoria_producto',  $data['categoria_producto'] ?? '');
        $stmt->bindValue(':clase_producto',  $data['clase_producto'] ?? '');
        $stmt->bindValue(':pais_origen',  $data['pais_origen'] ?? '');
        $stmt->bindValue(':peso',  $data['peso'] ?? '');
        $stmt->bindValue(':status',  $data['status'] ?? '');
        $stmt->bindValue(':proveedor',  $data['proveedor'] ?? '');
        $stmt->bindValue(':origen',  $data['origen'] ?? '');
        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function table_personal(): array{
         $sql = "SELECT *
                FROM item
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT *
                FROM item
                WHERE MD5(id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

}
?>