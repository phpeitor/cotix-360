<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function recetaCategoriaPayload(): array {
    return [
        'tipo' => trim((string)($_POST['tipo'] ?? '')),
        'categoria' => trim((string)($_POST['categoria'] ?? '')),
        'sub_cat_1' => trim((string)($_POST['sub_cat_1'] ?? '')),
        'sub_cat_2' => trim((string)($_POST['sub_cat_2'] ?? '')),
        'estado' => isset($_POST['estado']) ? (int)$_POST['estado'] : 1,
    ];
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        echo json_encode(['ok' => false, 'message' => 'Sesión expirada o usuario no autenticado']);
        exit;
    }

    $item = new Item();
    $action = strtolower(trim((string)($_REQUEST['action'] ?? 'list')));

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
        echo json_encode($item->obtenerRecetaCategoriasGestion(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
        exit;
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['ok' => false, 'message' => 'ID no válido']);
            exit;
        }

        echo json_encode([
            'ok' => $item->bajaRecetaCategoria($id),
            'message' => 'Categoría suspendida correctamente'
        ]);
        exit;
    }

    $data = recetaCategoriaPayload();
    if ($data['tipo'] === '' || $data['categoria'] === '') {
        echo json_encode(['ok' => false, 'message' => 'Tipo y categoría son obligatorios']);
        exit;
    }

    if ($action === 'create') {
        $id = $item->guardarRecetaCategoria($data);
        echo json_encode(['ok' => true, 'id' => $id, 'message' => 'Categoría registrada correctamente']);
        exit;
    }

    if ($action === 'update') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['ok' => false, 'message' => 'ID no válido']);
            exit;
        }

        $item->actualizarRecetaCategoria($id, $data);
        echo json_encode(['ok' => true, 'message' => 'Categoría actualizada correctamente']);
        exit;
    }

    echo json_encode(['ok' => false, 'message' => 'Acción no válida']);
} catch (PDOException $e) {
    $isDuplicate = $e->getCode() === '23000';
    http_response_code($isDuplicate ? 409 : 500);
    echo json_encode([
        'ok' => false,
        'message' => $isDuplicate ? 'Ya existe una categoría con la misma combinación' : 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
