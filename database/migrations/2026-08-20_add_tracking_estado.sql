ALTER TABLE trackings
    ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'abierto' AFTER cod_publico;