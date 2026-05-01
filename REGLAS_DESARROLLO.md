# Reglas de Desarrollo - Cotix360

## Objetivo

Mantener consistencia de código, facilitar mantenimiento y reducir regresiones.

## Reglas principales

1. No mezclar JS ni CSS dentro de vistas PHP/HTML.
2. Todo JavaScript debe vivir en `assets/js/`.
3. Todo CSS debe vivir en `assets/css/`.
4. Las vistas solo deben contener estructura HTML/PHP y referencias a archivos estáticos.
5. Los controladores en `controller/` deben devolver JSON consistente para endpoints AJAX.
6. La lógica de negocio y acceso a datos debe permanecer en `model/`.
7. Evitar duplicar lógica: reutilizar funciones de utilidades compartidas cuando existan.
8. Validar sesión al inicio de endpoints protegidos.
9. No exponer errores sensibles en producción.
10. Mantener nombres de estados y campos alineados con base de datos.
11. Para recetas, respetar regla de negocio: edición y recarga de precios solo en estado Enviada.
12. Toda restricción crítica de negocio debe validarse en frontend y backend.

## Reglas para tiempo real (SSE)

1. El stream SSE de recetas solo debe estar activo cuando la receta esté en estado Enviada.
2. Si la receta cambia a estado no editable, el backend debe cortar el stream y el frontend debe cerrar la conexión.
3. Liberar bloqueo de sesión en endpoints SSE usando session_write_close luego de validar autenticación.
4. Evitar consultas pesadas en cada ciclo: usar firma liviana y traer detalle completo solo cuando cambie.
5. Usar polling adaptativo (activo/idle) para balancear respuesta e impacto en servidor.
6. Incluir heartbeat/ping controlado para mantener conexión sin generar tráfico excesivo.
7. El endpoint SSE debe emitir payload JSON consistente y con eventos explícitos (price_changes, ping, stream_disabled, error).

## Reglas para nuevas funcionalidades

1. Si se agrega un endpoint nuevo, documentarlo en `README.md`.
2. Si se agrega un flujo UI nuevo, incluir su archivo JS dedicado en `assets/js/`.
3. Si se modifica cálculo comercial/financiero, actualizar documentación funcional y PDF relacionado.
4. Antes de cerrar cambios, validar errores de sintaxis/diagnóstico en los archivos editados.
5. Si se implementa o modifica tiempo real, documentar comportamiento funcional y estrategia de rendimiento en README.

## Reglas de estilo

1. Preferir cambios mínimos y focalizados.
2. Evitar refactor masivo si no es parte del requerimiento.
3. Mantener formato y convenciones ya usadas en el proyecto.
4. Usar comentarios solo cuando el bloque no sea evidente por sí mismo.

## Reglas de negocio y operativas recientes

- No usar JavaScript inline en vistas: pasar valores del servidor mediante `data-*` (por ejemplo `data-user-cargo`) y leerlos desde `assets/js/*`.
- Permisos por `session_cargo`:
  - `cargo === 4` (Técnico): ocultar columna `Precio` y totales sensibles en UI y PDF. Implementar la validación en frontend y backend cuando afecte cálculo o seguridad de datos.
- Migraciones: documentar y agregar archivo SQL en `db/migrations/` cuando se cambie el esquema (ej. `moneda` en `receta_categoria`); ejecutar migraciones antes de desplegar.
- SSE:
  - Siempre llamar `session_write_close()` después de validar sesión en endpoints SSE para evitar bloquear otras requests de la misma sesión.
  - Usar firmas/cheksum y contar cambios antes de traer detalle completo.
  - Emitir eventos claros (`price_changes`, `ping`, `stream_disabled`).
- PDF (Dompdf): evitar reglas CSS que provoquen reflow o errores (por ejemplo `position: fixed` para footers); preferir pies estáticos compatibles con Dompdf.
- Formatos y normalización:
  - Normalizar etiquetas de categorías para no mostrar duplicados del tipo "X (X)".
  - Incluir símbolo de moneda en `precio_formateado` en el backend para uso directo en PDFs.
- Validaciones numéricas:
  - Márgenes entre `0` y `100` (validar en frontend y backend).
  - No permitir `margenDecimal >= 1` al calcular `subtotal / (1 - margen)`.

## Documentación de cambios recientes

- Modal `info-categoria-modal` para edición de márgenes por `sub_cat_1` y suma de totales por moneda.
- Nuevo endpoint SSE: `controller/stream_precio_0.php` (notifica ítems con `precio = 0`).
- Actualizaciones en modelos: `model/receta.php` (obtenerCategoriasParaEdicion, guardarCategoriaReceta) y `model/item.php`.
- Actualizaciones en vistas y JS: `receta_form.php`, `assets/js/receta_form.js`, `items_receta.php`, `assets/js/table-gridjs-item-receta.js`, `pdf_receta.php`.

Asegúrate de revisar estas reglas en cada PR que afecte recetas, PDFs o streams SSE.
