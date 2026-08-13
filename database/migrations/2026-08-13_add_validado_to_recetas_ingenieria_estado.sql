ALTER TABLE recetas_ingenieria
    MODIFY estado ENUM('Borrador','Enviada','Aprobada','Validado','Rechazada','Anulada','GANADO') NULL DEFAULT 'GANADO';
