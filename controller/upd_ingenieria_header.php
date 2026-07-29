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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception('Metodo no permitido');
    }

    $hash = trim((string)($_POST['hash'] ?? ''));
    $field = trim((string)($_POST['field'] ?? ''));
    $value = trim((string)($_POST['value'] ?? ''));

    if ($hash === '') {
        throw new Exception('ID inválido');
    }

    $receta = new Receta();

    if ($field === 'nombre') {
        if ($value === '') {
            throw new Exception('El nombre no puede estar vacío');
        }
        $ok = $receta->actualizarNombreIngenieria($hash, $value);
    } elseif ($field === 'tipo_cambio') {
        $tipoCambio = (float)$value;
        if ($tipoCambio <= 0) {
            throw new Exception('Tipo de cambio inválido');
        }
        $ok = $receta->actualizarTipoCambioIngenieria($hash, $tipoCambio);
    } else {
        throw new Exception('Campo no permitido');
    }

    if (!$ok) {
        throw new Exception('No se pudo actualizar ingeniería');
    }

    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
