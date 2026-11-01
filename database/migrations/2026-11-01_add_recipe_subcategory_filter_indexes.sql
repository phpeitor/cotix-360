ALTER TABLE recetas
    ADD INDEX idx_recetas_created_at (created_at),
    ADD INDEX idx_recetas_usuario_created_at (usuario_id, created_at);

ALTER TABLE receta_detalle
    ADD INDEX idx_receta_detalle_receta_subcat1 (receta_id, sub_cat_1);

ALTER TABLE recetas_ingenieria
    ADD INDEX idx_recetas_ingenieria_created_at (created_at);

ALTER TABLE detalle_ingenieria
    DROP INDEX idx_detalle_ingenieria_receta,
    ADD INDEX idx_detalle_ingenieria_receta_subcat1 (receta_id, sub_cat_1);
