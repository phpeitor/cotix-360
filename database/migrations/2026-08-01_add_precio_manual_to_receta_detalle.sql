ALTER TABLE receta_detalle
    ADD COLUMN precio_manual TINYINT(1) NOT NULL DEFAULT 0 AFTER precio;
