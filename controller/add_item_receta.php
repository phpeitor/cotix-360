<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';
require_once __DIR__ . '/../database/conexion.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {

    if (!isset($_SESSION['session_id']) || $_SESSION['session_id'] <= 0) {
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

    $item = new Item();
    $itemId = $item->guardarItemReceta([
        'categoria' => $_POST['categoria'] ?? '',
        'sub_cat_1' => $_POST['sub_cat_1'] ?? '',
        'sub_cat_2' => $_POST['sub_cat_2'] ?? '',
        'marca' => $_POST['marca'] ?? '',
        'modelo' => $_POST['modelo'] ?? '',
        'nombre' => $_POST['nombre'] ?? '',
        'descripcion' => $_POST['descripcion'] ?? '',
        'uni_medida' => $_POST['uni_medida'] ?? '',
        'precio' => isset($_POST['precio']) ? (float)$_POST['precio'] : 0,
        'stock' => isset($_POST['stock']) ? (int)$_POST['stock'] : 0,
        'moneda' => $_POST['moneda'] ?? '',
        'tipo' => $_POST['tipo'] ?? '',
    ]);

    $conexion = new Conexion();
    $pdo = $conexion->conectar();
    $nowLima = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))->format('Y-m-d H:i:s');
    $detalle = trim(implode(' | ', array_filter([
        (string)($_POST['tipo'] ?? ''),
        (string)($_POST['sub_cat_2'] ?? '')
    ], static fn ($value) => $value !== '')));

    $stmtNotif = $pdo->prepare(
        "INSERT INTO header_notifications (
            tipo, usuario_id, usuario, titulo, detalle, icon, tone, meta_json, estado, created_at
        ) VALUES (
            :tipo, :usuario_id, :usuario, :titulo, :detalle, :icon, :tone, :meta_json, 1, :created_at
        )"
    );
    $stmtNotif->bindValue(':tipo', 'item_receta');
    $stmtNotif->bindValue(':usuario_id', (int)($_SESSION['session_id'] ?? 0), PDO::PARAM_INT);
    $stmtNotif->bindValue(':usuario', (string)($_SESSION['session_usuario'] ?? $_SESSION['session_nombre'] ?? 'Sistema'));
    $stmtNotif->bindValue(':titulo', 'Nuevo item de receta');
    $stmtNotif->bindValue(':detalle', $detalle);
    $stmtNotif->bindValue(':icon', 'ti-package');
    $stmtNotif->bindValue(':tone', 'success');
    $stmtNotif->bindValue(':meta_json', json_encode([
        'item_id' => $itemId,
        'nombre' => (string)($_POST['nombre'] ?? ''),
        'tipo' => (string)($_POST['tipo'] ?? ''),
        'categoria' => (string)($_POST['categoria'] ?? ''),
        'sub_cat_1' => (string)($_POST['sub_cat_1'] ?? ''),
        'sub_cat_2' => (string)($_POST['sub_cat_2'] ?? '')
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $stmtNotif->bindValue(':created_at', $nowLima);
    $stmtNotif->execute();

    echo json_encode([
        'ok' => true,
        'id' => $itemId
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}