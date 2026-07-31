<?php
require_once __DIR__ . '/../config/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido']);
    exit;
}

$jsonUrl = $_ENV['SUNAT_TIPO_CAMBIO_URL'] ?? '';
$txtUrl = $_ENV['SUNAT_TIPO_CAMBIO_KEY'] ?? '';

if (!$jsonUrl && !$txtUrl) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'SUNAT_TIPO_CAMBIO_URL y SUNAT_TIPO_CAMBIO_KEY no configurados']);
    exit;
}

function fetchSunatTipoCambio(string $url): string
{
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
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Error en cURL: ' . $error);
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('SUNAT devolvio HTTP ' . $httpCode);
    }

    $response = trim((string)$response);

    if ($response === '') {
        throw new Exception('SUNAT no devolvio datos');
    }

    return $response;
}

function parseSunatJson(string $response): array
{
    $data = json_decode($response, true);

    if (!is_array($data) || !isset($data['venta']) || (float)$data['venta'] <= 0) {
        throw new Exception('Formato JSON SUNAT invalido');
    }

    return [
        'fecha' => trim((string)($data['fecha'] ?? '')),
        'compra' => (float)($data['compra'] ?? 0),
        'venta' => (float)$data['venta'],
    ];
}

function parseSunatTxt(string $response): array
{
    // Formato esperado: fecha|compra|venta|
    $parts = explode('|', trim($response));

    if (count($parts) < 3 || (float)trim($parts[2]) <= 0) {
        throw new Exception('Formato TXT SUNAT invalido');
    }

    return [
        'fecha' => trim($parts[0]),
        'compra' => (float)trim($parts[1]),
        'venta' => (float)trim($parts[2]),
    ];
}

try {
    $tipoCambio = null;
    $errores = [];

    if ($jsonUrl) {
        try {
            $tipoCambio = parseSunatJson(fetchSunatTipoCambio($jsonUrl));
        } catch (Throwable $e) {
            $errores[] = 'SUNAT_TIPO_CAMBIO_URL: ' . $e->getMessage();
        }
    }

    if ($tipoCambio === null && $txtUrl) {
        try {
            $tipoCambio = parseSunatTxt(fetchSunatTipoCambio($txtUrl));
        } catch (Throwable $e) {
            $errores[] = 'SUNAT_TIPO_CAMBIO_KEY: ' . $e->getMessage();
        }
    }

    if ($tipoCambio === null) {
        throw new Exception($errores ? implode(' | ', $errores) : 'No se pudo obtener tipo de cambio SUNAT');
    }

    echo json_encode([
        'ok' => true,
        'fecha' => $tipoCambio['fecha'],
        'compra' => $tipoCambio['compra'],
        'venta' => $tipoCambio['venta'],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
