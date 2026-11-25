ALTER TABLE detalle_compras
    ADD COLUMN origen_abastecimiento ENUM('Stock', 'Compras') NULL DEFAULT NULL
    AFTER adicional_signo;
