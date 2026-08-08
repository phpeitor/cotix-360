<?php
require_once __DIR__ . '/../../database/conexion.php';

class Compras
{
    private PDO $conn;
    private string $nowLima;

    public const UMBRAL_MEJORA = 0.97;
    public const UMBRAL_SUPERIOR = 1.05;

    public const CARGOS_EDITABLES = [1, 3, 5];
    public const CARGOS_VER_MONTOS = [1, 3, 5];

    public function __construct()
    {
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

    public function tableCompras(string $fecIni, string $fecFin): array
    {
        $this->crearTablasSiNoExisten();

        $sql = "SELECT
                    c.id,
                    c.ingenieria_id,
                    c.id_receta_duplicada,
                    p.usuario,
                    p2.usuario AS usuario_aprobador,
                    c.nombre,
                    rc.ruc AS cliente_ruc,
                    rc.razon_social_empresa AS cliente_razon_social_empresa,
                    c.estado,
                    c.created_at,
                    c.updated_at,
                    COALESCE(SUM(d.cantidad), 0) AS total_items,
                    GROUP_CONCAT(
                        CONCAT(d.nombre, ' x ', COALESCE(d.cantidad, 0))
                        ORDER BY d.nombre
                        SEPARATOR ' | '
                    ) AS items,
                    COALESCE((
                        SELECT ROUND(SUM(
                            CASE
                                WHEN UPPER(COALESCE(dc.moneda, '')) = 'DOLLAR' THEN COALESCE(dc.precio, 0) * COALESCE(dc.cantidad, 0)
                                ELSE (COALESCE(dc.precio, 0) * COALESCE(dc.cantidad, 0)) / NULLIF(COALESCE(cc.tipo_cambio, 0), 0)
                            END
                        ), 2)
                        FROM detalle_compras dc
                        INNER JOIN receta_compras cc ON cc.id = dc.compra_id
                        WHERE cc.id = c.id
                    ), 0) AS total_compra_dolares,
                    COALESCE((
                        SELECT ROUND(SUM(
                            CASE
                                WHEN UPPER(COALESCE(di.moneda, '')) = 'DOLLAR' THEN COALESCE(di.precio, 0) * COALESCE(di.cantidad, 0)
                                ELSE (COALESCE(di.precio, 0) * COALESCE(di.cantidad, 0)) / NULLIF(COALESCE(ri.tipo_cambio, 0), 0)
                            END
                        ), 2)
                        FROM detalle_ingenieria di
                        INNER JOIN recetas_ingenieria ri ON ri.id = di.receta_id
                        WHERE ri.id = c.ingenieria_id
                    ), 0) AS total_origen_dolares
                FROM receta_compras c
                LEFT JOIN detalle_compras d ON d.compra_id = c.id
                LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
                LEFT JOIN personal p2 ON p2.IDPERSONAL = c.usuario_upd
                LEFT JOIN receta_cliente rc ON rc.id_receta = c.id_receta_duplicada
                WHERE c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)
                GROUP BY
                    c.id,
                    c.ingenieria_id,
                    c.id_receta_duplicada,
                    p.usuario,
                    p2.usuario,
                    c.nombre,
                    rc.ruc,
                    rc.razon_social_empresa,
                    c.estado,
                    c.created_at,
                    c.updated_at
                ORDER BY c.id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fecIni);
        $stmt->bindValue(':fec_fin', $fecFin);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($rows as &$row) {
            $semaforo = $this->evaluarSemaforo(
                (float)($row['total_compra_dolares'] ?? 0),
                (float)($row['total_origen_dolares'] ?? 0)
            );
            $semaforo['total_compra_dolares'] = (float)($row['total_compra_dolares'] ?? 0);
            $semaforo['total_origen_dolares'] = (float)($row['total_origen_dolares'] ?? 0);
            $row['semaforo'] = $semaforo;
        }
        unset($row);

