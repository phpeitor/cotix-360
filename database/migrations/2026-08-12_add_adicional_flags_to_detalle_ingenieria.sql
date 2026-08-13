ALTER TABLE detalle_ingenieria
    ADD COLUMN es_adicional TINYINT(1) NOT NULL DEFAULT 0 AFTER cantidad,
    ADD COLUMN adicional_signo ENUM('positivo','negativo') NULL DEFAULT NULL AFTER es_adicional;

ALTER TABLE detalle_compras
    ADD COLUMN es_adicional TINYINT(1) NOT NULL DEFAULT 0 AFTER cantidad,
    ADD COLUMN adicional_signo ENUM('positivo','negativo') NULL DEFAULT NULL AFTER es_adicional;
