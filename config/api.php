<?php
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$dni = $_GET['dni'] ?? null;

if (!$dni || !preg_match('/^\d{8,11}$/', $dni)) {
    http_response_code(400);
    echo json_encode(["error" => "Número de documento inválido"]);
    exit;
}

function buildDniUrl(string $baseUrl, string $dni): string
{
    $baseUrl = trim($baseUrl);

    if (str_contains($baseUrl, '{dni}')) {
        return str_replace('{dni}', urlencode($dni), $baseUrl);
    }

    if (preg_match('/[?&][^=]+=$/', $baseUrl) === 1) {
        return $baseUrl . urlencode($dni);
    }

    $separator = str_contains($baseUrl, '?') ? '&' : '?';
    return $baseUrl . $separator . 'dni=' . urlencode($dni);
}

function requestDniApi(string $url): array
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
        throw new Exception("Error en cURL: " . $error);
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 || $response === false || trim((string)$response) === '') {
        throw new Exception("El servidor externo devolvió código HTTP $httpCode");
    }

    $json = json_decode((string)$response, true);
    if (!is_array($json)) {
        throw new Exception('Respuesta DNI inválida');
    }

    return $json;
}

function normalizeDniResponse(array $data): array
{
    if (isset($data['found_patient']) && is_array($data['found_patient'])) {
        return $data;
    }

    $nombres = trim((string)($data['nombres'] ?? ''));
    $apellidos = trim((string)(
        $data['last_name']
        ?? $data['apellido']
        ?? trim((string)($data['apellidoPaterno'] ?? '') . ' ' . (string)($data['apellidoMaterno'] ?? ''))
    ));

    if ($nombres === '' && $apellidos === '' && !empty($data['name'])) {
        $parts = preg_split('/\s+/', trim((string)$data['name'])) ?: [];
        $apellidos = trim(implode(' ', array_slice($parts, 0, 2)));
        $nombres = trim(implode(' ', array_slice($parts, 2)));
    }

    if ($nombres === '' && !empty($data['nombre']) && $apellidos !== '') {
        $nombres = trim((string)$data['nombre']);
    }

    if ($nombres !== '' || $apellidos !== '') {
        $data['found_patient'] = [
            'name' => $nombres,
            'last_name' => $apellidos,
        ];
    }

    return $data;
}

$endpoints = array_values(array_filter([
    $_ENV['API_DNI_URL'] ?? '',
    $_ENV['API_DNI_URL_2'] ?? '',
], static fn ($url) => trim((string)$url) !== ''));

if (!$endpoints) {
    http_response_code(500);
    echo json_encode(["error" => "No hay API DNI configurada"]);
    exit;
}

try {
    $lastError = null;

    foreach ($endpoints as $endpoint) {
        try {
            echo json_encode(
                normalizeDniResponse(requestDniApi(buildDniUrl((string)$endpoint, $dni))),
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            );
            exit;
        } catch (Throwable $e) {
            $lastError = $e;
        }
    }

    throw $lastError ?? new Exception('No se pudo consultar DNI');

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
