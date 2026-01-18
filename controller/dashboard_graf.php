<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/dashboard.php';

try {
    $dashboard = new Dashboard();
    $graf_donut   = $dashboard->graf_donut();
    $graf_line   = $dashboard->graf_line();

    echo json_encode([
        'error' => false,
        'data'  => [
            'donut'   => $graf_donut,
            'line'    => $graf_line
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => true,
        'message' => $e->getMessage()
    ]);
}
