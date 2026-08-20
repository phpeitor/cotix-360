<?php
header('Content-Type: application/json; charset=utf-8');
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

    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        jsonResponse(401, ['ok' => false, 'message' => 'Sesión expirada o usuario no autenticado']);
    }

    $codTracking = trim((string)($_GET['cod_tracking'] ?? ''));

    if ($codTracking === '') {
        jsonResponse(400, ['ok' => false, 'message' => 'Debe enviar el parámetro cod_tracking']);
    }

    $tracking = new Tracking();
    $trackingRow = $tracking->trackingPorCodigo($codTracking);

    if ($trackingRow === null) {
        jsonResponse(404, ['ok' => false, 'message' => 'No se encontró un tracking con el código proporcionado']);
    }

    $codPublico = trim((string)($trackingRow['cod_publico'] ?? ''));

    if ($codPublico === '') {
        $codPublico = $tracking->asignarCodigoPublico((int)$trackingRow['id']);
    }

    $codigoPublico = trackingCodigoPublico($codTracking, $codPublico);

    jsonResponse(200, [
        'ok' => true,
        'cod_interno' => $codTracking,
        'cod_publico' => $codigoPublico,
        'url' => 'controller/tracking/api_tracking.php?cod_tracking=' . urlencode($codigoPublico),
    ]);
} catch (Throwable $e) {
    jsonResponse(500, ['ok' => false, 'message' => $e->getMessage()]);
}