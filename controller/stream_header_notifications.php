<?php
require_once __DIR__ . '/../model/dashboard.php';

header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache, no-transform');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
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
    sse_send('error', ['message' => 'Sesión expirada o usuario no autenticado']);
    exit;
}

session_write_close();

try {
    $dashboard = new Dashboard();

    echo "retry: 3000\n\n";
    flush();

    $baseline = $dashboard->headerNotificationsSignature();
    $lastSignature = $baseline['total'] . '|' . $baseline['max_id'];
    $startedAt = time();
    $maxLifetimeSeconds = 45;
    $pollSeconds = 2;
    $lastPingAt = time();
    $pingEverySeconds = 15;

    while (!connection_aborted()) {
        $firma = $dashboard->headerNotificationsSignature();
        $signature = $firma['total'] . '|' . $firma['max_id'];

        if ($signature !== $lastSignature) {
            sse_send('header_notifications', [
                'total' => (int)$firma['total'],
                'notifications' => $dashboard->headerNotifications(10),
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