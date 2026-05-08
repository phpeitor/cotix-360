<?php
session_start();
use Dompdf\Dompdf;
require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/model/receta.php";
require_once __DIR__ . "/model/item.php";

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
// Totales por tipo (convertidos a S/.)
$totalProductoPeru = 0.0;
$totalServicioPeru = 0.0;

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

    // Sumar al total por tipo en soles (convertir dólares usando tipo de cambio)
    $subtotalPeru = ($moneda === 'DOLLAR') ? ($subtotal * $tipoCambio) : $subtotal;
    $tipoNormalized = strtoupper(trim((string)($item['tipo'] ?? '')));
    if ($tipoNormalized === 'PRODUCTO') {
        $totalProductoPeru += $subtotalPeru;
    } else {
        $totalServicioPeru += $subtotalPeru;
    }

    $item['precio_formateado'] = $item['simbolo_moneda'] . ' ' . number_format($precio, 2);

}

$totalPeru = $totalSoles + ($totalDolares * $tipoCambio);

// Calcular totales con margen por moneda
$totalMargenSoles = 0.0;
$totalMargenDolares = 0.0;

if (isset($categorias['rows']) && is_array($categorias['rows'])) {
    foreach ($categorias['rows'] as $cat) {
        $subtotal = (float)($cat['subtotal'] ?? 0);
        $margenPct = (float)($cat['margen'] ?? 0);
        $monedaCat = strtoupper(trim((string)($cat['moneda'] ?? '')));
        
        // Calcular total con margen: subtotal / (1 - margen_decimal)
        $margenDecimal = $margenPct / 100;
        if ($margenDecimal < 1) {
            $totalConMargen = $subtotal / (1 - $margenDecimal);
        } else {
            $totalConMargen = 0;
        }
        
        if ($monedaCat === 'DOLLAR') {
            $totalMargenDolares += $totalConMargen;
        } else {
            $totalMargenSoles += $totalConMargen;
        }
    }
}

// Calcular Total Margen Perú
$totalMargenPeru = $totalMargenSoles + ($totalMargenDolares * $tipoCambio);

// Calcular IGV (18%)
$igvMargenPeru = $totalMargenPeru * 0.18;

// Calcular Total con IGV
$totalConIgv = $totalMargenPeru + $igvMargenPeru;

function normalizarTextoDetallePdf($valor): string
{
    $texto = trim((string)($valor ?? ''));

    if ($texto === '' || $texto === '-') {
        return '';
    }

    return $texto;
}

function formatearRutaDetallePdf(array $valores): string
{
    $partes = [];

    foreach ($valores as $valor) {
        $texto = normalizarTextoDetallePdf($valor);

        if ($texto === '') {
            continue;
        }

        $ultimo = end($partes);
        if ($ultimo === $texto) {
            continue;
        }

        $partes[] = $texto;
    }

    return implode(' / ', $partes);
}

