<?php
use Dompdf\Dompdf;
require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/model/cotizacion.php";
require_once __DIR__ . "/model/item.php";
require_once __DIR__ . "/model/calc_cotizacion.php";

//header("Content-Type: application/pdf");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$hash = $_GET['id'] ?? null;
if (!$hash) {
    http_response_code(400);
    exit("ID inválido");
}

$cotizacionModel = new Cotizacion();
$items      = new Item();

$cotizacion = $cotizacionModel->obtenerPorHash($hash);
$detalle    = $cotizacionModel->obtenerDetallePorHash($hash);
$fleteTable = $items->obtenerFlete();
$gastoTable = $items->obtenerGastos();
$isAdmin = isset($_SESSION['session_cargo']) && $_SESSION['session_cargo'] == 1;

if (!$cotizacion || !$detalle) {
    http_response_code(404);
    exit("Cotización no encontrada");
}

$totalItems = 0;
$totalPeso  = 0;
$totalFob   = 0;
$pesosPorPais = [];

foreach ($detalle as &$item) {
    $qty    = (int)$item['cantidad'];
    $peso   = (float)$item['peso'];
    $precio = (float)$item['precio_unitario'];
    $grupo  = $item['grupo'];
    $pais   = CotizacionCalc::normalizarPais($item['pais_origen']);
    $margen = CotizacionCalc::margenPorGrupo($grupo);
    $precioDscto = $precio * (1 - $margen);

    $totalItems += $qty;
    $totalPeso  += $peso * $qty;
    $totalFob   += $precioDscto * $qty;

    if (!isset($pesosPorPais[$pais])) {
        $pesosPorPais[$pais] = 0;
    }
    $pesosPorPais[$pais] += $peso * $qty;

    $item['_precio']       = $precio;
    $item['_precio_dscto'] = $precioDscto;
    $item['_margen']       = $margen;
}

/* === Flete / Gasto === */
$flete = 0;
foreach ($pesosPorPais as $pais => $pesoPais) {
    $flete += CotizacionCalc::calcularFletePorPais(
        $fleteTable,
        $pais,
        $pesoPais
    );
}
$gasto = CotizacionCalc::calcularGasto($gastoTable, $totalFob);
$totalPeru = $totalFob + $flete + $gasto;
$rawFactor = $totalFob ? ($flete + $gasto) / $totalFob : 0;

/* === Cálculo por item === */
foreach ($detalle as &$item) {
    $precio      = $item['_precio'];
    $precioDscto = $item['_precio_dscto'];
    $margen      = $item['_margen'];
    $qty         = (int)$item['cantidad'];
    $margenDscto = round($precio * $margen, 2);
    $margen_uti = (float)$item['margen'];
    
    $factorPU = round(
        $precioDscto * round($rawFactor, 4),
        2
    );

    $precioM = round(
        $precioDscto + $factorPU,
        2
    );

    $utilidad = round(
        $precioM * $margen_uti,
        2
    );

    $precioCliente = round(
        $precioM + $utilidad,
        2
    );
    
    $item['margen_pct']      = $margen * 100;
    $item['margen_dscto']    = $margenDscto;
    $item['precio_dscto']    = $precioDscto;
    $item['factor_pu']       = $factorPU;
    $item['precio_m']        = $precioM;
    $item['utilidad']        = $utilidad;
    $item['precio_cliente']  = $precioCliente;
}

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
            color: rgba(25, 135, 84, 0.15); 
        }

        .watermark.anulada {
            color: rgba(220, 53, 69, 0.15); 
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
            <th class="right">Precio Uni.</th>
            <th class="right">Valor</th>
            <?php if ($isAdmin): ?><th class="center">Dscto</th><?php endif; ?>
            <?php if ($isAdmin): ?><th class="right">Precio Dscto</th><?php endif; ?>
            <?php if ($isAdmin): ?><th class="right">Factor PU</th><?php endif; ?>
            <?php if ($isAdmin): ?><th class="right">Precio M</th><?php endif; ?>
            <th class="right">Margen</th>
            <?php if ($isAdmin): ?><th class="right">Utilidad</th><?php endif; ?>
            <th class="right">Precio Cliente</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($detalle as $i): ?>
        <tr>
            <td class="left">
                <b><?= $i['modelo'] ?></b><br>
                <?= $i['descripcion'] ?><br>
                <?= $i['grupo'] ?>
            </td>

            <td class="center"><?= $i['cantidad'] ?></td>
            <td class="center"><?= number_format($i['peso'], 2) ?></td>
            <td class="right"><?= number_format($i['_precio'], 2) ?></td>
            <td class="right"><?= number_format($i['margen_pct'], 0) ?>%</td>
            <?php if ($isAdmin): ?><td class="center"><?= number_format($i['margen_dscto'], 2) ?></td><?php endif; ?>
            <?php if ($isAdmin): ?><td class="right"><?= number_format($i['precio_dscto'], 2) ?></td><?php endif; ?>
            <?php if ($isAdmin): ?><td class="right"><?= number_format($i['factor_pu'], 2) ?></td><?php endif; ?>
            <?php if ($isAdmin): ?><td class="right"><?= number_format($i['precio_m'], 2) ?></td><?php endif; ?>
            <td class="right"><?= number_format($i['margen'], 2) ?></td>
            <?php if ($isAdmin): ?><td class="right"><?= number_format($i['utilidad'], 2) ?></td><?php endif; ?>
            <td class="right"><?= number_format($i['precio_cliente'], 2) ?></td>
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
//echo $html;
//exit;
$pdf = new Dompdf();
$pdf->loadHtml($html);
$pdf->setPaper('A4', 'portrait');
$pdf->render();
$pdf->stream("cotizacion_" . md5($cotizacion['id']) . ".pdf", ["Attachment" => false]);