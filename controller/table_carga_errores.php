<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        http_response_code(401);
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }

    $idCarga = (int)($_GET['id'] ?? 0);
    if ($idCarga <= 0) throw new InvalidArgumentException('ID de carga inválido');

    $item = new Item();
    echo json_encode([
        'ok' => true,
        'errores' => $item->obtenerErroresCarga($idCarga),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
