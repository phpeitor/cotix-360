<?php
require_once __DIR__ . '/bootstrap.php';

function trackingPrefijo(string $codigo): ?string
{
    if (preg_match('/^MGI-[A-Z]-[0-9]{4}-/', $codigo, $m) === 1) {
        return $m[0];
    }

    return null;
}

function trackingCodigoPublico(string $codTracking, string $codPublico): string
{
    $prefijo = trackingPrefijo($codTracking);

    if ($prefijo !== null) {
        return $prefijo . $codPublico;
    }

    return $codPublico;
}

function trackingResolver(string $codigo): ?string
{
    $codigo = trim($codigo);
    $prefijo = trackingPrefijo($codigo);

    if ($prefijo !== null) {
        $sufijo = substr($codigo, strlen($prefijo));

        if (preg_match('/^\d{10}$/', $sufijo) === 1) {
            return $sufijo;
        }

        return null;
    }

    if (preg_match('/^\d{10}$/', $codigo) === 1) {
        return $codigo;
    }

    return null;
}