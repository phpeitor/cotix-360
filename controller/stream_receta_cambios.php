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

function es_estado_enviada(string $estado): bool
{
    return strtolower(trim($estado)) === 'enviada';
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
    $pollFastSeconds = 2;
    $pollIdleSeconds = 6;
    $activeWindowSeconds = 20;
    $pingFastEverySeconds = 6;
    $pingIdleEverySeconds = 18;
    $estadoRefreshEverySeconds = 30;
    $maxLifetimeSeconds = 40;
    $recetaId = (int)$receta['id'];
    $estadoActual = (string)($receta['estado'] ?? '');

    if (!es_estado_enviada($estadoActual)) {
        sse_send('stream_disabled', [
            'receta_id' => $recetaId,
            'estado' => $estadoActual,
            'message' => 'Stream detenido: la receta no esta en estado Enviada'
        ]);
        exit;
    }

    $lastChangeAt = 0;
    $lastPingAt = time();
    $lastEstadoCheckAt = time();

    while (!connection_aborted()) {
        $now = time();

        // Refresh estado less frequently; avoids an extra query on every cycle.
        if (($now - $lastEstadoCheckAt) >= $estadoRefreshEverySeconds) {
            $recetaActual = $recetaModel->obtenerPorId($recetaId);
            if (!$recetaActual) {
                sse_send('error', [
                    'message' => 'La receta ya no existe'
                ]);
                break;
            }
            $estadoActual = (string)($recetaActual['estado'] ?? '');
            $lastEstadoCheckAt = $now;

            if (!es_estado_enviada($estadoActual)) {
                sse_send('stream_disabled', [
                    'receta_id' => $recetaId,
                    'estado' => $estadoActual,
                    'message' => 'Stream detenido: la receta cambio a estado no editable'
                ]);
                break;
            }
        }

        $firma = $recetaModel->obtenerCambiosPrecioFirma($recetaId);
        $signature = $firma['count'] . '|' . $firma['checksum'];

        $previousSignature = $lastSignature;
        if ($signature !== $lastSignature) {
            $lastSignature = $signature;

            $cambios = [];
            if ((int)$firma['count'] > 0) {
                $cambios = $recetaModel->obtenerCambiosPrecio($recetaId);
            }

            sse_send('price_changes', [
                'receta_id' => $recetaId,
                'estado' => $estadoActual,
                'count' => (int)$firma['count'],
                'cambios' => $cambios,
                'timestamp' => date('c')
            ]);

            // Initial baseline event should not force fast polling mode.
            if ($previousSignature !== null) {
                $lastChangeAt = $now;
            }
            $lastPingAt = $now;
        } else {
            $isActiveWindow = ($lastChangeAt > 0) && (($now - $lastChangeAt) <= $activeWindowSeconds);
            $pingEverySeconds = $isActiveWindow ? $pingFastEverySeconds : $pingIdleEverySeconds;

            if (($now - $lastPingAt) >= $pingEverySeconds) {
                sse_send('ping', [
                    'timestamp' => date('c')
                ]);
                $lastPingAt = $now;
            }
        }

        // Rotate connection periodically so EventSource reconnects cleanly.
        if ((time() - $startedAt) >= $maxLifetimeSeconds) {
            break;
        }

        $nowAfterWork = time();
        $isActiveWindow = ($lastChangeAt > 0) && (($nowAfterWork - $lastChangeAt) <= $activeWindowSeconds);
        $sleepSeconds = $isActiveWindow ? $pollFastSeconds : $pollIdleSeconds;

        sleep($sleepSeconds);
    }
} catch (Throwable $e) {
    sse_send('error', [
        'message' => $e->getMessage()
    ]);
}
