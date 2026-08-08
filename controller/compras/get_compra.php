<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $hash = trim((string)($_GET['id'] ?? ''));
    if ($hash === '' || !preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        throw new Exception('ID inválido');
    }

    $compras = new Compras();
    $compra = $compras->obtenerCompraPorHash($hash);

    if (!$compra) {
        throw new Exception('Compra no encontrada');
    }

    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    $puedeVerMontos = in_array($cargo, Compras::CARGOS_VER_MONTOS, true);
    $detalle = $compras->obtenerDetallePorHash($hash);
    if (!$puedeVerMontos) {
        foreach ($detalle as &$row) {
            unset($row['precio']);
        }
        unset($row);
        unset($compra['tipo_cambio']);
    }
    $totales = $compras->totalesCompraPorHash($hash);
    $totalCompra = $compras->totalCompraDolaresPorHash($hash);
    $totalOrigen = $compras->totalIngenieriaDolaresPorId((int)($compra['ingenieria_id'] ?? 0));

    if (!$puedeVerMontos) {
        $totales = null;
        $totalCompra = null;
        $totalOrigen = null;
    }

    echo json_encode([
        'success' => true,
        'compra' => $compra,
        'detalle' => $detalle,
        'totales' => $totales,
        'semaforo' => $puedeVerMontos ? $compras->evaluarSemaforo((float)$totalCompra, (float)$totalOrigen) : null,
        'total_compra_dolares' => $totalCompra,
        'total_origen_dolares' => $totalOrigen,
        'condiciones' => [
            'razon_social_empresa' => $compra['cliente_razon_social_empresa'] ?? '',
            'direccion' => $compra['cliente_direccion'] ?? '',
            'ruc' => $compra['cliente_ruc'] ?? '',
            'nombre_completo' => $compra['cliente_nombre_completo'] ?? '',
            'correo' => $compra['cliente_correo'] ?? '',
            'celular' => $compra['cliente_celular'] ?? '',
            'motivo' => $compra['cliente_motivo'] ?? '',
            'descripcion' => $compra['cliente_descripcion'] ?? '',
            'cantidad_items' => $compra['cliente_cantidad_items'] ?? '',
            'tiempo_entrega' => $compra['cliente_tiempo_entrega'] ?? '',
            'condiciones_pago' => $compra['cliente_condiciones_pago'] ?? '',
            'vendedor' => $compra['cliente_vendedor'] ?? '',
            'vendedor_correo' => $compra['cliente_vendedor_correo'] ?? '',
            'vendedor_telefono' => $compra['cliente_vendedor_telefono'] ?? '',
            'condiciones_economicas_dias' => $compra['cliente_condiciones_economicas_dias'] ?? '',
            'condiciones_economicas_visible' => $compra['cliente_condiciones_economicas_visible'] ?? 0,
        ],
        'permisos' => [
            'puede_editar' => in_array($cargo, Compras::CARGOS_EDITABLES, true),
            'puede_ver_montos' => $puedeVerMontos,
            'estado' => $compra['estado'] ?? 'Pendiente',
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
