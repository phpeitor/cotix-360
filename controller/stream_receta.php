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
    sse_send('error', ['message' => 'Sesion expirada o usuario no autenticado']);
    exit;
}

$fecIni = $_GET['fec_ini'] ?? null;
$fecFin = $_GET['fec_fin'] ?? null;

if (!$fecIni || !$fecFin) {
    sse_send('error', ['message' => 'Debe enviar fec_ini y fec_fin']);
    exit;
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecIni) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecFin)) {
    sse_send('error', ['message' => 'Formato de fecha invalido (YYYY-MM-DD)']);
    exit;
}

// Release session lock to avoid blocking other requests from same user.
session_write_close();

try {
    $recetaModel = new Receta();

    // Browser reconnection backoff hint.
    echo "retry: 5000\n\n";
    flush();

    $baseline = $recetaModel->firmaListaReceta($fecIni, $fecFin);
    $lastSignature = $baseline['total_recetas'] . '|' . $baseline['max_receta_id'] . '|' . $baseline['total_detalle'];
    $startedAt = time();
    $maxLifetimeSeconds = 40;
    $pollSeconds = 5;
    $lastPingAt = time();
    $pingEverySeconds = 15;

    while (!connection_aborted()) {
        $firma = $recetaModel->firmaListaReceta($fecIni, $fecFin);
        $signature = $firma['total_recetas'] . '|' . $firma['max_receta_id'] . '|' . $firma['total_detalle'];

        if ($signature !== $lastSignature) {
            $previousTotal = $baseline['total_recetas'];
            $newTotal = $firma['total_recetas'];
            $nuevasRecetas = max(0, $newTotal - $previousTotal);

            if ($nuevasRecetas > 0 || $firma['max_receta_id'] > $baseline['max_receta_id']) {
                sse_send('new_receta', [
                    'nuevas_recetas' => $nuevasRecetas,
                    'total_recetas' => $newTotal,
                    'max_receta_id' => $firma['max_receta_id'],
                    'timestamp' => date('c')
                ]);
            }

            $baseline = $firma;
            $lastSignature = $signature;
            $lastPingAt = time();
        } elseif ((time() - $lastPingAt) >= $pingEverySeconds) {
            sse_send('ping', ['timestamp' => date('c')]);
            $lastPingAt = time();
        }

        if ((time() - $startedAt) >= $maxLifetimeSeconds) {
            break;
        }

        sleep($pollSeconds);
    }
} catch (Throwable $e) {
    sse_send('error', ['message' => $e->getMessage()]);
}
