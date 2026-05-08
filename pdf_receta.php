<?php
session_start();
use Dompdf\Dompdf;
require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/model/receta.php";
require_once __DIR__ . "/model/item.php";

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

function normalizarTextoDetallePdf($texto) {
    if ($texto === null) return '';
    $text = strip_tags((string)$texto);
    $text = trim(preg_replace('/\s+/', ' ', $text));
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

// Calcular totales adicionales (Total Perú y Totales de Margen por categoría)
$totalPeru = $totalSoles + ($totalDolares * $tipoCambio);

$totalMargenSoles = 0.0;
$totalMargenDolares = 0.0;
$totalMargenPeru = 0.0;
$igvMargenPeru = 0.0;
$totalConIgv = 0.0;

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
            $totalMargenPeru += ($margenMonto * $tipoCambio);
        } else {
            $totalMargenSoles += $margenMonto;
            $totalMargenPeru += $margenMonto;
        }
    }

    $igvMargenPeru = $totalMargenPeru * 0.18;
    $totalConIgv = $totalMargenPeru + $igvMargenPeru;
}

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
    $cssPath = __DIR__ . '/assets/css/pdf_receta.css';
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
        $logoPath = __DIR__ . '/assets/images/mg-indusol-logo.svg';
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
                <p class="panel-line">Estado: <?= escaparPdf($receta['estado'] ?? 'N/D') ?></p>
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
                <td style="width: 33%; background: #ededed; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Producto:</strong> S/ <?= number_format($totalProductoPeru, 2) ?><br>
                    <strong>Total Servicio:</strong> S/ <?= number_format($totalServicioPeru, 2) ?>
                </td>
                <td style="width: 33%; background: #ededed; padding: 3mm 4mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
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