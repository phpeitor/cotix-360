ALTER TABLE receta_cliente
    ADD COLUMN vendedor_correo VARCHAR(150) NULL AFTER vendedor,
    ADD COLUMN vendedor_telefono VARCHAR(50) NULL AFTER vendedor_correo,
    ADD COLUMN condiciones_economicas_dias INT NULL AFTER vendedor_telefono;
    
ALTER TABLE receta_cliente
CHANGE COLUMN `tiempo_entrega` `tiempo_entrega` INT NULL DEFAULT NULL ; 