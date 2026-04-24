<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode(['ok' => false, 'message' => 'Sesión expirada o usuario no autenticado']);
        exit;
    }

    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        echo json_encode(['ok' => false, 'message' => 'ID no válido']);
        exit;
    }

    $id = (int) $_POST['id'];
    $item = new Item();

    if ($item->bajaItemReceta($id)) {
        echo json_encode(['ok' => true, 'message' => 'Item de baja correctamente']);
    } else {
        echo json_encode(['ok' => false, 'message' => 'No se pudo dar de baja el item']);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
