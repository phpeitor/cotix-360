<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

require_once __DIR__ . '/../model/item.php';
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

try {
    if (!isset($_FILES['fileItems'])) {
        throw new Exception("No se recibió archivo");
    }

    $fileTmp = $_FILES['fileItems']['tmp_name'];
    $fileName = $_FILES['fileItems']['name'];

    $spreadsheet = IOFactory::load($fileTmp);
    $sheet = $spreadsheet->getSheet(0);
    $highestRow = $sheet->getHighestRow();

    $item = new Item();
    $batch = [];
    $insertados = 0;
    $chunkSize = 300;

    // -------------------------------------------
    // 1. Crear registro en tabla "carga"
    // -------------------------------------------
    $idCarga = $item->crearCarga($fileName);
    if (!$idCarga) {
        throw new Exception("No se pudo crear el registro de carga");
    }

    // -------------------------------------------
    // 2. Procesar Excel por chunks
    // -------------------------------------------
    for ($row = 2; $row <= $highestRow; $row++) {

        $data = [
            'modelo'            => $sheet->getCell("A$row")->getValue(),
            'precio_unitario'   => (float) $sheet->getCell("B$row")->getValue(),
            'moneda'            => $sheet->getCell("C$row")->getValue(),
            'grupo_descuento'   => $sheet->getCell("D$row")->getValue(),
            'descripcion'       => $sheet->getCell("E$row")->getValue(),
            'categoria_producto'=> $sheet->getCell("F$row")->getValue(),
            'clase_producto'    => $sheet->getCell("G$row")->getValue(),
            'pais_origen'       => $sheet->getCell("H$row")->getValue(),
            'peso'              => (float) $sheet->getCell("I$row")->getValue(),
            'status'            => $sheet->getCell("J$row")->getValue(),
            'proveedor'         => $sheet->getCell("K$row")->getValue(),
            'origen'            => $sheet->getCell("L$row")->getValue(),
            'id_carga'          => $idCarga
        ];

        if (!$data['modelo']) continue;

        $batch[] = $data;

        if (count($batch) >= $chunkSize) {
            $item->guardarLote($batch);
            $insertados += count($batch);
            $batch = [];
        }
    }

    // -------------------------------------------
    // 3. Insertar último chunk
    // -------------------------------------------
    if (!empty($batch)) {
        $item->guardarLote($batch);
        $insertados += count($batch);
    }

    // -------------------------------------------
    // 4. Actualizar la tabla carga
    // -------------------------------------------
    $errores = ($highestRow - 1) - $insertados;

    $item->actualizarCarga($idCarga, $insertados, $errores);

    echo json_encode([
        'ok' => true,
        'message' => "Cargados $insertados items correctamente",
        'insertados' => $insertados,
        'errores' => $errores,
        'id_carga' => $idCarga
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
