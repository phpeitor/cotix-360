<?php
header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $notifications = $_SESSION['header_notifications'] ?? [];
    $_SESSION['header_notifications'] = [];

    echo json_encode([
        'ok' => true,
        'notifications' => array_values(is_array($notifications) ? $notifications : [])
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}