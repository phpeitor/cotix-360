<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'message' => 'Metodo no permitido'
        ]);
        exit;
    }

    $recetaId = isset($_POST['receta_id']) ? (int)$_POST['receta_id'] : 0;
    $tipoCambio = isset($_POST['tipo_cambio']) ? (float)$_POST['tipo_cambio'] : 0;

    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    if ($tipoCambio <= 0) {
        throw new Exception('Tipo de cambio inválido');
    }

    if (!isset($_POST['items'])) {
        throw new Exception('No se enviaron items');
    }

    $items = json_decode((string)$_POST['items'], true);
    if (!is_array($items) || empty($items)) {
        throw new Exception('Items inválidos');
    }

    $receta = new Receta();
    $receta->begin();

    $okCabecera = $receta->actualizarCabeceraEdicion(
        $recetaId,
        $tipoCambio,
        (int)$_SESSION['session_id']
    );

    if (!$okCabecera) {
        throw new Exception('No se pudo actualizar cabecera de receta');
    }

    $receta->eliminarDetalle($recetaId);

    foreach ($items as $item) {
        $itemId = (int)($item['item_id'] ?? 0);
        $cantidad = (int)($item['cantidad'] ?? 0);

        if ($itemId <= 0) {
            throw new Exception('Item inválido');
        }

        if ($cantidad <= 0) {
            throw new Exception('Cantidad inválida');
        }

        $receta->guardarDetalle([
            'receta_id' => $recetaId,
            'item_id' => $itemId,
            'categoria' => $item['categoria'] ?? '',
            'sub_cat_1' => $item['sub_cat_1'] ?? '',
            'sub_cat_2' => $item['sub_cat_2'] ?? '',
            'marca' => $item['marca'] ?? '',
            'modelo' => $item['modelo'] ?? '',
            'nombre' => $item['nombre'] ?? '',
            'descripcion' => $item['descripcion'] ?? '',
            'uni_medida' => $item['uni_medida'] ?? '',
            'precio' => (float)($item['precio'] ?? 0),
            'moneda' => $item['moneda'] ?? '',
            'tipo' => $item['tipo'] ?? '',
            'cantidad' => $cantidad,
        ]);
    }

    $receta->commit();

    echo json_encode([
        'ok' => true,
        'id' => $recetaId
    ]);

} catch (Throwable $e) {
    if (isset($receta)) {
        $receta->rollback();
    }

    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
