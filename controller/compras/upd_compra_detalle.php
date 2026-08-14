<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesión expirada o usuario no autenticado');
    }

    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    if (!in_array($cargo, Compras::CARGOS_EDITABLES, true)) {
        throw new Exception('No tiene permisos para modificar la compra');
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception('Metodo no permitido');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $compras = new Compras();
    $compra = $compras->obtenerCompraPorHash($hash);
    if (!$compra) {
        throw new Exception('Compra no encontrada');
    }
    if (!in_array(strtolower(trim((string)($compra['estado'] ?? ''))), ['pendiente', 'validado'], true)) {
        throw new Exception('Solo se pueden modificar compras en estado Pendiente o Validado');
    }

    $accion = trim((string)($_POST['accion'] ?? ''));
    $transaccionIniciada = false;

    if ($accion === 'agregar') {
        $itemId = (int)($_POST['item_id'] ?? 0);
        $cantidad = (int)($_POST['cantidad'] ?? 1);
        $esAdicional = (int)($_POST['es_adicional'] ?? 0) === 1;
        $adicionalSigno = strtolower(trim((string)($_POST['adicional_signo'] ?? 'positivo'))) === 'negativo' ? 'negativo' : 'positivo';
        if ($itemId <= 0) {
            throw new Exception('Item inválido');
        }
        if ($cantidad < 1 || $cantidad > 5000) {
            throw new Exception('La cantidad debe estar entre 1 y 5000');
        }

        $detalleActual = $compras->obtenerDetallePorHash($hash);
        foreach ($detalleActual as $row) {
            if ((int)($row['item_id'] ?? 0) !== $itemId) {
                continue;
            }

            $rowEsAdicional = (int)($row['es_adicional'] ?? 0) === 1;
            $rowSigno = strtolower((string)($row['adicional_signo'] ?? 'positivo')) === 'negativo' ? 'negativo' : 'positivo';
            $mismoTipo = (!$esAdicional && !$rowEsAdicional) || ($esAdicional && $rowEsAdicional && $rowSigno === $adicionalSigno);

            if ($mismoTipo) {
                $tipoTexto = !$esAdicional ? 'normal' : 'adicional ' . ($adicionalSigno === 'negativo' ? 'negativo' : 'positivo');
                throw new Exception('Este item ya existe como ' . $tipoTexto . '. Cambia la cantidad del item existente.');
            }
        }

        $compras->begin();
        $transaccionIniciada = true;
        $ok = $compras->agregarDetalleDesdeItem($hash, $itemId, $cantidad, $esAdicional, $adicionalSigno);
    } elseif ($accion === 'precio') {
        $detalleId = (int)($_POST['detalle_id'] ?? 0);
        $precio = (float)($_POST['precio'] ?? 0);
        $moneda = strtoupper(trim((string)($_POST['moneda'] ?? '')));
        if ($detalleId <= 0) {
            throw new Exception('Detalle inválido');
        }
        if (!is_finite($precio) || $precio < 0) {
            throw new Exception('Precio inválido');
        }
        if ($moneda !== 'SOL' && $moneda !== 'DOLLAR') {
            throw new Exception('Moneda inválida');
        }
        $compras->begin();
        $transaccionIniciada = true;
        $ok = $compras->actualizarPrecioDetalle($hash, $detalleId, $precio, $moneda);
    } elseif ($accion === 'cantidad') {
        $detalleId = (int)($_POST['detalle_id'] ?? 0);
        $cantidad = (int)($_POST['cantidad'] ?? 1);
        if ($detalleId <= 0) {
            throw new Exception('Detalle inválido');
        }
        $compras->begin();
        $transaccionIniciada = true;
        $ok = $compras->actualizarCantidadDetalle($hash, $detalleId, $cantidad);
    } elseif ($accion === 'eliminar') {
        $detalleId = (int)($_POST['detalle_id'] ?? 0);
        if ($detalleId <= 0) {
            throw new Exception('Detalle inválido');
        }
        $compras->begin();
        $transaccionIniciada = true;
        $ok = $compras->eliminarDetalle($hash, $detalleId);
    } else {
        throw new Exception('Acción no permitida');
    }

    if (!$ok) {
        throw new Exception('No se pudo actualizar el detalle');
    }

    $totalCompra = $compras->totalCompraDolaresPorHash($hash);
    $totalAdicionalesNegativos = $compras->totalAdicionalesNegativosDolaresPorHash($hash);
    $totalOrigen = $compras->totalIngenieriaDolaresPorId((int)($compra['ingenieria_id'] ?? 0));
    $semaforo = $compras->evaluarSemaforo($totalCompra, $totalOrigen);
    $totales = $compras->totalesCompraPorHash($hash);

    $compras->commit();

    echo json_encode([
        'success' => true,
        'total_compra_dolares' => $totalCompra,
        'total_adicionales_negativos_dolares' => $totalAdicionalesNegativos,
        'total_origen_dolares' => $totalOrigen,
        'semaforo' => $semaforo,
        'totales' => $totales,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($compras, $transaccionIniciada) && $transaccionIniciada && $compras instanceof Compras) {
        $compras->rollback();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
