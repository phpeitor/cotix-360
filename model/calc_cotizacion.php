<?php

class CotizacionCalc
{
    public static function margenPorGrupo(?string $grupo): float
    {
        if (!$grupo) return 0.32;
        
        $g = strtolower($grupo);
        if (str_contains($g, '0')) return 0;
        if (str_contains($g, '1')) return 0.15;
        if (str_contains($g, '2')) return 0.25;
        if (str_contains($g, '3')) return 0.28;
        if (str_contains($g, '4')) return 0.30;
        if (str_contains($g, '5')) return 0.31;
        if (str_contains($g, '6')) return 0.33;
        if (str_contains($g, '7')) return 0.35;
        if (str_contains($g, '8')) return 0.36;
        if (str_contains($g, '9')) return 0.40;
        if (str_contains($g, '10')) return 0.45;
        if (str_contains($g, '11')) return 0.50;
        if (str_contains($g, '12')) return 0.55;
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