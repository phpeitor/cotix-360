<?php
require_once __DIR__ . '/../config/bootstrap.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
    @session_start();
}
use Dompdf\Dompdf;
require_once __DIR__ . '/../vendor/autoload.php';
require_once ROOT . '/model/receta.php';
require_once ROOT . '/model/item.php';

// Helpers para formateo y seguridad en el PDF
function escaparPdf($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function formatearFechaPdf($fecha) {
    if (empty($fecha)) return '';
    try {
        $dt = new DateTime($fecha);
        return $dt->format('Y-m-d H:i');
    } catch (Exception $e) {
        return (string)$fecha;
    }
}

function formatearNumeroRecetaPdf($id) {
    return sprintf('RC-%06d', (int)$id);
}

function formatearMontoPdf($monto, $simbolo = 'S/') {
    $monto = (float)$monto;
    return $simbolo . ' ' . number_format($monto, 2);
}

function decimalAjustPdf($value, int $decimals = 2): float {
    return round((float)$value, $decimals, PHP_ROUND_HALF_UP);
}

function normalizarTextoDetallePdf($texto) {
    if ($texto === null) return '';
    $text = html_entity_decode(strip_tags((string)$texto), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $text = trim(preg_replace('/\s+/', ' ', $text));
    if ($text === '' || preg_match('/^[\-\–\—\s]+$/u', $text)) {
        return '';
    }

    return $text;
}

function formatearRutaDetallePdf(array $partes) {
    $clean = array_filter(array_map(function($p){
        $s = trim((string)$p);
        return $s === '' ? null : $s;
    }, $partes));
    return implode(' / ', $clean);
}

/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

$hash = $_GET['id'] ?? null;
if (!$hash) {
    http_response_code(400);
    exit("ID inválido");
}

$recetaModel = new Receta();
$items      = new Item();

$receta = $recetaModel->obtenerPorHash($hash);
$detalle    = $recetaModel->obtenerDetallePorHash($hash);
$categorias = $recetaModel->obtenerCategoriasParaEdicion((int)$receta['id']);

$isAdmin = isset($_SESSION['session_cargo']) && $_SESSION['session_cargo'] == 1;
$esTecnico = isset($_SESSION['session_cargo']) && (int)$_SESSION['session_cargo'] === 4;

if (!$receta || !$detalle) {
    http_response_code(404);
    exit("Receta no encontrada");
}

$totalItems = 0;
$totalSoles = 0.0;
$totalDolares = 0.0;
$tipoCambio = (float)($receta['tipo_cambio'] ?? 1);
// Totales convertidos a DÓLARES (a partir de precios mostrados)
$totalDolaresConvertidos = 0.0;
$totalProductoDolares = 0.0;
$totalServicioDolares = 0.0;

foreach ($detalle as &$item) {
    $qty    = (int)$item['cantidad'];
    $precio = (float)$item['precio'];
    $moneda = strtoupper(trim((string)($item['moneda'] ?? '')));
    $subtotal = $precio * $qty;

    $totalItems += $qty;

    if ($moneda === 'DOLLAR') {
        $totalDolares += $subtotal;
        $item['simbolo_moneda'] = '$';
    } else {
        $totalSoles += $subtotal;
        $item['simbolo_moneda'] = 'S/';
    }

    // Calcular subtotal en DÓLARES para la presentación (si está en S/., convertir)
    $subtotalDolares = ($moneda === 'DOLLAR') ? $subtotal : ($tipoCambio > 0 ? ($subtotal / $tipoCambio) : 0);
    $subtotalDolares = decimalAjustPdf($subtotalDolares, 2);
    $totalDolaresConvertidos += $subtotalDolares;

    // Totales por tipo en DÓLARES
    $tipoNormalized = strtoupper(trim((string)($item['tipo'] ?? '')));
    if ($tipoNormalized === 'PRODUCTO') {
        $totalProductoDolares += $subtotalDolares;
    } else {
        $totalServicioDolares += $subtotalDolares;
    }

    $item['precio_formateado'] = $item['simbolo_moneda'] . ' ' . number_format($precio, 2);

}

// Calcular totales adicionales (Total Perú y Totales de Margen por categoría)
$totalPeru = $totalSoles + ($totalDolares * $tipoCambio);

$totalMargenSoles = 0.0;
$totalMargenDolares = 0.0;
$totalMargenPeru = 0.0;
// Margen total en DÓLARES (convirtiendo S/. a $)
$totalMargenDolaresAll = 0.0;
$igvMargenDolares = 0.0;
$totalConIgvDolares = 0.0;

if (is_array($categorias) && isset($categorias['rows']) && is_array($categorias['rows'])) {
    foreach ($categorias['rows'] as $cat) {
        $subtotalCat = (float)($cat['subtotal'] ?? 0);
        $monedaCat = strtoupper(trim((string)($cat['moneda'] ?? '')));
        $margenPct = (float)($cat['margen'] ?? 0);
        $margenDecimal = $margenPct / 100.0;
        if ($margenDecimal >= 1) {
            $margenDecimal = 0; // evitar división por cero o valores inválidos
        }

        $totalConMargenCat = $margenDecimal > 0 ? ($subtotalCat / (1 - $margenDecimal)) : $subtotalCat;
        $margenMonto = $totalConMargenCat - $subtotalCat;

        if ($monedaCat === 'DOLLAR') {
            $totalMargenDolares += $margenMonto;
            // margen en dólares directamente
            $totalMargenDolaresAll += $margenMonto;
        } else {
            $totalMargenSoles += $margenMonto;
            // convertir margen en S/. a dólares
            $totalMargenDolaresAll += decimalAjustPdf(($tipoCambio > 0 ? ($margenMonto / $tipoCambio) : 0), 2);
        }
    }
}

$totalDolaresConvertidos = decimalAjustPdf($totalDolaresConvertidos, 2);
$totalMargenDolaresAll = decimalAjustPdf($totalMargenDolaresAll, 2);
$baseTotalDolares = decimalAjustPdf($totalDolaresConvertidos + $totalMargenDolaresAll, 2);
$igvOverTotal = decimalAjustPdf($baseTotalDolares * 0.18, 2);
$totalConIgvDolares = decimalAjustPdf($baseTotalDolares + $igvOverTotal, 2);

ob_start();
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Receta PDF</title>
<?php
    // Cargar archivo CSS externo para Dompdf
    $cssPath = ROOT . '/assets/css/pdf_receta.css';
    $cssContent = '';
    if (file_exists($cssPath) && is_readable($cssPath)) {
        $cssContent = file_get_contents($cssPath);
    }
?>
    <style>
    <?= $cssContent ?>
    </style>
</head>
<body>
<?php
    $estado = strtolower($receta['estado'] ?? '');
    $wmClass = '';

    if ($estado === 'aprobada') {
        $wmClass = 'aprobada';
    } elseif ($estado === 'anulada') {
        $wmClass = 'anulada';
    }
?>

<?php if ($wmClass): ?>
    <div class="watermark <?= $wmClass ?>">
        <?= htmlspecialchars($receta['estado']) ?>
    </div>
<?php endif; ?>

<?php
    $numeroReceta = formatearNumeroRecetaPdf($receta['id']);
    $fechaReceta = formatearFechaPdf($receta['created_at'] ?? null);
    $usuarioRegistro = trim((string)($receta['usuario'] ?? ''));
    $usuarioActual = trim((string)($_SESSION['session_usuario'] ?? $receta['usu_upd'] ?? $receta['usuario'] ?? ''));
    $nombreReceta = trim((string)($receta['nombre'] ?? 'RECETA'));
    $empresaLinea1 = 'Sistema interno';
    $empresaLinea2 = 'Lima, Perú';
?>

<div class="top-band"></div>
<div class="corner-top-right"></div>
<div class="bottom-band"></div>
<div class="corner-bottom-left"></div>

<div class="page">
    <?php
        $logoPath = ROOT . '/assets/images/mg-indusol-logo.svg';
        $logoDataUri = '';
        if (file_exists($logoPath) && is_readable($logoPath)) {
            $mime = 'image/svg+xml';
            $data = @file_get_contents($logoPath);
            if ($data !== false) {
                $logoDataUri = 'data:' . $mime . ';base64,' . base64_encode($data);
            }
        }
    ?>
    <table class="hero">
        <tr>
            <td class="hero-left">
                <?php if ($logoDataUri): ?>
                    <img src="<?= $logoDataUri ?>" alt="Logo" class="hero-logo">
                <?php else: ?>
                    <div style="width: 100px; height: 80px; background: #f0f0f0; margin: 0 auto;"></div>
                <?php endif; ?>
            </td>
            <td class="hero-right">
                <div class="title"><?= escaparPdf($nombreReceta !== '' ? mb_strtoupper($nombreReceta, 'UTF-8') : 'RECETA') ?></div>
            </td>
        </tr>
    </table>

    <table class="panels">
        <tr>
            <td class="panel" style="padding-right: 6mm;">
                <div class="panel-title">RECETA</div>
                <div class="panel-name"><?= escaparPdf($usuarioRegistro !== '' ? $usuarioRegistro : 'Sin responsable') ?></div>
                <p class="panel-line">Usuario registro: <?= escaparPdf($usuarioRegistro !== '' ? $usuarioRegistro : 'Desconocido') ?></p>
                <p class="panel-line">Estado: <?= escaparPdf($receta['estado'] ?? 'N/D') ?> (<?= escaparPdf($receta['usu_upd'] ?? 'N/D') ?>)</p>
            </td>
            <td class="panel" style="padding-left: 6mm; text-align: right;">
                <div class="panel-title">MG INDUSOL</div>
                <p class="panel-line"><?= escaparPdf($empresaLinea1) ?></p>
                <p class="panel-line"><?= escaparPdf($empresaLinea2) ?></p>
            </td>
        </tr>
    </table>

    <table class="section-table">
        <thead>
            <tr class="section-head">
                <th style="width: <?= $esTecnico ? '88%' : '68%'; ?>;">DESCRIPCIÓN</th>
                <th style="width: 12%;">CANT.</th>
                <?php if (!$esTecnico): ?>
                    <th style="width: 10%;">PRECIO $</th>
                <?php endif; ?>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($detalle as $i): ?>
                <?php
                    $descripcion = normalizarTextoDetallePdf($i['descripcion']);
                    $rutaDetalle = formatearRutaDetallePdf([$i['marca'], $i['modelo'], $i['uni_medida']]);
                    $categoriaDetalle = formatearRutaDetallePdf([$i['categoria'], $i['sub_cat_1'], $i['sub_cat_2']]);
                    $cantidad = (int)($i['cantidad'] ?? 0);
                    $precioUnitario = (float)($i['precio'] ?? 0);
                    $subtotalLinea = $precioUnitario * $cantidad;
                    $simboloLinea = strtoupper(trim((string)($i['moneda'] ?? ''))) === 'DOLLAR' ? '$' : 'S/';
                    
                    // Mostrar precio en DÓLARES: si el item está en soles, convertir usando tipo de cambio; si ya está en dólares usar el valor real
                    $esEnSoles = strtoupper(trim((string)($i['moneda'] ?? ''))) !== 'DOLLAR';
                    if ($esEnSoles) {
                        $precioMostrado = $tipoCambio > 0 ? ($subtotalLinea / $tipoCambio) : 0;
                    } else {
                        $precioMostrado = $subtotalLinea;
                    }
                    $simboloMostrado = '$';
                ?>
                <tr class="item-row">
                    <td>
                        <div class="item-description"><?= escaparPdf((string)($i['nombre'] ?? 'SIN NOMBRE')) ?></div>
                        <?php if ($descripcion !== ''): ?>
                            <div class="item-subline"><?= escaparPdf($descripcion) ?></div>
                        <?php endif; ?>
                        <?php if ($rutaDetalle !== ''): ?>
                            <div class="item-subline"><?= escaparPdf($rutaDetalle) ?></div>
                        <?php endif; ?>
                        <?php if ($categoriaDetalle !== ''): ?>
                            <div class="item-meta"><?= escaparPdf($categoriaDetalle) ?></div>
                        <?php endif; ?>
                        <div class="item-meta">Tipo: <?= escaparPdf((string)($i['tipo'] ?? '')) ?></div>
                    </td>
                    <td class="item-qty"><?= (int)$cantidad ?></td>
                    <?php if (!$esTecnico): ?>
                        <td class="item-price"><?= escaparPdf(formatearMontoPdf($precioMostrado, $simboloMostrado)) ?></td>
                    <?php endif; ?>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <table style="width: 100%; margin-top: 5mm;">
        <?php if ($esTecnico): ?>
            <tr>
                <td style="background: transparent; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f;">
                    <strong>Total Items:</strong> <?= $totalItems ?>
                </td>
            </tr>
        <?php else: ?>
            <tr>
                <td style="width: 50%; background: transparent; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Items:</strong> <?= $totalItems ?><br>
                    <strong>Costo Total Producto:</strong> $<?= number_format($totalProductoDolares, 2) ?><br>
                    <strong>Costo Total Servicio:</strong> $<?= number_format($totalServicioDolares, 2) ?>
                </td>
                <td style="width: 50%; background: transparent; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Costo Total:</strong> $<?= number_format($totalDolaresConvertidos, 2) ?><br>
                    <strong>Margen:</strong> $<?= number_format($totalMargenDolaresAll, 2) ?><br>
                    <strong>SubTotal:</strong> $<?= number_format($baseTotalDolares, 2) ?><br>
                    <strong>IGV 18%:</strong> $<?= number_format($igvOverTotal, 2) ?><br>
                    <strong>Subtotal + IGV:</strong> $<?= number_format($totalConIgvDolares, 2) ?>
                </td>
            </tr>
        <?php endif; ?>
    </table>
    
    <?php if (trim((string)($receta['observacion'] ?? '')) !== ''): ?>
        <div style="margin-top: 6mm; margin-bottom: 6mm;">
            <div style="padding: 2mm 0; min-height: 12mm;">
                <div style="font-weight: 700; margin-bottom: 2mm;">Observación</div>
                <div style="font-size: 11px; line-height: 1.2;"><?= nl2br(escaparPdf($receta['observacion'])) ?></div>
            </div>
        </div>
    <?php endif; ?>

    <div style="margin-bottom: 30mm;"></div>
</div>

<div class="pdf-footer">
    <strong>Tipo de Cambio SUNAT:</strong> <?= number_format($tipoCambio, 3) ?> |
    <strong>Generado por:</strong> <?= htmlspecialchars($_SESSION['session_usuario'] ?? $receta['usu_upd'] ?? $receta['usuario'] ?? 'Desconocido') ?> |
    <strong>Fec. Impresión:</strong> <?= (new DateTime('now', new DateTimeZone('America/Lima')))->format('Y-m-d H:i:s') ?> (PET)
</div>
</body>
</html>

<?php

$html = ob_get_clean();
/*echo $html;
exit;*/
$pdf = new Dompdf();
$pdf->loadHtml($html);
$pdf->setPaper('A4', 'portrait');
$pdf->render();
$nombreArchivoBase = normalizarTextoDetallePdf($receta['nombre'] ?? '');
if ($nombreArchivoBase === '') {
    $nombreArchivoBase = 'receta_' . (string)($receta['id'] ?? '0');
}
$nombreArchivoBase = preg_replace('/[^A-Za-z0-9]+/', '_', $nombreArchivoBase);
$nombreArchivoBase = trim((string)$nombreArchivoBase, '_');
if ($nombreArchivoBase === '') {
    $nombreArchivoBase = 'receta';
}
$pdf->stream($nombreArchivoBase . '.pdf', ["Attachment" => false]);