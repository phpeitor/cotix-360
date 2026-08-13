# Database Standards - Cotix360

## Objetivo

Mantener el esquema MySQL consistente con los flujos de cotizaciones, recetas, usuarios, carga de items, notificaciones y auditoria operativa.

## Motor y acceso

- Base de datos: MySQL 5.7 o superior, recomendado MySQL 8.x.
- Acceso desde PHP mediante PDO en `database/conexion.php`.
- Charset de conexion actual: `utf8`.
- Credenciales y nombre de base se leen desde `.env`: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.

## Migraciones

- Toda modificacion de esquema debe tener archivo SQL en `database/migrations/`.
- Nombrar migraciones con fecha y descripcion: `YYYY-MM-DD_descripcion.sql`.
- Incluir comentarios breves sobre objetivo y forma de ejecucion.
- Si la migracion requiere backfill, dejar el SQL documentado y marcado cuando sea opcional o requiera revision manual.
- Ejecutar migraciones antes de desplegar codigo que dependa del nuevo esquema.

## Diseño de tablas y columnas

- Mantener nombres existentes para no romper controladores, modelos, PDFs ni reportes.
- Usar nombres descriptivos y consistentes con el dominio: `recetas`, `receta_detalle`, `receta_categoria`, `receta_items`, `personal`.
- Los estados deben mantenerse como valores consistentes con backend y frontend, por ejemplo `Enviada`, `Aprobada`, `Anulada`.
- Campos monetarios deben conservar precision suficiente para calculo; redondear en presentacion, no en persistencia si se requiere precision interna.
- Guardar moneda de forma explicita cuando el registro pueda mezclar soles y dolares.

## Integridad y auditoria

- Usar claves primarias estables para referencias desde detalle y controladores.
- Preservar relaciones logicas entre cabecera y detalle, especialmente `recetas` con `receta_detalle`.
- Registrar fechas relevantes con `created_at` y `updated_at` cuando el flujo lo requiera.
- Registrar usuario creador o actualizador cuando exista columna disponible, por ejemplo `usuario_id` o `usuario_upd`.
- Evitar borrados fisicos si el flujo requiere historial; preferir estados o baja logica cuando ya exista ese patron.

## Consultas y rendimiento

- Indexar columnas usadas en filtros frecuentes: fechas, estados, identificadores de cabecera, usuario y llaves de detalle.
- Evitar consultas pesadas dentro de ciclos SSE.
- Para tiempo real, preferir firmas livianas como conteos y checksums antes de traer detalle completo.
- Revisar `GROUP BY`, `GROUP_CONCAT` y agregaciones para que no degraden al crecer recetas o detalles.
- Mantener filtros por rango de fechas compatibles con el patron usado por el backend: desde fecha inicial hasta antes del dia siguiente de fecha final.

## Seguridad de datos

- No guardar secretos, tokens o credenciales en scripts SQL versionados.
- No exponer datos sensibles a roles no autorizados; el backend debe filtrar precios y totales sensibles cuando corresponda.
- Validar en backend toda operacion que modifique datos criticos, aunque el frontend oculte botones.
- No depender de triggers o cambios manuales no documentados para reglas criticas del negocio.

## Datos iniciales y catalogos

- Documentar scripts de carga inicial cuando afecten catalogos, items, fletes, gastos, estados o usuarios.
- Mantener catalogos alineados con los calculos comerciales de `model/calc_cotizacion.php`.
- Si cambia una columna usada por cargas Excel, actualizar validaciones de carga y documentacion.

## Checklist antes de cerrar

1. Existe migracion SQL para cada cambio de esquema.
2. El codigo que usa el cambio no se despliega antes de ejecutar la migracion.
3. Las columnas nuevas tienen default o backfill cuando existen datos previos.
4. Los nombres de estados y campos coinciden con backend y frontend.
5. Las consultas nuevas usan indices razonables para el volumen esperado.
6. No hay secretos ni datos privados en scripts versionados.
