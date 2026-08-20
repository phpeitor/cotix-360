CREATE TABLE IF NOT EXISTS trackings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_receta BIGINT UNSIGNED NULL,
    nombre VARCHAR(200) NOT NULL,
    razon_social_empresa VARCHAR(200) NOT NULL,
    ruc VARCHAR(11) NOT NULL,
    cod_tracking VARCHAR(30) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_trackings_cod_tracking (cod_tracking),
    KEY idx_trackings_id_receta (id_receta),
    CONSTRAINT fk_trackings_recetas
        FOREIGN KEY (id_receta) REFERENCES recetas (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO trackings (id_receta, nombre, razon_social_empresa, ruc, cod_tracking, created_at)
SELECT r.id, r.nombre, rc.razon_social_empresa, rc.ruc,
       CONCAT('MGI-', UPPER(LEFT(TRIM(rc.razon_social_empresa),1)), '-', YEAR(r.created_at), '-', r.id),
       r.created_at
FROM recetas r
INNER JOIN receta_cliente rc ON rc.id_receta = r.id
WHERE LOWER(TRIM(r.estado)) = 'aprobada'
ON DUPLICATE KEY UPDATE id_receta = VALUES(id_receta);

ALTER TABLE trackings
    ADD COLUMN cod_publico VARCHAR(10) NULL DEFAULT NULL AFTER cod_tracking,
    ADD UNIQUE KEY uq_trackings_cod_publico (cod_publico);