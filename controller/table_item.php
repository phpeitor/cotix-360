<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    $base = $_GET['base'] ?? null;
    $grupo = $_GET['grupo'] ?? null;
    $clase = $_GET['clase'] ?? null;
    $categoria = $_GET['categoria'] ?? null;
    $md5_id = $_GET['md5_id'] ?? null;

    $item = new Item();
    $data = $item->table_item($base, $grupo, $clase, $categoria, $md5_id);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}