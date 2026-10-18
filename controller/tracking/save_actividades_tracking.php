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

    $trackingId = (int)($_POST['tracking_id'] ?? 0);
    if ($trackingId <= 0) {
        throw new Exception('El tracking es obligatorio');
    }

    $tracking = new Tracking();

    if (!$tracking->trackingExiste($trackingId)) {
        throw new Exception('El tracking no existe');
    }

    $actividadesRaw = $_POST['actividades'] ?? [];
    if (!is_array($actividadesRaw)) {
        throw new Exception('Datos de actividades inválidos');
    }

    $actividades = [];
    foreach ($actividadesRaw as $item) {
        $item = is_array($item) ? $item : [];
        $fase = trim((string)($item['fase'] ?? ''));
        $actividad = trim((string)($item['actividad'] ?? ''));

        if ($fase === '' || $actividad === '') {
            continue;
        }

        $actividades[] = [
            'fase' => $fase,
            'actividad' => $actividad,
            'fecha' => trim((string)($item['fecha'] ?? '')),
            'observacion' => trim((string)($item['observacion'] ?? '')),
            'color' => trim((string)($item['color'] ?? Tracking::COLOR_ACTIVIDAD_DEFAULT)),
            'completada' => filter_var($item['completada'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'cambiada' => filter_var($item['cambiada'] ?? true, FILTER_VALIDATE_BOOLEAN)
        ];
    }

    $fasesRegistradas = array_fill_keys(array_keys(Tracking::FASES_ACTIVIDADES), false);
    foreach ($actividades as $item) {
        if (!empty($item['completada']) && isset($fasesRegistradas[$item['fase']])) {
            $fasesRegistradas[$item['fase']] = true;
        }
    }

    if (empty($fasesRegistradas['Inicio'])) {
        throw new Exception('Debe registrar al menos una actividad de la fase Inicio');
    }

    $usuarioId = (int)$_SESSION['session_id'];
    $tracking->guardarActividades($trackingId, $actividades, $usuarioId);

    $descripcion = trim((string)($_POST['descripcion'] ?? ''));
    $tracking->guardarDescripcion($trackingId, $descripcion);
    $numOc = trim((string)($_POST['num_oc'] ?? ''));
    $tracking->guardarNumOc($trackingId, $numOc);
    $nombre = trim((string)($_POST['nombre'] ?? ''));
    $tracking->guardarNombre($trackingId, $nombre);

    echo json_encode([
        'success' => true,
        'registradas' => count(array_filter($actividades, static fn($item) => !empty($item['completada']))),
        'guardado_por' => (string)($_SESSION['session_usuario'] ?? '')
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
