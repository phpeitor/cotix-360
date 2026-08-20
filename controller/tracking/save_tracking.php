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

    $nombre    = trim((string)($_POST['nombre'] ?? ''));
    $razonSocial = trim((string)($_POST['razon_social_empresa'] ?? ''));
    $ruc       = trim((string)($_POST['ruc'] ?? ''));
    $codTracking = trim((string)($_POST['cod_tracking'] ?? ''));

    if ($nombre === '') {
        throw new Exception('El nombre es obligatorio');
    }
    if ($razonSocial === '') {
        throw new Exception('La razón social es obligatoria');
    }
    if ($ruc === '') {
        throw new Exception('El RUC es obligatorio');
    }
    if (!preg_match('/^\d{11}$/', $ruc)) {
        throw new Exception('El RUC debe tener 11 dígitos');
    }

    $tracking = new Tracking();

    if ($codTracking !== '' && $tracking->codigoExiste($codTracking)) {
        throw new Exception('El código de tracking ya se encuentra registrado');
    }

    $id = $tracking->crearManual($nombre, $razonSocial, $ruc, $codTracking);

    if ($id <= 0) {
        throw new Exception('No se pudo registrar el tracking');
    }

    echo json_encode([
        'success' => true,
        'id' => $id,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}