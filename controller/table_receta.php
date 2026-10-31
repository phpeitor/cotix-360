<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

try {
    $fec_ini = $_GET['fec_ini'] ?? $_POST['fec_ini'] ?? null;
    $fec_fin = $_GET['fec_fin'] ?? $_POST['fec_fin'] ?? null;

    if (!$fec_ini || !$fec_fin) {
        echo json_encode([
            'error' => true,
            'message' => 'Debe enviar fec_ini y fec_fin'
        ]);
        exit;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fec_ini) ||
        !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fec_fin)) {
        echo json_encode([
            'error' => true,
            'message' => 'Formato de fecha inválido (YYYY-MM-DD)'
        ]);
        exit;
    }

    $subCat1 = trim((string)($_GET['sub_cat_1'] ?? $_POST['sub_cat_1'] ?? ''));
    if (mb_strlen($subCat1, 'UTF-8') > 255) {
        throw new InvalidArgumentException('El filtro de Subcategoría 1 es demasiado largo');
    }

    $receta = new Receta();
    $data = $receta->table_receta($fec_ini, $fec_fin, $subCat1);

    echo json_encode(
        [
            'error' => false,
            'data'  => $data
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
