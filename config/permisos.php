<?php
function tieneAcceso(string $archivo): bool
{
    if (!isset($_SESSION['session_cargo'])) {
        return false;
    }

    $rol = (string)$_SESSION['session_cargo'];

    $permisos = json_decode(
        file_get_contents(__DIR__ . '/permisos.json'),
        true
    );

    if (!isset($permisos[$rol])) {
        return false;
    }

    if ($permisos[$rol]['acceso'] === '*') {
        return true;
    }

    return in_array($archivo, $permisos[$rol]['acceso'], true);
}
