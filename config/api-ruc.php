<?php
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido']);
    exit;
}

$ruc = preg_replace('/\D/', '', (string)($_GET['ruc'] ?? ''));

if (!preg_match('/^[0-9]{11}$/', $ruc)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'RUC invalido']);
    exit;
}

function buildRucUrl(string $baseUrl, string $ruc): string
{
    $baseUrl = trim($baseUrl);

    if (str_contains($baseUrl, '{ruc}')) {
        return str_replace('{ruc}', urlencode($ruc), $baseUrl);
    }

    if (preg_match('/[?&][^=]+=$/', $baseUrl) === 1) {
        return $baseUrl . urlencode($ruc);
    }

    $separator = str_contains($baseUrl, '?') ? '&' : '?';
    return $baseUrl . $separator . 'ruc=' . urlencode($ruc);
}

function requestRucApi(string $url): array
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

    if ($httpCode !== 200 || $response === false || trim((string)$response) === '') {
        throw new Exception("El servidor externo devolvio codigo HTTP $httpCode");
    }

    $json = json_decode((string)$response, true);
    if (!is_array($json)) {
        throw new Exception('Respuesta RUC invalida');
    }

    return $json;
}

function normalizeRucResponse(array $data): array
{
    $nombre = trim((string)($data['nombre'] ?? $data['name'] ?? ''));
    $direccion = trim((string)($data['direccion'] ?? $data['address'] ?? ''));

    if ($direccion === '') {
        $direccion = trim(implode(' ', array_filter([
            $data['distrito'] ?? '',
            $data['provincia'] ?? '',
            $data['departamento'] ?? '',
        ], static fn ($value) => trim((string)$value) !== '')));
    }

    if ($nombre === '') {
        throw new Exception('No se encontro razon social para el RUC');
    }

    return [
        'ok' => true,
        'nombre' => $nombre,
        'direccion' => $direccion,
    ];
}

$endpoints = array_values(array_filter([
    $_ENV['API_RUC_URL'] ?? '',
    $_ENV['API_RUC_URL_2'] ?? '',
], static fn ($url) => trim((string)$url) !== ''));

if (!$endpoints) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No hay API RUC configurada']);
    exit;
}

try {
    $lastError = null;

    foreach ($endpoints as $endpoint) {
        try {
            echo json_encode(
                normalizeRucResponse(requestRucApi(buildRucUrl((string)$endpoint, $ruc))),
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            );
            exit;
        } catch (Throwable $e) {
            $lastError = $e;
        }
    }

    throw $lastError ?? new Exception('No se pudo consultar RUC');
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
