ALTER TABLE receta_compras
    MODIFY estado ENUM('Pendiente','Validado','Cerrado','Aprobada','Anulada') NULL DEFAULT 'Pendiente';

UPDATE receta_compras
SET estado = 'Cerrado'
WHERE estado = 'Validado';

ALTER TABLE receta_compras
    MODIFY estado ENUM('Pendiente','Cerrado','Aprobada','Anulada') NULL DEFAULT 'Pendiente';
