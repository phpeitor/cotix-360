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

    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) {
        throw new Exception('Debe enviar una ingeniería válida');
    }

    $receta = new Receta();
    $receta->prepararTablasComprasIngenieria();
    $receta->begin();
    $compraId = $receta->aprobarIngenieriaParaCompras($id, (int)$_SESSION['session_id']);
    $receta->commit();

    echo json_encode([
        'success' => true,
        'estado' => 'Aprobada',
        'compra_id' => $compraId,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta) && $receta instanceof Receta) {
        $receta->rollback();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
