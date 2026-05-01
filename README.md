# Cotix360

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Aplicación web para gestión de usuarios, carga de ítems y generación de cotizaciones con cálculo automático de costos, flete, gastos, interés, factor y precios finales.

[![Video](https://img.youtube.com/vi/QzPLElgIzGA/0.jpg)](https://www.youtube.com/watch?v=QzPLElgIzGA)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=QzPLElgIzGA)


## Qué hace el sistema

- Gestión de usuarios (alta, edición, baja lógica, validación de estado activo para login).
- Gestión de ítems para cotización.
- Carga masiva de ítems desde Excel con validación de cabeceras.
- Cálculo comercial por cotización:
	- FOB
	- Flete por país y peso
	- Gastos por tramo
	- Interés de financiamiento
	- Factor
	- Precio M, utilidad y precio cliente
- Historial de cotizaciones.
- Exportación de cotización a PDF.
- Módulo de recetas comerciales:
	- Creación de receta con tipo de cambio SUNAT.
	- Guardado de cabecera en `recetas` y detalle en `receta_detalle`.
	- Consulta de recetas por rango de fechas.
	- Vista de receta con edición de detalle (agregar, quitar y ajustar cantidad).
	- Notificación en tiempo real de cambios de precio (SSE) sin refrescar página.
	- Sincronización entre múltiples pestañas/ventanas abiertas de la misma receta.
	- Detección de cambios de precio contra catálogo (`receta_items`) con alerta visual por fila e ícono informativo con tooltip.
	- Recarga/sincronización de precios de detalle desde catálogo con botón `reload`.
	- Restricción funcional: solo se permite editar y recargar precios cuando la receta está en estado `Enviada`.
	- Restricción de stream: el canal en tiempo real solo permanece activo en estado `Enviada`; en otros estados se detiene para reducir consumo.
	- Aprobación/anulación de receta.
	- Exportación de receta a PDF con totales por moneda y total Perú.

## Stack técnico

- Backend: PHP (capas controller, model, database).
- Frontend: JavaScript + Bootstrap.
- Base de datos: MySQL.
- Dependencias PHP:
	- dompdf/dompdf
	- phpoffice/phpspreadsheet
	- vlucas/phpdotenv

## Requisitos

- PHP 8.1 o superior
- Composer
- MySQL 5.7 o superior (recomendado 8.x)
- Apache (recomendado) o servidor embebido de PHP

## Instalación rápida

1. Clonar el proyecto.

```bash
git clone https://github.com/phpeitor/cotix-360.git
cd cotix-360
```

2. Instalar dependencias.

```bash
composer install
```

3. Crear archivo .env en la raíz del proyecto.

```env
DB_HOST=127.0.0.1
DB_NAME=bd_cotix
DB_USER=root
DB_PASS=

# Requerido por controller/acceso.php y controller/logout.php
IP_API_URL=https://api.ipify.org

# Opcional (solo si usas integración externa de config/api.php)
API_CLINIC_STATUS_URL=
HEALTH_WORKER_ID=
DOCUMENT_TYPE_ID=
```

4. Crear la base de datos y cargar estructura/datos iniciales según tu script SQL interno.

5. Levantar la aplicación.

Opción A (Apache)

- Copiar proyecto en htdocs.
- Abrir: http://127.0.0.1/cotix/index.php

Opción B (servidor embebido PHP)

```bash
php -S 127.0.0.1:8000
```

Abrir: http://127.0.0.1:8000/index.php

## Estructura del proyecto

```text
cotix/
	assets/          # CSS, JS, imágenes y recursos UI
	config/          # bootstrap y configuración
	controller/      # endpoints/controladores
	database/        # conexión a MySQL
	model/           # lógica de negocio
	release-notes/   # notas por versión
	vendor/          # dependencias Composer
```

## Flujo principal

1. Login.
2. Gestión de usuarios e ítems.
3. Carga masiva de ítems (Excel).
4. Generación de cotización y cálculo de totales.
5. Financiamiento (tasa, cuota e interés por períodos).
6. Consulta de cotizaciones y exportación PDF.
7. Creación, consulta, edición controlada, aprobación/anulación y exportación de recetas.

## Reglas de cálculo relevantes

- El sistema aplica margen por grupo para obtener precio descuento.
- El flete se calcula por país de origen y peso acumulado.
- Gastos se calculan por tramos de FOB.
- El interés de financiamiento se integra al costo total y al factor.
- Puede existir ajuste por redondeo cuando se compara:
	- Total teórico (FOB + Flete + Gastos + Interés)
	- versus suma de líneas redondeadas por ítem.

## Endpoints/controladores importantes

- Login: controller/acceso.php
- Logout: controller/logout.php
- Cotización (tabla): controller/table_cotizacion.php
- Cotización (detalle): controller/get_cotizacion.php
- Guardar cotización: controller/add_cotizacion.php
- Financiamiento: controller/financiamiento_cotizacion.php
- Carga Excel ítems: controller/cargar_items.php
- Receta (tabla): controller/table_receta.php
- Receta (detalle): controller/get_receta.php
- Guardar receta: controller/add_receta.php
- Actualizar receta (detalle/cantidades): controller/upd_receta.php
- Recargar precios de receta: controller/reload_receta_precios.php
- Stream de cambios de precio (SSE): controller/stream_receta_cambios.php
- Actualizar estado receta: controller/upd_estado_receta.php

## Tiempo real (SSE) en recetas

- El stream SSE se usa para detectar cambios de precio de `receta_items` en la vista de receta sin recargar.
- El frontend consume el stream con `EventSource` y actualiza alertas/filas en vivo.
- El stream solo notifica cuando la receta está en estado `Enviada`.
- Si la receta cambia a estado no editable (`Aprobada`, `Anulada`, etc.), el backend emite desactivación y el frontend cierra la conexión.

### Optimización de rendimiento del stream

- Se libera el lock de sesión (`session_write_close`) para no bloquear otras requests de la misma sesión.
- Se usa firma liviana en BD (`count + checksum`) y solo se trae detalle completo cuando hay cambios reales.
- Polling adaptativo:
	- Modo activo: intervalo corto para respuesta rápida después de cambios.
	- Modo idle: intervalo mayor cuando no hay actividad.
- Heartbeat (`ping`) y refresh de estado con frecuencia desacoplada para reducir carga.

## Exportación PDF

- Archivo principal: pdf_cotizacion.php
- Genera PDF con Dompdf.
- Incluye cálculos de Total Perú, Factor e Interés para mantener consistencia con la cotización.
- Archivo principal receta: pdf_receta.php
- El PDF de receta concatena símbolo de moneda al precio (`S/` o `$`).
- Calcula y muestra `Total S/`, `Total $` y `Total Perú` (con tipo de cambio).
- Muestra el tipo de cambio solo cuando `Total $ > 0`.

## Convenciones de desarrollo

- Ver reglas del proyecto en `REGLAS_DESARROLLO.md`.

## Solución de problemas

- Error de conexión a DB:
	- Verifica DB_HOST, DB_NAME, DB_USER, DB_PASS en .env.
- Login falla sin mensaje claro:
	- Verifica que el usuario tenga IDESTADO = 1 (activo).
- IP no registrada en login/logout:
	- Configura IP_API_URL en .env.
- Carga Excel rechazada:
	- Confirma que el archivo tenga cabeceras exactas y en el orden esperado.

## Roadmap sugerido

- Añadir pruebas automatizadas para cálculos financieros.
- Publicar script SQL oficial de inicialización.
- Definir licencia formal del proyecto.

## Implementaciones recientes (2026-04-30)

- Márgenes por categoría en modal `info-categoria-modal` con guardado de márgenes por `sub_cat_1` y soporte de `moneda`.
- Se agregó (migración creada) la columna `moneda` en `receta_categoria` para mantener totales por moneda. Archivo de migración: `db/migrations/2026-04-30_add_moneda_to_receta_categoria.sql` (ejecutar en BD).
- Cálculo de `Total Fórmula` por categoría: subtotal / (1 - margen_decimal) y resumen agregado en el modal (totales S/ y $).
- Mejora en el PDF de receta (`pdf_receta.php`): incrustación de logo como data URI, totales por moneda, total Perú (con tipo de cambio), y condicionamiento de visibilidad de columnas/totales según permisos.
- Permisos por cargo (session_cargo): para `cargo == 4` (Técnico) se oculta la columna Precio y los totales sensibles en la UI y en la exportación PDF; esta regla aplica en frontend y backend.
- Eliminación de JS inline en vistas: los datos del servidor se pasan vía `data-*` (ej. `data-user-cargo`) y la lógica move a `assets/js/receta_form.js` y otros archivos JS dedicados.
- Normalización en modal de categorías: se evita mostrar duplicados del tipo "X (X)" mostrando solo "X".
- SSE nuevo: `controller/stream_precio_0.php` emite avisos sobre ítems con `precio = 0` y el frontend muestra alertas (div `#alertPrecioCambio`).
- Mejora del stream de cambios: `stream_receta_cambios.php` mantiene firma/cheksum y polling adaptativo; el frontend compara firmas antes de refrescar detalle.
- Modelos y controladores actualizados: `model/receta.php` (obtenerCategoriasParaEdicion, guardarCategoriaReceta), `model/item.php` (nuevos select/firmas), `controller/get_receta_categoria.php`, `controller/upd_receta_categoria.php`, `controller/stream_precio_0.php`.
- UI: tooltips añadidos al enlace PDF y comportamiento visual de alertas en listas/filas cuando hay cambios de precio.

Nota: algunas modificaciones requieren aplicar la migración SQL mencionada y verificar permisos de sesión al desplegar en producción.

## Reglas de desarrollo y negocio recientes

- No mezclar JS ni CSS dentro de vistas PHP/HTML; usar archivos en `assets/js/` y `assets/css/`.
- Pasar datos del servidor al cliente mediante `data-*` (evitar inline <script> que introduzca variables de sesión directamente en HTML).
- Regla de permisos: `session_cargo === 4` (Técnico) → ocultar columna Precio y totales sensibles en todas las vistas y en el PDF. Esta restricción debe aplicarse en frontend y validarse en backend cuando corresponda.
- Migraciones: cuando un `model` requiere una nueva columna (ej. `moneda` en `receta_categoria`), crear y documentar la migración en `db/migrations/` y ejecutar en BD antes de desplegar.
- SSE: endpoints en tiempo real deben llamar `session_write_close()` luego de validar la sesión para no bloquear la ejecución de otras requests de la misma sesión.
- Dompdf: evitar CSS y layouts incompatibles (por ejemplo `position: fixed` puede provocar errores de reflow en Dompdf). Preferir pies estáticos o soluciones compatibles con Dompdf.
- Validar siempre reglas críticas de negocio en frontend y backend (ej. edición solo en estado `Enviada`, ocultar precios por cargo, límites de margen 0-100).
- Normalización de datos: limpiar y deduplicar rutas/categorías en UI para evitar mostrar valores redundantes (e.g., "ALIMENTACIÓN (ALIMENTACIÓN)").

## Licencia

Uso interno del proyecto. Si se distribuirá a terceros, definir una licencia explícita.