<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/cotizacion.php';

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

    $cotizacion = new Cotizacion();
    $ok = $cotizacion->actualizar_estado((int)$id, $estado,(int)$_SESSION['session_id']);

    if (!$ok) {
        throw new Exception("No se pudo actualizar el estado");
    }

    echo json_encode([
        'success' => true,
        'estado'  => $estado
    ]);

} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}