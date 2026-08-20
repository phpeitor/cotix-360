ALTER TABLE trackings
    ADD COLUMN cod_publico VARCHAR(10) NULL DEFAULT NULL AFTER cod_tracking,
    ADD UNIQUE KEY uq_trackings_cod_publico (cod_publico);