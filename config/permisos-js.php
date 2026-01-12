<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['session_cargo'])) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

$rol = (string) $_SESSION['session_cargo'];

$permisosJson = json_decode(
    file_get_contents(__DIR__ . '/permisos.json'),
    true
);

if (!isset($permisosJson[$rol])) {
    echo json_encode([]);
    exit;
}

if ($permisosJson[$rol]['acceso'] === '*') {
    echo json_encode(['*']);
    exit;
}

echo json_encode($permisosJson[$rol]['acceso']);
