CREATE TABLE IF NOT EXISTS ingenieria_historial (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ingenieria_id BIGINT UNSIGNED NOT NULL,
    detalle_id INT NULL DEFAULT NULL,
    item_id INT NULL DEFAULT NULL,
    accion VARCHAR(40) NOT NULL,
    antes_json JSON NULL,
    despues_json JSON NULL,
    usuario_id INT NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_ingenieria_historial_ingenieria (ingenieria_id),
    KEY idx_ingenieria_historial_accion (accion)
);
