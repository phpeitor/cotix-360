<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

require_once __DIR__ . '/../model/item.php';
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

try {
    if (!isset($_FILES['fileItems'])) {
        throw new Exception("No se adjunta archivo");
    }

    if ((int)($_FILES['fileItems']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new Exception("La carga del archivo falló. Vuelve a seleccionarlo e inténtalo nuevamente.");
    }

    $fileTmp = $_FILES['fileItems']['tmp_name'];
    $fileName = $_FILES['fileItems']['name'];
    if (!preg_match('/\.(xls|xlsx)$/i', (string)$fileName)) {
        throw new Exception("El archivo debe tener formato .xls o .xlsx");
    }

    $spreadsheet = IOFactory::load($fileTmp);
    $sheet = $spreadsheet->getSheet(0);
    $highestRow = $sheet->getHighestRow();

    // ===============================
    // 🔒 VALIDAR CABECERAS DEL EXCEL
    // ===============================
    $highestColumn = $sheet->getHighestColumn();
    $headerRow = $sheet->rangeToArray("A1:{$highestColumn}1", null, true, false)[0];

    $headerRow = array_map(fn($h) => trim(mb_strtoupper($h)), $headerRow);

    $columnasEsperadas = array_map(fn($h) => trim(mb_strtoupper($h)), [
        "MODELO",
        "PRECIO UNITARIO",
        "MONEDA",
        "GRUPO DE DESCUENTO",
        "DESCRIPCION",
        "CATEGORIA DE PRODUCTO",
        "CLASE DE PRODUCTO",
        "PAIS DE ORIGEN",
        "PESO EN KG",
        "STATUS",
        "PROVEEDOR",
        "ORIGEN"
    ]);

    if (count($headerRow) !== count($columnasEsperadas)) {
        throw new Exception(
            "El archivo Excel no tiene la cantidad correcta de columnas. " .
            "Se esperaban " . count($columnasEsperadas)
        );
    }

    $diff = array_diff_assoc($columnasEsperadas, $headerRow);

    if (!empty($diff)) {
        throw new Exception(
            "Las columnas del Excel no coinciden con el formato requerido. " .
            "Verifique nombres y orden de las columnas."
        );
    }
    //fin validación cabeceras
    // ==========================

    $item = new Item();
    $textCell = static function ($value): string {
        if ($value === null) return '';
        if (is_object($value) && method_exists($value, 'getPlainText')) {
            $value = $value->getPlainText();
        }
        return trim((string)$value);
    };
    $parseNumber = static function ($value) use ($textCell): ?float {
        if (is_int($value) || is_float($value)) return (float)$value;
        $raw = str_replace(["\u{00A0}", ' '], '', $textCell($value));
        if ($raw === '') return null;
        if (str_contains($raw, ',') && str_contains($raw, '.')) {
            $raw = strrpos($raw, ',') > strrpos($raw, '.')
                ? str_replace(',', '.', str_replace('.', '', $raw))
                : str_replace(',', '', $raw);
        } else {
            $raw = str_replace(',', '.', $raw);
        }
        return is_numeric($raw) ? (float)$raw : null;
    };
    $normalizeCurrency = static function (string $value): ?string {
        $value = mb_strtoupper(trim($value), 'UTF-8');
        if (in_array($value, ['DOLLAR', 'USD', 'US$', '$', 'DÓLAR', 'DOLARES', 'DÓLARES'], true)) return 'DOLLAR';
        if (in_array($value, ['SOL', 'SOLES', 'PEN', 'S/', 'S/.', 'S/ .'], true)) return 'SOL';
        return null;
    };
    $normalizeGroup = static function (string $value): ?string {
        $value = trim($value);
        if (mb_strtolower($value, 'UTF-8') === 'default') return 'Default';
        if (preg_match('/^(?:GROUP|GRUPO)\s*(\d{1,2})$/i', $value, $match)) {
            $number = (int)$match[1];
            if ($number >= 0 && $number <= 15) return 'Group ' . $number;
        }
        return null;
    };
    $normalizeStatus = static function (string $value): ?string {
        $value = mb_strtolower(trim($value), 'UTF-8');
        if (in_array($value, ['1', 'active', 'activo', 'activa', 'yes', 'si', 'sí'], true)) return 'Active';
        if (in_array($value, ['0', 'inactive', 'inactivo', 'inactiva', 'no'], true)) return 'Inactive';
        return null;
    };

    $tieneFilas = false;
    for ($row = 2; $row <= $highestRow; $row++) {
        $cells = $sheet->rangeToArray("A$row:L$row", null, true, false)[0] ?? [];
        if (count(array_filter($cells, static fn($value) => $textCell($value) !== '')) > 0) {
            $tieneFilas = true;
            break;
        }
    }
    if (!$tieneFilas) throw new Exception('La hoja no contiene filas de items para importar');

    $batch = [];
    $batchMeta = [];
    $erroresDetalle = [];
    $insertados = 0;
    $chunkSize = 300;
    $idCarga = $item->crearCarga($fileName);
    if (!$idCarga) throw new Exception('No se pudo crear el registro de carga');

    $flushBatch = static function () use (&$batch, &$batchMeta, &$erroresDetalle, &$insertados, $item): void {
        if (!$batch) return;
        try {
            $insertados += $item->guardarLote($batch);
        } catch (Throwable $bulkError) {
            foreach ($batch as $index => $record) {
                try {
                    $insertados += $item->guardarLote([$record]);
                } catch (Throwable $rowError) {
                    $meta = $batchMeta[$index] ?? [];
                    $erroresDetalle[] = [
                        'fila_excel' => (int)($meta['fila_excel'] ?? 0),
                        'modelo' => (string)($meta['modelo'] ?? ''),
                        'mensaje' => 'No se pudo guardar la fila: ' . $rowError->getMessage(),
                    ];
                }
            }
        }
        $batch = [];
        $batchMeta = [];
    };

    for ($row = 2; $row <= $highestRow; $row++) {
        $cells = $sheet->rangeToArray("A$row:L$row", null, true, false)[0] ?? [];
        $cells = array_pad($cells, 12, null);
        $values = array_map($textCell, $cells);
        if (count(array_filter($values, static fn($value) => $value !== '')) === 0) continue;

        [$modelo, $precioRaw, $monedaRaw, $grupoRaw, $descripcion, $categoria, $clase, $pais, $pesoRaw, $statusRaw, $proveedor, $origen] = $values;
        $erroresFila = [];

        if ($modelo === '') $erroresFila[] = 'Falta el modelo.';
        if (mb_strlen($modelo, 'UTF-8') > 70) $erroresFila[] = 'El modelo supera 70 caracteres.';

        $precio = $parseNumber($cells[1]);
        if ($precio === null || $precio < 0) $erroresFila[] = 'El precio unitario debe ser un número igual o mayor que 0.';

        $moneda = $normalizeCurrency($monedaRaw);
        if ($moneda === null) $erroresFila[] = 'La moneda debe ser SOL o DOLLAR.';

        $grupo = $normalizeGroup($grupoRaw);
        if ($grupo === null) $erroresFila[] = 'El grupo debe ser Default o Group 0–15.';

        if ($categoria === '') $erroresFila[] = 'Falta la categoría del producto.';
        if (mb_strlen($categoria, 'UTF-8') > 70) $erroresFila[] = 'La categoría supera 70 caracteres.';
        if ($clase === '') $erroresFila[] = 'Falta la clase del producto.';
        if (mb_strlen($clase, 'UTF-8') > 70) $erroresFila[] = 'La clase supera 70 caracteres.';
        if ($pais === '') $erroresFila[] = 'Falta el país de origen.';
        if (mb_strlen($pais, 'UTF-8') > 70) $erroresFila[] = 'El país de origen supera 70 caracteres.';

        $peso = $parseNumber($cells[8]);
        if ($peso === null || $peso <= 0) $erroresFila[] = 'El peso en kg debe ser un número mayor que 0.';

        $status = $normalizeStatus($statusRaw);
        if ($status === null) $erroresFila[] = 'El status debe ser Active/Inactive o 1/0.';

        if (mb_strlen($descripcion, 'UTF-8') > 900) $erroresFila[] = 'La descripción supera 900 caracteres.';
        if (mb_strlen($proveedor, 'UTF-8') > 150) $erroresFila[] = 'El proveedor supera 150 caracteres.';
        if (mb_strlen($origen, 'UTF-8') > 100) $erroresFila[] = 'El origen supera 100 caracteres.';

        if ($erroresFila) {
            $erroresDetalle[] = [
                'fila_excel' => $row,
                'modelo' => $modelo,
                'mensaje' => implode(' ', $erroresFila),
            ];
            continue;
        }

        $batch[] = [
            'modelo' => $modelo,
            'precio_unitario' => $precio,
            'moneda' => $moneda,
            'grupo_descuento' => $grupo,
            'descripcion' => $descripcion,
            'categoria_producto' => $categoria,
            'clase_producto' => $clase,
            'pais_origen' => $pais,
            'peso' => $peso,
            'status' => $status,
            'proveedor' => $proveedor,
            'origen' => $origen,
            'id_carga' => $idCarga,
        ];
        $batchMeta[] = ['fila_excel' => $row, 'modelo' => $modelo];

        if (count($batch) >= $chunkSize) $flushBatch();
    }

    $flushBatch();
    $errores = count($erroresDetalle);
    $item->actualizarCarga($idCarga, $insertados, $errores);
    if ($erroresDetalle) $item->registrarErroresCarga($idCarga, $erroresDetalle);

    echo json_encode([
        'ok' => true,
        'message' => "Carga terminada: $insertados items cargados y $errores filas con errores",
        'insertados' => $insertados,
        'errores' => $errores,
        'id_carga' => $idCarga,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage(),
    ]);
}
