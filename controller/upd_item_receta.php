<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
        exit;
    }

    if (!isset($_POST['hash']) || strlen($_POST['hash']) !== 32) {
        echo json_encode(['ok' => false, 'message' => 'Hash no válido']);
        exit;
    }

    $hash = $_POST['hash'];

    $data = [
        'descripcion'       => $_POST['descripcion'] ?? '',
        'precio'   => $_POST['precio'] ?? '',
        'moneda'            => $_POST['moneda'] ?? '',
        'estado'            => isset($_POST['estado']) ? 1 : 0,
    ];

    $item = new Item();

    $ok = $item->actualizarItemRecetaPorHash($hash, $data);

    echo json_encode([
        'ok' => $ok,
        'message' => $ok ? 'Item actualizado correctamente' : 'No se realizaron cambios'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Mensaje del servidor: ' . $e->getMessage()
    ]);
}
