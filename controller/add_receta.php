<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

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

    $items = json_decode((string)($_POST['items'] ?? '[]'), true);
    if (!is_array($items)) throw new Exception('Items inválidos');
    $asignadoUsuarioId = (int)($_POST['usuario_ingenieria_id'] ?? 0);

    $receta = new Receta();
    if ($asignadoUsuarioId > 0 && !$receta->esUsuarioIngenieriaActivo($asignadoUsuarioId)) {
        throw new Exception('El usuario asignado no pertenece a Ingeniería o está inactivo');
    }
    if (!$items && $asignadoUsuarioId <= 0) {
        throw new Exception('Agrega al menos un item o asigna la receta a un usuario de Ingeniería');
    }

    $tipoCambio = isset($_POST['tipo_cambio']) ? (float)$_POST['tipo_cambio'] : 0;
    if ($tipoCambio <= 0) {
        throw new Exception('Tipo de cambio inválido');
    }

    $razonSocialEmpresa = trim((string)($_POST['razon_social_empresa'] ?? ''));
    $direccionCliente = trim((string)($_POST['direccion_cliente'] ?? ''));
    $rucCliente = trim((string)($_POST['ruc_cliente'] ?? ''));
    $nombreCompletoContacto = trim((string)($_POST['nombre_completo_contacto'] ?? ''));
    $correoContacto = trim((string)($_POST['correo_contacto'] ?? ''));
    $celularContacto = trim((string)($_POST['celular_contacto'] ?? ''));
    $motivoSolicitud = trim((string)($_POST['motivo_solicitud'] ?? ''));
    $descripcionReceta = trim((string)($_POST['descripcion_receta'] ?? ''));
    $cantidadItemsReceta = isset($_POST['cantidad_items_receta']) ? (int)$_POST['cantidad_items_receta'] : 0;

    if ($razonSocialEmpresa === '' || $direccionCliente === '' || $rucCliente === '' || $nombreCompletoContacto === '' || $correoContacto === '' || $celularContacto === '' || $motivoSolicitud === '' || $descripcionReceta === '') {
        throw new Exception('Completa los datos del cliente y de la receta antes de guardar');
    }

    if ($cantidadItemsReceta < 1 || $cantidadItemsReceta > 5000) {
        throw new Exception('La cantidad de items debe estar entre 1 y 5000');
    }

    if (!preg_match('/^[0-9]{11}$/', $rucCliente)) {
        throw new Exception('El RUC debe contener 11 dígitos');
    }

    if (!filter_var($correoContacto, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('El correo del contacto no es válido');
    }

    if (!preg_match('/^[0-9]{9}$/', $celularContacto)) {
        throw new Exception('El celular del contacto debe contener 9 dígitos numéricos');
    }

    $receta->prepararAsignacionReceta();
    $receta->begin();

    $recetaId = $receta->guardarCabecera([
        'usuario_id' => (int)$_SESSION['session_id'],
        'asignado_usuario_id' => $asignadoUsuarioId > 0 ? $asignadoUsuarioId : null,
        'estado' => 'Enviada',
        'usuario_upd' => null,
        'tipo_cambio' => $tipoCambio,
    ]);

    $receta->guardarCliente([
        'receta_id' => $recetaId,
        'razon_social_empresa' => $razonSocialEmpresa,
        'direccion' => $direccionCliente,
        'ruc' => $rucCliente,
        'nombre_completo' => $nombreCompletoContacto,
        'correo' => $correoContacto,
        'celular' => $celularContacto,
        'motivo' => $motivoSolicitud,
        'descripcion' => $descripcionReceta,
        'cantidad_items' => $cantidadItemsReceta,
    ]);

    foreach ($items as $item) {
        $itemId = (int)($item['item_id'] ?? 0);
        $cantidad = (int)($item['cantidad'] ?? 0);

        if ($itemId <= 0) {
            throw new Exception('Item inválido');
        }

        if ($cantidad < 1 || $cantidad > 5000) {
            throw new Exception('Cantidad inválida (1 a 5000)');
        }

        $receta->guardarDetalle([
            'receta_id' => $recetaId,
            'item_id' => $itemId,
            'categoria' => $item['categoria'] ?? '',
            'sub_cat_1' => $item['sub_cat_1'] ?? '',
            'sub_cat_2' => $item['sub_cat_2'] ?? '',
            'marca' => $item['marca'] ?? '',
            'modelo' => $item['modelo'] ?? '',
            'nombre' => $item['nombre'] ?? '',
            'descripcion' => $item['descripcion'] ?? '',
            'uni_medida' => $item['uni_medida'] ?? '',
            'precio' => (float)($item['precio'] ?? 0),
            'moneda' => $item['moneda'] ?? '',
            'tipo' => $item['tipo'] ?? '',
            'cantidad' => $cantidad,
        ]);
    }

    if ($asignadoUsuarioId > 0) {
        $receta->notificarRecetaAsignada(
            $recetaId,
            $asignadoUsuarioId,
            (string)($_SESSION['session_usuario'] ?? 'Sistema'),
            $motivoSolicitud
        );
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