        return $rows;
    }

    public function obtenerCompraPorHash(string $hash): ?array
    {
        $this->crearTablasSiNoExisten();

        $sql = "SELECT c.*,
                       p.usuario,
                       p2.usuario AS usuario_aprobador,
                       rc.ruc AS cliente_ruc,
                       rc.razon_social_empresa AS cliente_razon_social_empresa,
                       rc.direccion AS cliente_direccion,
                       rc.nombre_completo AS cliente_nombre_completo,
                       rc.correo AS cliente_correo,
                       rc.celular AS cliente_celular,
                       rc.motivo AS cliente_motivo,
                       rc.descripcion AS cliente_descripcion,
                       rc.cantidad_items AS cliente_cantidad_items,
                       rc.tiempo_entrega AS cliente_tiempo_entrega,
                       rc.condiciones_pago AS cliente_condiciones_pago,
                       rc.vendedor AS cliente_vendedor,
                       rc.vendedor_correo AS cliente_vendedor_correo,
                       rc.vendedor_telefono AS cliente_vendedor_telefono,
                       rc.condiciones_economicas_dias AS cliente_condiciones_economicas_dias,
                       rc.condiciones_economicas_visible AS cliente_condiciones_economicas_visible
                FROM receta_compras c
                LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
                LEFT JOIN personal p2 ON p2.IDPERSONAL = c.usuario_upd
                LEFT JOIN receta_cliente rc ON rc.id_receta = c.id_receta_duplicada
                WHERE MD5(c.id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerDetallePorHash(string $hash): array
    {
        $this->crearTablasSiNoExisten();

        $sql = "SELECT d.*
                FROM detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                LEFT JOIN vw_receta_items_orden o
                    ON o.tipo COLLATE utf8mb4_unicode_ci = d.tipo COLLATE utf8mb4_unicode_ci
                   AND o.sub_cat_1 COLLATE utf8mb4_unicode_ci = d.sub_cat_1 COLLATE utf8mb4_unicode_ci
                WHERE MD5(c.id) = :hash
                ORDER BY d.tipo ASC, COALESCE(o.orden, 9999) ASC, d.sub_cat_1 ASC, d.sub_cat_2 ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function totalCompraDolaresPorHash(string $hash): float
    {
        $sql = "SELECT ROUND(COALESCE(SUM(
                    CASE
                        WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)
                        ELSE (COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)) / NULLIF(COALESCE(c.tipo_cambio, 0), 0)
                    END
                ), 0), 2) AS total
                FROM detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                WHERE MD5(c.id) = :hash";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return (float)($row['total'] ?? 0);
    }

    public function totalRecetaOrigenDolares(int $recetaId): float
    {
        $sql = "SELECT ROUND(COALESCE(SUM(
                    CASE
                        WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)
                        ELSE (COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)) / NULLIF(COALESCE(r.tipo_cambio, 0), 0)
                    END
                ), 0), 2) AS total
                FROM receta_detalle d
                INNER JOIN recetas r ON r.id = d.receta_id
                WHERE r.id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return (float)($row['total'] ?? 0);
    }

    public function totalIngenieriaDolaresPorId(int $ingenieriaId): float
    {
        $sql = "SELECT ROUND(COALESCE(SUM(
                    CASE
                        WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)
                        ELSE (COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)) / NULLIF(COALESCE(r.tipo_cambio, 0), 0)
                    END
                ), 0), 2) AS total
                FROM detalle_ingenieria d
                INNER JOIN recetas_ingenieria r ON r.id = d.receta_id
                WHERE r.id = :ingenieria_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return (float)($row['total'] ?? 0);
    }

    public function evaluarSemaforo(float $totalCompra, float $totalOrigen): array
    {
        if ($totalOrigen <= 0) {
            return [
                'nivel' => 'gris',
                'color' => 'secondary',
                'mensaje' => 'Sin referencia de la ingeniería',
            ];
        }

        $ratio = $totalCompra / $totalOrigen;

        if ($ratio < self::UMBRAL_MEJORA) {
            return [
                'nivel' => 'verde',
                'color' => 'success',
                'mensaje' => 'Mejora económica respecto a la ingeniería',
            ];
        }

        if ($ratio > self::UMBRAL_SUPERIOR) {
            return [
                'nivel' => 'rojo',
                'color' => 'danger',
                'mensaje' => 'Los costos superan significativamente a la ingeniería',
            ];
        }

        return [
            'nivel' => 'naranja',
            'color' => 'warning',
            'mensaje' => 'Costos dentro del rango promedio aceptable',
        ];
    }

    public function totalesCompraPorHash(string $hash): array
    {
        $sql = "SELECT
                    COALESCE(SUM(d.cantidad), 0) AS total_items,
                    COALESCE(SUM(
                        CASE WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN 0 ELSE COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0) END
                    ), 0) AS total_soles,
                    COALESCE(SUM(
                        CASE WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0) ELSE 0 END
                    ), 0) AS total_dolares,
                    COALESCE(MAX(c.tipo_cambio), 0) AS tipo_cambio
                FROM detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                WHERE MD5(c.id) = :hash";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        $totalSoles = (float)($row['total_soles'] ?? 0);
        $totalDolares = (float)($row['total_dolares'] ?? 0);
        $tipoCambio = (float)($row['tipo_cambio'] ?? 0);
        $totalPeru = $totalSoles + $totalDolares * $tipoCambio;

        return [
            'total_items' => (int)($row['total_items'] ?? 0),
            'total_soles' => $totalSoles,
            'total_dolares' => $totalDolares,
            'tipo_cambio' => $tipoCambio,
            'total_peru' => $totalPeru,
            'total_peru_dolares' => $tipoCambio > 0 ? round($totalPeru / $tipoCambio, 2) : 0,
        ];
    }

    public function agregarDetalleDesdeItem(string $hash, int $itemId, int $cantidad): bool
    {
        $sql = "INSERT INTO detalle_compras (
                    compra_id,
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
                ) SELECT
                    c.id,
                    i.id,
                    i.categoria,
                    i.sub_cat_1,
                    i.sub_cat_2,
                    i.marca,
                    i.modelo,
                    i.nombre,
                    i.descripcion,
                    i.uni_medida,
                    i.precio,
                    i.moneda,
                    i.tipo,
                    :created_at,
                    :cantidad
                FROM receta_compras c
                INNER JOIN receta_items i ON i.id = :item_id
                WHERE MD5(c.id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':cantidad', min(5000, max(1, $cantidad)), PDO::PARAM_INT);
        $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarPrecioDetalle(string $hash, int $detalleId, float $precio, string $moneda): bool
    {
        $sql = "UPDATE detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                SET d.precio = :precio,
                    d.moneda = :moneda
                WHERE MD5(c.id) = :hash
                  AND d.id = :detalle_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':precio', $precio);
        $stmt->bindValue(':moneda', $moneda);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarCantidadDetalle(string $hash, int $detalleId, int $cantidad): bool
    {
        $sql = "UPDATE detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                SET d.cantidad = :cantidad
                WHERE MD5(c.id) = :hash
                  AND d.id = :detalle_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cantidad', min(5000, max(1, $cantidad)), PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function eliminarDetalle(string $hash, int $detalleId): bool
    {
        $sql = "DELETE d
                FROM detalle_compras d
                INNER JOIN receta_compras c ON c.id = d.compra_id
                WHERE MD5(c.id) = :hash
                  AND d.id = :detalle_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    private function crearTablasSiNoExisten(): void
    {
        $this->conn->exec("CREATE TABLE IF NOT EXISTS receta_compras (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ingenieria_id BIGINT UNSIGNED NOT NULL,
            id_receta_duplicada INT NULL DEFAULT NULL,
            usuario_id BIGINT UNSIGNED NOT NULL,
            estado ENUM('Pendiente','Aprobada','Anulada') NULL DEFAULT 'Pendiente',
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            usuario_upd INT NULL DEFAULT NULL,
            tipo_cambio DECIMAL(7,3) NULL DEFAULT NULL,
            nombre VARCHAR(100) NULL DEFAULT NULL,
            observacion VARCHAR(300) NOT NULL DEFAULT '',
            PRIMARY KEY (id),
            UNIQUE KEY uq_receta_compras_ingenieria (ingenieria_id),
            KEY idx_receta_compras_origen (id_receta_duplicada),
            KEY idx_receta_compras_estado (estado)
        )");

        $this->conn->exec("CREATE TABLE IF NOT EXISTS detalle_compras (
            id INT NOT NULL AUTO_INCREMENT,
            compra_id BIGINT UNSIGNED NOT NULL,
            ingenieria_detalle_id INT NULL DEFAULT NULL,
            item_id INT NULL DEFAULT NULL,
            categoria VARCHAR(255) NULL DEFAULT NULL,
            sub_cat_1 VARCHAR(255) NULL DEFAULT NULL,
            sub_cat_2 VARCHAR(255) NULL DEFAULT NULL,
            marca VARCHAR(255) NULL DEFAULT NULL,
            modelo VARCHAR(255) NULL DEFAULT NULL,
            nombre VARCHAR(255) NULL DEFAULT NULL,
            descripcion VARCHAR(500) NULL DEFAULT NULL,
            uni_medida VARCHAR(50) NULL DEFAULT NULL,
            precio DECIMAL(15,2) NULL DEFAULT NULL,
            moneda VARCHAR(20) NULL DEFAULT NULL,
            tipo VARCHAR(50) NULL DEFAULT NULL,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            cantidad INT NULL DEFAULT NULL,
            PRIMARY KEY (id),
            KEY idx_detalle_compras_compra (compra_id),
            KEY idx_detalle_compras_item (item_id)
        )");
    }
}
