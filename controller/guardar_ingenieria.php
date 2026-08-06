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
    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $receta = new Receta();
    $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
    if (!$ingenieria) {
        throw new Exception('Receta de ingeniería no encontrada');
    }
    if (strcasecmp(trim((string)($ingenieria['estado'] ?? '')), 'Aprobada') === 0) {
        throw new Exception('La ingeniería aprobada no permite guardar cambios');
    }

    $totalIngenieria = $receta->totalIngenieriaDolaresPorHash($hash);
    $totalOrigen = $receta->totalRecetaOrigenDolares((int)($ingenieria['id_receta_duplicada'] ?? 0));

    if ($totalIngenieria > $totalOrigen + 0.01) {
        $puedeVerMontos = in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 3], true);
        $mensaje = 'No se puede guardar. La receta aprobada tiene un monto menor al monto de ingeniería.';
        if ($puedeVerMontos) {
            $mensaje = 'No se puede guardar. La receta aprobada tiene un monto menor ($' .
                number_format($totalOrigen, 2) . ') al monto de ingeniería ($' .
                number_format($totalIngenieria, 2) . ').';
        }
        throw new Exception($mensaje);
    }

    $receta->registrarHistorialIngenieria(
        (int)$ingenieria['id'],
        'guardar_ingenieria',
        null,
        null,
        ['total_origen_dolares' => $totalOrigen],
        ['total_ingenieria_dolares' => $totalIngenieria],
        (int)$_SESSION['session_id']
    );

    echo json_encode([
        'success' => true,
        'total_origen_dolares' => $totalOrigen,
        'total_ingenieria_dolares' => $totalIngenieria,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
