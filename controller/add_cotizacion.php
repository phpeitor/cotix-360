<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../model/cotizacion.php';

try {

    // 🔐 Validar sesión
    if (!isset($_SESSION['session_id']) || $_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    // 📦 Validar items
    if (!isset($_POST['items'])) {
        throw new Exception('No se enviaron items');
    }

    $items = json_decode($_POST['items'], true);

    if (!is_array($items) || empty($items)) {
        throw new Exception('Items inválidos');
    }

    $cotizacion = new Cotizacion();

    // 🔁 Iniciar transacción
    $cotizacion->begin();

    // 🧾 Guardar cabecera
    $cotizacionId = $cotizacion->g_cotizacion([
        'usuario_id' => (int) $_SESSION['session_id'],
        'estado'     => 'Enviada',
    ]);

    // 📄 Guardar detalle
    foreach ($items as $item) {

        if (($item['item_id'] ?? 0) <= 0) {
            throw new Exception('Item inválido');
        }

        $cotizacion->g_cotizacion_detalle([
            'cotizacion_id'   => $cotizacionId,
            'item_id'         => (int) $item['item_id'],
            'modelo'          => $item['modelo'] ?? '',
            'descripcion'     => $item['descripcion'] ?? '',
            'categoria'       => $item['categoria'] ?? '',
            'grupo'           => $item['grupo'] ?? '',
            'cantidad'        => (int) ($item['cantidad'] ?? 1),
            'peso'            => (float) ($item['peso'] ?? 0),
            'precio_unitario' => (float) ($item['precio'] ?? 0),
            'status'          => $item['status'] ?? 'Active',
        ]);
    }

    $cotizacion->commit();

    echo json_encode([
        'ok' => true,
        'id' => $cotizacionId
    ]);

} catch (Throwable $e) {

    if (isset($cotizacion)) {
        $cotizacion->rollback();
    }

    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
