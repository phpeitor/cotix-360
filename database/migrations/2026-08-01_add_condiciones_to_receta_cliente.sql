ALTER TABLE receta_cliente
    ADD COLUMN tiempo_entrega VARCHAR(150) NULL AFTER motivo,
    ADD COLUMN condiciones_pago VARCHAR(200) NULL AFTER tiempo_entrega,
    ADD COLUMN vendedor VARCHAR(150) NULL AFTER condiciones_pago;
