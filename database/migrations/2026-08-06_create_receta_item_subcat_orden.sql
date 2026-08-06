CREATE TABLE IF NOT EXISTS receta_item_subcat_orden (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    sub_cat_1 VARCHAR(150) NOT NULL,
    orden INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_receta_item_subcat_orden (tipo, sub_cat_1),
    KEY idx_receta_item_subcat_orden_tipo_orden (tipo, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO receta_item_subcat_orden (tipo, sub_cat_1, orden, created_at)
SELECT tipo, sub_cat_1, ROW_NUMBER() OVER (PARTITION BY tipo ORDER BY sub_cat_1 ASC) AS orden, NOW()
FROM (
    SELECT tipo, sub_cat_1
    FROM receta_item_categorias
    GROUP BY tipo, sub_cat_1
) c
ON DUPLICATE KEY UPDATE
    orden = VALUES(orden),
    updated_at = NOW();

DROP VIEW IF EXISTS vw_receta_items_orden;

CREATE VIEW vw_receta_items_orden AS
SELECT
    c.tipo,
    c.sub_cat_1,
    COALESCE(o.orden, 9999) AS orden
FROM (
    SELECT tipo, sub_cat_1
    FROM receta_item_categorias
    GROUP BY tipo, sub_cat_1
) c
LEFT JOIN receta_item_subcat_orden o
    ON o.tipo = c.tipo
   AND o.sub_cat_1 = c.sub_cat_1;
