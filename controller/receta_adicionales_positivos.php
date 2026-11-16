<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/compras/compras.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        http_response_code(401);
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }

    $compras = new Compras();
    $recetaId = (int)($_GET['receta_id'] ?? 0);
    if ($recetaId > 0) {
        echo json_encode([
            'ok' => true,
            'adicionales' => $compras->adicionalesPositivosPorReceta($recetaId),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'recetas' => $compras->recetasConAdicionalesPositivos(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
