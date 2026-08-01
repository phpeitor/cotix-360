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
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
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

function formatearFechaExcel($fecha): string
{
    if (empty($fecha)) {
        return '';
    }

    try {
        return (new DateTime((string)$fecha))->format('Y-m-d H:i');
    } catch (Throwable $e) {
        return (string)$fecha;
    }
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
    $estadoReceta = (string)($receta['estado'] ?? '');
    $fechaCreacion = formatearFechaExcel($receta['created_at'] ?? null);
    $fechaAprobacion = strcasecmp($estadoReceta, 'Aprobada') === 0
        ? formatearFechaExcel($receta['updated_at'] ?? null)
        : '';

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Receta');

    $sheet->setCellValue('A1', 'REPORTE DE RECETA');
    $sheet->setCellValue('A2', 'Receta: ' . ($nombreReceta !== '' ? mb_strtoupper($nombreReceta, 'UTF-8') : $numeroReceta));
    $sheet->setCellValue('A3', 'ID: ' . $numeroReceta);
    $sheet->setCellValue('A4', 'Usuario: ' . (string)($receta['usuario'] ?? ''));
    $sheet->setCellValue('A5', 'Estado: ' . $estadoReceta);
    $sheet->setCellValue('A6', 'Tipo de cambio: ' . number_format($tipoCambio, 3));
    $sheet->setCellValue('A7', 'Usuario aprueba: ' . (string)($receta['usu_upd'] ?? ''));
    $sheet->setCellValue('A8', 'Fecha creación: ' . ($fechaCreacion !== '' ? $fechaCreacion : 'N/D'));
    $sheet->setCellValue('A9', 'Fecha aprobación: ' . ($fechaAprobacion !== '' ? $fechaAprobacion : 'N/D'));

    $headerRow = 11;
    $columns = ['A' => 'Item', 'B' => 'Marca / Modelo / UM', 'C' => 'Descripción', 'D' => 'Detalle', 'E' => 'Tipo', 'F' => 'Cant.', 'G' => 'Precio unitario $', 'H' => 'Subtotal $'];

    foreach ($columns as $col => $title) {
        $sheet->setCellValue($col . $headerRow, $title);
    }

    $sheet->getStyle('A1:H9')->getFont()->setBold(true);
    $sheet->getStyle('A1')->getFont()->setSize(14);

    $headerStyle = $sheet->getStyle('A' . $headerRow . ':H' . $headerRow);
    $headerStyle->getFont()->setBold(true);
    $headerStyle->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFD9E2F3');
    $headerStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $headerStyle->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

    $row = $headerRow + 1;
    $totalItems = 0;
    $totalDolaresConvertidos = 0.0;
    $totalProductoDolares = 0.0;
    $totalServicioDolares = 0.0;

    foreach ($detalle as $item) {
        $descripcion = normalizarTextoExcel($item['descripcion'] ?? '');
        $rutaDetalle = formatearRutaExcel([$item['categoria'] ?? '', $item['sub_cat_1'] ?? '', $item['sub_cat_2'] ?? '']);
        $marcaModeloUnidad = formatearRutaExcel([$item['marca'] ?? '', $item['modelo'] ?? '', $item['uni_medida'] ?? '']);
        $tipo = trim((string)($item['tipo'] ?? ''));
        $cantidad = (int)($item['cantidad'] ?? 0);
        $precio = (float)($item['precio'] ?? 0);
        $moneda = strtoupper(trim((string)($item['moneda'] ?? '')));
        $precioDolar = $moneda === 'DOLLAR' ? $precio : ($tipoCambio > 0 ? ($precio / $tipoCambio) : 0);
        $subtotalDolar = $precioDolar * $cantidad;

        $totalItems += $cantidad;

        $totalDolaresConvertidos += $subtotalDolar;

        if ($tipo === 'PRODUCTO') {
            $totalProductoDolares += $subtotalDolar;
        } else {
            $totalServicioDolares += $subtotalDolar;
        }

        $sheet->setCellValue('A' . $row, (string)($item['nombre'] ?? 'SIN NOMBRE'));
        $sheet->setCellValue('B' . $row, $marcaModeloUnidad);
        $sheet->setCellValue('C' . $row, $descripcion);
        $sheet->setCellValue('D' . $row, $rutaDetalle);
        $sheet->setCellValue('E' . $row, $tipo);
        $sheet->setCellValue('F' . $row, $cantidad);
        $sheet->setCellValue('G' . $row, $precioDolar);
        $sheet->setCellValue('H' . $row, $subtotalDolar);

        $sheet->getStyle('F' . $row . ':H' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $row++;
    }

    $totalMargenDolaresAll = 0.0;
    $margenesCategoriaRows = [];

    if (is_array($categorias) && isset($categorias['rows']) && is_array($categorias['rows'])) {
        foreach ($categorias['rows'] as $cat) {
            $categoriaNombre = normalizarTextoExcel($cat['sub_cat_1'] ?? ($cat['categoria'] ?? 'SIN CATEGORÍA'));
            $cantidadCat = (float)($cat['cantidad'] ?? 0);
            $subtotalCat = (float)($cat['subtotal'] ?? 0);
            $monedaCat = strtoupper(trim((string)($cat['moneda'] ?? '')));
            $margenPct = (float)($cat['margen'] ?? 0);
            $margenDecimal = $margenPct / 100.0;

            if ($margenDecimal >= 1) {
                $margenDecimal = 0;
            }

            $totalConMargenCat = $margenDecimal > 0 ? ($subtotalCat / (1 - $margenDecimal)) : $subtotalCat;
            $margenMonto = $totalConMargenCat - $subtotalCat;

            $subtotalCatDolar = $monedaCat === 'DOLLAR' ? $subtotalCat : ($tipoCambio > 0 ? ($subtotalCat / $tipoCambio) : 0);
            $margenMontoDolar = $monedaCat === 'DOLLAR' ? $margenMonto : ($tipoCambio > 0 ? ($margenMonto / $tipoCambio) : 0);

            $margenesCategoriaRows[] = [
                'categoria' => $categoriaNombre !== '' ? $categoriaNombre : 'SIN CATEGORÍA',
                'cantidad' => $cantidadCat,
                'subtotal_dolar' => $subtotalCatDolar,
                'margen_pct' => $margenPct,
                'total_margen_dolar' => $margenMontoDolar,
            ];

            if ($monedaCat === 'DOLLAR') {
                $totalMargenDolaresAll += $margenMonto;
            } else {
                $totalMargenDolaresAll += ($tipoCambio > 0 ? ($margenMonto / $tipoCambio) : 0);
            }
        }
    }

    $baseTotalDolares = $totalDolaresConvertidos + $totalMargenDolaresAll;
    $igvOverTotal = $baseTotalDolares * 0.18;
    $totalConIgvDolares = $baseTotalDolares + $igvOverTotal;

    $margenesStart = $row + 2;
    $sheet->setCellValue('A' . $margenesStart, 'MÁRGENES POR CATEGORÍA');
    $sheet->getStyle('A' . $margenesStart)->getFont()->setBold(true);

    $margenesHeaderRow = $margenesStart + 1;
    $margenesColumns = [
        'A' => 'Categoría',
        'B' => 'Cantidad',
        'C' => 'Subtotal $',
        'D' => 'Margen %',
        'E' => 'Margen $',
    ];

    foreach ($margenesColumns as $col => $title) {
        $sheet->setCellValue($col . $margenesHeaderRow, $title);
    }

    $margenesHeaderStyle = $sheet->getStyle('A' . $margenesHeaderRow . ':E' . $margenesHeaderRow);
    $margenesHeaderStyle->getFont()->setBold(true);
    $margenesHeaderStyle->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFDE9D9');
    $margenesHeaderStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $margenesHeaderStyle->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

    $margenesDataStart = $margenesHeaderRow + 1;
    if (!empty($margenesCategoriaRows)) {
        $margenesRow = $margenesDataStart;
        foreach ($margenesCategoriaRows as $margenRow) {
            $sheet->setCellValue('A' . $margenesRow, $margenRow['categoria']);
            $sheet->setCellValue('B' . $margenesRow, $margenRow['cantidad']);
            $sheet->setCellValue('C' . $margenesRow, $margenRow['subtotal_dolar']);
            $sheet->setCellValue('D' . $margenesRow, $margenRow['margen_pct']);
            $sheet->setCellValue('E' . $margenesRow, $margenRow['total_margen_dolar']);
            $margenesRow++;
        }
        $margenesEndRow = $margenesRow - 1;
    } else {
        $sheet->setCellValue('A' . $margenesDataStart, 'Sin categorías para mostrar');
        $sheet->mergeCells('A' . $margenesDataStart . ':E' . $margenesDataStart);
        $sheet->getStyle('A' . $margenesDataStart)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $margenesEndRow = $margenesDataStart;
    }

    $sheet->getStyle('A' . $margenesDataStart . ':E' . $margenesEndRow)
        ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
    $sheet->getStyle('B' . $margenesDataStart . ':E' . $margenesEndRow)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
    $sheet->getStyle('B' . $margenesDataStart . ':B' . $margenesEndRow)
        ->getNumberFormat()->setFormatCode('#,##0.00');
    $sheet->getStyle('C' . $margenesDataStart . ':C' . $margenesEndRow)
        ->getNumberFormat()->setFormatCode('#,##0.00');
    $sheet->getStyle('D' . $margenesDataStart . ':D' . $margenesEndRow)
        ->getNumberFormat()->setFormatCode('0.00');
    $sheet->getStyle('E' . $margenesDataStart . ':E' . $margenesEndRow)
        ->getNumberFormat()->setFormatCode('#,##0.00');

    $totalsStart = $margenesEndRow + 2;
    $sheet->setCellValue('A' . $totalsStart, 'TOTALES');
    $sheet->getStyle('A' . $totalsStart)->getFont()->setBold(true);

    $totals = [
        ['A', 'Total Items', $totalItems],
        ['A', 'SubTotal Producto $', $totalProductoDolares],
        ['A', 'SubTotal Servicio $', $totalServicioDolares],
        ['D', 'Total $', $totalDolaresConvertidos],
        ['D', 'Margen $', $totalMargenDolaresAll],
        ['D', 'IGV 18%', $igvOverTotal],
        ['D', 'Total + IGV', $totalConIgvDolares],
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
    $sheet->getStyle('B' . ($headerRow + 1) . ':D' . ($row - 1))->getAlignment()->setWrapText(true);

    $sheet->getStyle('B' . ($totalsStart + 1) . ':B' . ($totalsStart + 2))->getNumberFormat()->setFormatCode('#,##0.00');
    $sheet->getStyle('E' . $totalsStart . ':E' . ($totalsStart + count($totals) - 1))->getNumberFormat()->setFormatCode('#,##0.00');

    $sheet->getColumnDimension('B')->setWidth(33);
    $sheet->getColumnDimension('C')->setWidth(33);
    $sheet->getColumnDimension('D')->setWidth(26);
    foreach (['A', 'E', 'F', 'G', 'H'] as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    $sheet->freezePane('A' . ($headerRow + 1));

    $nombreArchivoBase = normalizarTextoExcel($receta['nombre'] ?? '');
    if ($nombreArchivoBase === '') {
        $nombreArchivoBase = 'receta_' . (string)($receta['id'] ?? '0');
    }
    $nombreArchivoBase = preg_replace('/[^A-Za-z0-9]+/', '_', $nombreArchivoBase);
    $nombreArchivoBase = trim((string)$nombreArchivoBase, '_');
    if ($nombreArchivoBase === '') {
        $nombreArchivoBase = 'receta';
    }

    $filename = $nombreArchivoBase . '.xlsx';

    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo $e->getMessage();
}
