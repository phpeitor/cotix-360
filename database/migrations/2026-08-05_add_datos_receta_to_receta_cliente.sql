SET @add_descripcion = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_cliente' AND COLUMN_NAME = 'descripcion') = 0,
    'ALTER TABLE receta_cliente ADD COLUMN descripcion VARCHAR(500) NULL AFTER motivo',
    'DO 0'
);
PREPARE stmt FROM @add_descripcion;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_cantidad_items = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_cliente' AND COLUMN_NAME = 'cantidad_items') = 0,
    'ALTER TABLE receta_cliente ADD COLUMN cantidad_items INT NULL AFTER descripcion',
    'DO 0'
);
PREPARE stmt FROM @add_cantidad_items;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