function escaparPdf(?string $valor): string
{
    return htmlspecialchars((string)($valor ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function formatearFechaPdf(?string $valor): string
{
    if (!$valor) {
        return '-';
    }

    try {
        $fecha = new DateTimeImmutable($valor);
    } catch (Throwable $e) {
        return trim((string)$valor);
    }

    $meses = [
        'January' => 'enero',
        'February' => 'febrero',
        'March' => 'marzo',
        'April' => 'abril',
        'May' => 'mayo',
        'June' => 'junio',
        'July' => 'julio',
        'August' => 'agosto',
        'September' => 'septiembre',
        'October' => 'octubre',
        'November' => 'noviembre',
        'December' => 'diciembre',
    ];

    $mes = $meses[$fecha->format('F')] ?? strtolower($fecha->format('F'));
    return strtoupper($fecha->format('d')) . ' DE ' . strtoupper($mes) . ' DE ' . $fecha->format('Y');
}

function formatearNumeroRecetaPdf($id): string
{
    return str_pad((string)((int)$id), 5, '0', STR_PAD_LEFT);
}

function formatearMontoPdf(float $monto, string $simbolo = 'S/'): string
{
    return $simbolo . ' ' . number_format($monto, 2);
}

ob_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Receta <?= md5($receta['id']) ?></title>
    <style>
        @page { margin: 18mm 15mm 16mm 15mm; }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #202124;
            position: relative;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .page {
            position: relative;
            z-index: 2;
        }

        .top-band,
        .bottom-band {
            position: fixed;
            left: 0;
            right: 0;
            height: 18mm;
            background: #148fd0;
            z-index: 0;
        }

        .top-band { top: 0; }
        .bottom-band { bottom: 0; }

        .corner-top-right,
        .corner-bottom-left {
            position: fixed;
            width: 0;
            height: 0;
            z-index: 1;
        }

        .corner-top-right {
            top: 0;
            right: 0;
            border-top: 30mm solid #8ad9c7;
            border-left: 30mm solid transparent;
        }

        .corner-bottom-left {
            left: 0;
            bottom: 0;
            border-bottom: 30mm solid #8ad9c7;
            border-right: 30mm solid transparent;
        }

        .watermark {
            position: fixed;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 80px;
            font-weight: bold;
            color: rgba(0,0,0,0.08);
            z-index: -1;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .watermark.aprobada { color: rgba(25, 135, 84, 0.15); }
        .watermark.anulada { color: rgba(220, 53, 69, 0.15); }

        .hero {
            margin-top: 18mm;
            padding-top: 8mm;
        }

        .hero td {
            vertical-align: top;
        }

        .hero-left {
            width: 34%;
        }

        .hero-right {
            width: 66%;
            text-align: right;
        }

        .doc-number {
            font-size: 11px;
            letter-spacing: 1px;
            margin: 0 0 2mm 0;
        }

        .doc-date {
            font-size: 11px;
            letter-spacing: 1px;
            margin: 0;
        }

        .title {
            margin: 0;
            font-size: 29px;
            line-height: 1;
            font-weight: bold;
            letter-spacing: 2px;
            color: #0e84c2;
        }

        .panels {
            margin-top: 5mm;
        }

        .panel {
            width: 50%;
            vertical-align: top;
        }

        .panel-title {
            font-size: 13px;
            font-weight: bold;
            color: #3d3d3d;
            letter-spacing: 0.5px;
            margin: 0 0 1mm 0;
        }

        .panel-name {
            font-size: 13px;
            color: #197fb6;
            letter-spacing: 1px;
            margin: 0 0 0.8mm 0;
        }

        .panel-line {
            margin: 0 0 0.6mm 0;
            font-size: 10.5px;
            letter-spacing: 0.4px;
        }

        .section-table {
            margin-top: 6mm;
        }

        .section-head th {
            background: #0f86c2;
            color: #fff;
            font-size: 13px;
            letter-spacing: 1px;
            padding: 2.5mm 3mm;
            border: none;
        }

        .item-row td {
            border-bottom: 0.35mm solid #4f4f4f;
            padding: 2mm 2mm 2.5mm 2mm;
            vertical-align: top;
        }

        .item-description {
            font-size: 11px;
            letter-spacing: 0.3px;
            margin-bottom: 0.6mm;
        }

        .item-subline {
            color: #4f4f4f;
            font-size: 9.5px;
            line-height: 1.35;
            margin-bottom: 0.4mm;
        }

        .item-meta {
            color: #6a6a6a;
            font-size: 8.5px;
            letter-spacing: 0.3px;
        }

        .item-qty {
            text-align: center;
            width: 12%;
            color: #4f4f4f;
        }

        .item-price {
            width: 22%;
            text-align: right;
            font-size: 12px;
            letter-spacing: 0.4px;
            white-space: nowrap;
        }

        .summary-wrap {
            margin-top: 8mm;
            width: 100%;
        }

        .summary-box {
            width: 48%;
            margin-left: 52%;
            background: #ededed;
            padding: 3mm 4mm;
            box-sizing: border-box;
        }

        .summary-box td {
            padding: 1.6mm 0;
            font-size: 10px;
            letter-spacing: 0.8px;
        }

        .summary-label {
            width: 72%;
            text-align: center;
            color: #4a4a4a;
        }

        .summary-value {
            width: 28%;
            text-align: left;
            color: #222;
            white-space: nowrap;
        }

        .summary-total td {
            padding-top: 2.6mm;
            font-size: 11px;
            color: #1c1c1c;
        }

        .payment {
            margin-top: 9mm;
            width: 55%;
        }

        .payment-title {
            margin: 0 0 2.5mm 0;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 0.8px;
            color: #3d3d3d;
        }

        .payment-line {
            margin: 0 0 1mm 0;
            font-size: 10px;
            letter-spacing: 0.2px;
        }

        .signatures {
            margin-top: 18mm;
            width: 100%;
        }

        .signature-cell {
            width: 50%;
            vertical-align: bottom;
            text-align: center;
            padding-top: 12mm;
        }

        .signature-line {
            width: 90%;
            margin: 0 auto 2.5mm auto;
            border-top: 0.35mm solid #4f4f4f;
            height: 1px;
        }

        .signature-label {
            font-size: 10px;
            letter-spacing: 0.5px;
            color: #222;
        }

        .right { text-align: right; }
        .center { text-align: center; }
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
    $empresaNombre = 'COTIX';
    $empresaLinea1 = 'Sistema interno';
    $empresaLinea2 = 'Lima, Perú';
    $empresaLinea3 = 'Documento generado en PDF';
?>

<div class="top-band"></div>
<div class="corner-top-right"></div>
<div class="bottom-band"></div>
<div class="corner-bottom-left"></div>

<div class="page">
    <table class="hero">
        <tr>
            <td class="hero-left">
                <p class="doc-number">N°. <?= escaparPdf($numeroReceta) ?></p>
                <p class="doc-date"><?= escaparPdf($fechaReceta) ?></p>
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
                <p class="panel-line">ID: <?= escaparPdf($numeroReceta) ?></p>
                <p class="panel-line">Usuario registro: <?= escaparPdf($usuarioRegistro !== '' ? $usuarioRegistro : 'Desconocido') ?></p>
                <p class="panel-line">Estado: <?= escaparPdf($receta['estado'] ?? 'N/D') ?></p>
                <p class="panel-line">Tipo de cambio: <?= number_format($tipoCambio, 3) ?></p>
            </td>
            <td class="panel" style="padding-left: 6mm; text-align: right;">
                <div class="panel-title">EMPRESA</div>
                <div class="panel-name"><?= escaparPdf($empresaNombre) ?></div>
                <p class="panel-line"><?= escaparPdf($empresaLinea1) ?></p>
                <p class="panel-line"><?= escaparPdf($empresaLinea2) ?></p>
                <p class="panel-line"><?= escaparPdf($empresaLinea3) ?></p>
                <p class="panel-line">Generado por: <?= escaparPdf($usuarioActual !== '' ? $usuarioActual : 'Sistema') ?></p>
            </td>
        </tr>
    </table>

    <table class="section-table">
        <thead>
            <tr class="section-head">
                <th style="width: 78%;">DESCRIPCIÓN</th>
                <th style="width: 10%;">CANT.</th>
                <th style="width: 12%;">PRECIO</th>
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
                    <td class="item-price"><?= escaparPdf(formatearMontoPdf($subtotalLinea, $simboloLinea)) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <table style="width: 100%; margin-top: 5mm;">
        <?php if ($esTecnico): ?>
            <tr>
                <td style="background: #ededed; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f;">
                    <strong>Total Items:</strong> <?= $totalItems ?>
                </td>
            </tr>
        <?php else: ?>
            <tr>
                <td style="width: 33%; background: #ededed; padding: 5mm 6mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Producto:</strong> S/ <?= number_format($totalProductoPeru, 2) ?><br>
                    <strong>Total Servicio:</strong> S/ <?= number_format($totalServicioPeru, 2) ?>
                </td>
                <td style="width: 33%; background: #ededed; padding: 5mm 6mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Items:</strong> <?= $totalItems ?><br>
                    <strong>Total S/:</strong> <?= number_format($totalSoles, 2) ?><br>
                    <?php if ($totalDolares > 0): ?>
                        <strong>Total $:</strong> <?= number_format($totalDolares, 2) ?><br>
                        <strong>Total Perú:</strong> S/ <?= number_format($totalPeru, 2) ?>
                    <?php endif; ?>
                </td>
                <td style="width: 34%; background: #ededed; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Margen S/:</strong> S/ <?= number_format($totalMargenSoles, 2) ?><br>
                    <?php if ($totalMargenDolares > 0): ?>
                        <strong>Total Margen $:</strong> $ <?= number_format($totalMargenDolares, 2) ?><br>
                    <?php endif; ?>
                    <strong>Total Margen Perú:</strong> S/ <?= number_format($totalMargenPeru, 2) ?><br>
                    <strong>IGV 18%:</strong> S/ <?= number_format($igvMargenPeru, 2) ?><br>
                    <strong>Total + IGV:</strong> S/ <?= number_format($totalConIgv, 2) ?>
                </td>
            </tr>
        <?php endif; ?>
    </table>

    <div style="margin-top: 5mm; font-size: 9px; color: #555; text-align: center; border-top: 1px solid #e6e6e6; padding-top: 4px;">
        <strong>Tipo de Cambio SUNAT:</strong> <?= number_format($tipoCambio, 3) ?> |
        <strong>Generado por:</strong> <?= htmlspecialchars($_SESSION['session_usuario'] ?? $receta['usu_upd'] ?? $receta['usuario'] ?? 'Desconocido') ?> |
        <strong>Fec. Impresión:</strong> <?= date('Y-m-d H:i:s') ?>
    </div>
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
$pdf->stream("receta_" . md5($receta['id']) . ".pdf", ["Attachment" => false]);