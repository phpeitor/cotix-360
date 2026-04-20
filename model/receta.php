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
        $sessionCargo = $_SESSION['session_cargo'] ?? null;
        $sessionId = $_SESSION['session_id'] ?? null;
        $isAdmin = in_array((int)$sessionCargo, [1, 3], true);

        $where = "c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)";

        if (!$isAdmin) {
            if ((int)$sessionId <= 0) {
                return [];
            }

            $where .= " AND c.usuario_id = :usuario_id";
        }

        $sql = "
            SELECT
                c.id,
                p.usuario,
                c.estado,
                c.created_at,
                c.updated_at,
                COALESCE(SUM(cd.cantidad), 0) AS total_items,
                GROUP_CONCAT(
                    CONCAT(cd.nombre, ' x ', COALESCE(cd.cantidad, 0))
                    ORDER BY cd.nombre
                    SEPARATOR ' | '
                ) AS items
            FROM recetas c
            LEFT JOIN receta_detalle cd ON cd.receta_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            WHERE $where
            GROUP BY
                c.id, p.usuario, c.estado, c.created_at, c.updated_at
            ORDER BY c.id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!$isAdmin) {
            $stmt->bindValue(':usuario_id', (int)$sessionId, PDO::PARAM_INT);
        }

        //echo $sql;

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$rows) {
            return [];
        }

        return $rows;
    }
}