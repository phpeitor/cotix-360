<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        http_response_code(401);
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }
    if (!in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 3], true)) {
        http_response_code(403);
        throw new RuntimeException('Solo Administración y Supervisión pueden asignar a Compras');
    }

    $receta = new Receta();
    echo json_encode([
        'success' => true,
        'usuarios' => $receta->obtenerUsuariosComprasActivos(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
