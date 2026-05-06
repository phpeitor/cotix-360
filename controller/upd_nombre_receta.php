<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'success' => false,
            'message' => 'Metodo no permitido'
        ]);
        exit;
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

    $usuarioUpd = isset($_SESSION['session_id']) ? (int)$_SESSION['session_id'] : null;

    $receta = new Receta();
    // Obtener id real para concatenar al nombre
    $row = $receta->obtenerPorHash($hash);
    if (!$row) {
        echo json_encode([
            'success' => false,
            'message' => 'Receta no encontrada'
        ]);
        exit;
    }

    $id = (int)$row['id'];
    $prefixed = sprintf('PRO-%s-%d', $nombre, $id);

    $ok = $receta->actualizarNombrePorHash($hash, $prefixed, $usuarioUpd);

    echo json_encode([
        'success' => $ok,
        'message' => $ok ? 'Nombre de receta actualizado' : 'No se realizaron cambios'
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
