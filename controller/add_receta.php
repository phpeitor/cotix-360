<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    session_start();

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

    if (!isset($_POST['items'])) {
        throw new Exception('No se enviaron items');
    }

    $items = json_decode((string)$_POST['items'], true);

    if (!is_array($items) || empty($items)) {
        throw new Exception('Items inválidos');
    }

    $tipoCambio = isset($_POST['tipo_cambio']) ? (float)$_POST['tipo_cambio'] : 0;
    if ($tipoCambio <= 0) {
        throw new Exception('Tipo de cambio inválido');
    }

    $receta = new Receta();
    $receta->begin();

    $recetaId = $receta->guardarCabecera([
        'usuario_id' => (int)$_SESSION['session_id'],
        'estado' => 'Enviada',
        'usuario_upd' => null,
        'tipo_cambio' => $tipoCambio,
    ]);

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