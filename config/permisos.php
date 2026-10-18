<?php
function obtenerRolesPermisos(): array
{
    $path = __DIR__ . '/permisos.json';
    if (!is_file($path) || !is_readable($path)) {
        return [];
    }

    $roles = json_decode((string)file_get_contents($path), true);
    return is_array($roles) ? $roles : [];
}

function cargoPermisoExiste(string $cargo): bool
{
    return array_key_exists($cargo, obtenerRolesPermisos());
}

function tieneAcceso(string $archivo): bool
{
    if (!isset($_SESSION['session_cargo'])) {
        return false;
    }

    $rol = (string)$_SESSION['session_cargo'];

    $permisos = obtenerRolesPermisos();

    if (!isset($permisos[$rol])) {
        return false;
    }

    if ($permisos[$rol]['acceso'] === '*') {
        return true;
    }

    return in_array($archivo, $permisos[$rol]['acceso'], true);
}
