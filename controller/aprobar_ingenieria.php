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
    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    if (!in_array($cargo, [1, 3], true)) {
        http_response_code(403);
        throw new RuntimeException('Solo Administración y Supervisión pueden validar la prevalidación');
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new RuntimeException('Método no permitido');
    }

    $id = (int)($_POST['id'] ?? 0);
    $compradorId = (int)($_POST['comprador_id'] ?? 0);
    if ($id <= 0) {
        throw new Exception('Debe enviar una ingeniería válida');
    }
    if ($compradorId <= 0) {
        throw new Exception('Selecciona un usuario de Compras');
    }

    $receta = new Receta();
    $receta->prepararTablasComprasIngenieria();
    $hash = md5((string)$id);
    $ingenieria = $receta->obtenerIngenieriaPorHash($hash);
    if (!$ingenieria) throw new RuntimeException('Ingeniería no encontrada');
    if (trim((string)($ingenieria['estado'] ?? '')) !== 'GANADO - PREVALIDACION') {
        throw new RuntimeException('La ingeniería debe estar prevalidada antes de enviarse a Compras');
    }
    if (!$receta->ingenieriaTieneDetalleBase($id)) {
        throw new RuntimeException('La ingeniería debe conservar al menos un item normal antes de enviarse a Compras');
    }
    if (!$receta->esUsuarioComprasActivo($compradorId)) {
        throw new RuntimeException('El usuario seleccionado no pertenece al área de Compras o está inactivo');
    }
    $totalIngenieria = $receta->totalIngenieriaDolaresPorHash($hash);
    $totalOrigen = $receta->totalRecetaOrigenDolares((int)($ingenieria['id_receta_duplicada'] ?? 0));
    if ($totalIngenieria > $totalOrigen + 0.01) {
        throw new RuntimeException('El total de ingeniería excede el monto de la receta de origen. Revisa los cambios antes de validar.');
    }

    $receta->begin();
    $compraId = $receta->aprobarIngenieriaParaCompras($id, (int)$_SESSION['session_id'], $compradorId);
    $receta->commit();

    echo json_encode([
        'success' => true,
        'estado' => 'PREVALIDACION - VALIDADO',
        'compra_id' => $compraId,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($receta) && $receta instanceof Receta) {
        $receta->rollback();
    }

    if (http_response_code() < 400) http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
