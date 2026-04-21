<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    $hash = $_GET['id'] ?? null;

    if (!$hash) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'ID inválido']);
        exit;
    }

    $recetaModel = new Receta();

    $receta = $recetaModel->obtenerPorHash($hash);

    if (!$receta) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Receta no encontrada']);
        exit;
    }

    $detalle = $recetaModel->obtenerDetallePorHash($hash);

    echo json_encode([
        'receta' => $receta,
        'detalle'    => $detalle
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
