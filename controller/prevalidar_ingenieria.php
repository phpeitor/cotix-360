<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        http_response_code(401);
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }
    if ((int)($_SESSION['session_cargo'] ?? 0) !== 6) {
        http_response_code(403);
        throw new RuntimeException('Solo el usuario de Ingeniería puede prevalidar');
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new RuntimeException('Método no permitido');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    if (!preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        throw new InvalidArgumentException('ID de ingeniería inválido');
    }

    $receta = new Receta();
    $receta->prepararTablasComprasIngenieria();
    $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
    if (!$ingenieria) throw new RuntimeException('Ingeniería no encontrada');
    if (trim((string)($ingenieria['estado'] ?? '')) !== 'GANADO') {
        throw new RuntimeException('Solo se puede prevalidar una ingeniería en estado GANADO');
    }
    if (!$receta->ingenieriaTieneDetalleBase((int)$ingenieria['id'])) {
        throw new RuntimeException('Agrega al menos un item normal antes de prevalidar la ingeniería');
    }

    $totalIngenieria = $receta->totalIngenieriaDolaresPorHash($hash);
    $totalOrigen = $receta->totalRecetaOrigenDolares((int)($ingenieria['id_receta_duplicada'] ?? 0));
    if ($totalIngenieria > $totalOrigen + 0.01) {
        throw new RuntimeException('El total de ingeniería excede el monto de la receta de origen. Revisa los cambios antes de prevalidar.');
    }

    $receta->begin();
    $receta->prevalidarIngenieria((int)$ingenieria['id'], (int)$_SESSION['session_id']);
    $receta->commit();

    echo json_encode(['success' => true, 'estado' => 'GANADO - PREVALIDACION'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta) && $receta instanceof Receta) $receta->rollback();
    if (http_response_code() < 400) http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
