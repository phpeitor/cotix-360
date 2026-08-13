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
    $field = trim((string)($_POST['field'] ?? ''));
    $value = trim((string)($_POST['value'] ?? ''));

    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $receta = new Receta();

    if ($field === 'nombre') {
        if ($value === '') {
            throw new Exception('El nombre no puede estar vacío');
        }
        $ok = $receta->actualizarNombreIngenieria($hash, $value);
    } elseif ($field === 'tipo_cambio') {
        $tipoCambio = (float)$value;
        if ($tipoCambio <= 0) {
            throw new Exception('Tipo de cambio inválido');
        }
        $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
        if (!$ingenieria) {
            throw new Exception('Receta de ingeniería no encontrada');
        }

        $receta->begin();
        $ok = $receta->actualizarTipoCambioIngenieria($hash, $tipoCambio);
        if (!$ok) {
            throw new Exception('No se pudo actualizar ingeniería');
        }

        $totalIngenieria = $receta->totalIngenieriaDolaresPorHash($hash);
        $totalOrigen = $receta->totalRecetaOrigenDolares((int)($ingenieria['id_receta_duplicada'] ?? 0));

        if ($totalIngenieria > $totalOrigen + 0.01) {
            $receta->rollback();
            $puedeVerMontos = in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 3], true);
            $mensaje = 'No se puede actualizar el tipo de cambio. La receta aprobada tiene un monto menor al monto de ingeniería.';
            if ($puedeVerMontos) {
                $mensaje = 'No se puede actualizar el tipo de cambio. La receta aprobada tiene un monto menor ($' .
                    number_format($totalOrigen, 2) . ') al monto de ingeniería ($' .
                    number_format($totalIngenieria, 2) . ').';
            }
            throw new Exception($mensaje);
        }

        $receta->commit();
    } else {
        throw new Exception('Campo no permitido');
    }

    if (!$ok) {
        throw new Exception('No se pudo actualizar ingeniería');
    }

    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta) && $receta instanceof Receta) {
        $receta->rollback();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
