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

ob_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>PDF <?= md5($receta['id']) ?></title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        h2 { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 4px; }
        th { background: #f2f2f2; }
        .right { text-align: right; }
        .center { text-align: center; }
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

        .watermark.aprobada {
            color: rgba(25, 135, 84, 0.15); 
        }

        .watermark.anulada {
            color: rgba(220, 53, 69, 0.15); 
        }
        /* Encabezado sin bordes */
        table.header-table, table.header-table th, table.header-table td {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
        }
        .pdf-footer {
            position: fixed;
            bottom: 8px;
            left: 20px;
            right: 20px;
            font-size: 9px;
            color: #555;
            text-align: center;
            border-top: 1px solid #e6e6e6;
            padding-top: 6px;
            background: transparent;
        }
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
    // Intentar incrustar logo como data URI para Dompdf (ruta relativa a este archivo)
    $logoPath = __DIR__ . '/assets/images/logo-dark.png';
    $logoDataUri = '';
    if (file_exists($logoPath) && is_readable($logoPath)) {
        $mime = function_exists('mime_content_type') ? mime_content_type($logoPath) : 'image/png';
        $data = @file_get_contents($logoPath);
        if ($data !== false) {
            $logoDataUri = 'data:' . ($mime ?: 'image/png') . ';base64,' . base64_encode($data);
        }
    }
?>

<table class="header-table" style="width:100%; border-collapse:collapse; margin-bottom:6px;">
    <tr>
        <td style="width:20%; vertical-align: top;">
            <?php if ($logoDataUri): ?>
                <img src="<?= $logoDataUri ?>" alt="Logo" style="width: 80px; height: auto;">
            <?php else: ?>
                <div style="font-size:12px;color:#666;">Logo</div>
            <?php endif; ?>
        </td>
        <td style="width:60%; text-align:center; vertical-align: middle;">
            <h2 style="margin:0; padding:0;">RECETA COMERCIAL</h2>
            <p style="margin:2px 0 0 0; font-size:11px;">Documento informativo – No constituye factura</p>
        </td>
        <td style="width:20%;"></td>
    </table>

<p>
    <strong>ID:</strong> <?= $receta['id'] ?><br>
    <strong>Usuario Registro:</strong> <?= $receta['usuario'] ?><br>
    <strong>Fec. Registro:</strong> <?= $receta['created_at'] ?><br>
    <strong>Usuario Modifica:</strong> <?= $receta['usu_upd'] ?><br>
    <strong>Fec. Modifica:</strong> <?= $receta['updated_at'] ?><br>
    <strong>Estado:</strong> <?= $receta['estado'] ?>
</p>

<table>
    <thead>
        <tr>
            <th>Item Descripción</th>
            <th>Item Detalle</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <?php if (!$esTecnico): ?>
            <th>Precio</th>
            <?php endif; ?>
            <th>Cantidad</th>

        </tr>
    </thead>
    <tbody>
        <?php foreach ($detalle as $i): ?>
        <tr>
            <td class="left">
                <b><?= htmlspecialchars($i['nombre']) ?></b><br>
                <?php $descripcion = normalizarTextoDetallePdf($i['descripcion']); ?>
                <?php if ($descripcion !== ''): ?>
                    <?= htmlspecialchars($descripcion) ?><br>
                <?php endif; ?>
            </td>
            <td class="left">
                <b><?= htmlspecialchars($i['marca']) ?></b><br>
                <?= htmlspecialchars($i['modelo']) ?><br>
                <?= htmlspecialchars($i['uni_medida']) ?><br>
            </td>
            <td class="left">
                <b><?= htmlspecialchars($i['categoria']) ?></b><br>
                <?php $rutaDetalle = formatearRutaDetallePdf([$i['sub_cat_1'], $i['sub_cat_2']]); ?>
                <?php if ($rutaDetalle !== ''): ?>
                    <?= htmlspecialchars($rutaDetalle) ?><br>
                <?php endif; ?>
            </td>
            <td class="center"><?= $i['tipo'] ?></td>
            <?php if (!$esTecnico): ?>
            <td class="right"><?= htmlspecialchars($i['precio_formateado']) ?></td>
            <?php endif; ?>
            <td class="center"><?= $i['cantidad'] ?></td>
        </tr>
        <?php endforeach ?>
    </tbody>
</table>
<br>
<br>
<table style="width: 100%; border-collapse: collapse;">
    <?php if ($esTecnico): ?>
        <tr>
            <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top; width: 100%;">
                <strong>Total Items:</strong> <?= $totalItems ?>
            </td>
        </tr>
    <?php else: ?>
        <tr>
            <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top; width: 33%;">
                <strong>Total Producto:</strong> S/ <?= number_format($totalProductoPeru, 2) ?><br>
                <strong>Total Servicio:</strong> S/ <?= number_format($totalServicioPeru, 2) ?>
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top; width: 33%;">
                <strong>Total Items:</strong> <?= $totalItems ?><br>
                <strong>Total S/:</strong> <?= number_format($totalSoles, 2) ?><br>
                <?php if ($totalDolares > 0): ?>
                    <strong>Total $:</strong> <?= number_format($totalDolares, 2) ?><br>
                    <strong>Total Perú:</strong> S/ <?= number_format($totalPeru, 2) ?>
                <?php endif; ?>
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top; width: 33%;">
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
</table>

<div class="pdf-footer">
    <strong>Tipo de Cambio SUNAT:</strong> <?= number_format($tipoCambio, 3) ?> |
    <strong>Generado por:</strong> <?= htmlspecialchars($_SESSION['session_usuario'] ?? $receta['usu_upd'] ?? $receta['usuario'] ?? 'Desconocido') ?> |
    <strong>Fec. Impresión:</strong> <?= date('Y-m-d H:i:s') ?>
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