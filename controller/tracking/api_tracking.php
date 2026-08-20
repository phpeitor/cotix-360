<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/tracking/tracking.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function jsonResponse(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(405, ['ok' => false, 'message' => 'Método no permitido']);
    }

    $codTracking = trim((string)($_GET['cod_tracking'] ?? $_GET['cod'] ?? ''));

    if ($codTracking === '') {
        jsonResponse(400, ['ok' => false, 'message' => 'El parámetro cod_tracking es obligatorio']);
    }

    if (strlen($codTracking) > 30) {
        jsonResponse(400, ['ok' => false, 'message' => 'El código de tracking no puede superar 30 caracteres']);
    }

    $tracking = new Tracking();
    $data = $tracking->trackingConActividades($codTracking);

    if ($data === null) {
        jsonResponse(404, ['ok' => false, 'message' => 'No se encontró un tracking con el código proporcionado']);
    }

    $data['origen'] = (int)$data['origen_receta'] === 1 ? 'receta' : 'manual';

    jsonResponse(200, [
        'ok' => true,
        'data' => $data,
    ]);
} catch (Throwable $e) {
    jsonResponse(500, ['ok' => false, 'message' => $e->getMessage()]);
}