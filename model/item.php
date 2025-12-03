<?php
require_once __DIR__ . '/../database/conexion.php';

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

    public function v($value): string {
        return trim((string)($value ?? ''));
    }

    public function guardarLote(array $rows): int {
        if (empty($rows)) return 0;
        
        $cols = [
            'modelo',
            'precio_unitario',
            'moneda',
            'grupo_descuento',
            'descripcion',
            'categoria_producto',
            'clase_producto',
            'pais_origen',
            'peso',
            'status',
            'proveedor',
            'origen',
            'id_carga'
        ];

        $placeholders = [];
        $values = [];

        foreach ($rows as $r) {
            // normalizo y garantizo todas las columnas para evitar errores
            $placeholders[] = "(" . rtrim(str_repeat('?,', count($cols)), ',') . ")";
            // push values en el mismo orden que $cols
            $values[] = $this->v($r['modelo'] ?? '');
            // precio_unitario y peso deben ser números
            $values[] = isset($r['precio_unitario']) && $r['precio_unitario'] !== '' ? (float)$r['precio_unitario'] : 0.0;
            $values[] = $this->v($r['moneda'] ?? '');
            $values[] = $this->v($r['grupo_descuento'] ?? '');
            $values[] = $this->v($r['descripcion'] ?? '');
            $values[] = $this->v($r['categoria_producto'] ?? '');
            $values[] = $this->v($r['clase_producto'] ?? '');
            $values[] = $this->v($r['pais_origen'] ?? '');
            $values[] = isset($r['peso']) && $r['peso'] !== '' ? (float)$r['peso'] : 0.0;
            $values[] = $this->v($r['status'] ?? '');
            $values[] = $this->v($r['proveedor'] ?? '');
            $values[] = $this->v($r['origen'] ?? '');
            $values[] = isset($r['id_carga']) ? (int)$r['id_carga'] : null;
        }

        $sql = "INSERT INTO item (" . implode(',', $cols) . ") VALUES " . implode(',', $placeholders);

        // Ejecutar en transacción para mayor seguridad
        try {
            $this->conn->beginTransaction();
            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute($values);
            if (!$ok) {
                $this->conn->rollBack();
                throw new Exception("Error al ejecutar insert masivo");
            }
            $count = $stmt->rowCount();
            $this->conn->commit();
            return $count;
        } catch (Throwable $t) {
            if ($this->conn->inTransaction()) $this->conn->rollBack();
            // relanzar para que el caller lo maneje
            throw $t;
        }
    }

    public function table_item($base = null, $grupo = null, $clase = null, $categoria = null): array
    {
        $sql = "SELECT * FROM item WHERE 1=1";
        $params = [];

        if ($base) {
            $sql .= " AND id_carga = ?";
            $params[] = $base;
        }

        if ($grupo) {
            $sql .= " AND grupo_descuento = ?";
            $params[] = $grupo;
        }

        if ($clase) {
            $sql .= " AND clase_producto = ?";
            $params[] = $clase;
        }

        if ($categoria) {
            $sql .= " AND categoria_producto = ?";
            $params[] = $categoria;
        }

        $sql .= " ORDER BY id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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

    public function select_bases(): array{
         $sql = "SELECT id,nombre_file as base
                FROM carga
                where estado=1
                group by id,nombre_file
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_grupo_descuento(): array{
         $sql = "SELECT grupo_descuento, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where estado=1
                group by grupo_descuento";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_clase_producto(): array{
         $sql = "SELECT clase_producto, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where estado=1
                group by clase_producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_categoria_producto(): array{
         $sql = "SELECT categoria_producto, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where estado=1
                group by categoria_producto";
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

    public function crearCarga(string $nombreFile): int {
        $sql = "INSERT INTO carga (nombre_file, cargados, errores, fecha_registro)
                VALUES (:nombre_file, 0, 0, :fecha_registro)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre_file', $nombreFile);
        $stmt->bindValue(':fecha_registro', $this->nowLima);

        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function actualizarCarga(int $idCarga, int $cargados, int $errores): bool {
        $sql = "UPDATE carga SET cargados = :cargados, errores = :errores WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cargados', $cargados, PDO::PARAM_INT);
        $stmt->bindValue(':errores', $errores, PDO::PARAM_INT);
        $stmt->bindValue(':id', $idCarga, PDO::PARAM_INT);
        return $stmt->execute();
    }

}
?>