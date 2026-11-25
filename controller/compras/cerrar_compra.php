<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../model/compras/compras.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$compras = null;
$transaccionIniciada = false;

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new RuntimeException('Método no permitido');
    }

    $cargo = (int)($_SESSION['session_cargo'] ?? 0);
    if (!in_array($cargo, Compras::CARGOS_EDITABLES, true)) {
        http_response_code(403);
        throw new RuntimeException('No tiene permisos para cerrar la compra');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    if (!preg_match('/^[a-f0-9]{32}$/i', $hash)) {
        throw new InvalidArgumentException('ID inválido');
    }

    $compras = new Compras();
    if (!$compras->obtenerCompraPorHash($hash)) {
        throw new RuntimeException('Compra no encontrada');
    }

    $compras->begin();
    $transaccionIniciada = true;
    $compra = $compras->bloquearCompraPorHash($hash);
    if (!$compra) {
        throw new RuntimeException('Compra no encontrada');
    }
    if ($cargo === 5 && (int)($compra['asignado_usuario_id'] ?? 0) > 0 && (int)$compra['asignado_usuario_id'] !== (int)$_SESSION['session_id']) {
        http_response_code(403);
        throw new RuntimeException('Esta compra no está asignada a tu usuario');
    }
    if (strtolower(trim((string)($compra['estado'] ?? ''))) !== 'pendiente') {
        throw new RuntimeException('Solo se pueden cerrar compras en estado Pendiente');
    }
    if ($compras->tieneDetalleSinOrigenAbastecimiento($hash)) {
        throw new RuntimeException('Selecciona Stock o Compras en todos los items antes de cerrar');
    }
    if (!$compras->cerrarCompra((int)$compra['id'], (int)$_SESSION['session_id'])) {
        throw new RuntimeException('No se pudo cerrar la compra. Verifica que todos los items tengan origen seleccionado.');
    }

    $compras->commit();
    $transaccionIniciada = false;

    echo json_encode([
        'success' => true,
        'estado' => 'Cerrado',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if ($transaccionIniciada && $compras instanceof Compras) {
        $compras->rollback();
    }

    if (http_response_code() < 400) {
        http_response_code(400);
    }
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
