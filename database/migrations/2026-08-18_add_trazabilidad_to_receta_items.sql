-- Trazabilidad de receta_items: registra el usuario que crea y el que edita cada item.

SET @add_usuario_id = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_items' AND COLUMN_NAME = 'usuario_id') = 0,
    'ALTER TABLE receta_items ADD COLUMN usuario_id INT NULL DEFAULT NULL AFTER id',
    'DO 0'
);
PREPARE stmt FROM @add_usuario_id;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_usuario_upd = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_items' AND COLUMN_NAME = 'usuario_upd') = 0,
    'ALTER TABLE receta_items ADD COLUMN usuario_upd INT NULL DEFAULT NULL AFTER usuario_id',
    'DO 0'
);
PREPARE stmt FROM @add_usuario_upd;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
