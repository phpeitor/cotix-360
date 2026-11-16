CREATE TABLE IF NOT EXISTS carga_errores (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    carga_id INT NOT NULL,
    fila_excel INT NOT NULL,
    modelo VARCHAR(255) NOT NULL DEFAULT '',
    mensaje TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_carga_errores_carga_fila (carga_id, fila_excel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
