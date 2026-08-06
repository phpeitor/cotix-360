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

function agruparOfertaExcel(array $detalle): array
{
    $grupos = [];
    foreach ($detalle as $item) {
        $subcat = textoOfertaExcel($item['sub_cat_1'] ?? '');
        if ($subcat === '') {
            $subcat = 'SIN CATEGORÍA';
        }

        if (!isset($grupos[$subcat])) {
            $grupos[$subcat] = [];
        }
        $grupos[$subcat][] = $item;
    }

    return $grupos;
}

try {
    $hash = $_REQUEST['id'] ?? null;
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
    $detalle = $recetaModel->obtenerDetallePorHash((string)$hash);

    $ofertaItemsParam = trim((string)($_REQUEST['oferta_items'] ?? ''));
    $ofertaItemIds = $ofertaItemsParam !== ''
        ? array_filter(array_map('intval', explode(',', $ofertaItemsParam)), fn($id) => $id > 0)
        : [];
    if (!empty($ofertaItemIds)) {
        $idsPermitidos = array_flip($ofertaItemIds);
        $detalle = array_values(array_filter($detalle, function ($item) use ($idsPermitidos) {
            return isset($idsPermitidos[(int)($item['id'] ?? 0)]);
        }));
    }

    $ofertaGroupCols = [];
    $ofertaGroupColsJson = trim((string)($_REQUEST['oferta_group_cols'] ?? ''));
    if ($ofertaGroupColsJson !== '') {
        $decodedGroupCols = json_decode($ofertaGroupColsJson, true);
        if (is_array($decodedGroupCols)) {
            foreach ($decodedGroupCols as $subcat => $cols) {
                if (is_array($cols)) {
                    $ofertaGroupCols[(string)$subcat] = array_values(array_intersect($cols, ['descripcion', 'marca']));
                }
            }
        }
    }
    $detalleAgrupado = agruparOfertaExcel($detalle);

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('GENERAL');
    $sheet->setShowGridlines(true);

    foreach (range('A', 'L') as $col) {
        $sheet->getColumnDimension($col)->setWidth(match ($col) {
            'A' => 12,
            'B' => 3,
            'C' => 10,
            'D' => 8,
            'E' => 22,
            'F' => 26,
            'G' => 8,
            'H' => 12,
            'I' => 3,
            'J' => 25,
            'K' => 13,
            'L' => 15,
            default => 10,
        });
    }

    for ($row = 1; $row <= 21; $row++) {
        $sheet->getRowDimension($row)->setRowHeight($row === 20 || $row === 21 ? 20 : 18);
    }

    $sheet->getStyle('A1:L21')->getFont()->setName('Consolas')->setSize(10);
    $sheet->getStyle('A1:L21')->getAlignment()
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
    $sheet->getStyle('A1:L21')->applyFromArray($thinBorder);
    $sheet->getStyle('A10:L10')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A10:L10')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A11:G18')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('H11:L18')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A19:L19')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('A21:L21')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);

    $logoPath = __DIR__ . '/../assets/images/mg-indusol-logo.png';
    if (is_readable($logoPath)) {
        $drawing = new Drawing();
        $drawing->setName('MG Indusol');
        $drawing->setPath($logoPath);
        $drawing->setCoordinates('A3');
        $drawing->setOffsetX(10);
        $drawing->setOffsetY(6);
        $drawing->setWidth(230);
        $drawing->setWorksheet($sheet);
    }

    $sheet->mergeCells('A2:D8');
    $sheet->mergeCells('E2:H2');
    $sheet->mergeCells('E3:H3');
    $sheet->mergeCells('E4:H4');
    $sheet->mergeCells('E5:H5');
    $sheet->mergeCells('E6:H6');
    $sheet->mergeCells('E7:H7');
    $sheet->mergeCells('E8:H8');
    $sheet->mergeCells('J4:L4');
    $sheet->mergeCells('J5:L5');
    $sheet->mergeCells('J9:L9');
    $sheet->mergeCells('A20:L20');
    $sheet->mergeCells('A21:L21');

    $sheet->setCellValue('E2', 'MG INDUSTRIAL SOLUTION S.A.C.');
    $sheet->setCellValue('E3', 'MG INDUSOL SAC');
    $sheet->setCellValueExplicit('E4', 'RUC:20548328854', DataType::TYPE_STRING);
    $sheet->setCellValue('E5', 'Calle Brea y Pariñas 102, of 704, Stgo de Surco.');
    $sheet->setCellValue('E6', 'Central Telf. (01)3048091');
    $sheet->setCellValue('E7', 'E-mail: ventas@mgindusol.com /contacto@mgindusol.com');
    $sheet->setCellValue('E8', 'Página Web. www.mgindusol.com');
    $sheet->getStyle('E2:H8')->getFont()->setBold(true);

    $sheet->setCellValue('J4', 'Cotización');
    $sheet->setCellValue('J5', 'N° ' . numeroOfertaExcel($receta));
    $sheet->setCellValue('J9', fechaOfertaExcel($receta['updated_at'] ?? $receta['created_at'] ?? null));
    $sheet->getStyle('J4:L5')->getFont()->setBold(true)->setSize(16);
    $sheet->getStyle('J4:L5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('J9:L9')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $sheet->setCellValue('A11', 'Cotización realizada para:');
    $sheet->setCellValue('H11', 'Cotización realizada por:');
    $sheet->mergeCells('A11:G11');
    $sheet->mergeCells('H11:L11');
    $sheet->getStyle('A11:L11')->getFont()->setBold(true);
    $sheet->getStyle('A11:G11')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);
    $sheet->getStyle('H11:L11')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);

    $clienteRows = [
        12 => ['Cliente', textoOfertaExcel($receta['cliente_razon_social_empresa'] ?? '')],
        13 => ['Dirección', textoOfertaExcel($receta['cliente_direccion'] ?? '')],
        14 => ['Ruc', textoOfertaExcel($receta['cliente_ruc'] ?? '')],
        15 => ['Nombre', textoOfertaExcel($receta['cliente_nombre_completo'] ?? '')],
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
        16 => ['Vendedor', $vendedor],
        17 => ['E-mail', $vendedorCorreo],
        18 => ['Teléfonos', '(01) 3048091, Cel. ' . $vendedorTelefono],
    ];

    foreach ($comercialRows as $row => [$label, $value]) {
        $sheet->setCellValue('H' . $row, $label);
        $sheet->setCellValue('I' . $row, $label !== '' ? ':' : '');
        $sheet->setCellValueExplicit('J' . $row, $value, DataType::TYPE_STRING);
        $sheet->mergeCells('J' . $row . ':L' . $row);
    }
    $sheet->getStyle('J17')->getFont()->getColor()->setARGB('FF0000FF');
    $sheet->getStyle('J17')->getFont()->setUnderline(Font::UNDERLINE_SINGLE);
    $sheet->getStyle('H12:H18')->getFont()->setBold(true);
    $sheet->getStyle('J12:L18')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

    $sheet->setCellValue('A20', 'Estimado/a, en respuesta a su solicitud de cotización sobre los precios de los productos de nuestra compañía. A continuación le brindamos nuestra oferta:');
    $sheet->getStyle('A20:A21')->getAlignment()->setWrapText(true);

    $tableHeaderRow = 23;
    $sheet->getRowDimension(22)->setRowHeight(12);
    $sheet->getRowDimension($tableHeaderRow)->setRowHeight(18);
    $sheet->mergeCells('C' . $tableHeaderRow . ':F' . $tableHeaderRow);
    $sheet->mergeCells('H' . $tableHeaderRow . ':I' . $tableHeaderRow);
    $sheet->mergeCells('K' . $tableHeaderRow . ':L' . $tableHeaderRow);
    $sheet->setCellValue('C' . $tableHeaderRow, 'DESCRIPCION');
    $sheet->setCellValue('G' . $tableHeaderRow, 'MARCA');
    $sheet->setCellValue('H' . $tableHeaderRow, 'TIEMPO DE ENTREGA');
    $sheet->setCellValue('J' . $tableHeaderRow, 'CANT.');
    $sheet->setCellValue('K' . $tableHeaderRow, 'VALOR TOTAL');
    $sheet->getStyle('A' . $tableHeaderRow . ':L' . $tableHeaderRow)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF92D050');
    $sheet->getStyle('A' . $tableHeaderRow . ':L' . $tableHeaderRow)->getFont()->setBold(true);
    $sheet->getStyle('A' . $tableHeaderRow . ':L' . $tableHeaderRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $row = $tableHeaderRow + 1;
    $itemNumber = 1;
    $tiempoEntregaDias = (int)preg_replace('/\D+/', '', (string)($receta['cliente_tiempo_entrega'] ?? ''));
    $tiempoEntregaTexto = $tiempoEntregaDias > 0 ? $tiempoEntregaDias . ' días' : 'TIEMPO DE ENTREGA';

    foreach ($detalleAgrupado as $subcat => $itemsGrupo) {
        $sheet->mergeCells('A' . $row . ':L' . $row);
        $sheet->setCellValue('A' . $row, mb_strtoupper($subcat, 'UTF-8'));
        $sheet->getStyle('A' . $row . ':L' . $row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF00');
        $sheet->getStyle('A' . $row)->getFont()->setBold(true);
        $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $row++;

        foreach ($itemsGrupo as $item) {
            $nombre = textoOfertaExcel($item['nombre'] ?? 'SIN NOMBRE');
            $descripcion = textoOfertaExcel($item['descripcion'] ?? '');
            $marca = textoOfertaExcel($item['marca'] ?? '');
            $cantidad = (int)($item['cantidad'] ?? 0);
            $descripcionCelda = $nombre;
            $colsGrupo = $ofertaGroupCols[$subcat] ?? ['descripcion', 'marca'];
            $mostrarDescripcion = in_array('descripcion', $colsGrupo, true);
            $mostrarMarca = in_array('marca', $colsGrupo, true);

            if ($mostrarDescripcion && $descripcion !== '') {
                $descripcionCelda .= "\n" . $descripcion;
            }

            $sheet->mergeCells('C' . $row . ':F' . $row);
            $sheet->mergeCells('H' . $row . ':I' . $row);
            $sheet->mergeCells('K' . $row . ':L' . $row);
            $sheet->setCellValue('A' . $row, str_pad((string)$itemNumber, 2, '0', STR_PAD_LEFT));
            $sheet->setCellValue('C' . $row, $descripcionCelda);
            $sheet->setCellValue('G' . $row, $mostrarMarca ? $marca : '');
            $sheet->setCellValue('H' . $row, $tiempoEntregaTexto);
            $sheet->setCellValue('J' . $row, $cantidad);
            $sheet->setCellValue('K' . $row, 'TOTAL RECETA +MARGEN');
            $sheet->getRowDimension($row)->setRowHeight(96);
            $sheet->getStyle('A' . $row . ':L' . $row)->getAlignment()
                ->setVertical(Alignment::VERTICAL_CENTER)
                ->setWrapText(true);
            $sheet->getStyle('A' . $row . ':B' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('G' . $row . ':L' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $itemNumber++;
            $row++;
        }
    }

    $tableEndRow = max($row - 1, $tableHeaderRow);
    $sheet->getStyle('A' . $tableHeaderRow . ':L' . $tableEndRow)->applyFromArray($thinBorder);
    $sheet->getStyle('A' . $tableHeaderRow . ':L' . $tableEndRow)->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);

    $sheet->getPageSetup()->setPrintArea('A1:L' . $tableEndRow);
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
