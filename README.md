# Cotix360

[![forthebadge](http://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.linkedin.com/in/drphp/)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Aplicación web para gestión de usuarios, carga de ítems y generación de cotizaciones con cálculo automático de costos, flete, gastos, interés, factor y precios finales.

[![Video](https://img.youtube.com/vi/QzPLElgIzGA/0.jpg)](https://www.youtube.com/watch?v=QzPLElgIzGA)

[Ver demo en YouTube](https://www.youtube.com/watch?v=QzPLElgIzGA)

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

## Exportación PDF

- Archivo principal: pdf_cotizacion.php
- Genera PDF con Dompdf.
- Incluye cálculos de Total Perú, Factor e Interés para mantener consistencia con la cotización.

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

## Licencia

Uso interno del proyecto. Si se distribuirá a terceros, definir una licencia explícita.