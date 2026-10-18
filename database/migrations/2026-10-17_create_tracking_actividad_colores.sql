CREATE TABLE IF NOT EXISTS tracking_actividad_colores (
    tracking_id BIGINT UNSIGNED NOT NULL,
    fase VARCHAR(60) NOT NULL,
    actividad VARCHAR(200) NOT NULL,
    color CHAR(7) NOT NULL DEFAULT '#FACC15',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (tracking_id, fase, actividad),
    CONSTRAINT fk_tracking_actividad_colores_tracking
        FOREIGN KEY (tracking_id) REFERENCES trackings (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
