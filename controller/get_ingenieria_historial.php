<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesión expirada o usuario no autenticado');
    }

    $hash = trim((string)($_GET['id'] ?? ''));
    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;

    $receta = new Receta();
    $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
    if (!$ingenieria) {
        throw new Exception('Receta de ingeniería no encontrada');
    }

    echo json_encode([
        'success' => true,
        'historial' => $receta->listarHistorialIngenieriaPorHash($hash, $page, $perPage),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
