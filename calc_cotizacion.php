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

    public static function calcularFlete(array $tabla, float $peso): float
    {
        foreach ($tabla as $row) {
            if ((float)$row['peso'] >= $peso) {
                return (float)$row['flete'];
            }
        }
        return (float)end($tabla)['flete'];
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
