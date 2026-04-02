<?php
require_once __DIR__ . '/../config/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido']);
    exit;
}

$url = $_ENV['SUNAT_TIPO_CAMBIO_KEY'] ?? '';

if (!$url) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'SUNAT_TIPO_CAMBIO_KEY no configurado']);
    exit;
}

try {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception('Error en cURL: ' . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('SUNAT devolvio HTTP ' . $httpCode);
    }

    $line = trim((string)$response);
    // Formato esperado: fecha|compra|venta|
    $parts = explode('|', $line);

    if (count($parts) < 3) {
        throw new Exception('Formato de respuesta SUNAT invalido');
    }

    $fecha = trim($parts[0]);
    $compra = (float)trim($parts[1]);
    $venta = (float)trim($parts[2]);

    echo json_encode([
        'ok' => true,
        'fecha' => $fecha,
        'compra' => $compra,
        'venta' => $venta,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
