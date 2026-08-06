<?php
require_once __DIR__ . '/../config/bootstrap.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
    @session_start();
}
use Dompdf\Dompdf;
require_once __DIR__ . '/../vendor/autoload.php';
require_once ROOT . '/model/receta.php';
require_once ROOT . '/model/item.php';
require_once ROOT . '/controller/oferta_comercial_helpers.php';

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

function columnasOfertaSubcatPdf(array $ofertaGroupCols, string $subcat): array {
    if (array_key_exists($subcat, $ofertaGroupCols)) {
        return array_values(array_intersect($ofertaGroupCols[$subcat], ['descripcion', 'marca']));
    }

    return ['descripcion', 'marca'];
}

/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

$hash = $_REQUEST['id'] ?? null;
if (!$hash) {
    http_response_code(400);
    exit("ID inválido");
}
$mostrarDetalle = !isset($_REQUEST['detalle']) || (string)$_REQUEST['detalle'] === '1';
$esOferta = isset($_REQUEST['oferta']) && (string)$_REQUEST['oferta'] === '1';

$recetaModel = new Receta();
$items      = new Item();

$receta = $recetaModel->obtenerPorHash($hash);
$detalle    = $recetaModel->obtenerDetallePorHash($hash);
$categorias = $recetaModel->obtenerCategoriasParaEdicion((int)$receta['id']);
$totalesOfertaComercial = totalesOfertaExcel($categorias['rows'] ?? []);

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
$ofertaItemsParam = trim((string)($_REQUEST['oferta_items'] ?? ''));
$ofertaItemIds = $ofertaItemsParam !== ''
    ? array_filter(array_map('intval', explode(',', $ofertaItemsParam)), fn($id) => $id > 0)
    : [];
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
$detalleOfertaVisible = $detalle;
if ($esOferta && !empty($ofertaItemIds)) {
    $idsPermitidos = array_flip($ofertaItemIds);
    $detalleOfertaVisible = array_values(array_filter($detalle, function ($item) use ($idsPermitidos) {
        return isset($idsPermitidos[(int)($item['id'] ?? 0)]);
    }));
}
$detalleOfertaAgrupado = $esOferta ? agruparOfertaExcel($detalleOfertaVisible) : [];
$seccionesCondicionalesOferta = $esOferta ? seccionesCondicionalesOfertaExcel($detalleOfertaVisible) : [];
ob_start();
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?= $esOferta ? 'Oferta PDF' : 'Receta PDF' ?></title>
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
<body class="<?= $esOferta ? 'offer-pdf' : 'recipe-pdf' ?>">
<?php
    $estado = strtolower($receta['estado'] ?? '');
    $wmClass = '';

    if ($esOferta) {
        $wmClass = 'copia';
    } elseif ($estado === 'aprobada') {
        $wmClass = 'aprobada';
    } elseif ($estado === 'anulada') {
        $wmClass = 'anulada';
    }
?>

<?php if ($wmClass): ?>
    <div class="watermark <?= $wmClass ?>">
        <?= htmlspecialchars($esOferta ? 'COPIA' : ($receta['estado'] ?? '')) ?>
    </div>
<?php endif; ?>

