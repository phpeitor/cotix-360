<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__ . '/../model/usuario.php';
require_once __DIR__ . '/../config/bootstrap.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido.');
    }

    $usuario = trim($_POST['usuario'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($usuario === '' || $password === '') {
        throw new Exception('Debe ingresar usuario y password.');
    }

    // Inicializar estructura de intentos en la sesión
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = [];
    }

    $now = time();
    if (!isset($_SESSION['login_attempts'][$usuario])) {
        $_SESSION['login_attempts'][$usuario] = ['count' => 0];
    }

    $userAttempts = &$_SESSION['login_attempts'][$usuario];

    // Verificar si el usuario está temporalmente bloqueado
    if (!empty($userAttempts['blocked_until']) && $now < (int)$userAttempts['blocked_until']) {
        $remain = (int)$userAttempts['blocked_until'] - $now;
        $minutes = ceil($remain / 60);
        echo json_encode([
            'ok' => false,
            'message' => "🚫 Bloqueado por intentos fallidos. Intente nuevamente en {$minutes} minuto(s).",
            'blocked_seconds' => $remain
        ]);
        exit;
    }

    $password = md5($password);
    $obj = new Usuario();
    $data = $obj->acceso_user([
        'usuario' => $usuario,
        'password' => $password
    ]);

    if ($data) {
        if ((int)($data['IDESTADO'] ?? 0) !== 1) {
            echo json_encode([
                'ok' => false,
                'message' => 'Usuario desactivado contactar con el administrador del sistema 📵🙅‍♂️'
            ]);
            exit;
        }

        // Login exitoso: limpiar contador de intentos
        if (isset($_SESSION['login_attempts'][$usuario])) {
            unset($_SESSION['login_attempts'][$usuario]);
        }

        $_SESSION['session_usuario'] = $data['USUARIO'];
        $_SESSION['session_id'] = $data['IDPERSONAL'];
        $_SESSION['session_nombre'] = $data['NOMBRES'];
        $_SESSION['session_cargo'] = $data['CARGO'];
        $_SESSION['session_time'] = time(); 

        $ip = $_SERVER['REMOTE_ADDR'] ?? null;

        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        }

        if (!$ip) {
            $apiUrl = $_ENV['IP_API_URL'];

            $ch = curl_init();

            curl_setopt_array($ch, [
                CURLOPT_URL => $apiUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_CONNECTTIMEOUT => 3
            ]);

            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                $ip = '0.0.0.0';
            } else {
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $ip = $httpCode === 200 ? trim($response) : '0.0.0.0';
            }

            curl_close($ch);
        }

        $obj->guardar_session([
            'tipo' => 'IN',
            'id_user' => $data['IDPERSONAL'],
            'ip' => $ip
        ]);
        
        echo json_encode(['ok' => true]);
    } else {
        // Intento fallido: incrementar contador y bloquear si alcanza 3 intentos
        $userAttempts['count'] = (int)($userAttempts['count'] ?? 0) + 1;
        $userAttempts['last'] = $now;

        if ($userAttempts['count'] >= 3) {
            // bloquear 5 minutos
            $userAttempts['blocked_until'] = $now + 300; // 300s = 5min
            $userAttempts['count'] = 0; // resetear contador tras bloqueo
            echo json_encode([
                'ok' => false,
                'message' => '🚫 Usuario o password incorrectos. Se han agotado los intentos. Bloqueado 5 minutos.',
                'blocked_seconds' => 300
            ]);
        } else {
            $left = 3 - $userAttempts['count'];
            echo json_encode(['ok' => false, 'message' => '🚫 Usuario o password incorrectos. Intentos restantes: ' . $left]);
        }
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
