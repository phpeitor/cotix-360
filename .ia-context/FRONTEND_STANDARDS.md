# Frontend Standards - Cotix360

## Objetivo

Mantener interfaces consistentes, seguras y mantenibles para los modulos de cotizaciones, recetas, carga de items, usuarios, dashboard y exportaciones relacionadas.

## Stack y ubicacion

- JavaScript del proyecto: `assets/js/`.
- CSS del proyecto: `assets/css/`.
- Vistas PHP/HTML: raiz del proyecto y archivos de pantalla existentes.
- UI base: Bootstrap, Grid.js, Alertify y librerias ya incluidas en `assets/`.
- No agregar JavaScript ni CSS inline en vistas. Las vistas solo deben renderizar estructura, datos `data-*` y referencias a assets.

## Reglas obligatorias

1. Todo JavaScript nuevo debe vivir en un archivo dedicado dentro de `assets/js/`.
2. Todo CSS nuevo debe vivir en un archivo dedicado dentro de `assets/css/`.
3. Las vistas no deben mezclar logica de negocio ni calculos extensos; deben delegar en JS o backend segun corresponda.
4. Los datos enviados desde PHP hacia JS deben exponerse con atributos `data-*` o endpoints JSON, no con bloques `<script>` inline.
5. Toda restriccion critica de negocio debe validarse tambien en backend.
6. No mostrar datos sensibles si el rol no corresponde. Para `session_cargo === 4` (Tecnico), ocultar precios y totales sensibles en UI y PDF.
7. Mantener nombres de estados y campos alineados con la base de datos.

## Formularios y validacion

- Validar entradas antes de enviar al backend: cantidades, tipo de cambio, margenes, fechas y campos obligatorios.
- Usar rangos consistentes con backend. Ejemplo: cantidades de receta entre `1` y `5000`; margenes entre `0` y `100`.
- Normalizar numeros ingresados por usuario aceptando coma o punto solo cuando el flujo existente lo haga.
- Mostrar errores claros al usuario, sin exponer trazas ni detalles internos.
- Deshabilitar botones mientras una operacion asincrona esta en curso para evitar doble envio.

## Fetch y endpoints AJAX

- Consumir controladores en `controller/` mediante `fetch` o patrones ya existentes.
- Esperar respuestas JSON consistentes con banderas como `ok` o `success` y `message`.
- Manejar errores de red, respuestas no validas y sesiones expiradas.
- No confiar en validaciones del frontend para seguridad; el backend decide autorizacion, estado y persistencia.

## Recetas y SSE

- El frontend debe abrir `EventSource` solo para recetas en estado `Enviada`.
- Si el backend emite `stream_disabled`, cerrar el stream y actualizar la UI a modo no editable.
- Procesar eventos explicitos: `price_changes`, `ping`, `stream_disabled` y `error`.
- Evitar renders completos si solo cambio una fila o indicador.
- Mantener la sincronizacion entre pestañas sin generar polling adicional innecesario.

## Calculos y moneda

- Usar las formulas documentadas en `docs/CALCULO_VARIABLES.md` para totales de recetas.
- Mostrar soles y dolares con 2 decimales; tipo de cambio con 3 decimales.
- Conservar precision interna y redondear al presentar.
- Para totales mixtos, mostrar `Total S/`, `Total $` y `Total Peru` cuando aplique.

## Seguridad de UI

- Escapar HTML antes de interpolar datos de servidor o usuario en plantillas JS.
- No construir HTML con datos crudos sin sanitizacion.
- No exponer tokens, credenciales ni variables de entorno en vistas o assets.
- No depender de ocultar botones como unica medida de seguridad.

## PDFs

- Mantener estilos de PDF en archivos CSS dedicados, por ejemplo `assets/css/pdf_receta.css`.
- Evitar CSS incompatible con Dompdf, especialmente layouts que dependan de `position: fixed` para footers complejos.
- Los PDFs deben aplicar las mismas restricciones de permisos que la UI.

## Checklist antes de cerrar

1. No hay JS/CSS inline nuevo.
2. El archivo JS o CSS dedicado esta referenciado por la vista correspondiente.
3. Las validaciones criticas existen tambien en backend.
4. Los errores al usuario son claros y no filtran informacion sensible.
5. El flujo funciona en desktop y mobile cuando la vista sea usada por usuarios finales.
6. Si se modificaron calculos, se actualizo `docs/CALCULO_VARIABLES.md` o la documentacion funcional relacionada.
