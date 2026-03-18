<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/cotizacion.php';

try {
    if (!isset($_SESSION['session_id']) || (int)$_SESSION['session_id'] <= 0) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Sesion expirada o usuario no autenticado'
        ]);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $cotizacion = new Cotizacion();

    if ($method === 'GET') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            throw new Exception('ID de cotizacion invalido');
        }

        $row = $cotizacion->obtener_financiamiento($id);
        if (!$row) {
            throw new Exception('Cotizacion no encontrada');
        }

        $tasa = $row['tasa'] !== null ? (float)$row['tasa'] : null;
        $cuota = $row['cuota'] !== null ? (float)$row['cuota'] : null;
        $yaGuardado = $tasa !== null || $cuota !== null;

        echo json_encode([
            'success' => true,
            'id' => (int)$row['id'],
            'tasa' => $tasa,
            'cuota' => $cuota,
            'ya_guardado' => $yaGuardado
        ]);
        exit;
    }

    if ($method === 'POST') {
        $id = (int)($_POST['id'] ?? 0);
        $tasa = isset($_POST['tasa']) ? (float)$_POST['tasa'] : null;
        $cuota = isset($_POST['cuota']) ? (float)$_POST['cuota'] : null;

        if ($id <= 0 || $tasa === null || $cuota === null) {
            throw new Exception('Parametros incompletos');
        }

        if ($tasa <= 0 || $cuota <= 0) {
            throw new Exception('Tasa y cuota deben ser mayores a 0');
        }

        $saved = $cotizacion->guardar_financiamiento(
            $id,
            $tasa,
            $cuota,
            (int)$_SESSION['session_id']
        );

        if (!$saved) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'La cotizacion ya tiene tasa y cuota registradas'
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Financiamiento guardado correctamente'
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metodo no permitido'
    ]);

} catch (Throwable $e) {
    if (http_response_code() < 400) {
        http_response_code(400);
    }

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
