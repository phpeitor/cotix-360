<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {

    if (!isset($_SESSION['session_id']) || $_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    $id     = $_POST['id']     ?? null;
    $accion = $_POST['accion'] ?? null;

    if (!$id || !$accion) {
        throw new Exception("Parámetros incompletos");
    }

    if (!in_array($accion, ['aprobar', 'anular'])) {
        throw new Exception("Acción no válida");
    }

    $estado = $accion === 'aprobar'
        ? 'Aprobada'
        : 'Anulada';

    $receta = new Receta();

    if ($accion === 'aprobar' && !$receta->recetaTieneNombre((int)$id)) {
        throw new Exception('No se puede aprobar la receta porque no tiene nombre registrado');
    }

    if ($accion === 'aprobar' && !$receta->recetaTieneClienteCompleto((int)$id)) {
        throw new Exception('No se puede aprobar la receta porque no tiene datos del cliente y comerciales completos');
    }

    if ($accion === 'aprobar' && $receta->recetaTieneProductosPrecioCero((int)$id)) {
        throw new Exception('No se puede aprobar la receta porque hay productos con precio 0');
    }

    if ($accion === 'aprobar' && !$receta->recetaTieneMargenes((int)$id)) {
        throw new Exception('No se puede aprobar la receta porque no tiene márgenes registrados');
    }

    $receta->begin();

    $ok = $receta->actualizar_estado((int)$id, $estado,(int)$_SESSION['session_id']);

    if (!$ok) {
        throw new Exception("No se pudo actualizar el estado");
    }

    $ingenieriaId = null;
    if ($accion === 'aprobar') {
        $ingenieriaId = $receta->crearRecetaIngenieriaDesdeReceta((int)$id, (int)$_SESSION['session_id']);
    }

    $receta->commit();

    echo json_encode([
        'success' => true,
        'estado'  => $estado,
        'ingenieria_id' => $ingenieriaId
    ]);

} catch (Throwable $e) {
    if (isset($receta) && $receta instanceof Receta) {
        $receta->rollback();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
