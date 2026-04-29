<?php
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

$isAdmin = isset($_SESSION['session_cargo']) && $_SESSION['session_cargo'] == 1;

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

<h2 style="text-align:center; margin-bottom:4px;">
    RECETA COMERCIAL
</h2>
<p style="text-align:center; font-size:11px; margin-top:0;">
    Documento informativo – No constituye factura
</p>
<hr>
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
            <th>Precio</th>
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
            <td class="right"><?= htmlspecialchars($i['precio_formateado']) ?></td>
            <td class="center"><?= $i['cantidad'] ?></td>
        </tr>
        <?php endforeach ?>
    </tbody>
</table>
<br>
<br>
<p>
    <strong>Total Producto:</strong> S/ <?= number_format($totalProductoPeru, 2) ?><br>
    <strong>Total Servicio:</strong> S/ <?= number_format($totalServicioPeru, 2) ?><br>
</p>
<p>
    <strong>Total Items:</strong> <?= $totalItems ?><br>
    <strong>Total S/:</strong> <?= number_format($totalSoles, 2) ?><br>
    <?php if ($totalDolares > 0): ?>
        <strong>Total $:</strong> <?= number_format($totalDolares, 2) ?><br>
        <strong>Total Perú:</strong> S/ <?= number_format($totalPeru, 2) ?><br>
        <strong>Tipo de Cambio:</strong> <?= number_format($tipoCambio, 3) ?><br>
    <?php endif; ?>
</p>
</body>
</html>

<?php

$html = ob_get_clean();
/*echo $html;
exit;
*/
$pdf = new Dompdf();
$pdf->loadHtml($html);
$pdf->setPaper('A4', 'portrait');
$pdf->render();
$pdf->stream("receta_" . md5($receta['id']) . ".pdf", ["Attachment" => false]);