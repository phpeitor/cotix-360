<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        throw new RuntimeException('Sesión expirada o usuario no autenticado');
    }

    $modulo = strtolower(trim((string)($_GET['modulo'] ?? '')));
    if (!in_array($modulo, ['receta', 'ingenieria'], true)) {
        throw new InvalidArgumentException('Módulo no válido');
    }

    $receta = new Receta();
    echo json_encode([
        'success' => true,
        'subcategorias' => $receta->subCategoriasFiltro($modulo)
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
