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

    $recetaId = isset($_POST['receta_id']) ? (int)$_POST['receta_id'] : 0;
    $tipoCambio = isset($_POST['tipo_cambio']) ? (float)$_POST['tipo_cambio'] : 0;

    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    if ($tipoCambio <= 0) {
        throw new Exception('Tipo de cambio inválido');
    }

    $receta = new Receta();
    $rowReceta = $receta->obtenerPorId($recetaId);
    if (!$rowReceta) {
        throw new Exception('Receta no encontrada');
    }

    $estado = strtolower((string)($rowReceta['estado'] ?? ''));
    if (!in_array($estado, ['enviada', 'aprobada'], true)) {
        throw new Exception('Solo se puede modificar recetas con estado Enviada o Aprobada');
    }

    $receta->begin();

    $okCabecera = $receta->actualizarCabeceraEdicion(
        $recetaId,
        $tipoCambio,
        (int)$_SESSION['session_id']
    );

    if (!$okCabecera) {
        throw new Exception('No se pudo actualizar cabecera de receta');
    }

    $receta->commit();

    echo json_encode([
        'ok' => true,
        'id' => $recetaId
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
