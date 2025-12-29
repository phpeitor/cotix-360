<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/dashboard.php';

try {
    $dashboard = new Dashboard();

    $cotizaciones = $dashboard->table_cotizacion();
    $items        = $dashboard->items();
    $contadores        = $dashboard->contadores();

    echo json_encode([
        'error' => false,
        'data'  => [
            'cotizaciones' => $cotizaciones,
            'items'        => $items,
            'contadores'   => $contadores
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'error'   => true,
        'message' => $e->getMessage()
    ]);
}
