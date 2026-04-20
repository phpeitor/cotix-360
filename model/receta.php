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
}