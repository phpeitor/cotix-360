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
    $esDuplicacion = (string)($_GET['duplicar'] ?? '') === '1';
    $recetaIdDuplicar = $esDuplicacion ? (int)($_GET['receta_id'] ?? 0) : 0;
    if ($recetaIdDuplicar > 0 && !hash_equals(md5((string)$recetaIdDuplicar), strtolower((string)$hash))) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'ID de receta no coincide']);
        exit;
    }

    $receta = $recetaIdDuplicar > 0
        ? $recetaModel->obtenerPorIdParaDuplicar($recetaIdDuplicar)
        : $recetaModel->obtenerPorHash($hash);

    if (!$receta) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Receta no encontrada']);
        exit;
    }

    if ($esDuplicacion) {
        if (session_status() !== PHP_SESSION_ACTIVE) session_start();
        $cargo = (int)($_SESSION['session_cargo'] ?? 0);
        $usuarioId = (int)($_SESSION['session_id'] ?? 0);
        if (!in_array($cargo, [1, 7], true)) {
            http_response_code(403);
            throw new RuntimeException('Solo Admin y Vendedor pueden duplicar recetas');
        }
        if ($cargo === 7 && !$recetaModel->perteneceAlUsuario((int)$receta['id'], $usuarioId)) {
            http_response_code(403);
            throw new RuntimeException('El Vendedor solo puede duplicar sus propias recetas');
        }
    }

    $detalle = $recetaIdDuplicar > 0
        ? $recetaModel->obtenerDetallePorRecetaId($recetaIdDuplicar)
        : $recetaModel->obtenerDetallePorHash($hash);
    $cambiosPrecio = $esDuplicacion ? [] : $recetaModel->obtenerCambiosPrecio((int)$receta['id']);
    $categorias = $esDuplicacion ? [] : $recetaModel->obtenerCategoriasParaEdicion((int)$receta['id']);

    $cliente = null;
    if (
        trim((string)($receta['cliente_razon_social_empresa'] ?? '')) !== ''
        || trim((string)($receta['cliente_ruc'] ?? '')) !== ''
        || trim((string)($receta['cliente_tiempo_entrega'] ?? '')) !== ''
        || trim((string)($receta['cliente_descripcion'] ?? '')) !== ''
        || (int)($receta['cliente_cantidad_items'] ?? 0) > 0
        || trim((string)($receta['cliente_condiciones_pago'] ?? '')) !== ''
        || trim((string)($receta['cliente_vendedor'] ?? '')) !== ''
        || trim((string)($receta['cliente_vendedor_correo'] ?? '')) !== ''
        || trim((string)($receta['cliente_vendedor_telefono'] ?? '')) !== ''
        || (int)($receta['cliente_condiciones_economicas_dias'] ?? 0) > 0
        || (int)($receta['cliente_condiciones_economicas_visible'] ?? 0) === 1
        || trim((string)($receta['cliente_observaciones'] ?? '')) !== ''
    ) {
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
            'tiempo_entrega_unidad' => $receta['cliente_tiempo_entrega_unidad'] ?? 'dias',
            'condiciones_pago' => $receta['cliente_condiciones_pago'] ?? '',
            'vendedor' => $receta['cliente_vendedor'] ?? '',
            'vendedor_correo' => $receta['cliente_vendedor_correo'] ?? '',
            'vendedor_telefono' => $receta['cliente_vendedor_telefono'] ?? '',
            'condiciones_economicas_dias' => $receta['cliente_condiciones_economicas_dias'] ?? '',
            'condiciones_economicas_visible' => $receta['cliente_condiciones_economicas_visible'] ?? 0,
            'observaciones' => $receta['cliente_observaciones'] ?? '',
        ];
    }

    echo json_encode([
        'receta' => $receta,
        'detalle' => $detalle,
        'categorias' => $categorias,
        'cambios_precio' => $cambiosPrecio,
        'cliente' => $cliente
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
