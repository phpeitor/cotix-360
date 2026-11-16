<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/dashboard.php';

try {
    $inicio = DateTimeImmutable::createFromFormat('!Y-m-d', (string)($_GET['fecha_inicio'] ?? ''));
    $fin = DateTimeImmutable::createFromFormat('!Y-m-d', (string)($_GET['fecha_fin'] ?? ''));

    if (!$inicio || !$fin || $fin < $inicio) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'Rango de fechas no válido']);
        exit;
    }

    if ($inicio->diff($fin)->days > 366) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'El rango no puede superar 1 año']);
        exit;
    }

    $data = (new Dashboard())->variaciones($inicio->format('Y-m-d'), $fin->format('Y-m-d'));
    echo json_encode(['error' => false, 'data' => $data], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'No se pudieron cargar las variaciones']);
}
