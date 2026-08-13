CREATE TABLE IF NOT EXISTS recetas_ingenieria (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_receta_duplicada INT NULL DEFAULT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    estado ENUM('Borrador','Enviada','Aprobada','Validado','Rechazada','Anulada','GANADO') NULL DEFAULT 'GANADO',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usuario_upd INT NULL DEFAULT NULL,
    tipo_cambio DECIMAL(7,3) NULL DEFAULT NULL,
    nombre VARCHAR(100) NULL DEFAULT NULL,
    observacion VARCHAR(300) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    UNIQUE KEY uq_recetas_ingenieria_origen (id_receta_duplicada),
    KEY idx_recetas_ingenieria_estado (estado)
);

CREATE TABLE IF NOT EXISTS detalle_ingenieria (
    id INT NOT NULL AUTO_INCREMENT,
    receta_id INT NULL DEFAULT NULL,
    item_id INT NULL DEFAULT NULL,
    categoria VARCHAR(255) NULL DEFAULT NULL,
    sub_cat_1 VARCHAR(255) NULL DEFAULT NULL,
    sub_cat_2 VARCHAR(255) NULL DEFAULT NULL,
    marca VARCHAR(255) NULL DEFAULT NULL,
    modelo VARCHAR(255) NULL DEFAULT NULL,
    nombre VARCHAR(255) NULL DEFAULT NULL,
    descripcion VARCHAR(500) NULL DEFAULT NULL,
    uni_medida VARCHAR(50) NULL DEFAULT NULL,
    precio DECIMAL(15,2) NULL DEFAULT NULL,
    moneda VARCHAR(20) NULL DEFAULT NULL,
    tipo VARCHAR(50) NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_detalle_ingenieria_receta (receta_id)
);
