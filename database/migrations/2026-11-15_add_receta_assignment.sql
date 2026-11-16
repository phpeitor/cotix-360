ALTER TABLE recetas
    ADD COLUMN asignado_usuario_id INT NULL DEFAULT NULL AFTER usuario_id,
    ADD KEY idx_recetas_asignado_usuario (asignado_usuario_id);
