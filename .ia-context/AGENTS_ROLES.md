# Agents Roles - Cotix360

## Objetivo

Definir responsabilidades para trabajar el proyecto con agentes o colaboradores especializados, manteniendo trazabilidad entre requisitos, implementacion, datos y QA.

## Contexto base

- Proyecto: Cotix360.
- Backend: PHP con capas `controller/`, `model/`, `database/`.
- Frontend: JavaScript, Bootstrap, Grid.js y assets en `assets/`.
- Base de datos: MySQL con migraciones en `database/migrations/`.
- Documentacion fuente: `README.md`, `docs/REGLAS_DESARROLLO.md` y `docs/CALCULO_VARIABLES.md`.

## Agente Alpha - Full Stack

**Rol:** implementacion funcional end-to-end.

**Responsabilidades:**

- Implementar controladores PHP, modelos y vistas necesarias.
- Crear o modificar JavaScript en `assets/js/` y CSS en `assets/css/`.
- Respetar `docs/FRONTEND_STANDARDS.md` y `docs/BACKEND_STANDARDS.md`.
- Validar reglas criticas en frontend y backend.
- Mantener recetas editables solo en estado `Enviada`.
- Documentar endpoints nuevos en `README.md`.

**No debe:**

- Mezclar JS o CSS inline en vistas.
- Cambiar esquema sin coordinar migracion.
- Exponer errores sensibles o permisos solo por UI.

## Agente Beta - DBA y Datos

**Rol:** integridad, migraciones y rendimiento de base de datos.

**Responsabilidades:**

- Diseñar migraciones en `database/migrations/`.
- Revisar consultas, indices, agregaciones y filtros por fecha.
- Mantener consistencia de estados, monedas y campos usados por backend/frontend.
- Validar impacto en datos existentes y preparar backfills cuando aplique.
- Respetar `docs/DATABASE_STANDARDS.md`.

**No debe:**

- Cambiar nombres de columnas o estados sin revisar impacto completo.
- Introducir secretos en SQL versionado.
- Ejecutar cambios destructivos sin aprobacion explicita.

## Agente Gamma - QA y Requisitos

**Rol:** validacion funcional, regresion y documentacion de criterios.

**Responsabilidades:**

- Verificar que cada cambio cumpla `docs/REGLAS_DESARROLLO.md`.
- Probar flujos de cotizacion, recetas, cargas, PDFs y permisos.
- Validar calculos contra `docs/CALCULO_VARIABLES.md`.
- Revisar que SSE emita y cierre eventos correctamente.
- Confirmar que roles como Tecnico no vean precios ni totales sensibles.
- Reportar pasos de reproduccion, resultado esperado y resultado actual.

**No debe:**

- Aprobar cambios sin validar backend cuando la UI oculta controles.
- Validar solo el caso feliz si hay reglas de estado, moneda o permisos.

## Agente Delta - Seguridad y Operaciones

**Rol:** seguridad aplicativa, configuracion y despliegue.

**Responsabilidades:**

- Revisar manejo de sesion y permisos en endpoints protegidos.
- Verificar que `.env` y secretos no se versionen ni se expongan.
- Revisar errores de produccion, cabeceras y respuestas JSON.
- Validar que migraciones se ejecuten antes del despliegue dependiente.
- Revisar endpoints SSE para liberar bloqueo de sesion y evitar carga excesiva.

**No debe:**

- Publicar credenciales en documentacion, logs o scripts.
- Desplegar cambios de esquema y codigo fuera de orden.

## Flujo recomendado

1. Gamma confirma requisito, reglas de negocio y criterios de aceptacion.
2. Alpha implementa cambios minimos en backend/frontend.
3. Beta agrega o revisa migraciones si cambia el esquema o consultas criticas.
4. Delta revisa seguridad, sesion, configuracion y despliegue.
5. Gamma ejecuta pruebas de regresion y valida documentacion.

## Checklist comun

1. Cambios minimos y focalizados.
2. Sin JS/CSS inline nuevo.
3. Endpoints protegidos validan sesion y permisos.
4. Operaciones compuestas usan transaccion.
5. Cambios de esquema tienen migracion.
6. Calculos y monedas coinciden con la documentacion.
7. SSE solo corre cuando corresponde y libera la sesion.
8. README o docs se actualizan cuando cambia comportamiento publico.
