# Cotix360

Aplicacion web para gestion de usuarios, items y cotizaciones con calculo automatico de costos, flete, gastos y precio final.

## Resumen

Cotix360 permite:

- Gestion de usuarios y permisos.
- Carga masiva de items desde Excel.
- Calculo de cotizaciones con reglas por grupo, flete y gastos.
- Consulta y seguimiento de cotizaciones.
- Exportacion de cotizacion a PDF.

## Stack Tecnico

- Backend: PHP (arquitectura simple por capas `controller/`, `model/`, `database/`).
- Frontend: JavaScript vanilla + Bootstrap UI.
- Base de datos: MySQL.
- Librerias PHP:
	- `dompdf/dompdf` para generar PDF.
	- `phpoffice/phpspreadsheet` para importacion de Excel.
	- `vlucas/phpdotenv` para variables de entorno.

## Requisitos

- PHP 8.1+
- Composer
- MySQL 5.7+ o 8+
- Apache (recomendado en entorno local tipo XAMPP/WAMP) o servidor PHP embebido

## Instalacion

1. Clonar repositorio

```bash
git clone https://github.com/phpeitor/cotix-360.git
cd cotix-360
```

2. Instalar dependencias

```bash
composer install
```

3. Crear archivo `.env` en la raiz del proyecto

```env
DB_HOST=127.0.0.1
DB_NAME=bd_cotix
DB_USER=root
DB_PASS=
```

4. Crear base de datos en MySQL y cargar la estructura/datos iniciales (segun tu script SQL interno).

5. Levantar aplicacion

Opcion A (Apache):

- Copiar proyecto a `htdocs`.
- Abrir en navegador: `http://127.0.0.1/cotix/index.php`

Opcion B (servidor embebido de PHP):

```bash
php -S 127.0.0.1:8000
```

y abrir:

`http://127.0.0.1:8000/index.php`

## Estructura del Proyecto

```text
cotix/
	assets/        # CSS, JS, imagenes, recursos de UI
	config/        # bootstrap, permisos, configuraciones
	controller/    # endpoints y logica de entrada
	database/      # conexion y acceso a DB
	model/         # logica de negocio
	vendor/        # dependencias de Composer
```

## Flujo Principal

1. Login de usuario.
2. Gestion de usuarios/items.
3. Carga de items (manual o Excel).
4. Calculo de cotizacion (FOB, flete, gastos, factor, precios).
5. Guardado de cotizacion y consulta historica.
6. Generacion de PDF.

## Novedades de Esta Version

- Mejoras en animaciones de login (fallo y exito).
- Delay de redireccion en login exitoso para visualizar animacion.
- Formato con separador de miles en precios y totales en:
	- `assets/js/form-calculo.js`
	- `assets/js/form-cotizacion.js`

## Demo

[Ver video demo](https://www.youtube.com/watch?v=QzPLElgIzGA)

## Licencia

Uso interno del proyecto. Define una licencia formal (MIT, GPL, propietaria, etc.) si se publicara para terceros.