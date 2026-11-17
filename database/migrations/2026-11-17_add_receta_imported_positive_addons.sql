ALTER TABLE recetas
    ADD COLUMN adicionales_positivos_importados TINYINT(1) NOT NULL DEFAULT 0 AFTER nombre_interno;
