<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    session_start();

    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    $recetaId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    $receta = new Receta();
    $resultado = $receta->obtenerCategoriasParaEdicion($recetaId);

    echo json_encode([
        'ok' => true,
        'source' => $resultado['source'] ?? 'detalle',
        'rows' => $resultado['rows'] ?? [],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}