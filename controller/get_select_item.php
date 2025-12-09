<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    $id = $_GET['id'] ?? null;
    $item = new Item();
    $data = $item->obtenerItems($id);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}