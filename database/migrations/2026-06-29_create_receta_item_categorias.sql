CREATE TABLE IF NOT EXISTS receta_item_categorias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    sub_cat_1 VARCHAR(150) NOT NULL DEFAULT '',
    sub_cat_2 VARCHAR(150) NOT NULL DEFAULT '',
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_receta_item_categorias_path (tipo, categoria, sub_cat_1, sub_cat_2),
    KEY idx_receta_item_categorias_estado (estado),
    KEY idx_receta_item_categorias_tipo_categoria (tipo, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO receta_item_categorias (tipo, categoria, sub_cat_1, sub_cat_2, estado, created_at)
SELECT DISTINCT
    TRIM(COALESCE(tipo, '')) AS tipo,
    TRIM(COALESCE(categoria, '')) AS categoria,
    TRIM(COALESCE(sub_cat_1, '')) AS sub_cat_1,
    TRIM(COALESCE(sub_cat_2, '')) AS sub_cat_2,
    1 AS estado,
    NOW() AS created_at
FROM receta_items
WHERE TRIM(COALESCE(tipo, '')) <> ''
  AND TRIM(COALESCE(categoria, '')) <> ''
ON DUPLICATE KEY UPDATE
    estado = VALUES(estado),
    updated_at = NOW();
