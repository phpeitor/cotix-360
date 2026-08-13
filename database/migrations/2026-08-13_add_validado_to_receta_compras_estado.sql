ALTER TABLE receta_compras
    MODIFY estado ENUM('Pendiente','Validado','Aprobada','Anulada') NULL DEFAULT 'Validado';
