CREATE TABLE IF NOT EXISTS usuario_presencia (
    usuario_id INT NOT NULL,
    ultima_actividad DATETIME NOT NULL,
    PRIMARY KEY (usuario_id),
    KEY idx_usuario_presencia_actividad (ultima_actividad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
