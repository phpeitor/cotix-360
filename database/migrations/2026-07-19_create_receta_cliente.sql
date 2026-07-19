CREATE TABLE IF NOT EXISTS receta_cliente (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_receta INT UNSIGNED NOT NULL,
    razon_social_empresa VARCHAR(200) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    ruc VARCHAR(11) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    motivo VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_receta_cliente_id_receta (id_receta),
    KEY idx_receta_cliente_ruc (ruc),
    KEY idx_receta_cliente_correo (correo),
    CONSTRAINT fk_receta_cliente_recetas
        FOREIGN KEY (id_receta) REFERENCES recetas (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;