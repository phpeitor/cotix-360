<?php
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Cache-Control: max-age=0');
header('Pragma: public');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../model/item.php';

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

function normalizarTextoExcelItems($texto): string
{
    if ($texto === null) {
        return '';
    }

    $texto = html_entity_decode(strip_tags((string)$texto), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $texto = trim(preg_replace('/\s+/', ' ', $texto));

    return $texto;
}

try {
    $itemModel = new Item();
    $rows = $itemModel->obtenerTodosRecetaItems();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Items Receta');

    $sheet->setCellValue('A1', 'REPORTE DE ITEMS RECETA');
    $sheet->setCellValue('A2', 'Total registros: ' . count($rows));

    $headerRow = 4;
    $columns = [
        'A' => 'ID',
        'B' => 'Nombre',
        'C' => 'Descripción',
        'D' => 'Categoría',
        'E' => 'Sub Cat 1',
        'F' => 'Sub Cat 2',
        'G' => 'Marca',
        'H' => 'Modelo',
        'I' => 'Uni. Medida',
        'J' => 'Tipo',
        'K' => 'Precio',
        'L' => 'Moneda',
        'M' => 'Estado'
    ];

    foreach ($columns as $col => $title) {
        $sheet->setCellValue($col . $headerRow, $title);
    }

    $sheet->getStyle('A1:M2')->getFont()->setBold(true);
    $sheet->getStyle('A1')->getFont()->setSize(14);

    $headerStyle = $sheet->getStyle('A' . $headerRow . ':M' . $headerRow);
    $headerStyle->getFont()->setBold(true);
    $headerStyle->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFD9E2F3');
    $headerStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $headerStyle->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

    $row = $headerRow + 1;
    foreach ($rows as $item) {
        $sheet->setCellValue('A' . $row, (int)($item['id'] ?? 0));
        $sheet->setCellValue('B' . $row, normalizarTextoExcelItems($item['nombre'] ?? ''));
        $sheet->setCellValue('C' . $row, normalizarTextoExcelItems($item['descripcion'] ?? ''));
        $sheet->setCellValue('D' . $row, normalizarTextoExcelItems($item['categoria'] ?? ''));
        $sheet->setCellValue('E' . $row, normalizarTextoExcelItems($item['sub_cat_1'] ?? ''));
        $sheet->setCellValue('F' . $row, normalizarTextoExcelItems($item['sub_cat_2'] ?? ''));
        $sheet->setCellValue('G' . $row, normalizarTextoExcelItems($item['marca'] ?? ''));
        $sheet->setCellValue('H' . $row, normalizarTextoExcelItems($item['modelo'] ?? ''));
        $sheet->setCellValue('I' . $row, normalizarTextoExcelItems($item['uni_medida'] ?? ''));
        $sheet->setCellValue('J' . $row, normalizarTextoExcelItems($item['tipo'] ?? ''));
        $sheet->setCellValue('K' . $row, (float)($item['precio'] ?? 0));
        $sheet->setCellValue('L' . $row, normalizarTextoExcelItems($item['moneda'] ?? ''));
        $sheet->setCellValue('M' . $row, (string)($item['estado'] ?? ''));
        $row++;
    }

    $endRow = max($headerRow + 1, $row - 1);
    $sheet->getStyle('A' . ($headerRow + 1) . ':M' . $endRow)
        ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

    $sheet->getStyle('K' . ($headerRow + 1) . ':K' . $endRow)
        ->getNumberFormat()->setFormatCode('#,##0.00');

    $sheet->getStyle('A' . ($headerRow + 1) . ':M' . $endRow)
        ->getAlignment()->setVertical(Alignment::VERTICAL_TOP);

    $sheet->getColumnDimension('A')->setWidth(5);
    $sheet->getColumnDimension('B')->setWidth(24);
    $sheet->getColumnDimension('C')->setWidth(28);

    foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    $sheet->freezePane('A' . ($headerRow + 1));

    $filename = 'items_receta_' . date('Ymd_His') . '.xlsx';
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo $e->getMessage();
}
