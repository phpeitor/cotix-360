ALTER TABLE receta_item_subcat_orden
    ADD COLUMN icon VARCHAR(80) NOT NULL DEFAULT 'ti ti-tools' AFTER sub_cat_1;

DROP VIEW IF EXISTS vw_receta_items_orden;

CREATE VIEW vw_receta_items_orden AS
SELECT
    c.tipo,
    c.sub_cat_1,
    COALESCE(o.orden, 9999) AS orden,
    COALESCE(o.icon, 'ti ti-tools') AS icon
FROM (
    SELECT tipo, sub_cat_1
    FROM receta_item_categorias
    GROUP BY tipo, sub_cat_1
) c
LEFT JOIN receta_item_subcat_orden o
    ON o.tipo = c.tipo
   AND o.sub_cat_1 = c.sub_cat_1;
