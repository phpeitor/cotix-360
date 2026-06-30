ALTER TABLE recetas
    ADD COLUMN id_receta_duplicada INT NULL DEFAULT NULL AFTER id;

ALTER TABLE recetas
    ADD INDEX idx_recetas_id_receta_duplicada (id_receta_duplicada);
