-- Migración: crear tabla para notificaciones persistentes del header
-- Ejecutar en MySQL / MariaDB

CREATE TABLE IF NOT EXISTS header_notifications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(32) NOT NULL DEFAULT 'item_receta',
    usuario_id INT NULL,
    usuario VARCHAR(120) NOT NULL DEFAULT 'Sistema',
    titulo VARCHAR(150) NOT NULL,
    detalle TEXT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'ti-bell',
    tone VARCHAR(20) NOT NULL DEFAULT 'secondary',
    meta_json JSON NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_header_notifications_estado_created (estado, created_at),
    KEY idx_header_notifications_tipo_created (tipo, created_at),
    KEY idx_header_notifications_usuario_created (usuario_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;