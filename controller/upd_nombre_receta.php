<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'success' => false,
            'message' => 'Metodo no permitido'
        ]);
        exit;
    }

    if ((int)($_SESSION['session_cargo'] ?? 0) !== 1) {
        http_response_code(403);
        throw new RuntimeException('Solo el Administrador puede modificar el nombre de una receta');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    $nombre = trim((string)($_POST['nombre'] ?? ''));

    if (strlen($hash) !== 32) {
        echo json_encode([
            'success' => false,
            'message' => 'Hash invalido'
        ]);
        exit;
    }

    if ($nombre === '') {
        echo json_encode([
            'success' => false,
            'message' => 'Debe ingresar un nombre para la receta'
        ]);
        exit;
    }
    if (mb_strlen($nombre, 'UTF-8') > 100) {
        throw new InvalidArgumentException('El nombre de la receta no puede superar los 100 caracteres');
    }

    $usuarioUpd = isset($_SESSION['session_id']) ? (int)$_SESSION['session_id'] : null;

    $receta = new Receta();
    $row = $receta->obtenerPorHash($hash);
    if (!$row) {
        echo json_encode([
            'success' => false,
            'message' => 'Receta no encontrada'
        ]);
        exit;
    }

    $ok = $receta->actualizarNombrePorHash($hash, $nombre, $usuarioUpd);

    echo json_encode([
        'success' => $ok,
        'message' => $ok ? 'Nombre de receta actualizado' : 'No se realizaron cambios'
    ]);
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
