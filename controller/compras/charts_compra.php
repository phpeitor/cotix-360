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

    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    if (!in_array($cargo, Compras::CARGOS_VER_MONTOS, true)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Sin permisos'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $compras = new Compras();
    $compra = $compras->obtenerCompraPorHash($hash);
    if (!$compra) {
        throw new Exception('Compra no encontrada');
    }
    if ((int)($_SESSION['session_cargo'] ?? 0) === 5 && (int)($compra['asignado_usuario_id'] ?? 0) > 0 && (int)$compra['asignado_usuario_id'] !== (int)$_SESSION['session_id']) {
        http_response_code(403);
        throw new RuntimeException('Esta compra no está asignada a tu usuario');
    }

    $data = $compras->datosGraficosPorHash($hash);

    echo json_encode(['success' => true] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
