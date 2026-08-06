<?php
require_once __DIR__ . '/../../database/conexion.php';

class Compras
{
    private PDO $conn;

    public function __construct()
    {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
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
                    ) AS items
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

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
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
                       rc.celular AS cliente_celular
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
