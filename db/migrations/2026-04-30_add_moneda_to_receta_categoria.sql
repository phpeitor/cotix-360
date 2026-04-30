-- Migración: Agregar columna `moneda` a la tabla `receta_categoria`
-- Ejecutar en MySQL / MariaDB como usuario con permisos de ALTER TABLE

ALTER TABLE receta_categoria
    ADD COLUMN moneda VARCHAR(16) NOT NULL DEFAULT '' AFTER subtotal;

-- Opcional: poblar `moneda` para filas existentes usando receta_detalle
-- (Asegúrate de revisar antes de ejecutar)
-- UPDATE receta_categoria rc
-- JOIN (
--   SELECT receta_id, sub_cat_1, MAX(moneda) AS moneda
--   FROM receta_detalle
--   GROUP BY receta_id, sub_cat_1
-- ) rd ON rd.receta_id = rc.receta_id AND rd.sub_cat_1 = rc.sub_cat_1
-- SET rc.moneda = rd.moneda;
