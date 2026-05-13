<?php
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Cache-Control: max-age=0');
header('Pragma: public');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../model/receta.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function normalizarTextoExcel($texto): string
{
    if ($texto === null) {
        return '';
    }

    $texto = html_entity_decode(strip_tags((string)$texto), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $texto = trim(preg_replace('/\s+/', ' ', $texto));

    if ($texto === '' || preg_match('/^[\-\–\—\s]+$/u', $texto)) {
        return '';
    }

    return $texto;
}

function formatearRutaExcel(array $partes): string
{
    $limpias = [];

    foreach ($partes as $parte) {
        $texto = normalizarTextoExcel($parte);
        if ($texto !== '' && ($limpias === [] || end($limpias) !== $texto)) {
            $limpias[] = $texto;
        }
    }

    return implode(' / ', $limpias);
}

try {
    $hash = $_GET['id'] ?? null;

    if (!$hash) {
        http_response_code(400);
        exit('ID inválido');
    }

    $recetaModel = new Receta();
    $receta = $recetaModel->obtenerPorHash($hash);
    $detalle = $recetaModel->obtenerDetallePorHash($hash);
    $categorias = $recetaModel->obtenerCategoriasParaEdicion((int)($receta['id'] ?? 0));

    if (!$receta || !$detalle) {
        http_response_code(404);
        exit('Receta no encontrada');
    }

    $tipoCambio = (float)($receta['tipo_cambio'] ?? 1);
    $nombreReceta = trim((string)($receta['nombre'] ?? 'RECETA'));
    $numeroReceta = sprintf('RC-%06d', (int)($receta['id'] ?? 0));

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Receta');

    $sheet->setCellValue('A1', 'REPORTE DE RECETA');
    $sheet->setCellValue('A2', 'Receta: ' . ($nombreReceta !== '' ? mb_strtoupper($nombreReceta, 'UTF-8') : $numeroReceta));
    $sheet->setCellValue('A3', 'ID: ' . $numeroReceta);
    $sheet->setCellValue('A4', 'Usuario: ' . (string)($receta['usuario'] ?? ''));
    $sheet->setCellValue('A5', 'Estado: ' . (string)($receta['estado'] ?? ''));
    $sheet->setCellValue('A6', 'Tipo de cambio: ' . number_format($tipoCambio, 3));

    $headerRow = 9;
    $columns = ['A' => 'Item', 'B' => 'Descripción', 'C' => 'Detalle', 'D' => 'Tipo', 'E' => 'Cant.', 'F' => 'Moneda', 'G' => 'Precio unitario', 'H' => 'Subtotal'];

    foreach ($columns as $col => $title) {
        $sheet->setCellValue($col . $headerRow, $title);
    }

    $sheet->getStyle('A1:H6')->getFont()->setBold(true);
    $sheet->getStyle('A1')->getFont()->setSize(14);

    $headerStyle = $sheet->getStyle('A' . $headerRow . ':H' . $headerRow);
    $headerStyle->getFont()->setBold(true);
    $headerStyle->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFD9E2F3');
    $headerStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $headerStyle->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

    $row = $headerRow + 1;
    $totalItems = 0;
    $totalSoles = 0.0;
    $totalDolares = 0.0;
    $totalProductoPeru = 0.0;
    $totalServicioPeru = 0.0;

    foreach ($detalle as $item) {
        $descripcion = normalizarTextoExcel($item['descripcion'] ?? '');
        $rutaDetalle = formatearRutaExcel([$item['categoria'] ?? '', $item['sub_cat_1'] ?? '', $item['sub_cat_2'] ?? '']);
        $tipo = trim((string)($item['tipo'] ?? ''));
        $cantidad = (int)($item['cantidad'] ?? 0);
        $precio = (float)($item['precio'] ?? 0);
        $moneda = strtoupper(trim((string)($item['moneda'] ?? '')));
        $subtotal = $precio * $cantidad;
        $subtotalPeru = $moneda === 'DOLLAR' ? ($subtotal * $tipoCambio) : $subtotal;

        $totalItems += $cantidad;

        if ($moneda === 'DOLLAR') {
            $totalDolares += $subtotal;
        } else {
            $totalSoles += $subtotal;
        }

        if ($tipo === 'PRODUCTO') {
            $totalProductoPeru += $subtotalPeru;
        } else {
            $totalServicioPeru += $subtotalPeru;
        }

        $sheet->setCellValue('A' . $row, (string)($item['nombre'] ?? 'SIN NOMBRE'));
        $sheet->setCellValue('B' . $row, $descripcion);
        $sheet->setCellValue('C' . $row, $rutaDetalle);
        $sheet->setCellValue('D' . $row, $tipo);
        $sheet->setCellValue('E' . $row, $cantidad);
        $sheet->setCellValue('F' . $row, $moneda === 'DOLLAR' ? '$' : 'S/.');
        $sheet->setCellValue('G' . $row, $precio);
        $sheet->setCellValue('H' . $row, $subtotal);

        $sheet->getStyle('E' . $row . ':H' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $row++;
    }

    $totalPeru = $totalSoles + ($totalDolares * $tipoCambio);

    $totalMargenSoles = 0.0;
    $totalMargenDolares = 0.0;
    $totalMargenPeru = 0.0;

    if (is_array($categorias) && isset($categorias['rows']) && is_array($categorias['rows'])) {
        foreach ($categorias['rows'] as $cat) {
            $subtotalCat = (float)($cat['subtotal'] ?? 0);
            $monedaCat = strtoupper(trim((string)($cat['moneda'] ?? '')));
            $margenPct = (float)($cat['margen'] ?? 0);
            $margenDecimal = $margenPct / 100.0;

            if ($margenDecimal >= 1) {
                $margenDecimal = 0;
            }

            $totalConMargenCat = $margenDecimal > 0 ? ($subtotalCat / (1 - $margenDecimal)) : $subtotalCat;
            $margenMonto = $totalConMargenCat - $subtotalCat;

            if ($monedaCat === 'DOLLAR') {
                $totalMargenDolares += $margenMonto;
                $totalMargenPeru += ($margenMonto * $tipoCambio);
            } else {
                $totalMargenSoles += $margenMonto;
                $totalMargenPeru += $margenMonto;
            }
        }
    }

    $totalMargenPeruConBase = $totalPeru + $totalMargenPeru;
    $igvMargenPeru = $totalMargenPeruConBase * 0.18;
    $totalConIgv = $totalMargenPeruConBase + $igvMargenPeru;

    $totalsStart = $row + 2;
    $sheet->setCellValue('A' . $totalsStart, 'TOTALES');
    $sheet->getStyle('A' . $totalsStart)->getFont()->setBold(true);

    $totals = [
        ['A', 'Total Items', $totalItems],
        ['A', 'Total S/', $totalSoles],
        ['A', 'Total $', $totalDolares],
        ['A', 'Total Perú', $totalPeru],
        ['D', 'Total Producto', $totalProductoPeru],
        ['D', 'Total Servicio', $totalServicioPeru],
        ['D', 'Total Margen S/', $totalMargenSoles],
        ['D', 'Total Margen $', $totalMargenDolares],
        ['D', 'Total Margen Perú', $totalMargenPeruConBase],
        ['D', 'IGV 18%', $igvMargenPeru],
        ['D', 'Total + IGV', $totalConIgv],
    ];

    foreach ($totals as $index => [$col, $label, $value]) {
        $targetRow = $totalsStart + $index;
        $sheet->setCellValue($col . $targetRow, $label);
        $sheet->setCellValue(chr(ord($col) + 1) . $targetRow, $value);
    }

    $sheet->getStyle('A' . $totalsStart . ':H' . ($totalsStart + count($totals) - 1))->getFont()->setBold(true);

    $sheet->getStyle('G' . ($headerRow + 1) . ':H' . ($row - 1))
        ->getNumberFormat()
        ->setFormatCode('#,##0.00');
    $sheet->getStyle('B' . ($headerRow + 1) . ':C' . ($row - 1))->getAlignment()->setWrapText(true);

    $sheet->getStyle('B' . $totalsStart . ':B' . ($totalsStart + 3))->getNumberFormat()->setFormatCode('#,##0.00');
    $sheet->getStyle('E' . $totalsStart . ':E' . ($totalsStart + count($totals) - 1))->getNumberFormat()->setFormatCode('#,##0.00');

    $sheet->getColumnDimension('B')->setWidth(28);
    $sheet->getColumnDimension('C')->setWidth(26);
    foreach (['A', 'D', 'E', 'F', 'G', 'H'] as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    $sheet->freezePane('A' . ($headerRow + 1));

    $filename = 'receta_' . md5((string)($receta['id'] ?? '0')) . '.xlsx';

    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo $e->getMessage();
}
