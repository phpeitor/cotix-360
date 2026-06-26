# Backend Standards - Cotix360

## Objetivo

Mantener controladores, modelos y calculos comerciales consistentes, seguros y faciles de mantener en la aplicacion PHP.

## Stack y capas

- Lenguaje: PHP 8.1 o superior.
- Base de datos: MySQL mediante PDO.
- Controladores/endpoints: `controller/`.
- Logica de negocio y acceso a datos: `model/`.
- Conexion: `database/conexion.php`.
- Configuracion y variables de entorno: `config/` y `.env`.

## Separacion de responsabilidades

- Los controladores validan metodo HTTP, sesion, autorizacion, payload y formato de respuesta.
- Los modelos concentran consultas, transacciones y reglas de negocio persistentes.
- Las vistas no deben ejecutar logica de negocio.
- Los calculos compartidos deben centralizarse en clases existentes, por ejemplo `model/calc_cotizacion.php`.

## Respuestas JSON

- Todo endpoint AJAX debe responder `Content-Type: application/json; charset=utf-8`.
- Usar una estructura consistente con `ok` o `success` y `message` cuando haya error.
- Responder con codigos HTTP adecuados: `405` para metodo invalido, `401` o mensaje equivalente para sesion expirada, `500` solo para fallas inesperadas.
- No exponer trazas, SQL ni credenciales en respuestas de produccion.

## Sesion y permisos

- Validar sesion al inicio de endpoints protegidos usando `session_id` de la sesion del proyecto.
- Validar `session_cargo` cuando el flujo dependa del rol.
- Para `session_cargo === 4` (Tecnico), impedir acceso backend a precios y totales sensibles cuando afecte seguridad o calculo.
- No confiar en campos enviados por frontend para usuario, cargo, estado o permisos.

## Validacion de entrada

- Validar metodo HTTP antes de procesar datos.
- Convertir y validar tipos explicitamente: enteros, floats, fechas, arrays JSON y strings.
- Rechazar cantidades fuera de rango, identificadores vacios, tipo de cambio menor o igual a cero y margenes fuera de `0` a `100`.
- Mantener los nombres de estados alineados con la base de datos. La receta solo es editable y recargable en estado `Enviada`.

## Base de datos desde backend

- Usar consultas preparadas con PDO y `bindValue` cuando haya datos externos.
- No concatenar entradas de usuario en SQL.
- Usar transacciones para operaciones compuestas, por ejemplo cabecera y detalle de receta.
- Ejecutar `rollback` si ocurre una excepcion durante una transaccion.
- Mantener fechas operativas con zona horaria `America/Lima` cuando el flujo requiera hora local.

## SSE y tiempo real

- Los endpoints SSE deben declarar `Content-Type: text/event-stream; charset=utf-8`.
- Validar sesion antes de iniciar el stream.
- Llamar `session_write_close()` despues de validar autenticacion para liberar el bloqueo de sesion.
- Emitir eventos explicitos y payload JSON: `price_changes`, `ping`, `stream_disabled`, `error`.
- Mantener el stream de recetas activo solo en estado `Enviada`.
- Usar firmas livianas (`count`, `checksum` o equivalente) antes de consultar detalle completo.
- Rotar o cortar conexiones largas para permitir reconexion limpia de `EventSource`.

## Calculos comerciales

- Las reglas de calculo deben ser deterministas y compartidas entre pantallas y PDFs.
- Respetar `docs/CALCULO_VARIABLES.md` para totales por moneda y `Total Peru`.
- Conservar precision interna y redondear solo para presentacion.
- Si se modifica FOB, flete, gastos, interes, factor, margen o conversion de moneda, actualizar documentacion funcional y pruebas manuales relevantes.

## Archivos y exportaciones

- Validar cabeceras y estructura de archivos Excel antes de procesar carga masiva.
- No confiar en nombres de archivo enviados por usuario.
- Para PDFs con Dompdf, mantener calculos y permisos consistentes con la UI.

## Checklist antes de cerrar

1. El endpoint valida sesion, metodo HTTP y payload.
2. Las consultas usan PDO preparado.
3. Las operaciones compuestas usan transaccion.
4. Las respuestas JSON son consistentes.
5. Las reglas criticas estan validadas tambien en backend.
6. Si se agrego endpoint nuevo, se documento en `README.md`.
7. Si se modifico tiempo real, se documento el comportamiento y rendimiento.
