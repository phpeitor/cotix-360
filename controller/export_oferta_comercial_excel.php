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
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function textoOfertaExcel($value): string
{
    return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags((string)($value ?? '')), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')));
}

function fechaOfertaExcel($fecha): string
{
    try {
        return (new DateTime((string)$fecha))->format('j/n/Y');
    } catch (Throwable $e) {
        return (new DateTime('now', new DateTimeZone('America/Lima')))->format('j/n/Y');
    }
}

function numeroOfertaExcel(array $receta): string
{
    $year = date('Y');
    if (!empty($receta['created_at'])) {
        try {
            $year = (new DateTime((string)$receta['created_at']))->format('Y');
        } catch (Throwable $e) {
            $year = date('Y');
        }
    }

    return sprintf('%05d-%s', (int)($receta['id'] ?? 0), $year);
}

try {
    $hash = $_GET['id'] ?? null;
    if (!$hash) {
        http_response_code(400);
        exit('ID inválido');
    }

    $recetaModel = new Receta();
    $receta = $recetaModel->obtenerPorHash((string)$hash);
    if (!$receta) {
        http_response_code(404);
        exit('Receta no encontrada');
    }

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('FORMA GENERAL');
    $sheet->setShowGridlines(true);

    foreach (range('A', 'N') as $col) {
        $sheet->getColumnDimension($col)->setWidth(match ($col) {
            'A' => 4.8,
            'B' => 14,
            'C' => 7,
            'D' => 17,
            'E' => 19,
            'F' => 26,
            'G' => 10,
            'H' => 12,
            'I' => 7,
            'J' => 28,
            'K' => 12,
            'L' => 13,
            'M' => 13,
            'N' => 16,
            default => 10,
        });
    }

    for ($row = 1; $row <= 21; $row++) {
        $sheet->getRowDimension($row)->setRowHeight($row === 20 || $row === 21 ? 20 : 18);
    }

    $sheet->getStyle('A1:N21')->getFont()->setName('Courier New')->setSize(10);
    $sheet->getStyle('A1:N21')->getAlignment()
        ->setVertical(Alignment::VERTICAL_CENTER)
        ->setHorizontal(Alignment::HORIZONTAL_LEFT);

    $thinBorder = [
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['argb' => 'FF7F7F7F'],
            ],
        ],
    ];
    $sheet->getStyle('A1:N21')->applyFromArray($thinBorder);
    $sheet->getStyle('A10:N10')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A10:N10')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A11:G18')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('H11:N18')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A19:N19')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A21:N21')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);

    $logoPath = __DIR__ . '/../assets/images/mg-indusol-logo.svg';
    if (is_readable($logoPath)) {
        $drawing = new Drawing();
        $drawing->setName('MG Indusol');
        $drawing->setPath($logoPath);
        $drawing->setCoordinates('A2');
        $drawing->setOffsetX(10);
        $drawing->setOffsetY(10);
        $drawing->setWidth(280);
        $drawing->setWorksheet($sheet);
    }

    $sheet->mergeCells('A2:C8');
    $sheet->mergeCells('D2:H2');
    $sheet->mergeCells('D3:H3');
    $sheet->mergeCells('D4:H4');
    $sheet->mergeCells('D5:H5');
    $sheet->mergeCells('D6:H6');
    $sheet->mergeCells('D7:H7');
    $sheet->mergeCells('D8:H8');
    $sheet->mergeCells('J4:N4');
    $sheet->mergeCells('J5:N5');
    $sheet->mergeCells('K8:N8');
    $sheet->mergeCells('A9:C9');
    $sheet->mergeCells('A20:N20');
    $sheet->mergeCells('A21:N21');

    $sheet->setCellValue('D2', 'MG INDUSTRIAL SOLUTION S.A.C.');
    $sheet->setCellValue('D3', 'MG INDUSOL SAC');
    $sheet->setCellValueExplicit('D4', 'RUC:20548328854', DataType::TYPE_STRING);
    $sheet->setCellValue('D5', 'Calle Brea y Pariñas 102, of 704, Stgo de Surco.');
    $sheet->setCellValue('D6', 'Central Telf. (01)3048091');
    $sheet->setCellValue('D7', 'E-mail: ventas@mgindusol.com /contacto@mgindusol.com');
    $sheet->setCellValue('D8', 'Página Web. www.mgindusol.com');
    $sheet->getStyle('D2:H8')->getFont()->setBold(true);

    $sheet->setCellValue('J4', 'Cotización');
    $sheet->setCellValue('J5', 'N° ' . numeroOfertaExcel($receta));
    $sheet->setCellValue('K9', fechaOfertaExcel($receta['updated_at'] ?? $receta['created_at'] ?? null));
    $sheet->getStyle('J4:N5')->getFont()->setBold(true)->setSize(16);
    $sheet->getStyle('J4:N5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('K9:N9')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $sheet->setCellValue('A9', '(DATOS CLIENTE)');
    $sheet->getStyle('A9')->getFont()->getColor()->setARGB('FFFF0000');
    $sheet->getStyle('A9')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $sheet->setCellValue('A11', 'Cotización realizada para:');
    $sheet->setCellValue('H11', 'Cotización realizada por:');
    $sheet->mergeCells('A11:G11');
    $sheet->mergeCells('H11:N11');
    $sheet->getStyle('A11:N11')->getFont()->setBold(true);
    $sheet->getStyle('A11:G11')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('H11:N11')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);

    $clienteRows = [
        12 => ['Cliente', textoOfertaExcel($receta['cliente_razon_social_empresa'] ?? '')],
        13 => ['Dirección', textoOfertaExcel($receta['cliente_direccion'] ?? '')],
        14 => ['Ruc', textoOfertaExcel($receta['cliente_ruc'] ?? '')],
        15 => ['NOMBRE COMPLETO', textoOfertaExcel($receta['cliente_nombre_completo'] ?? '')],
        16 => ['E-mail', textoOfertaExcel($receta['cliente_correo'] ?? '')],
        17 => ['Teléfonos', textoOfertaExcel($receta['cliente_celular'] ?? '')],
        18 => ['Motivo', textoOfertaExcel($receta['cliente_motivo'] ?? '')],
    ];

    foreach ($clienteRows as $row => [$label, $value]) {
        $sheet->setCellValue('A' . $row, $label);
        $sheet->setCellValue('B' . $row, ':');
        $sheet->setCellValueExplicit('C' . $row, $value, DataType::TYPE_STRING);
        $sheet->mergeCells('C' . $row . ':F' . $row);
    }
    $sheet->getStyle('A12:A18')->getFont()->setBold(true);
    $sheet->getStyle('A15:C15')->getFont()->getColor()->setARGB('FFFF0000');
    $sheet->getStyle('C16')->getFont()->getColor()->setARGB('FF0000FF');
    $sheet->getStyle('C16')->getFont()->setUnderline(Font::UNDERLINE_SINGLE);
    $sheet->getStyle('C12:F18')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

    $vendedor = textoOfertaExcel($receta['cliente_vendedor'] ?? '');
    $vendedorCorreo = textoOfertaExcel($receta['cliente_vendedor_correo'] ?? '');
    $vendedorTelefono = textoOfertaExcel($receta['cliente_vendedor_telefono'] ?? '');

    $comercialRows = [
        12 => ['Empresa', 'MG INDUSTRIAL SOLUTIONS SAC-MG INDUSOL SAC'],
        13 => ['RUC', '20548328854'],
        14 => ['Dirección', 'Calle Brea y Pariñas N°102 , Ofic. 704,Piso 7'],
        15 => ['', 'Santiago de Surco'],
        16 => ['VENDEDOR', $vendedor],
        17 => ['E-mail', $vendedorCorreo],
        18 => ['Teléfonos', '(01) 3048091, Cel. ' . $vendedorTelefono],
    ];

    foreach ($comercialRows as $row => [$label, $value]) {
        $sheet->setCellValue('H' . $row, $label);
        $sheet->setCellValue('I' . $row, $label !== '' ? ':' : '');
        $sheet->setCellValueExplicit('J' . $row, $value, DataType::TYPE_STRING);
        $sheet->mergeCells('J' . $row . ':' . ($row === 16 ? 'K' : 'N') . $row);
    }
    $sheet->mergeCells('L16:N16');
    $sheet->setCellValue('L16', '(DATOS COMERCIALES)');
    $sheet->getStyle('H16:L18')->getFont()->getColor()->setARGB('FFFF0000');
    $sheet->getStyle('J17')->getFont()->getColor()->setARGB('FF0000FF');
    $sheet->getStyle('J17')->getFont()->setUnderline(Font::UNDERLINE_SINGLE);
    $sheet->getStyle('H12:H18')->getFont()->setBold(true);
    $sheet->getStyle('J12:N18')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

    $sheet->setCellValue('A20', 'Estimado/a, en respuesta a su solicitud de cotización sobre los precios de los productos de nuestra compañía. A continuación le brindamos nuestra');
    $sheet->setCellValue('A21', 'oferta:');
    $sheet->getStyle('A20:A21')->getAlignment()->setWrapText(true);

    $sheet->getPageSetup()->setPrintArea('A1:N21');
    $sheet->getPageSetup()->setFitToWidth(1)->setFitToHeight(0);
    $sheet->getPageMargins()->setTop(0.25)->setRight(0.25)->setLeft(0.25)->setBottom(0.25);

    $nombreArchivoBase = textoOfertaExcel($receta['nombre'] ?? 'oferta_comercial');
    $nombreArchivoBase = trim(preg_replace('/[^A-Za-z0-9]+/', '_', $nombreArchivoBase), '_');
    if ($nombreArchivoBase === '') {
        $nombreArchivoBase = 'oferta_comercial';
    }

    header('Content-Disposition: attachment; filename="' . $nombreArchivoBase . '_oferta_comercial.xlsx"');

    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo $e->getMessage();
}
