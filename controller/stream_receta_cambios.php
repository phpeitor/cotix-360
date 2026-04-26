<?php
require_once __DIR__ . '/../model/receta.php';

header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache, no-transform');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

@ini_set('output_buffering', 'off');
@ini_set('zlib.output_compression', '0');
@set_time_limit(0);

while (ob_get_level() > 0) {
    ob_end_flush();
}

function sse_send(string $event, array $payload): void
{
    echo 'event: ' . $event . "\n";
    echo 'data: ' . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n";

    if (function_exists('ob_flush')) {
        @ob_flush();
    }
    flush();
}

if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
    sse_send('error', [
        'message' => 'Sesion expirada o usuario no autenticado'
    ]);
    exit;
}

// Important for performance: release session lock so other tabs/requests are not blocked.
session_write_close();

$hash = $_GET['id'] ?? null;
if (!$hash) {
    sse_send('error', [
        'message' => 'ID invalido'
    ]);
    exit;
}

try {
    $recetaModel = new Receta();
    $receta = $recetaModel->obtenerPorHash((string)$hash);

    if (!$receta) {
        sse_send('error', [
            'message' => 'Receta no encontrada'
        ]);
        exit;
    }

    // Hint for browser reconnection delay.
    echo "retry: 5000\n\n";
    flush();

    $lastSignature = null;
    $startedAt = time();
    $pollSeconds = 5;
    $pingEvery = 3;
    $maxLifetimeSeconds = 40;
    $ticks = 0;
    $recetaId = (int)$receta['id'];
    $estadoActual = (string)($receta['estado'] ?? '');

    while (!connection_aborted()) {
        $ticks++;

        // Refresh estado less frequently; avoids an extra query on every cycle.
        if (($ticks % $pingEvery) === 0) {
            $recetaActual = $recetaModel->obtenerPorId($recetaId);
            if (!$recetaActual) {
                sse_send('error', [
                    'message' => 'La receta ya no existe'
                ]);
                break;
            }
            $estadoActual = (string)($recetaActual['estado'] ?? '');
        }

        $cambios = $recetaModel->obtenerCambiosPrecio($recetaId);
        $signature = md5(json_encode($cambios, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        if ($signature !== $lastSignature) {
            $lastSignature = $signature;
            sse_send('price_changes', [
                'receta_id' => $recetaId,
                'estado' => $estadoActual,
                'count' => count($cambios),
                'cambios' => $cambios,
                'timestamp' => date('c')
            ]);
        } elseif (($ticks % $pingEvery) === 0) {
            sse_send('ping', [
                'timestamp' => date('c')
            ]);
        }

        // Rotate connection periodically so EventSource reconnects cleanly.
        if ((time() - $startedAt) >= $maxLifetimeSeconds) {
            break;
        }

        sleep($pollSeconds);
    }
} catch (Throwable $e) {
    sse_send('error', [
        'message' => $e->getMessage()
    ]);
}
