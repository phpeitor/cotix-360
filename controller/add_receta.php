<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';
require_once __DIR__ . '/../model/compras/compras.php';

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
    $duplicarOrigenId = (int)($_POST['duplicar_origen_id'] ?? 0);
    $modoDuplicacion = trim((string)($_POST['modo_duplicacion'] ?? ''));
    $versionRaizParam = (int)($_POST['version_raiz_id'] ?? 0);
    $itemsCatalogo = [];
    $adicionalesPorRecetaOrigen = [];
    $cantidadAdicionalPorRecetaOrigen = [];
    foreach ($items as $item) {
        $detalleCompraId = (int)($item['compra_detalle_id'] ?? 0);
        if ($detalleCompraId > 0) {
            $recetaOrigenId = (int)($item['receta_origen_id'] ?? 0);
            if ($recetaOrigenId <= 0) throw new Exception('No se identificó la receta de origen del adicional');
            $adicionalesPorRecetaOrigen[$recetaOrigenId][] = $detalleCompraId;
            $cantidadAdicionalPorRecetaOrigen[$recetaOrigenId][$detalleCompraId] = (int)($item['cantidad'] ?? 0);
            continue;
        }
        $itemsCatalogo[] = $item;
    }

    $receta = new Receta();
    if ($duplicarOrigenId > 0) {
        if (!in_array($modoDuplicacion, ['normal', 'version'], true)) {
            throw new Exception('Selecciona si deseas duplicar normalmente o crear una versión');
        }
        $cargoActual = (int)($_SESSION['session_cargo'] ?? 0);
        if (!in_array($cargoActual, [1, 7], true)) {
            throw new Exception('Solo Admin y Vendedor pueden duplicar recetas');
        }
        $origenDuplicado = $receta->obtenerPorId($duplicarOrigenId);
        if (!$origenDuplicado) throw new Exception('La receta de origen no existe');
        if ($cargoActual === 7 && (int)($origenDuplicado['usuario_id'] ?? 0) !== (int)$_SESSION['session_id']) {
            throw new Exception('El Vendedor solo puede crear versiones de sus propias recetas');
        }
        if ($modoDuplicacion === 'version') {
            $raizReal = $receta->raizVersionReceta($duplicarOrigenId);
            if ($versionRaizParam !== $raizReal) {
                throw new Exception('La versión seleccionada no pertenece a la receta raíz');
            }
        } elseif ($versionRaizParam > 0) {
            throw new Exception('Una duplicación normal no debe incluir datos de versión');
        }
    } elseif ($versionRaizParam > 0 || $modoDuplicacion !== '') {
        throw new Exception('Falta la receta de origen para duplicar');
    }

    if ($asignadoUsuarioId > 0 && !$receta->esUsuarioAsignableReceta($asignadoUsuarioId)) {
        throw new Exception('El usuario asignado no pertenece a Supervisión o Ingeniería, o está inactivo');
    }
    if (!$itemsCatalogo && !$adicionalesPorRecetaOrigen && $asignadoUsuarioId <= 0) {
        throw new Exception('Agrega al menos un item, importa adicionales positivos o asigna la receta a Ingeniería');
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
    $nombreReceta = trim((string)($_POST['nombre_receta'] ?? ''));
    $nombreInterno = trim((string)($_POST['nombre_interno'] ?? ''));
    $motivoSolicitud = trim((string)($_POST['motivo_solicitud'] ?? ''));
    $descripcionReceta = trim((string)($_POST['descripcion_receta'] ?? ''));
    $cantidadItemsReceta = isset($_POST['cantidad_items_receta']) ? (int)$_POST['cantidad_items_receta'] : 0;

    if ($razonSocialEmpresa === '' || $direccionCliente === '' || $rucCliente === '' || $nombreCompletoContacto === '' || $correoContacto === '' || $celularContacto === '' || $nombreReceta === '' || $motivoSolicitud === '' || $descripcionReceta === '') {
        throw new Exception('Completa el nombre de la receta, los datos del cliente y la descripción antes de guardar');
    }
    if (mb_strlen($nombreReceta, 'UTF-8') > 100) {
        throw new Exception('El nombre de la receta no puede superar los 100 caracteres');
    }
    if (mb_strlen($nombreInterno, 'UTF-8') > 150) {
        throw new Exception('El Nombre Interno no puede superar los 150 caracteres');
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

    $adicionalesImportados = [];
    if ($adicionalesPorRecetaOrigen) {
        $compras = new Compras();
        foreach ($adicionalesPorRecetaOrigen as $recetaOrigenId => $idsDetalleCompra) {
            foreach ($compras->adicionalesPositivosPorIds((int)$recetaOrigenId, $idsDetalleCompra) as $adicionalImportado) {
                $cantidadImportada = (int)($cantidadAdicionalPorRecetaOrigen[$recetaOrigenId][(int)$adicionalImportado['id']] ?? 0);
                if ($cantidadImportada < 1 || $cantidadImportada > 5000) {
                    throw new Exception('Cantidad inválida para un adicional positivo importado');
                }
                $adicionalImportado['cantidad'] = $cantidadImportada;
                $adicionalesImportados[] = $adicionalImportado;
            }
        }
    }

    $receta->prepararAsignacionReceta();
    $receta->begin();

    $numeroVersion = $duplicarOrigenId > 0 && $modoDuplicacion === 'version'
        ? $receta->siguienteNumeroVersionReceta($versionRaizParam)
        : 0;

    $recetaId = $receta->guardarCabecera([
        'usuario_id' => (int)$_SESSION['session_id'],
        'asignado_usuario_id' => $asignadoUsuarioId > 0 ? $asignadoUsuarioId : null,
        'nombre' => $nombreReceta,
        'nombre_interno' => $nombreInterno,
        'adicionales_positivos_importados' => !empty($adicionalesImportados),
        'id_receta_duplicada' => $numeroVersion > 0 ? $duplicarOrigenId : null,
        'version_raiz_id' => $numeroVersion > 0 ? $versionRaizParam : null,
        'version_numero' => $numeroVersion > 0 ? $numeroVersion : null,
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

    foreach ($itemsCatalogo as $item) {
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

    foreach ($adicionalesImportados as $item) {
        $receta->guardarDetalle([
            'receta_id' => $recetaId,
            'item_id' => (int)($item['item_id'] ?? 0),
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
            'cantidad' => (int)($item['cantidad'] ?? 0),
            'es_adicional_positivo_importado' => 1,
            'compra_detalle_origen_id' => (int)($item['id'] ?? 0),
            'receta_origen_id' => (int)($item['id_receta_duplicada'] ?? 0),
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
