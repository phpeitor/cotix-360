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
    if ((int)($_SESSION['session_cargo'] ?? 0) !== 1) {
        http_response_code(403);
        throw new RuntimeException('Solo el Administrador puede modificar el Nombre Interno');
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new RuntimeException('Método no permitido');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    $nombreInterno = trim((string)($_POST['nombre_interno'] ?? ''));
    if (!preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        http_response_code(400);
        throw new InvalidArgumentException('Hash inválido');
    }
    if (mb_strlen($nombreInterno, 'UTF-8') > 150) {
        http_response_code(400);
        throw new InvalidArgumentException('El Nombre Interno no puede superar los 150 caracteres');
    }

    $receta = new Receta();
    if (!$receta->obtenerPorHash($hash)) {
        http_response_code(404);
        throw new RuntimeException('Receta no encontrada');
    }
    $ok = $receta->actualizarNombreInternoPorHash($hash, $nombreInterno, (int)$_SESSION['session_id']);
    echo json_encode(['success' => $ok, 'nombre_interno' => $nombreInterno], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
