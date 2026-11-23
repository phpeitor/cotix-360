<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/usuario.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$usuarioId = (int)($_SESSION['session_id'] ?? 0);
if ($usuarioId <= 0) {
    http_response_code(401);
    echo json_encode(['ok' => false]);
    exit;
}

try {
    $usuario = new Usuario();
    $accion = strtolower(trim((string)($_POST['accion'] ?? $_GET['accion'] ?? '')));
    if ($accion === 'offline') {
        $usuario->desconectarUsuario($usuarioId);
        echo json_encode(['ok' => true, 'online' => false]);
        exit;
    }
    $usuario->registrarPresencia($usuarioId);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
