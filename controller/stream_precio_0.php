<?php
require_once __DIR__ . '/../model/item.php';

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

$cargo = (int)($_SESSION['session_cargo'] ?? 0);
if ($cargo === 4) {
    exit;
}

session_write_close();

try {
    $itemModel = new Item();

    echo "retry: 5000\n\n";
    flush();

    $baseline = $itemModel->firmaItemsPrecioCero();
    $lastSignature = $baseline['total'] . '|' . $baseline['max_id'] . '|' . $baseline['checksum'];
    $startedAt = time();
    $maxLifetimeSeconds = 40;
    $pollSeconds = 5;
    $lastPingAt = time();
    $pingEverySeconds = 15;

    if ((int)$baseline['total'] > 0) {
        sse_send('precio_cero', [
            'total' => (int)$baseline['total'],
            'items' => $itemModel->obtenerItemsPrecioCero(10),
            'timestamp' => date('c')
        ]);
    }

    while (!connection_aborted()) {
        $firma = $itemModel->firmaItemsPrecioCero();
        $signature = $firma['total'] . '|' . $firma['max_id'] . '|' . $firma['checksum'];

        if ($signature !== $lastSignature) {
            $items = [];
            if ((int)$firma['total'] > 0) {
                $items = $itemModel->obtenerItemsPrecioCero(10);
            }

            sse_send('precio_cero', [
                'total' => (int)$firma['total'],
                'items' => $items,
                'timestamp' => date('c')
            ]);

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