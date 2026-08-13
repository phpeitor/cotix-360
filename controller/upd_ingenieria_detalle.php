<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesión expirada o usuario no autenticado');
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception('Metodo no permitido');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    $accion = trim((string)($_POST['accion'] ?? ''));

    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $receta = new Receta();
    $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
    if (!$ingenieria) {
        throw new Exception('Receta de ingeniería no encontrada');
    }
    if (strcasecmp(trim((string)($ingenieria['estado'] ?? '')), 'Aprobada') === 0) {
        throw new Exception('La ingeniería aprobada no permite modificar items');
    }
    $usuarioId = (int)$_SESSION['session_id'];
    $receta->begin();
    $historial = null;

    if ($accion === 'agregar') {
        $itemId = (int)($_POST['item_id'] ?? 0);
        $cantidad = (int)($_POST['cantidad'] ?? 1);
        $esAdicional = (int)($_POST['es_adicional'] ?? 0) === 1;
        $adicionalSigno = trim((string)($_POST['adicional_signo'] ?? 'positivo')) === 'negativo' ? 'negativo' : 'positivo';
        if ($itemId <= 0) {
            throw new Exception('Item inválido');
        }
        if ($cantidad < 1 || $cantidad > 5000) {
            throw new Exception('La cantidad debe estar entre 1 y 5000');
        }

        $detalleActual = $receta->obtenerDetalleIngenieriaPorHash($hash);
        if (!$esAdicional) {
            foreach ($detalleActual as $row) {
                if ((int)($row['item_id'] ?? 0) === $itemId && (int)($row['es_adicional'] ?? 0) === 0) {
                    throw new Exception('Este item ya fue agregado');
                }
            }
        }

        $ok = $receta->agregarDetalleIngenieriaDesdeItem($hash, $itemId, $cantidad, $esAdicional, $adicionalSigno);
        if ($ok) {
            $detalleNuevo = $receta->obtenerDetalleIngenieriaPorHash($hash);
            $detalleAgregado = null;
            foreach ($detalleNuevo as $row) {
                if ((int)($row['item_id'] ?? 0) === $itemId) {
                    if ($detalleAgregado === null || (int)($row['id'] ?? 0) > (int)($detalleAgregado['id'] ?? 0)) {
                        $detalleAgregado = $row;
                    }
                }
            }
            if ($detalleAgregado !== null) {
                $historial = ['agregar_item', (int)$detalleAgregado['id'], $itemId, [], $detalleAgregado];
            }
        }
    } elseif ($accion === 'eliminar') {
        $detalleId = (int)($_POST['detalle_id'] ?? 0);
        if ($detalleId <= 0) {
            throw new Exception('Detalle inválido');
        }
        $detalleActual = $receta->obtenerDetalleIngenieriaPorHash($hash);
        $antes = [];
        foreach ($detalleActual as $row) {
            if ((int)($row['id'] ?? 0) === $detalleId) {
                $antes = $row;
                break;
            }
        }
        $ok = $receta->eliminarDetalleIngenieria($hash, $detalleId);
        if ($ok) {
            $historial = ['eliminar_item', $detalleId, isset($antes['item_id']) ? (int)$antes['item_id'] : null, $antes, []];
        }
    } elseif ($accion === 'cantidad') {
        $detalleId = (int)($_POST['detalle_id'] ?? 0);
        $cantidad = (int)($_POST['cantidad'] ?? 1);
        if ($detalleId <= 0) {
            throw new Exception('Detalle inválido');
        }
        $detalleActual = $receta->obtenerDetalleIngenieriaPorHash($hash);
        $antes = [];
        foreach ($detalleActual as $row) {
            if ((int)($row['id'] ?? 0) === $detalleId) {
                $antes = $row;
                break;
            }
        }
        $ok = $receta->actualizarCantidadDetalleIngenieria($hash, $detalleId, $cantidad);
        if ($ok) {
            $despues = $antes;
            $despues['cantidad'] = max(1, $cantidad);
            $historial = ['cambiar_cantidad', $detalleId, isset($antes['item_id']) ? (int)$antes['item_id'] : null, $antes, $despues];
        }
    } else {
        throw new Exception('Acción no permitida');
    }

    if (!$ok) {
        throw new Exception('No se pudo actualizar el detalle');
    }

    $totalIngenieria = $receta->totalIngenieriaDolaresPorHash($hash);
    $totalOrigen = $receta->totalRecetaOrigenDolares((int)($ingenieria['id_receta_duplicada'] ?? 0));

    if ($totalIngenieria > $totalOrigen + 0.01) {
        $puedeVerMontos = in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 3], true);
        $mensaje = 'No se puede actualizar. La receta aprobada tiene un monto menor al monto de ingeniería.';
        if ($puedeVerMontos) {
            $mensaje = 'No se puede actualizar. La receta aprobada tiene un monto menor ($' .
                number_format($totalOrigen, 2) . ') al monto de ingeniería ($' .
                number_format($totalIngenieria, 2) . ').';
        }
        throw new Exception($mensaje);
    }

    $receta->commit();

    if ($historial !== null) {
        [$accionHistorial, $detalleHistorialId, $itemHistorialId, $antesHistorial, $despuesHistorial] = $historial;
        $receta->registrarHistorialIngenieria(
            (int)$ingenieria['id'],
            $accionHistorial,
            $detalleHistorialId,
            $itemHistorialId,
            $antesHistorial,
            $despuesHistorial,
            $usuarioId
        );
    }

    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta)) {
        $receta->rollback();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
