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

    $hash = trim((string)($_POST['hash'] ?? ''));
    $observacion = trim((string)($_POST['observacion'] ?? ''));

    if (strlen($hash) !== 32) {
        echo json_encode(['success' => false, 'message' => 'Hash invalido']);
        exit;
    }

    if (mb_strlen($observacion) > 300) {
        echo json_encode(['success' => false, 'message' => 'Observación demasiado larga']);
        exit;
    }

    $usuarioUpd = isset($_SESSION['session_id']) ? (int)$_SESSION['session_id'] : null;

    $receta = new Receta();
    $ok = $receta->actualizarObservacionPorHash($hash, $observacion, $usuarioUpd);

    echo json_encode([
        'success' => $ok,
        'message' => $ok ? 'Observación actualizada' : 'No se realizó ningún cambio'
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
