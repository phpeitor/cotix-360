<?php
header('Content-Type: application/json; charset=utf-8');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__ . '/../model/usuario.php';

if (!isset($_SESSION['session_id'], $_SESSION['session_usuario'], $_SESSION['session_cargo'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Sesión no válida']);
    exit;
}

try {
    $usuarioId = (int)($_SESSION['session_id'] ?? 0);
    if ($usuarioId <= 0) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'message' => 'Sesión no válida']);
        exit;
    }

    $perfil = (new Usuario())->obtenerPerfil($usuarioId);
    if (!$perfil) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Perfil no encontrado']);
        exit;
    }

    echo json_encode(['ok' => true, 'data' => $perfil]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No se pudo cargar el perfil']);
}
