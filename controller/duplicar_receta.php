<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode(['ok' => false, 'message' => 'Sesión expirada o usuario no autenticado']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['ok' => false, 'message' => 'ID no válido']);
        exit;
    }

    $receta = new Receta();
    $original = $receta->obtenerPorId($id);
    if (!$original) {
        echo json_encode(['ok' => false, 'message' => 'Receta no encontrada']);
        exit;
    }

    $sessionCargo = (int)($_SESSION['session_cargo'] ?? 0);
    $sessionId = (int)$_SESSION['session_id'];
    $isAdmin = $sessionCargo === 1;
    if (!$isAdmin && $sessionCargo !== 7) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'message' => 'Solo Admin y Vendedor pueden duplicar recetas']);
        exit;
    }

    if (!$isAdmin && (int)($original['usuario_id'] ?? 0) !== $sessionId) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'message' => 'No tiene permisos para duplicar esta receta']);
        exit;
    }

    $contextoVersion = $receta->contextoVersionParaDuplicar($id, $sessionId, $isAdmin);

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'hash' => md5((string)$id),
        'raiz_id' => $contextoVersion['raiz_id'],
        'siguiente_version' => $contextoVersion['siguiente_version'],
        'versiones' => $contextoVersion['versiones'],
        'message' => 'Selecciona la versión que usarás como base para la nueva copia.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta)) {
        $receta->rollback();
    }

    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
