<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {

    if (!isset($_SESSION['session_id']) || $_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'message' => 'Metodo no permitido'
        ]);
        exit;
    }

    $item = new Item();
    $itemId = $item->guardarItemReceta([
        'categoria' => $_POST['categoria'] ?? '',
        'sub_cat_1' => $_POST['sub_cat_1'] ?? '',
        'sub_cat_2' => $_POST['sub_cat_2'] ?? '',
        'marca' => $_POST['marca'] ?? '',
        'modelo' => $_POST['modelo'] ?? '',
        'nombre' => $_POST['nombre'] ?? '',
        'descripcion' => $_POST['descripcion'] ?? '',
        'uni_medida' => $_POST['uni_medida'] ?? '',
        'precio' => isset($_POST['precio']) ? (float)$_POST['precio'] : 0,
        'stock' => isset($_POST['stock']) ? (int)$_POST['stock'] : 0,
        'moneda' => $_POST['moneda'] ?? '',
        'tipo' => $_POST['tipo'] ?? '',
    ]);

    echo json_encode([
        'ok' => true,
        'id' => $itemId
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}