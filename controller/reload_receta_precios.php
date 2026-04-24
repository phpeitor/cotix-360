<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode([
            'ok' => false,
            'message' => 'Sesión expirada o usuario no autenticado'
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'message' => 'Metodo no permitido'
        ]);
        exit;
    }

    $hash = $_POST['id'] ?? null;
    if (!$hash) {
        throw new Exception('ID inválido');
    }

    $receta = new Receta();
    $row = $receta->obtenerPorHash((string)$hash);

    if (!$row) {
        throw new Exception('Receta no encontrada');
    }

    if (strcasecmp((string)($row['estado'] ?? ''), 'Enviada') !== 0) {
        throw new Exception('Solo se puede recargar precios en recetas con estado Enviada');
    }

    $receta->begin();
    $actualizados = $receta->sincronizarPreciosDetalle((int)$row['id']);

    $okCabecera = $receta->actualizarCabeceraEdicion(
        (int)$row['id'],
        (float)($row['tipo_cambio'] ?? 1),
        (int)$_SESSION['session_id']
    );

    if (!$okCabecera) {
        throw new Exception('No se pudo actualizar cabecera de receta');
    }

    $receta->commit();

    echo json_encode([
        'ok' => true,
        'actualizados' => $actualizados
    ]);

} catch (Throwable $e) {
    if (isset($receta)) {
        $receta->rollback();
    }

    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
