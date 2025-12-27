<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/cotizacion.php';

try {
    $hash = $_GET['id'] ?? null;

    if (!$hash) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'ID inválido']);
        exit;
    }

    $cotizacionModel = new Cotizacion();

    $cotizacion = $cotizacionModel->obtenerPorHash($hash);

    if (!$cotizacion) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Cotización no encontrada']);
        exit;
    }

    $detalle = $cotizacionModel->obtenerDetallePorHash($hash);

    echo json_encode([
        'cotizacion' => $cotizacion,
        'detalle'    => $detalle
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
