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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(405, ['ok' => false, 'message' => 'Método no permitido']);
    }

    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        jsonResponse(401, ['ok' => false, 'message' => 'Sesión expirada o usuario no autenticado']);
    }

    $trackingId = (int)($_POST['tracking_id'] ?? 0);
    if ($trackingId <= 0) {
        jsonResponse(400, ['ok' => false, 'message' => 'El tracking es obligatorio']);
    }

    $tracking = new Tracking();
    $ok = $tracking->cerrarTracking($trackingId);

    if (!$ok) {
        jsonResponse(400, ['ok' => false, 'message' => 'No se pudo cerrar el tracking']);
    }

    jsonResponse(200, ['ok' => true, 'message' => 'Tracking cerrado correctamente']);
} catch (InvalidArgumentException $e) {
    jsonResponse(400, ['ok' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    jsonResponse(500, ['ok' => false, 'message' => $e->getMessage()]);
}