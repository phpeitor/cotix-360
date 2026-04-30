<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

try {
    session_start();

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

    $recetaId = isset($_POST['receta_id']) ? (int)$_POST['receta_id'] : 0;
    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    if (!isset($_POST['items'])) {
        throw new Exception('No se enviaron categorías');
    }

    $items = json_decode((string)$_POST['items'], true);
    if (!is_array($items) || empty($items)) {
        throw new Exception('Categorías inválidas');
    }

    $receta = new Receta();
    $receta->begin();

    $receta->eliminarCategoriasReceta($recetaId);

    $guardados = 0;
    foreach ($items as $item) {
        $subCat1 = trim((string)($item['sub_cat_1'] ?? ''));
        if ($subCat1 === '') {
            continue;
        }

        $ok = $receta->guardarCategoriaReceta([
            'receta_id' => $recetaId,
            'sub_cat_1' => $subCat1,
            'subtotal' => (float)($item['subtotal'] ?? 0),
            'cantidad' => (float)($item['cantidad'] ?? 0),
            'margen' => (float)($item['margen'] ?? 0),
            'moneda' => (string)($item['moneda'] ?? ''),
        ]);

        if (!$ok) {
            throw new Exception('No se pudo guardar la categoría: ' . $subCat1);
        }

        $guardados++;
    }

    $receta->commit();

    echo json_encode([
        'ok' => true,
        'guardados' => $guardados,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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