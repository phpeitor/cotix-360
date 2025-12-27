<?php

use Dompdf\Dompdf;

require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/model/cotizacion.php";
require_once __DIR__ . "/model/item.php";
require_once __DIR__ . "/calc_cotizacion.php";

header("Content-Type: application/pdf");

/* =====================================================
   VALIDACIÓN
===================================================== */
$hash = $_GET['id'] ?? null;
if (!$hash) {
    http_response_code(400);
    exit("ID inválido");
}

/* =====================================================
   DATA
===================================================== */
$cotizacionModel = new Cotizacion();
$items      = new Item();

$cotizacion = $cotizacionModel->obtenerPorHash($hash);
$detalle    = $cotizacionModel->obtenerDetallePorHash($hash);
$fleteTable = $items->obtenerFlete();
$gastoTable = $items->obtenerGastos();

if (!$cotizacion || !$detalle) {
    http_response_code(404);
    exit("Cotización no encontrada");
}

/* =====================================================
   CÁLCULOS (IGUAL QUE JS)
===================================================== */
$totalItems = 0;
$totalPeso  = 0;
$totalFob   = 0;

foreach ($detalle as &$item) {

    $qty    = (int)$item['cantidad'];
    $peso   = (float)$item['peso'];
    $precio = (float)$item['precio_unitario'];

    $totalItems += $qty;
    $totalPeso  += $peso * $qty;
    $totalFob   += $precio * $qty;

    $item['_precio'] = $precio;
}

/* === Flete / Gasto === */
$flete = CotizacionCalc::calcularFlete($fleteTable, $totalPeso);
$gasto = CotizacionCalc::calcularGasto($gastoTable, $totalFob);

$totalPeru = $totalFob + $flete + $gasto;
$rawFactor = $totalFob ? ($flete + $gasto) / $totalFob : 0;

/* === Cálculo por item === */
foreach ($detalle as &$item) {

    $precio = $item['_precio'];
    $margen = CotizacionCalc::margenPorGrupo($item['grupo']);

    $factorPU = round($precio * round($rawFactor, 4), 2);
    $precioM  = round($precio + $factorPU, 2);
    $utilidad = round($precioM * $margen, 2);
    $precioCliente = round($precioM + $utilidad, 2);

    $item['factor_pu']      = $factorPU;
    $item['precio_m']       = $precioM;
    $item['margen']         = $margen * 100;
    $item['utilidad']       = $utilidad;
    $item['precio_cliente'] = $precioCliente;
}

/* =====================================================
   HTML PDF
===================================================== */
ob_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>PDF <?= md5($cotizacion['id']) ?></title>
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
            color: rgba(25, 135, 84, 0.15); /* verde */
        }

        .watermark.anulada {
            color: rgba(220, 53, 69, 0.15); /* rojo */
        }
    </style>
</head>
<body>
<?php
    $estado = strtolower($cotizacion['estado'] ?? '');
    $wmClass = '';

    if ($estado === 'aprobada') {
        $wmClass = 'aprobada';
    } elseif ($estado === 'anulada') {
        $wmClass = 'anulada';
    }
?>

<?php if ($wmClass): ?>
    <div class="watermark <?= $wmClass ?>">
        <?= htmlspecialchars($cotizacion['estado']) ?>
    </div>
<?php endif; ?>

<h2 style="text-align:center; margin-bottom:4px;">
    COTIZACION COMERCIAL
</h2>
<p style="text-align:center; font-size:11px; margin-top:0;">
    Documento informativo – No constituye factura
</p>
<hr>
<p>
    <strong>ID:</strong> <?= md5($cotizacion['id']) ?><br>
    <strong>Usuario:</strong> <?= $cotizacion['usuario'] ?><br>
    <strong>Fecha:</strong> <?= $cotizacion['created_at'] ?><br>
    <strong>Estado:</strong> <?= $cotizacion['estado'] ?>
</p>

<table>
    <thead>
        <tr>
            <th>Item Descripción</th>
            <th class="center">Cant</th>
            <th class="center">Peso</th>
            <th class="right">PU</th>
            <th class="right">Factor</th>
            <th class="right">Precio M</th>
            <th class="right">Margen</th>
            <th class="right">Utilidad</th>
            <th class="right">Precio Cliente</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($detalle as $i): ?>
        <tr>
            <td><b><?= $i['modelo']. '</b>: '.  $i['descripcion']. '</br>'.  $i['grupo'] ?></td>
            <td class="center"><?= $i['cantidad'] ?></td>
            <td class="center"><?= $i['peso'] ?></td>
            <td class="right"><?= number_format($i['_precio'],2) ?></td>
            <td class="right"><?= number_format($i['factor_pu'],2) ?></td>
            <td class="right"><?= number_format($i['precio_m'],2) ?></td>
            <td class="center">
                <?= number_format($i['margen'], 0) ?> %
            </td>
            <td class="right"><?= number_format($i['utilidad'],2) ?></td>
            <td class="right"><?= number_format($i['precio_cliente'],2) ?></td>
        </tr>
        <?php endforeach ?>
    </tbody>
</table>

<br>

<p>
    <strong>Total Items:</strong> <?= $totalItems ?><br>
    <strong>Total Peso:</strong> <?= number_format($totalPeso,2) ?><br>
    <strong>Total FOB:</strong> <?= number_format($totalFob,2) ?><br>
    <strong>Flete:</strong> <?= number_format($flete,2) ?><br>
    <strong>Gasto:</strong> <?= number_format($gasto,2) ?><br>
    <strong>Total Perú:</strong> <?= number_format($totalPeru,2) ?><br>
    <strong>Factor:</strong> <?= number_format($rawFactor,4) ?>
</p>

</body>
</html>

<?php
$html = ob_get_clean();

/* =====================================================
   GENERAR PDF
===================================================== */
$pdf = new Dompdf();
$pdf->loadHtml($html);
$pdf->setPaper('A4', 'portrait');
$pdf->render();
$pdf->stream("cotizacion_" . md5($cotizacion['id']) . ".pdf", ["Attachment" => false]);
