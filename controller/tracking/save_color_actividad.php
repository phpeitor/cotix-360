<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/tracking/tracking.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new RuntimeException('Método no permitido');
    }

    $trackingId = (int)($_POST['tracking_id'] ?? 0);
    if ($trackingId <= 0) {
        throw new InvalidArgumentException('El tracking es obligatorio');
    }

    $tracking = new Tracking();
    if (!$tracking->trackingExiste($trackingId)) {
        throw new RuntimeException('El tracking no existe');
    }
    $datos = $tracking->datosTrackingModal($trackingId);
    if (strtolower((string)($datos['estado'] ?? '')) === 'cerrado') {
        throw new RuntimeException('El tracking está cerrado y no admite cambios');
    }

    $color = $tracking->guardarColorActividad(
        $trackingId,
        (string)($_POST['fase'] ?? ''),
        (string)($_POST['actividad'] ?? ''),
        (string)($_POST['color'] ?? ''),
        (int)$_SESSION['session_id']
    );

    echo json_encode([
        'success' => true,
        'color' => $color,
        'guardado_por' => (string)($_SESSION['session_usuario'] ?? '')
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
