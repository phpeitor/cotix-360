<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesion expirada o usuario no autenticado');
    }

    $hash = trim((string)($_POST['id'] ?? ''));
    if ($hash === '') {
        throw new Exception('ID invalido');
    }

    $recetaModel = new Receta();
    $receta = $recetaModel->obtenerPorHash($hash);

    if (!$receta) {
        throw new Exception('Receta no encontrada');
    }

    $estadoActual = trim((string)($receta['estado'] ?? ''));
    $estadoNuevo = $estadoActual;
    $changed = false;

    if (strcasecmp($estadoActual, 'Enviada') === 0) {
        $ok = $recetaModel->actualizar_estado((int)$receta['id'], 'Ofertado', (int)$_SESSION['session_id']);
        if (!$ok) {
            throw new Exception('No se pudo actualizar la receta a Ofertado');
        }

        $estadoNuevo = 'Ofertado';
        $changed = true;
    }

    echo json_encode([
        'success' => true,
        'changed' => $changed,
        'estado' => $estadoNuevo,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
