<?php
header('Content-Type: application/json; charset=utf-8');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__ . '/../model/usuario.php';

if (!isset($_SESSION['session_id'], $_SESSION['session_usuario'], $_SESSION['session_cargo'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Sesión no válida']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $usuarioId = (int)($_SESSION['session_id'] ?? 0);
    $nombres = trim((string)($_POST['nombres'] ?? ''));
    $apellidos = trim((string)($_POST['apellidos'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));
    $telefono = trim((string)($_POST['telefono'] ?? ''));
    $sexo = filter_var($_POST['sexo'] ?? 0, FILTER_VALIDATE_INT);
    $nuevaPassword = (string)($_POST['nueva_password'] ?? '');
    $confirmarPassword = (string)($_POST['confirmar_password'] ?? '');

    if ($usuarioId <= 0 || $nombres === '' || $apellidos === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Completa nombres, apellidos y un correo válido']);
        exit;
    }

    if ($sexo === false || !in_array($sexo, [0, 1, 2], true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Selecciona un sexo válido']);
        exit;
    }

    if (strlen($nuevaPassword) > 0) {
        if (strlen($nuevaPassword) < 6 || $nuevaPassword !== $confirmarPassword) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'message' => 'La nueva contraseña debe tener al menos 6 caracteres y coincidir']);
            exit;
        }

        $passwordActual = (string)($_POST['password_actual'] ?? '');
        if ($passwordActual === '' || !(new Usuario())->validarPassword($usuarioId, $passwordActual)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'message' => 'La contraseña actual no es válida']);
            exit;
        }
    }

    $ok = (new Usuario())->actualizarPerfil($usuarioId, [
        'nombres' => $nombres,
        'apellidos' => $apellidos,
        'email' => $email,
        'telefono' => $telefono,
        'sexo' => $sexo,
        'nueva_password' => $nuevaPassword,
    ]);

    $_SESSION['session_nombre'] = mb_strtoupper($nombres, 'UTF-8');
    echo json_encode([
        'ok' => true,
        'message' => $ok ? 'Perfil actualizado correctamente' : 'No se realizaron cambios',
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No se pudo actualizar el perfil']);
}
