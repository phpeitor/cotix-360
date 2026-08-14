# Cotix360

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Aplicación web para gestión de usuarios, carga de ítems y generación de cotizaciones con cálculo automático de costos, flete, gastos, interés, factor y precios finales.

[![Video](https://img.youtube.com/vi/QzPLElgIzGA/0.jpg)](https://www.youtube.com/watch?v=QzPLElgIzGA)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=QzPLElgIzGA)

## Descripción

Cotix360 es una aplicación web operativa para administrar catálogos, cotizaciones, recetas comerciales, ingeniería y compras. El sistema concentra el ciclo completo desde la carga de ítems hasta la validación técnica/comercial y el control de costos de compra contra la ingeniería aprobada.

El proyecto es una aplicación PHP tradicional con frontend server-rendered y JavaScript modular por pantalla. La prioridad funcional es mantener trazabilidad de precios, estados, márgenes, totales por moneda y reglas de negocio entre áreas.

## Capacidades Principales

- Gestión de usuarios, sesiones y permisos por cargo.
- Administración de catálogo de ítems y carga masiva desde Excel.
- Cotizaciones con cálculo comercial, financiamiento y exportación PDF.
- Recetas comerciales con detalle editable, tipo de cambio, márgenes por categoría y datos comerciales.
- Detección de cambios de precio contra catálogo mediante SSE.
- Flujo de aprobación de recetas hacia ingeniería.
- Ingeniería con validación técnica, estados controlados y adicionales positivos/negativos.
- Compras generadas desde ingeniería validada, con edición controlada, semáforo comparativo y análisis gráfico.
- Exportación a PDF/Excel para documentos comerciales y técnicos.

## Stack

- PHP 8.x
- MySQL/MariaDB
- Apache HTTP Server
- JavaScript vanilla por módulo de pantalla
- Bootstrap y componentes del template administrativo
- Composer para dependencias PHP
- Dompdf para PDF
- PhpSpreadsheet para Excel
- Dotenv para configuración de entorno

## Arquitectura

```text
cotix/
  assets/              Frontend: JS, CSS, imágenes, vendor assets
  config/              Bootstrap de aplicación, APIs externas y configuración común
  controller/          Endpoints HTTP y orquestación de casos de uso
  database/            Conexión PDO y migraciones SQL
  layout/              Shell HTML compartido: menú, navbar, theme, footer
  model/               Acceso a datos y reglas de negocio por dominio
  release-notes/       Registro de cambios relevantes
  views/               Pantallas PHP renderizadas del lado servidor
  vendor/              Dependencias Composer
```

La aplicación no usa un framework MVC completo. La separación real es pragmática:

- `views/`: composición HTML/PHP y puntos de montaje para JS.
- `assets/js/`: comportamiento de cada vista, llamadas `fetch`, renderizado dinámico y validaciones UX.
- `controller/`: validación de request, sesión/permisos, transacciones y respuesta JSON/documento.
- `model/`: consultas SQL, creación defensiva de columnas/tablas y reglas persistentes del dominio.

## Instalación Local

1. Instalar dependencias PHP.

```bash
composer install
```

2. Crear `.env` en la raíz.

```env
DB_HOST=127.0.0.1
DB_NAME=bd_cotix
DB_USER=root
DB_PASS=

IP_API_URL=https://api.ipify.org
API_DNI_URL=
API_DNI_URL_2=
API_RUC_URL=
API_RUC_URL_2=
```

3. Crear base de datos y aplicar los scripts SQL disponibles en `database/migrations/` más el dump/base inicial del entorno.

4. Publicar el proyecto en Apache, por ejemplo:

```text
C:\Apache24\htdocs\cotix
```

5. Abrir la aplicación.

```text
http://127.0.0.1/cotix/index.php
```

## Configuración

La configuración sensible debe vivir en `.env`. No subir credenciales reales al repositorio.

- `DB_HOST`: host MySQL.
- `DB_NAME`: base de datos de Cotix360.
- `DB_USER`: usuario de base de datos.
- `DB_PASS`: contraseña de base de datos.
- `IP_API_URL`: servicio para registrar IP en login/logout.
- `API_DNI_URL`, `API_DNI_URL_2`: proveedores de consulta DNI.
- `API_RUC_URL`, `API_RUC_URL_2`: proveedores de consulta RUC.

## Roles Relevantes

- `1`: Administrador.
- `3`: Supervisor.
- `4`: Técnico.
- `5`: Compras.
- `6`: Ingeniería.

Los permisos no deben asumirse desde el frontend. Toda acción que cambie datos debe validarse en controller/model antes de persistir.

## Flujos de Negocio

### Cotizaciones

La cotización calcula costos, financiamiento y precios finales a partir del catálogo y parámetros comerciales. La salida principal es PDF, manteniendo consistencia entre los valores calculados en pantalla y el documento generado.

### Recetas

La receta representa una propuesta comercial editable antes de aprobación. Sus puntos críticos son:

- Detalle por ítem con cantidad, precio, moneda y tipo de cambio.
- Márgenes por categoría obligatorios antes de aprobación.
- Bloqueo de aprobación si hay precios en cero o datos comerciales incompletos.
- Detección de cambios de precio del catálogo mediante SSE cuando la receta está en estado editable.
- Exportación comercial PDF/Excel.

### Ingeniería

Ingeniería recibe recetas aprobadas y valida el detalle técnico. Puede manejar adicionales positivos y negativos, pero esos adicionales tienen reglas explícitas según el módulo consumidor.

### Compras

Compras se genera desde ingeniería validada. El módulo permite ajustar precios, cantidades, moneda y agregar ítems mientras el estado sea editable. El semáforo compara el total de compra contra la referencia de ingeniería.

Reglas actuales de adicionales en compras:

- Ítems normales suman al total y al semáforo.
- Adicionales negativos descuentan del total y afectan el semáforo.
- Adicionales positivos son informativos y no afectan total ni semáforo.
- Existen modales separados para revisar adicionales negativos y positivos.

## Estados Importantes

- `Enviada`: estado editable principal en recetas.
- `Aprobada`: receta aprobada y transferida al siguiente flujo.
- `Validado`: estado usado en ingeniería/compras para indicar validación operativa.
- `Pendiente`: estado legacy/compatible en compras.
- `Anulada`: estado terminal no editable.

Al agregar estados nuevos, revisar enums SQL, validaciones de controllers, badges frontend y reglas de editabilidad.

## Reglas de Cálculo

- Los totales por moneda deben calcularse en backend y reflejarse en frontend.
- Para conversiones a dólares se usa `tipo_cambio` de la entidad correspondiente.
- En recetas, los márgenes por categoría son obligatorios para aprobar.
- En compras, el semáforo usa total ajustado según reglas de adicionales.
- Evitar duplicar reglas críticas solo en JavaScript; el servidor debe ser la fuente de verdad.

## Endpoints Relevantes

### Sesión

- `controller/acceso.php`
- `controller/logout.php`

### Recetas

- `controller/table_receta.php`
- `controller/get_receta.php`
- `controller/add_receta.php`
- `controller/upd_receta.php`
- `controller/upd_estado_receta.php`
- `controller/get_receta_categoria.php`
- `controller/upd_receta_categoria.php`
- `controller/reload_receta_precios.php`
- `controller/stream_receta_cambios.php`

### Ingeniería

- `controller/aprobar_ingenieria.php`
- `controller/guardar_ingenieria.php`
- `controller/upd_ingenieria_detalle.php`
- `controller/upd_ingenieria_header.php`

### Compras

- `controller/compras/table_compras.php`
- `controller/compras/get_compra.php`
- `controller/compras/upd_compra_detalle.php`
- `controller/compras/charts_compra.php`

### Exportaciones

- `pdf_cotizacion.php`
- `pdf_receta.php`
- `controller/export_receta_excel.php`
- `controller/export_oferta_comercial_excel.php`

## Tiempo Real

El módulo de recetas usa Server-Sent Events para detectar cambios de precio del catálogo sin recargar la pantalla.

Consideraciones operativas:

- El stream debe liberar lock de sesión con `session_write_close()`.
- El stream solo debe mantenerse activo en estados editables.
- El backend usa firma liviana para evitar consultar detalle completo si no hay cambios.
- El frontend debe cerrar `EventSource` al salir de la vista.

## Migraciones

Las migraciones SQL viven en `database/migrations/`. Varias capas del modelo también hacen creación defensiva de columnas/tablas para ambientes existentes. Aun así, el camino preferido es ejecutar migraciones explícitas por ambiente.

Antes de desplegar cambios de datos:

- Revisar si hay `ENUM` afectados.
- Validar que nuevas columnas tengan default compatible.
- Confirmar compatibilidad con datos históricos.
- Ejecutar backup si el ambiente tiene datos productivos.

## Desarrollo

Comandos útiles:

```bash
composer install
php -l controller/compras/get_compra.php
php -l model/compras/compras.php
node --check assets/js/compras_detalle.js
```

Buenas prácticas del proyecto:

- Mantener cambios pequeños y localizados.
- Validar permisos en backend.
- No confiar en campos ocultos del frontend.
- Evitar lógica financiera divergente entre PHP y JavaScript.
- Actualizar cache bust (`?v=`) al modificar assets JS/CSS servidos por vistas PHP.
- Preferir migraciones explícitas antes que cambios manuales en BD.

## Troubleshooting

- Error de conexión a BD: revisar `.env`, credenciales y permisos del usuario MySQL.
- Login falla: verificar que el usuario esté activo y que la sesión pueda escribirse.
- PDF no genera: revisar `vendor/`, permisos de escritura temporales y dependencias de Dompdf.
- Excel no carga: validar cabeceras, formato y tamaño del archivo.
- Cambios JS no aparecen: forzar recarga (`Ctrl + F5`) y revisar versión `?v=` del asset.
- SSE no notifica: revisar estado de la receta, conexión del navegador y endpoint `stream_receta_cambios.php`.

## Calidad y Riesgos

Este código concentra reglas de negocio críticas en una aplicación PHP legacy-style. Los principales riesgos técnicos son:

- Reglas financieras duplicadas entre backend y frontend.
- Estados representados como strings y enums SQL.
- Compatibilidad con datos históricos.
- Dependencia de cache bust manual para assets.
- Consultas SQL complejas para totales y agrupaciones.

Al tocar totales, márgenes, estados o permisos, validar el flujo completo: lista, detalle, exportación, actualización AJAX y transición de estado.

## Release Notes

Los cambios funcionales relevantes deben documentarse en `release-notes/` cuando impacten operación, datos, permisos o reglas comerciales.

## Licencia

Proyecto de uso interno. Definir una licencia explícita antes de distribuirlo a terceros.
