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

    public function firmaListaReceta(string $fec_ini, string $fec_fin): array
    {
        $sessionCargo = $_SESSION['session_cargo'] ?? null;
        $sessionId = $_SESSION['session_id'] ?? null;
        $isAdmin = in_array((int)$sessionCargo, [1, 3], true);

        $where = "c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)";

        if (!$isAdmin) {
            if ((int)$sessionId <= 0) {
                return [
                    'total_recetas' => 0,
                    'max_receta_id' => 0,
                    'total_detalle' => 0,
                ];
            }

            $where .= " AND c.usuario_id = :usuario_id";
        }

        $sql = "SELECT
                    COUNT(*) AS total_recetas,
                    COALESCE(MAX(c.id), 0) AS max_receta_id,
                    COALESCE(SUM(COALESCE(d.total_detalle, 0)), 0) AS total_detalle
                FROM recetas c
                LEFT JOIN (
                    SELECT receta_id, COUNT(*) AS total_detalle
                    FROM receta_detalle
                    GROUP BY receta_id
                ) d ON d.receta_id = c.id
                WHERE $where";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!$isAdmin) {
            $stmt->bindValue(':usuario_id', (int)$sessionId, PDO::PARAM_INT);
        }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'total_recetas' => (int)($row['total_recetas'] ?? 0),
            'max_receta_id' => (int)($row['max_receta_id'] ?? 0),
            'total_detalle' => (int)($row['total_detalle'] ?? 0),
        ];
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT c.*,p.usuario, p2.usuario as usu_upd
                FROM recetas c
                LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
                LEFT JOIN personal p2 on p2.IDPERSONAL=c.usuario_upd
                WHERE MD5(id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerPorId(int $id): ?array {
        $sql = "SELECT c.*,p.usuario, p2.usuario as usu_upd
                FROM recetas c
                LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
                LEFT JOIN personal p2 on p2.IDPERSONAL=c.usuario_upd
                WHERE c.id = :id
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerDetallePorHash(string $hash): array {
        $sql = "SELECT a.*,b.orden
                FROM receta_detalle a
                left join vw_receta_items_orden b on a.tipo=b.tipo and a.sub_cat_1=b.sub_cat_1
                WHERE MD5(receta_id) = :hash
                order by tipo asc, orden asc, sub_cat_2 asc";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado(int $id, string $estado, int $usuario_upd): bool {
        $sql = "UPDATE recetas 
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

    public function actualizarCabeceraEdicion(int $id, float $tipoCambio, int $usuarioUpd): bool
    {
        $sql = "UPDATE recetas
                SET tipo_cambio = :tipo_cambio,
                    updated_at = :updated_at,
                    usuario_upd = :usuario_upd
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tipo_cambio', $tipoCambio);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':usuario_upd', $usuarioUpd, PDO::PARAM_INT);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function eliminarDetalle(int $recetaId): bool
    {
        $sql = "DELETE FROM receta_detalle WHERE receta_id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function obtenerCambiosPrecio(int $recetaId): array
    {
        $sql = "SELECT
                    d.item_id,
                    d.nombre,
                    d.precio AS precio_receta,
                    d.moneda AS moneda_receta,
                    r.precio AS precio_actual,
                    r.moneda AS moneda_actual
                FROM receta_detalle d
                INNER JOIN receta_items r ON r.id = d.item_id
                WHERE d.receta_id = :receta_id
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )
                ORDER BY d.item_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function obtenerCambiosPrecioFirma(int $recetaId): array
    {
        $sql = "SELECT
                    COUNT(*) AS total,
                    COALESCE(
                        SUM(
                            CAST(
                                CRC32(
                                    CONCAT_WS(
                                        '|',
                                        d.item_id,
                                        ROUND(COALESCE(d.precio, 0), 4),
                                        COALESCE(d.moneda, ''),
                                        ROUND(COALESCE(r.precio, 0), 4),
                                        COALESCE(r.moneda, '')
                                    )
                                ) AS UNSIGNED
                            )
                        ),
                        0
                    ) AS checksum
                FROM receta_detalle d
                INNER JOIN receta_items r ON r.id = d.item_id
                WHERE d.receta_id = :receta_id
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'count' => (int)($row['total'] ?? 0),
            'checksum' => (string)($row['checksum'] ?? '0'),
        ];
    }

    public function sincronizarPreciosDetalle(int $recetaId): int
    {
        $sql = "UPDATE receta_detalle d
                INNER JOIN receta_items r ON r.id = d.item_id
                SET d.precio = r.precio,
                    d.moneda = r.moneda
                WHERE d.receta_id = :receta_id
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        return (int)$stmt->rowCount();
    }

    public function obtenerCategoriasParaEdicion(int $recetaId): array
    {
        try {
            $sql = "SELECT
                        sub_cat_1,
                        SUM(COALESCE(subtotal, 0)) AS subtotal,
                        SUM(COALESCE(cantidad, 0)) AS cantidad,
                        COALESCE(MAX(margen), 0) AS margen
                    FROM receta_categoria
                    WHERE receta_id = :receta_id
                    GROUP BY sub_cat_1
                    ORDER BY sub_cat_1";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

            if (!empty($rows)) {
                return [
                    'source' => 'tabla',
                    'rows' => $rows,
                ];
            }
        } catch (Throwable $e) {
            // Si la tabla no existe o falla la consulta, caemos al agregado desde detalle.
        }

        $sql = "SELECT 
                    CONCAT(
                        sub_cat_1,
                        ' (',
                        GROUP_CONCAT(DISTINCT sub_cat_2 ORDER BY sub_cat_2 SEPARATOR ', '),
                        ')'
                    ) AS sub_cat_1,
                SUM(COALESCE(cantidad, 0)) AS cantidad,
                SUM(precio * cantidad) AS subtotal
                FROM receta_detalle
                WHERE receta_id = :receta_id
                GROUP BY sub_cat_1
                ORDER BY sub_cat_1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($rows as &$row) {
            $row['margen'] = 0;
        }

        return [
            'source' => 'detalle',
            'rows' => $rows,
        ];
    }

    public function eliminarCategoriasReceta(int $recetaId): bool
    {
        $sql = "DELETE FROM receta_categoria WHERE receta_id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function guardarCategoriaReceta(array $data): bool
    {
        $sql = "INSERT INTO receta_categoria (
                    receta_id,
                    sub_cat_1,
                    subtotal,
                    cantidad,
                    margen
                ) VALUES (
                    :receta_id,
                    :sub_cat_1,
                    :subtotal,
                    :cantidad,
                    :margen
                )";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':sub_cat_1', (string)($data['sub_cat_1'] ?? ''));
        $stmt->bindValue(':subtotal', (float)($data['subtotal'] ?? 0));
        $stmt->bindValue(':cantidad', (float)($data['cantidad'] ?? 0));
        $stmt->bindValue(':margen', (float)($data['margen'] ?? 0));

        return $stmt->execute();
    }
}