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
        'modelo'            => $_POST['modelo'] ?? '',
        'descripcion'       => $_POST['descripcion'] ?? '',
        'precio_unitario'   => $_POST['precio'] ?? '',
        'grupo_descuento'   => $_POST['grupo'] ?? '',
        'pais_origen'       => $_POST['origen'] ?? '',
        'peso'              => $_POST['peso'] ?? 0,
        'estado'            => isset($_POST['estado']) ? 1 : 0,
    ];

    $item = new Item();

    $existe = $item->valida_modelo_upd($data['modelo'], $hash);
    if ($existe) {
        echo json_encode([
            'ok' => false,
            'message' => 'El modelo ya está registrado por otro item'
        ]);
        exit;
    }

    $ok = $item->actualizarPorHash($hash, $data);

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
