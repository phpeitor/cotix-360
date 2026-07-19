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

    if (!isset($_POST['items'])) {
        throw new Exception('No se enviaron items');
    }

    $items = json_decode((string)$_POST['items'], true);

    if (!is_array($items) || empty($items)) {
        throw new Exception('Items inválidos');
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

    if ($razonSocialEmpresa === '' || $direccionCliente === '' || $rucCliente === '' || $nombreCompletoContacto === '' || $correoContacto === '' || $celularContacto === '' || $motivoSolicitud === '') {
        throw new Exception('Completa los datos del cliente antes de guardar la receta');
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

    $receta = new Receta();
    $receta->begin();

    $recetaId = $receta->guardarCabecera([
        'usuario_id' => (int)$_SESSION['session_id'],
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
