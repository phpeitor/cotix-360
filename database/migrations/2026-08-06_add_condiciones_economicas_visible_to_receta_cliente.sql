SET @add_condiciones_economicas_visible = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'receta_cliente' AND COLUMN_NAME = 'condiciones_economicas_visible') = 0,
    'ALTER TABLE receta_cliente ADD COLUMN condiciones_economicas_visible TINYINT(1) NOT NULL DEFAULT 0 AFTER condiciones_economicas_dias',
    'DO 0'
);
PREPARE stmt FROM @add_condiciones_economicas_visible;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
