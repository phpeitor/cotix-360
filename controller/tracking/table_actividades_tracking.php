<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/tracking/tracking.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesión expirada o usuario no autenticado');
    }

    $trackingId = (int)($_GET['tracking_id'] ?? 0);
    if ($trackingId <= 0) {
        throw new Exception('El tracking es obligatorio');
    }

    $tracking = new Tracking();

    if (!$tracking->trackingExiste($trackingId)) {
        throw new Exception('El tracking no existe');
    }

    echo json_encode([
        'success' => true,
        'fases' => Tracking::FASES_ACTIVIDADES,
        'actividades' => $tracking->actividadesTracking($trackingId),
        'descripcion' => $tracking->obtenerDescripcion($trackingId)
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}