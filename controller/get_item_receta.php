<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    $hash = $_GET['hash'] ?? null;

    if (!$hash || strlen($hash) !== 32) {
        echo json_encode([
            'ok' => false,
            'message' => 'Hash inválido'
        ]);
        exit;
    }

    $item = new Item();
    $data = $item->obtenerItemRecetaPorHash($hash);

    if (!$data) {
        echo json_encode([
            'ok' => false,
            'message' => 'Item receta no encontrado'
        ]);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
