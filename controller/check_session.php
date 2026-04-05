<?php
session_start();
require_once __DIR__ . '/../config/permisos.php';

$max_inactive = 90 * 60;

if (!isset($_SESSION['session_usuario'])) {
    header('Location: ./index.php');
    exit;
}

if (isset($_SESSION['session_time'])) {
    $inactive = time() - $_SESSION['session_time'];

    if ($inactive > $max_inactive) {
        session_unset();
        session_destroy();
        header('Location: ./index.php');
        exit;
    } else {
        $_SESSION['session_time'] = time();
    }
}

$archivoActual = basename($_SERVER['SCRIPT_NAME'] ?? '');

if ($archivoActual !== '' && !tieneAcceso($archivoActual)) {
    if ($archivoActual === 'home.php') {
        header('Location: ./index.php');
        exit;
    }

    header('Location: ./home.php');
    exit('Acceso denegado');
}
