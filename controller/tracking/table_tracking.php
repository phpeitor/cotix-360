<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/tracking/tracking.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    $fecIni = trim((string)($_GET['fec_ini'] ?? $_POST['fec_ini'] ?? ''));
    $fecFin = trim((string)($_GET['fec_fin'] ?? $_POST['fec_fin'] ?? ''));
    $hayFiltroFecha = $fecIni !== '' || $fecFin !== '';

    if ($hayFiltroFecha && ($fecIni === '' || $fecFin === '')) {
        throw new Exception('Debe seleccionar un rango de fechas completo');
    }

    if ($hayFiltroFecha && (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecIni) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecFin))) {
        throw new Exception('Formato de fecha inválido (YYYY-MM-DD)');
    }

    $estado = strtolower(trim((string)($_GET['estado'] ?? 'abierto')));
    if (!in_array($estado, ['todos', 'abierto', 'cerrado'], true)) {
        throw new Exception('Filtro de estado inválido');
    }

    $codigoTracking = trim((string)($_GET['cod_tracking'] ?? ''));
    $ruc = trim((string)($_GET['ruc'] ?? ''));
    if (mb_strlen($codigoTracking) > 100 || mb_strlen($ruc) > 20) {
        throw new Exception('El filtro enviado supera la longitud permitida');
    }

    $tracking = new Tracking();
    $data = $tracking->tableTracking(
        $hayFiltroFecha ? $fecIni : null,
        $hayFiltroFecha ? $fecFin : null,
        $estado,
        $codigoTracking,
        $ruc
    );

    echo json_encode([
        'error' => false,
        'data' => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
