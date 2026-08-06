<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

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
    if ((int)($_SESSION['session_cargo'] ?? 0) === 6) {
        foreach ($detalle as &$row) {
            unset($row['precio']);
        }
        unset($row);
        unset($receta['tipo_cambio']);
    }
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
            'descripcion' => $receta['cliente_descripcion'] ?? '',
            'cantidad_items' => $receta['cliente_cantidad_items'] ?? '',
            'tiempo_entrega' => $receta['cliente_tiempo_entrega'] ?? '',
            'condiciones_pago' => $receta['cliente_condiciones_pago'] ?? '',
            'vendedor' => $receta['cliente_vendedor'] ?? '',
            'vendedor_correo' => $receta['cliente_vendedor_correo'] ?? '',
            'vendedor_telefono' => $receta['cliente_vendedor_telefono'] ?? '',
            'condiciones_economicas_dias' => $receta['cliente_condiciones_economicas_dias'] ?? '',
            'condiciones_economicas_visible' => $receta['cliente_condiciones_economicas_visible'] ?? 0,
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
