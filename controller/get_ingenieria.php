<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    $hash = $_GET['id'] ?? null;

    if (!$hash) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'ID inválido']);
        exit;
    }

    $recetaModel = new Receta();
    $receta = $recetaModel->obtenerIngenieriaPorHash($hash);

    if (!$receta) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Receta de ingeniería no encontrada']);
        exit;
    }

    $detalle = $recetaModel->obtenerDetalleIngenieriaPorHash($hash);
    $cliente = null;

    if (trim((string)($receta['cliente_razon_social_empresa'] ?? '')) !== '' || trim((string)($receta['cliente_ruc'] ?? '')) !== '') {
        $cliente = [
            'razon_social_empresa' => $receta['cliente_razon_social_empresa'] ?? '',
            'direccion' => $receta['cliente_direccion'] ?? '',
            'ruc' => $receta['cliente_ruc'] ?? '',
            'nombre_completo' => $receta['cliente_nombre_completo'] ?? '',
            'correo' => $receta['cliente_correo'] ?? '',
            'celular' => $receta['cliente_celular'] ?? '',
            'motivo' => $receta['cliente_motivo'] ?? '',
        ];
    }

    echo json_encode([
        'receta' => $receta,
        'detalle' => $detalle,
        'cliente' => $cliente
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
