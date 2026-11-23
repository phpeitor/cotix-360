<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/permisos.php';
require_once __DIR__ . '/../database/conexion.php';

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

try {
    $db = (new Conexion())->conectar();
    $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $query) . '%';
    $cargo = (int)$_SESSION['session_cargo'];
    $usuarioId = (int)$_SESSION['session_id'];
    $data = [];

    if (tieneAcceso('usuarios.php')) {
        $stmt = $db->prepare(
            "SELECT MD5(IDPERSONAL) AS hash_id,
                    CONCAT_WS(' ', NOMBRES, APELLIDOS) AS titulo,
                    USUARIO AS subtitulo,
                    DOC
             FROM personal
             WHERE IDESTADO = 1
               AND (NOMBRES LIKE :q ESCAPE '\\\\'
                    OR APELLIDOS LIKE :q ESCAPE '\\\\'
                    OR USUARIO LIKE :q ESCAPE '\\\\'
                    OR DOC LIKE :q ESCAPE '\\\\')
             ORDER BY NOMBRES, APELLIDOS
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        $data['usuarios'] = array_map(static fn(array $row) => [
            'title' => $row['titulo'],
            'subtitle' => trim(($row['subtitulo'] ?: '') . ($row['DOC'] ? ' · ' . $row['DOC'] : '')),
            'href' => 'upd_usuario.php?hash=' . $row['hash_id'],
            'icon' => 'ti ti-user'
        ], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if (tieneAcceso('cotizaciones.php')) {
        $where = "(
            CAST(c.id AS CHAR) LIKE :q ESCAPE '\\\\'
            OR p.usuario LIKE :q ESCAPE '\\\\'
            OR c.estado LIKE :q ESCAPE '\\\\'
        )";
        $params = ['q' => $like];
        if (!in_array($cargo, [1, 3], true)) {
            $where .= " AND c.usuario_id = :usuario_id";
            $params['usuario_id'] = $usuarioId;
        }
        $stmt = $db->prepare(
            "SELECT MD5(c.id) AS hash_id, c.id, c.estado, p.usuario
             FROM cotizaciones c
             LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
             WHERE $where
             ORDER BY c.id DESC
             LIMIT 5"
        );
        $stmt->execute($params);
        $data['cotizaciones'] = array_map(static fn(array $row) => [
            'title' => 'Cotizacion #' . $row['id'],
            'subtitle' => trim(($row['usuario'] ?: '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'form_cotizacion.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-file-invoice'
        ], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if (tieneAcceso('receta_list.php') || tieneAcceso('receta_form.php')) {
        $where = "(CAST(r.id AS CHAR) LIKE :q ESCAPE '\\\\'
                   OR r.nombre LIKE :q ESCAPE '\\\\'
                   OR r.nombre_interno LIKE :q ESCAPE '\\\\'
                   OR p.usuario LIKE :q ESCAPE '\\\\')";
        $params = ['q' => $like];
        if (!in_array($cargo, [1, 3, 8], true)) {
            $where .= " AND r.usuario_id = :usuario_id";
            $params['usuario_id'] = $usuarioId;
        }
        $stmt = $db->prepare(
            "SELECT MD5(r.id) AS hash_id, r.id,
                    COALESCE(r.nombre, r.nombre_interno) AS titulo,
                    r.estado, p.usuario
             FROM recetas r
             LEFT JOIN personal p ON p.IDPERSONAL = r.usuario_id
             WHERE $where
             ORDER BY r.id DESC
             LIMIT 5"
        );
        $stmt->execute($params);
        $data['recetas'] = array_map(static fn(array $row) => [
            'title' => $row['titulo'] ?: 'Receta #' . $row['id'],
            'subtitle' => trim(($row['usuario'] ?: '') . ($row['estado'] ? ' · ' . $row['estado'] : '')),
            'href' => 'receta_form.php?id=' . $row['hash_id'],
            'icon' => 'ti ti-file-text'
        ], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if (tieneAcceso('items.php')) {
        $stmt = $db->prepare(
            "SELECT MD5(i.id) AS hash_id, i.modelo, i.descripcion, i.grupo_descuento
             FROM item i
             LEFT JOIN carga c ON c.id = i.id_carga
             WHERE (i.modelo LIKE :q ESCAPE '\\\\'
                    OR i.descripcion LIKE :q ESCAPE '\\\\'
                    OR i.grupo_descuento LIKE :q ESCAPE '\\\\'
                    OR i.clase_producto LIKE :q ESCAPE '\\\\'
                    OR i.categoria_producto LIKE :q ESCAPE '\\\\')
               AND c.estado = 1
             ORDER BY i.id DESC
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        $data['items'] = array_map(static fn(array $row) => [
            'title' => $row['modelo'] ?: 'Item',
            'subtitle' => trim(($row['descripcion'] ?: '') . ($row['grupo_descuento'] ? ' · ' . $row['grupo_descuento'] : '')),
            'href' => 'upd_item.php?hash=' . $row['hash_id'],
            'icon' => 'ti ti-package'
        ], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if (tieneAcceso('compras.php')) {
        try {
            $stmt = $db->prepare(
                "SELECT MD5(c.id) AS hash_id, c.id, c.estado
                 FROM receta_compras c
                 WHERE CAST(c.id AS CHAR) LIKE :q ESCAPE '\\\\'
                    OR c.estado LIKE :q ESCAPE '\\\\'
                 ORDER BY c.id DESC
                 LIMIT 5"
            );
            $stmt->execute(['q' => $like]);
            $data['compras'] = array_map(static fn(array $row) => [
                'title' => 'Compra #' . $row['id'],
                'subtitle' => $row['estado'] ?: 'Compra',
                'href' => 'compras_detalle.php?id=' . $row['hash_id'],
                'icon' => 'ti ti-shopping-cart'
            ], $stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (Throwable $e) {
            $data['compras'] = [];
        }
    }

    echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No se pudo realizar la búsqueda']);
}
