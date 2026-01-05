<?php

class CotizacionCalc
{
    public static function margenPorGrupo(?string $grupo): float
    {
        if (!$grupo) return 0.32;

        $g = strtolower($grupo);
        if (str_contains($g, '1')) return 0.25;
        if (str_contains($g, '2')) return 0.15;

        return 0.32;
    }

    public static function normalizarPais(?string $pais): string
    {
        return strtoupper(trim($pais)) === 'USA' ? 'USA' : 'CHINA';
    }

    public static function calcularFletePorPais(array $tabla, string $pais, float $peso): float
    {
        $pais = self::normalizarPais($pais);

        $tarifas = array_filter($tabla, fn($r) => $r['pais'] === $pais);

        if (!$tarifas) {
            $tarifas = array_filter($tabla, fn($r) => $r['pais'] === 'CHINA');
        }

        usort($tarifas, fn($a, $b) => $a['peso'] <=> $b['peso']);

        foreach ($tarifas as $row) {
            if ($peso <= (float)$row['peso']) {
                return (float)$row['flete'];
            }
        }

        return (float)end($tarifas)['flete'];
    }

    public static function calcularGasto(array $tabla, float $fob): float
    {
        foreach ($tabla as $row) {
            if ($fob >= $row['valor_inicial'] && $fob <= $row['valor_final']) {
                return (float)$row['costo'];
            }
        }
        return (float)end($tabla)['costo'];
    }
}