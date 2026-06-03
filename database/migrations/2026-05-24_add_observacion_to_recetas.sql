-- Migración: Agregar columna `observacion` a la tabla `recetas`
-- Ejecutar en MySQL / MariaDB como usuario con permisos de ALTER TABLE

ALTER TABLE recetas
    ADD COLUMN observacion VARCHAR(300) NOT NULL DEFAULT '' AFTER nombre;

-- Nota: la aplicación valida maxlength=300 en el frontend.
