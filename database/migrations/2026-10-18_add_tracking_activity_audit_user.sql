ALTER TABLE tracking_actividades
    ADD COLUMN updated_by INT NULL AFTER updated_at;

ALTER TABLE tracking_actividad_colores
    ADD COLUMN updated_by INT NULL AFTER updated_at;
