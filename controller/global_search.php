<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/permisos.php';
require_once __DIR__ . '/../model/global_search.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido']);
    exit;
}

if (!isset($_SESSION['session_id'], $_SESSION['session_cargo'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Sesion expirada']);
    exit;
}

$query = trim((string)($_GET['q'] ?? ''));
if (mb_strlen($query) < 2) {
    echo json_encode(['ok' => true, 'data' => []]);
    exit;
}
if (mb_strlen($query) > 100) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'La busqueda es demasiado larga']);
    exit;
}

try {
    $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $query) . '%';
    $cargo = (int)$_SESSION['session_cargo'];
    $usuarioId = (int)$_SESSION['session_id'];
    $model = new GlobalSearch();
    $data = [];

    if (tieneAcceso('usuarios.php')) {
        $data['usuarios'] = array_map(static fn(array $row) => [
            'title' => $row['titulo'],
            'subtitle' => trim(($row['subtitulo'] ?: '') . ($row['DOC'] ? ' · ' . $row['DOC'] : '')),
            'href' => 'upd_usuario.php?hash=' . $row['hash_id'],
            'icon' => 'ti ti-user'
        ], $model->buscarUsuarios($like));
    }

    if (tieneAcceso('cotizaciones.php')) {
        $data['cotizaciones'] = array_map(static fn(array $row) => [
            'title' => 'Cotizacion #' . $row['id'],
            'subtitle' => trim(($row['usuario'] ?: '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'form_cotizacion.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-file-invoice'
        ], $model->buscarCotizaciones($like, $cargo, $usuarioId));
    }

    if (tieneAcceso('receta_list.php') || tieneAcceso('receta_form.php')) {
        $data['recetas'] = array_map(static fn(array $row) => [
            'title' => $row['titulo'] ?: 'Receta #' . $row['id'],
            'subtitle' => trim(($row['usuario'] ?: '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'receta_form.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-file-text'
        ], $model->buscarRecetas($like, $cargo, $usuarioId));
    }

    if (tieneAcceso('items.php')) {
        $data['items'] = array_map(static fn(array $row) => [
            'title' => $row['modelo'] ?: 'Item',
            'subtitle' => trim(($row['descripcion'] ?: '') . ($row['grupo_descuento'] ? ' · ' . $row['grupo_descuento'] : '')),
            'href' => 'upd_item.php?hash=' . $row['hash_id'],
            'icon' => 'ti ti-package'
        ], $model->buscarItems($like));
    }

    if (tieneAcceso('compras.php')) {
        $data['compras'] = array_map(static fn(array $row) => [
            'title' => 'Compra #' . $row['id'],
            'subtitle' => trim(($row['nombre'] ?: '') . ($row['razon_social_empresa'] ? ' · ' . $row['razon_social_empresa'] : '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'compras_detalle.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-shopping-cart'
        ], $model->buscarCompras($like));
    }

    if (tieneAcceso('ingenieria.php')) {
        $data['ingenieria'] = array_map(static fn(array $row) => [
            'title' => $row['nombre'] ?: 'Ingeniería #' . $row['id'],
            'subtitle' => trim(($row['razon_social_empresa'] ?: '') . ($row['ruc'] ? ' · RUC ' . $row['ruc'] : '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'ingenieria_form.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-tools'
        ], $model->buscarIngenieria($like, $cargo, $usuarioId));
    }

    if (tieneAcceso('tracking.php')) {
        $data['tracking'] = array_map(static fn(array $row) => [
            'title' => $row['nombre'] ?: 'Tracking #' . $row['id'],
            'subtitle' => trim(($row['razon_social_empresa'] ?: '') . ($row['cod_tracking'] ? ' · ' . $row['cod_tracking'] : '')),
            'href' => 'tracking.php?cod_tracking=' . rawurlencode((string)($row['cod_tracking'] ?: $row['id'])),
            'icon' => 'ti ti-truck'
        ], $model->buscarTrackings($like));
    }

    echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No se pudo realizar la busqueda']);
}
