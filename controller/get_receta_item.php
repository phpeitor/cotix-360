<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/item.php';

try {
    $item = new Item();

    $nivel = strtolower(trim((string)($_GET['nivel'] ?? 'items')));
    $tipo = $_GET['tipo'] ?? ($_GET['base'] ?? null);
    $categoria = $_GET['categoria'] ?? null;
    $subCat1 = $_GET['sub_cat_1'] ?? null;
    $subCat2 = $_GET['sub_cat_2'] ?? null;

    switch ($nivel) {
        case 'bases':
            $data = $item->obtenerRecetaTipos();
            break;
        case 'categorias':
            $data = $item->obtenerRecetaCategorias($tipo);
            break;
        case 'subcat1':
            $data = $item->obtenerRecetaSubCategorias1($tipo, $categoria);
            break;
        case 'subcat2':
            $data = $item->obtenerRecetaSubCategorias2($tipo, $categoria, $subCat1);
            break;
        default:
            $data = $item->obtenerItemsRecetaFiltrados($tipo, $categoria, $subCat1, $subCat2);
            break;
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}