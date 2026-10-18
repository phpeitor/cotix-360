<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/usuario.php';
require_once __DIR__ . '/../config/permisos.php';

try {
    $cli = new Usuario();

    $payload = [
        'nombres'   => $_POST['nombres']   ?? '',
        'apellidos' => $_POST['apellidos'] ?? '',
        'email'     => $_POST['email']     ?? '',
        'documento' => $_POST['documento'] ?? '',
        'telefono'  => $_POST['telefono']  ?? '',
        'sexo'      => $_POST['sexo']      ?? '',
        'cargo'     => $_POST['cargo']     ?? '',
    ];

    if (!cargoPermisoExiste(trim((string)$payload['cargo']))) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Selecciona un cargo configurado en Permisos']);
        exit;
    }

    $existe = $cli->valida_documento($payload['documento']);
    if ($existe) {
        echo json_encode([
            'ok' => false,
            'message' => 'El documento ya está registrado'
        ]);
        exit;
    }

    $id = $cli->guardar($payload);
    echo json_encode(['ok' => true, 'id' => $id]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
