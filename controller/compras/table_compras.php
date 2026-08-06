<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $fecIni = $_GET['fec_ini'] ?? $_POST['fec_ini'] ?? null;
    $fecFin = $_GET['fec_fin'] ?? $_POST['fec_fin'] ?? null;

    if (!$fecIni || !$fecFin) {
        throw new Exception('Debe enviar fec_ini y fec_fin');
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecIni) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecFin)) {
        throw new Exception('Formato de fecha inválido (YYYY-MM-DD)');
    }

    $compras = new Compras();
    echo json_encode([
        'error' => false,
        'data' => $compras->tableCompras($fecIni, $fecFin),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
