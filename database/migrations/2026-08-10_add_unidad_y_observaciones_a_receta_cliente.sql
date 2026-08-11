SET @add_tiempo_entrega_unidad = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_cliente' AND COLUMN_NAME = 'tiempo_entrega_unidad') = 0,
    'ALTER TABLE receta_cliente ADD COLUMN tiempo_entrega_unidad VARCHAR(20) NULL DEFAULT "dias" AFTER tiempo_entrega',
    'DO 0'
);
PREPARE stmt FROM @add_tiempo_entrega_unidad;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_observaciones = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_cliente' AND COLUMN_NAME = 'observaciones') = 0,
    'ALTER TABLE receta_cliente ADD COLUMN observaciones TEXT NULL AFTER condiciones_economicas_visible',
    'DO 0'
);
PREPARE stmt FROM @add_observaciones;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
