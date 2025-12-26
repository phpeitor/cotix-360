<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../model/cotizacion.php';

try {
    $cotizacion = new Cotizacion();

    $payloadCotizacion = [
        'usuario_id' => $_POST['usuario_id'] ?? 0,
        'estado'     => $_POST['estado'] ?? 'Borrador',
    ];

    if ($payloadCotizacion['usuario_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Usuario inválido'
        ]);
        exit;
    }

    if (!isset($_POST['items'])) {
        echo json_encode([
            'ok' => false,
            'message' => 'No se enviaron items'
        ]);
        exit;
    }

    $items = json_decode($_POST['items'], true);

    if (!is_array($items) || count($items) === 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Items inválidos'
        ]);
        exit;
    }

    $cotizacion->conn->beginTransaction();

    $cotizacionId = $cotizacion->g_cotizacion($payloadCotizacion);

    foreach ($items as $item) {
        $payloadDetalle = [
            'cotizacion_id'   => $cotizacionId,
            'item_id'         => $item['item_id'] ?? 0,
            'modelo'          => $item['modelo'] ?? '',
            'descripcion'     => $item['descripcion'] ?? '',
            'categoria'       => $item['categoria'] ?? '',
            'grupo'           => $item['grupo'] ?? '',
            'cantidad'        => $item['cantidad'] ?? 1,
            'peso'            => $item['peso'] ?? 0,
            'precio_unitario' => $item['precio'] ?? 0,
            'status'          => $item['status'] ?? 'Active',
        ];

        if ($payloadDetalle['item_id'] <= 0) {
            throw new Exception('Item inválido');
        }

        $cotizacion->g_cotizacion_detalle($payloadDetalle);
    }

    $cotizacion->conn->commit();

    echo json_encode([
        'ok' => true,
        'id' => $cotizacionId
    ]);

} catch (Throwable $e) {

    if (isset($cotizacion->conn)) {
        $cotizacion->conn->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
