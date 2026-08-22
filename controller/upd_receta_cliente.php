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

    if (!in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 4, 3], true)) {
        throw new Exception('No tienes permisos para actualizar los datos del cliente');
    }

    $recetaId = isset($_POST['receta_id']) ? (int)$_POST['receta_id'] : 0;
    $razonSocialEmpresa = trim((string)($_POST['razon_social_empresa'] ?? ''));
    $direccion = trim((string)($_POST['direccion'] ?? ''));
    $ruc = trim((string)($_POST['ruc'] ?? ''));
    $nombreCompleto = trim((string)($_POST['nombre_completo'] ?? ''));
    $correo = trim((string)($_POST['correo'] ?? ''));
    $celular = trim((string)($_POST['celular'] ?? ''));
    $motivo = trim((string)($_POST['motivo'] ?? ''));

    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    foreach ([
        $razonSocialEmpresa,
        $direccion,
        $ruc,
        $nombreCompleto,
        $correo,
        $celular,
        $motivo,
    ] as $valor) {
        if ($valor === '') {
            throw new Exception('Completa todos los datos del cliente');
        }
    }

    if (!preg_match('/^[0-9]{11}$/', $ruc)) {
        throw new Exception('El RUC debe contener 11 dígitos');
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('El correo del cliente no es válido');
    }

    if (!preg_match('/^[0-9]{9}$/', $celular)) {
        throw new Exception('El celular del cliente debe contener 9 dígitos numéricos');
    }

    $receta = new Receta();
    $ok = $receta->guardarCliente([
        'receta_id' => $recetaId,
        'razon_social_empresa' => $razonSocialEmpresa,
        'direccion' => $direccion,
        'ruc' => $ruc,
        'nombre_completo' => $nombreCompleto,
        'correo' => $correo,
        'celular' => $celular,
        'motivo' => $motivo,
    ]);

    if (!$ok) {
        throw new Exception('No se pudo guardar la información del cliente');
    }

    echo json_encode([
        'ok' => true,
        'cliente' => [
            'razon_social_empresa' => $razonSocialEmpresa,
            'direccion' => $direccion,
            'ruc' => $ruc,
            'nombre_completo' => $nombreCompleto,
            'correo' => $correo,
            'celular' => $celular,
            'motivo' => $motivo,
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
