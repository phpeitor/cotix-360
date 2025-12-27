<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    $id     = $_POST['id']     ?? null;
    $accion = $_POST['accion'] ?? null;

    if (!$id || !$accion) {
        throw new Exception("Parámetros incompletos");
    }

    if (!in_array($accion, ['activar', 'anular'])) {
        throw new Exception("Acción no válida");
    }

    $estado = $accion === 'activar'
        ? '1'
        : '0';

    $item = new Item();
    $ok = $item->actualizar_estado((int)$id, $estado);

    if (!$ok) {
        throw new Exception("No se pudo actualizar el estado");
    }

    echo json_encode([
        'success' => true,
        'estado'  => $estado
    ]);

} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}