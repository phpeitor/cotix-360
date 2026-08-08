-- Ajusta la columna descripcion de receta_items a VARCHAR(1000) para permitir
-- descripciones mas largas en items de recetas.

SET @modify_descripcion = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_items' AND COLUMN_NAME = 'descripcion') = 1,
    'ALTER TABLE receta_items MODIFY COLUMN descripcion VARCHAR(1000) NULL DEFAULT NULL',
    'DO 0'
);
PREPARE stmt FROM @modify_descripcion;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
