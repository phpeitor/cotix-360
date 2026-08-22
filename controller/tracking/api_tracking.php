<?php
$allowedOrigins = [
    'http://localhost',
    'http://127.0.0.1',
    'https://tracking.metadatape.com',
    'https://mgindusol.metadatape.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once __DIR__ . '/../../config/tracking_codec.php';
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

    $encodificado = trim((string)($_GET['cod_tracking'] ?? $_GET['cod'] ?? ''));

    if ($encodificado === '') {
        jsonResponse(400, ['ok' => false, 'message' => 'Debe enviar el parámetro cod_tracking']);
    }

    $codPublico = trackingResolver($encodificado);

    if ($codPublico === null) {
        jsonResponse(400, ['ok' => false, 'message' => 'Código inválido o alterado']);
    }

    $tracking = new Tracking();
    $data = $tracking->trackingConActividadesPorCodigoPublico($codPublico);

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