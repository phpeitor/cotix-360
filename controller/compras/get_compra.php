<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $hash = trim((string)($_GET['id'] ?? ''));
    if ($hash === '' || !preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        throw new Exception('ID inválido');
    }

    $compras = new Compras();
    $compra = $compras->obtenerCompraPorHash($hash);

    if (!$compra) {
        throw new Exception('Compra no encontrada');
    }

    echo json_encode([
        'success' => true,
        'compra' => $compra,
        'detalle' => $compras->obtenerDetallePorHash($hash),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
