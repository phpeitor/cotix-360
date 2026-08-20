CREATE TABLE IF NOT EXISTS tracking_actividades (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tracking_id BIGINT UNSIGNED NOT NULL,
    fase VARCHAR(60) NOT NULL,
    actividad VARCHAR(200) NOT NULL,
    fecha DATE NULL DEFAULT NULL,
    observacion VARCHAR(500) NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tracking_actividad (tracking_id, fase, actividad),
    KEY idx_tracking_actividades_tracking (tracking_id)
);