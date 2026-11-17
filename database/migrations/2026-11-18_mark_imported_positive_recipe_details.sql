ALTER TABLE receta_detalle
    ADD COLUMN es_adicional_positivo_importado TINYINT(1) NOT NULL DEFAULT 0 AFTER cantidad,
    ADD COLUMN compra_detalle_origen_id INT NULL DEFAULT NULL AFTER es_adicional_positivo_importado,
    ADD COLUMN receta_origen_id INT NULL DEFAULT NULL AFTER compra_detalle_origen_id;
