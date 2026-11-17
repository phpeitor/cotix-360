ALTER TABLE recetas
    ADD COLUMN version_raiz_id INT NULL DEFAULT NULL AFTER id_receta_duplicada,
    ADD COLUMN version_numero INT NULL DEFAULT NULL AFTER version_raiz_id,
    ADD KEY idx_recetas_version_raiz_numero (version_raiz_id, version_numero);
