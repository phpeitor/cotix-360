<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';
require_once __DIR__ . '/../../model/tracking/tracking.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }

    $hash = trim((string)($_POST['id'] ?? $_GET['id'] ?? ''));
    if (!preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        throw new InvalidArgumentException('ID de compra inválido');
    }

    $compras = new Compras();
    $compra = $compras->obtenerCompraPorHash($hash);
    if (!$compra) {
        throw new RuntimeException('No se encontró la compra');
    }

    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    if (!in_array($cargo, Compras::CARGOS_EDITABLES, true)) {
        throw new RuntimeException('No tiene permisos para gestionar actividades de compras');
    }

    $recetaId = (int)($compra['id_receta_duplicada'] ?? 0);
    if ($recetaId <= 0) {
        throw new RuntimeException('Esta compra no está vinculada a una receta con tracking');
    }

    $tracking = new Tracking();
    $trackingRow = $tracking->trackingPorReceta($recetaId);
    if (!$trackingRow) {
        throw new RuntimeException('No existe un tracking asociado a la receta de esta compra');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (strtolower((string)$trackingRow['estado']) === 'cerrado') {
            throw new RuntimeException('El tracking está cerrado y no admite cambios');
        }

        $actividades = $_POST['actividades'] ?? [];
        if (!is_array($actividades)) {
            throw new InvalidArgumentException('Datos de actividades inválidos');
        }
        $tracking->guardarActividadesCompras((int)$trackingRow['id'], $actividades, (int)$_SESSION['session_id']);

        echo json_encode([
            'success' => true,
            'message' => 'Actividades de compras sincronizadas con el tracking',
            'guardado_por' => (string)($_SESSION['session_usuario'] ?? '')
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $codTracking = (string)$trackingRow['cod_tracking'];
    $codPublico = trim((string)($trackingRow['cod_publico'] ?? ''));
    if ($codPublico !== '') {
        $parts = explode('-', $codTracking);
        if (count($parts) >= 4) {
            $parts[count($parts) - 1] = $codPublico;
            $codTracking = implode('-', $parts);
        }
    }

    echo json_encode([
        'success' => true,
        'tracking_id' => (int)$trackingRow['id'],
        'cod_tracking' => $codTracking,
        'estado' => (string)$trackingRow['estado'],
        'actividades' => $tracking->actividadesComprasTracking((int)$trackingRow['id']),
        'colores' => $tracking->coloresActividadesTracking((int)$trackingRow['id'])
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