<?php
    $numeroReceta = formatearNumeroRecetaPdf($receta['id']);
    $fechaReceta = formatearFechaPdf($receta['created_at'] ?? null);
    $fechaAprobacion = strtolower((string)($receta['estado'] ?? '')) === 'aprobada'
        ? formatearFechaPdf($receta['updated_at'] ?? null)
        : '';
    $usuarioRegistro = trim((string)($receta['usuario'] ?? ''));
    $usuarioActual = trim((string)($_SESSION['session_usuario'] ?? $receta['usu_upd'] ?? $receta['usuario'] ?? ''));
    $nombreReceta = trim((string)preg_replace('/\s*-\s*\d+$/', '', trim((string)($receta['nombre'] ?? 'RECETA'))));
    $tituloDocumento = $esOferta ? 'OFERTA ' . $nombreReceta : $nombreReceta;
    $clienteLineasOferta = array_filter([
        trim((string)($receta['cliente_razon_social_empresa'] ?? '')) !== '' ? 'Cliente: ' . trim((string)$receta['cliente_razon_social_empresa']) : '',
        trim((string)($receta['cliente_ruc'] ?? '')) !== '' ? 'RUC: ' . trim((string)$receta['cliente_ruc']) : '',
        trim((string)($receta['cliente_nombre_completo'] ?? '')) !== '' ? 'Contacto: ' . trim((string)$receta['cliente_nombre_completo']) : '',
        trim((string)($receta['cliente_correo'] ?? '')) !== '' ? 'Correo: ' . trim((string)$receta['cliente_correo']) : '',
        trim((string)($receta['cliente_celular'] ?? '')) !== '' ? 'Celular: ' . trim((string)$receta['cliente_celular']) : '',
        trim((string)($receta['cliente_motivo'] ?? '')) !== '' ? 'Motivo: ' . trim((string)$receta['cliente_motivo']) : '',
        trim((string)($receta['cliente_descripcion'] ?? '')) !== '' ? 'Descripcion: ' . trim((string)$receta['cliente_descripcion']) : '',
        (int)($receta['cliente_cantidad_items'] ?? 0) > 0 ? 'Cantidad items: ' . (int)$receta['cliente_cantidad_items'] : '',
        (int)preg_replace('/\D+/', '', (string)($receta['cliente_tiempo_entrega'] ?? '')) > 0 ? 'Tiempo de entrega: ' . (int)preg_replace('/\D+/', '', (string)$receta['cliente_tiempo_entrega']) . ' días' : '',
        trim((string)($receta['cliente_condiciones_pago'] ?? '')) !== '' ? 'Condiciones de pago: ' . trim((string)$receta['cliente_condiciones_pago']) : '',
        trim((string)($receta['cliente_vendedor'] ?? '')) !== '' ? 'Vendedor: ' . trim((string)$receta['cliente_vendedor']) : '',
        trim((string)($receta['cliente_vendedor_correo'] ?? '')) !== '' ? 'Email vendedor: ' . trim((string)$receta['cliente_vendedor_correo']) : '',
        trim((string)($receta['cliente_vendedor_telefono'] ?? '')) !== '' ? 'Teléfono vendedor: ' . trim((string)$receta['cliente_vendedor_telefono']) : '',
    ]);
    $empresaLinea1 = 'Sistema interno';
    $empresaLinea2 = 'Lima, Perú';
    $condicionesEconomicasDias = (int)($receta['cliente_condiciones_economicas_dias'] ?? 0);
    $condicionesEconomicasVisible = (int)($receta['cliente_condiciones_economicas_visible'] ?? 0) === 1;
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
    <?php if ($esOferta): ?>
        <?php
            $clienteHeaderRows = [
                ['Cliente', textoOfertaExcel($receta['cliente_razon_social_empresa'] ?? '')],
                ['Dirección', textoOfertaExcel($receta['cliente_direccion'] ?? '')],
                ['Ruc', textoOfertaExcel($receta['cliente_ruc'] ?? '')],
                ['Nombre', textoOfertaExcel($receta['cliente_nombre_completo'] ?? '')],
                ['E-mail', textoOfertaExcel($receta['cliente_correo'] ?? '')],
                ['Teléfonos', textoOfertaExcel($receta['cliente_celular'] ?? '')],
                ['Motivo', textoOfertaExcel($receta['cliente_motivo'] ?? '')],
            ];
            $comercialHeaderRows = [
                ['Empresa', 'MG INDUSTRIAL SOLUTIONS SAC-MG INDUSOL SAC'],
                ['RUC', '20548328854'],
                ['Dirección', 'Calle Brea y Pariñas N°102 , Ofic. 704,Piso 7'],
                ['', 'Santiago de Surco'],
                ['Vendedor', textoOfertaExcel($receta['cliente_vendedor'] ?? '')],
                ['E-mail', textoOfertaExcel($receta['cliente_vendedor_correo'] ?? '')],
                ['Teléfonos', '(01) 3048091, Cel. ' . textoOfertaExcel($receta['cliente_vendedor_telefono'] ?? '')],
            ];
        ?>
        <table class="offer-header-table">
            <tr>
                <td rowspan="7" class="offer-logo-cell">
                    <?php if ($logoDataUri): ?>
                        <img src="<?= $logoDataUri ?>" alt="Logo" class="offer-logo" />
                    <?php endif; ?>
                </td>
                <td colspan="3"><strong>MG INDUSTRIAL SOLUTION S.A.C.</strong></td>
                <td colspan="3" class="offer-quote-title" rowspan="2">Cotización<br>N° <?= escaparPdf(numeroOfertaExcel($receta)) ?></td>
            </tr>
            <tr><td colspan="3"><strong>MG INDUSOL SAC</strong></td></tr>
            <tr><td colspan="3"><strong>RUC:20548328854</strong></td><td colspan="3"></td></tr>
            <tr><td colspan="3"><strong>Calle Brea y Pariñas 102, of 704, Stgo de Surco.</strong></td><td colspan="3"></td></tr>
            <tr><td colspan="3"><strong>Central Telf. (01)3048091</strong></td><td colspan="3"></td></tr>
            <tr><td colspan="3"><strong>E-mail: ventas@mgindusol.com /contacto@mgindusol.com</strong></td><td colspan="3"></td></tr>
            <tr><td colspan="3"><strong>Página Web. www.mgindusol.com</strong></td><td colspan="3" class="center"><?= escaparPdf(fechaOfertaExcel($receta['updated_at'] ?? $receta['created_at'] ?? null)) ?></td></tr>
            <tr><td colspan="7" class="offer-spacer"></td></tr>
            <tr>
                <td colspan="3" class="offer-header-title">Cotización realizada para:</td>
                <td colspan="4" class="offer-header-title">Cotización realizada por:</td>
            </tr>
            <?php for ($idxHeader = 0; $idxHeader < 7; $idxHeader++): ?>
                <tr>
                    <td class="offer-label"><?= escaparPdf($clienteHeaderRows[$idxHeader][0]) ?></td>
                    <td class="center">:</td>
                    <td><?= escaparPdf($clienteHeaderRows[$idxHeader][1]) ?></td>
                    <td class="offer-label"><?= escaparPdf($comercialHeaderRows[$idxHeader][0]) ?></td>
                    <td class="center"><?= $comercialHeaderRows[$idxHeader][0] !== '' ? ':' : '' ?></td>
                    <td colspan="2"><?= escaparPdf($comercialHeaderRows[$idxHeader][1]) ?></td>
                </tr>
            <?php endfor; ?>
            <tr>
                <td colspan="7" class="offer-intro">Estimado/a, en respuesta a su solicitud de cotización sobre los precios de los productos de nuestra compañía. A continuación le brindamos nuestra oferta:</td>
            </tr>
        </table>
    <?php else: ?>
        <table class="hero">
            <tr>
                <td class="hero-left">
                    <?php if ($logoDataUri): ?>
                        <img src="<?= $logoDataUri ?>" alt="Logo" class="hero-logo" style="width: 45mm; height: auto;" />
                    <?php else: ?>
                        <div style="width: 45mm; height: 13mm; background: #f0f0f0;"></div>
                    <?php endif; ?>
                </td>
                <td class="hero-right">
                    <div class="title"><?= escaparPdf(trim($tituloDocumento) !== '' ? mb_strtoupper(trim($tituloDocumento), 'UTF-8') : 'RECETA') ?></div>
                </td>
            </tr>
        </table>

        <table class="panels">
            <tr>
                <td class="panel" style="padding-right: 6mm;">
                    <div class="panel-title">RECETA</div>
                    <div class="panel-name"><?= escaparPdf($usuarioRegistro !== '' ? $usuarioRegistro : 'Sin responsable') ?></div>
                    <p class="panel-line">Usuario registro: <?= escaparPdf($usuarioRegistro !== '' ? $usuarioRegistro : 'Desconocido') ?></p>
                    <p class="panel-line">Fecha creación: <?= escaparPdf($fechaReceta !== '' ? $fechaReceta : 'N/D') ?></p>
                    <p class="panel-line">Estado: <?= escaparPdf($receta['estado'] ?? 'N/D') ?> (<?= escaparPdf($receta['usu_upd'] ?? 'N/D') ?>)</p>
                    <?php if ($fechaAprobacion !== ''): ?>
                        <p class="panel-line">Fecha aprobación: <?= escaparPdf($fechaAprobacion) ?></p>
                    <?php endif; ?>
                </td>
                <td class="panel" style="padding-left: 6mm; text-align: right;">
                    <div class="panel-title">MG INDUSOL</div>
                    <p class="panel-line"><?= escaparPdf($empresaLinea1) ?></p>
                    <p class="panel-line"><?= escaparPdf($empresaLinea2) ?></p>
                </td>
            </tr>
        </table>
    <?php endif; ?>

    <?php if ($mostrarDetalle && $esOferta): ?>
        <?php
            $tiempoEntregaDiasOferta = (int)preg_replace('/\D+/', '', (string)($receta['cliente_tiempo_entrega'] ?? ''));
            $tiempoEntregaTextoOferta = $tiempoEntregaDiasOferta > 0 ? $tiempoEntregaDiasOferta . ' días' : 'TIEMPO DE ENTREGA';
            $descripcionRecetaOferta = textoOfertaExcel($receta['cliente_descripcion'] ?? '');
            $cantidadItemsOferta = (int)($receta['cliente_cantidad_items'] ?? 0);
        ?>
        <table class="offer-excel-table">
            <thead>
                <tr>
                    <th style="width:45%;">DESCRIPCION</th>
                    <th style="width:13%;">MARCA</th>
                    <th style="width:17%;">TIEMPO DE ENTREGA</th>
                    <th style="width:8%;">CANT.</th>
                    <th style="width:17%;">VALOR TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><?= escaparPdf($descripcionRecetaOferta) ?></td>
                    <td></td>
                    <td class="center"><?= escaparPdf($tiempoEntregaTextoOferta) ?></td>
                    <td class="center"><?= $cantidadItemsOferta > 0 ? (int)$cantidadItemsOferta : '' ?></td>
                    <td class="money">$ <?= number_format($totalesOfertaComercial['subtotal'], 2) ?></td>
                </tr>
                <?php foreach ($detalleOfertaAgrupado as $subcat => $itemsGrupo): ?>
                    <tr class="offer-pdf-group-row">
                        <td colspan="5"><?= escaparPdf(mb_strtoupper((string)$subcat, 'UTF-8')) ?></td>
                    </tr>
                    <?php $columnasSubcatOferta = columnasOfertaSubcatPdf($ofertaGroupCols, (string)$subcat); ?>
                    <?php foreach ($itemsGrupo as $i): ?>
                        <?php
                            $descripcion = normalizarTextoDetallePdf($i['descripcion'] ?? '');
                            $marca = trim((string)($i['marca'] ?? ''));
                            $lineasItemOferta = [textoOfertaExcel($i['nombre'] ?? 'SIN NOMBRE')];
                            $mostrarMarcaItemOferta = in_array('marca', $columnasSubcatOferta, true);
                            if (in_array('descripcion', $columnasSubcatOferta, true) && $descripcion !== '') {
                                $lineasItemOferta[] = $descripcion;
                            }
                        ?>
                        <tr>
                            <td><?= nl2br(escaparPdf(implode("\n", $lineasItemOferta))) ?></td>
                            <td><?= $mostrarMarcaItemOferta ? escaparPdf($marca) : '' ?></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endforeach; ?>
                <?php foreach ($seccionesCondicionalesOferta as $seccionOfertaPdf): ?>
                    <tr class="offer-pdf-group-row">
                        <td colspan="5"><?= escaparPdf($seccionOfertaPdf['titulo']) ?></td>
                    </tr>
                    <tr>
                        <td colspan="5"><?= nl2br(escaparPdf($seccionOfertaPdf['contenido'])) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php elseif ($mostrarDetalle): ?>
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
    <?php endif; ?>

    <?php if ($esOferta): ?>
        <table class="offer-summary-table">
            <tr>
                <td class="offer-green" style="width: 70%;">Observaciones:</td>
                <td style="width: 15%;"><strong>SUBTOTAL_1</strong></td>
                <td class="money" style="width: 15%;">$ <?= number_format($totalesOfertaComercial['subtotal'], 2) ?></td>
            </tr>
            <tr>
                <td rowspan="2"></td>
                <td><strong>IGV 18%</strong></td>
                <td class="money">$ <?= number_format($totalesOfertaComercial['igv'], 2) ?></td>
            </tr>
            <tr>
                <td><strong>TOTAL US$</strong></td>
                <td class="money">$ <?= number_format($totalesOfertaComercial['total'], 2) ?></td>
            </tr>
            <tr>
                <td colspan="3"><strong>SON:</strong> <?= escaparPdf(totalEnLetrasOfertaExcel($totalesOfertaComercial['total'])) ?></td>
            </tr>
        </table>

        <div class="offer-block-title">CONDICIONES COMERCIALES</div>
        <?php
            $condicionesPagoOferta = textoOfertaExcel($receta['cliente_condiciones_pago'] ?? '');
            $condicionesRowsOferta = [
                ['MONEDA', 'DOLARES AMERICANOS', ''],
                ['PLAZO DE ENTREGA', 'Ver detalle columna Stock; puesta y confirmada OC. (Sujeto a venta previa o disponibilidad)', ''],
                ['CONDICIONES DE PAGO', $condicionesPagoOferta !== '' ? $condicionesPagoOferta : 'Factura a 15 días.', ''],
                ['FORMA DE PAGO', 'Abono en cuenta corriente US$ Dólares y/o cuenta corriente soles, según moneda cotizada.', ''],
                ['CTA. CORRIENTE BCP', '193-2015964-1-81 / DOLARES', 'CCI 002-193-002015964181-18'],
                ['CTA. CORRIENTE BCP', '193-2006583-0-14 / SOLES', 'CCI 002-193-002006583014-11'],
                ['CTA. CORRIENTE BBVA', '0011-0194-0100112155-85 / DOLARES', 'CCI 011-194-000100112155-85'],
                ['VALIDEZ DE COTIZACION', '30 días', ''],
                ['LUGAR DE ENTREGA', 'Almacenes de MG INDUSOL SAC', ''],
                ['Garantía de Producto', 'Según fabricante por defectos de fabricacion o diseño.', ''],
                ['Garantía del Servicio', 'A convenir', ''],
            ];
        ?>
        <table class="offer-conditions-table">
            <?php foreach ($condicionesRowsOferta as [$label, $value, $extra]): ?>
                <tr>
                    <td style="width: 22%;"><strong><?= escaparPdf($label) ?></strong></td>
                    <td style="width: 2%;">:</td>
                    <td style="width: 46%;"><?= escaparPdf($value) ?></td>
                    <td style="width: 30%;"><?= escaparPdf($extra) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>

        <div class="offer-block-title">TERMINOS Y CONDICIONES DE VENTA</div>
        <div class="offer-terms">
            <?php foreach (terminosCondicionesVentaOferta($condicionesEconomicasDias, $condicionesEconomicasVisible) as $terminoOferta): ?>
                <?php $isTitleTermino = (bool)preg_match('/^\d+\.\s+(Sobre|Condiciones)\s+/u', $terminoOferta); ?>
                <p class="<?= $isTitleTermino ? 'term-title' : 'term-text' ?>"><?= escaparPdf($terminoOferta) ?></p>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
    <table style="width: 100%; margin-top: 2mm;">
        <?php if ($esTecnico): ?>
            <tr>
                <td style="background: transparent; padding: 2mm 3mm; border-bottom: 0.35mm solid #4f4f4f;">
                    <strong>Total Items:</strong> <?= $totalItems ?>
                </td>
            </tr>
        <?php else: ?>
            <tr>
                <td style="width: 50%; background: transparent; padding: 2mm 3mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Total Items:</strong> <?= $totalItems ?><br>
                    <strong>Costo Total Producto:</strong> $<?= number_format($totalProductoDolares, 2) ?><br>
                    <strong>Costo Total Servicio:</strong> $<?= number_format($totalServicioDolares, 2) ?>
                </td>
                <td style="width: 50%; background: transparent; padding: 2mm 3mm; border-bottom: 0.35mm solid #4f4f4f; vertical-align: top;">
                    <strong>Costo Total:</strong> $<?= number_format($totalDolaresConvertidos, 2) ?><br>
                    <strong>Margen:</strong> $<?= number_format($totalMargenDolaresAll, 2) ?><br>
                    <strong>SubTotal:</strong> $<?= number_format($baseTotalDolares, 2) ?><br>
                    <strong>IGV 18%:</strong> $<?= number_format($igvOverTotal, 2) ?><br>
                    <strong>Subtotal + IGV:</strong> $<?= number_format($totalConIgvDolares, 2) ?>
                </td>
            </tr>
        <?php endif; ?>
    </table>
    <?php endif; ?>
    
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
$pdf->stream(($esOferta ? 'oferta_' : '') . $nombreArchivoBase . '.pdf', ["Attachment" => false]);
