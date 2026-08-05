<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/receta.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        throw new Exception('Sesión expirada o usuario no autenticado');
    }

    if (!in_array((int)($_SESSION['session_cargo'] ?? 0), [1, 3], true)) {
        throw new Exception('No tienes permisos para actualizar estos datos');
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Metodo no permitido']);
        exit;
    }

    $recetaId = isset($_POST['receta_id']) ? (int)$_POST['receta_id'] : 0;
    $tiempoEntrega = trim((string)($_POST['tiempo_entrega'] ?? ''));
    $condicionesPago = trim((string)($_POST['condiciones_pago'] ?? ''));
    $vendedor = trim((string)($_POST['vendedor'] ?? ''));
    $vendedorCorreo = trim((string)($_POST['vendedor_correo'] ?? ''));
    $vendedorTelefono = preg_replace('/\D+/', '', (string)($_POST['vendedor_telefono'] ?? ''));
    $condicionesEconomicasDias = isset($_POST['condiciones_economicas_dias']) ? (int)$_POST['condiciones_economicas_dias'] : 0;

    if ($recetaId <= 0) {
        throw new Exception('Receta inválida');
    }

    if ($tiempoEntrega === '' || $condicionesPago === '' || $vendedor === '' || $vendedorCorreo === '' || $vendedorTelefono === '' || $condicionesEconomicasDias <= 0) {
        throw new Exception('Completa tiempo de entrega, condiciones de pago, vendedor, email, teléfono y días de suspensión');
    }

    $receta = new Receta();
    $ok = $receta->guardarCondicionesComerciales([
        'receta_id' => $recetaId,
        'tiempo_entrega' => $tiempoEntrega,
        'condiciones_pago' => $condicionesPago,
        'vendedor' => $vendedor,
        'vendedor_correo' => $vendedorCorreo,
        'vendedor_telefono' => $vendedorTelefono,
        'condiciones_economicas_dias' => $condicionesEconomicasDias,
    ]);

    if (!$ok) {
        throw new Exception('No se pudieron guardar los datos comerciales');
    }

    echo json_encode([
        'ok' => true,
        'condiciones' => [
            'tiempo_entrega' => $tiempoEntrega,
            'condiciones_pago' => $condicionesPago,
            'vendedor' => $vendedor,
            'vendedor_correo' => $vendedorCorreo,
            'vendedor_telefono' => $vendedorTelefono,
            'condiciones_economicas_dias' => $condicionesEconomicasDias,
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
