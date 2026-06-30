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
    $isAdmin = in_array($sessionCargo, [1, 3], true);

    if (!$isAdmin && (int)($original['usuario_id'] ?? 0) !== $sessionId) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'message' => 'No tiene permisos para duplicar esta receta']);
        exit;
    }

    $receta->begin();
    $nuevoId = $receta->duplicarReceta($id, $sessionId);
    $receta->commit();

    echo json_encode([
        'ok' => true,
        'id' => $nuevoId,
        'hash' => md5((string)$nuevoId),
        'message' => 'Receta duplicada correctamente'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta)) {
        $receta->rollback();
    }

    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
