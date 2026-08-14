<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
$cargo = (int)($_SESSION['session_cargo'] ?? 0);
$puedeEditar = in_array($cargo, [1, 3, 5], true);
$verMontos = in_array($cargo, [1, 3, 5], true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Detalle de Compra</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Cotix360 Compras" name="description" />
    <meta content="amvsoft.tech" name="author" />
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <link rel="stylesheet" href="./assets/css/mermaid.min.css">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/receta.css?v=1.4" rel="stylesheet" type="text/css" />
    <link href="./assets/css/compras_detalle.css?v=2.0" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
</head>

<body>
    <div class="wrapper">
        <?php include ROOT . '/layout/menu.php'; ?>
        <header class="app-topbar">
            <?php include ROOT . '/layout/navbar.php'; ?>
        </header>

        <div class="page-content">
            <div class="page-container">
                <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                    <div class="flex-grow-1">
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Compras</h4>
                    </div>
                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="compras.php">Compras</a></li>
                            <li class="breadcrumb-item active">Detalle</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header receta-form-header border-bottom border-dashed d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div class="receta-title-wrap">
                                    <h4 class="header-title mb-0">Compra #<span id="compra_id"></span></h4>
                                    <p class="text-muted fs-14 mb-0" id="compra_nombre_display"></p>
                                </div>

                                <div class="row g-3 flex-grow-1 justify-content-center receta-meta-row">
                                    <div class="col-lg-3">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:shield-user-bold" class="fs-28 text-primary"></iconify-icon>
                                            </div>
                                            <div><p class="text-dark fw-medium fs-12 mb-0"><span id="usuario"></span></p></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:user-check-bold" class="fs-28 text-success"></iconify-icon>
                                            </div>
                                            <div><p class="text-dark fw-medium fs-12 mb-0"><span id="usuario_aprobador"></span></p></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:calendar-date-broken" class="fs-28 text-primary"></iconify-icon>
                                            </div>
                                            <div><p class="text-dark fw-medium fs-12 mb-0"><span id="fecha"></span></p></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:verified-check-bold" class="fs-28 text-warning"></iconify-icon>
                                            </div>
                                            <div><p class="text-dark fw-medium fs-12 mb-0"><span id="estado"></span></p></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end receta-header-actions">
                                    <button type="button" class="btn btn-dark btn-icon" data-bs-toggle="modal" data-bs-target="#cliente-modal" data-bs-title="Cliente" data-bs-placement="bottom"><i class="ti ti-user-circle fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon <?= $verMontos ? '' : 'd-none' ?>" data-bs-toggle="modal" data-bs-target="#adicionales-negativos-modal" data-bs-title="Adicionales negativos" data-bs-placement="bottom"><i class="ti ti-circle-minus fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon <?= $verMontos ? '' : 'd-none' ?>" data-bs-toggle="modal" data-bs-target="#adicionales-positivos-modal" data-bs-title="Adicionales positivos" data-bs-placement="bottom"><i class="ti ti-circle-plus fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon <?= $verMontos ? '' : 'd-none' ?>" id="btnToggleCharts" data-bs-toggle="tooltip" data-bs-title="Ver gráficos" data-bs-placement="bottom"><i class="ti ti-chart-arcs fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon" data-bs-toggle="modal" data-bs-target="#info-header-modal" data-bs-title="Buscar items" data-bs-placement="bottom" id="btnBuscarItems"><i class="ti ti-search fs-18"></i></button>
                                    <a href="compras.php" class="btn btn-dark btn-icon" data-bs-toggle="tooltip" data-bs-title="Volver" data-bs-placement="bottom"><i class="ti ti-corner-up-left-double fs-18"></i></a>
                                </div>
                            </div>

                            <form class="form-compras" novalidate data-user-cargo="<?= $cargo ?>" data-puede-editar="<?= $puedeEditar ? '1' : '0' ?>">
                                <div class="card-body p-0">
                                    <div id="semaforo-wrap" class="py-1 text-center d-none"></div>
                                    <div class="bg-warning bg-opacity-10 py-1 text-center">
                                        <p class="m-0"><b id="total_item">0</b> item(s) en compras</p>
                                    </div>
                                    <div class="border border-dashed p-2 rounded text-center">
                                        <div class="row align-items-center">
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">SubTotal S/. </span> <span id="total_soles">0.00</span></p>
                                            </div>
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">SubTotal $ </span> <span id="total_dolares">0.00</span></p>
                                            </div>
                                            <div class="col-lg-3 col-12 border-end">
                                                <p class="text-muted fw-medium fs-12 mb-1">
                                                    <span class="tipo-cambio-label">Tipo de Cambio SUNAT (Venta)</span>
                                                    <span id="tipo_cambio_sunat" class="external-event fc-event bg-warning-subtle text-warning-emphasis">0.000</span>
                                                </p>
                                            </div>
                                            <div class="col-lg-3 col-12">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:money-bag-outline" class="text-success"></iconify-icon> <span class="text-dark">Total S/.</span> <span id="total_peru">0.00</span></p>
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:dollar-minimalistic-outline" class="text-success"></iconify-icon> <span class="text-dark">Total $</span> <span id="total_peru_dolares">0.00</span></p>
                                                <small class="text-muted d-block">Incluye descuentos adicionales negativos</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="px-2 py-2 border-bottom">
                                        <div class="input-group input-group-sm" style="max-width: 420px;">
                                            <span class="input-group-text"><i class="ti ti-search"></i></span>
                                            <input type="search" class="form-control" id="comprasDetalleSearch" placeholder="Buscar item en compras...">
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-custom table-centered table-sm table-hover mb-0 compras-detalle-table">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Detalle</th>
                                                    <th>Tipo</th>
                                                    <th class="text-center">Cant.</th>
                                                    <th class="text-end <?= $verMontos ? '' : 'd-none' ?>">Precio</th>
                                                    <th class="text-end <?= $verMontos ? '' : 'd-none' ?>">Total</th>
                                                    <th class="text-center">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody id="comprasDetalleBody">
                                                <tr><td colspan="7" class="text-center text-muted py-4">Cargando detalle...</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                </div>
            </div>

            <div id="charts-section" class="<?= $verMontos ? '' : 'd-none' ?>"></div>
        </div>
    </div>
    <?php include ROOT . '/layout/footer.html'; ?>

        </div>
    </div>

    <div id="charts-modal" class="modal fade" tabindex="-1" aria-labelledby="charts-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header text-bg-dark border-0">
                    <h4 class="modal-title" id="charts-modalLabel">Análisis gráfico de la compra</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="charts-wrap">
                    <div class="row g-3">
                        <div class="col-xl-6 d-flex">
                            <div class="card compras-chart-card w-100">
                                <div class="card-body d-flex flex-column">
                                    <h4 class="header-title mb-3">Monto por Categoría</h4>
                                    <div dir="ltr" class="radar-chart-wrap flex-grow-1">
                                        <div id="chart-radar-subcat" class="apex-charts" data-colors="#39afd1"></div>
                                        <div id="radar-hover-layer" class="radar-hover-layer"></div>
                                        <div id="radar-custom-tooltip" class="radar-custom-tooltip"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 d-flex">
                            <div class="card compras-chart-card w-100">
                                <div class="card-body d-flex flex-column">
                                    <h4 class="header-title mb-3">Ingeniería vs Compras</h4>
                                    <div dir="ltr" class="flex-grow-1">
                                        <div id="chart-radialbar-comparativo" class="apex-charts" data-colors="#6ac75a,#39afd1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card compras-chart-card compras-chart-card-wide">
                                <div class="card-body d-flex flex-column">
                                    <h4 class="header-title mb-3">Items de la compra</h4>
                                    <div dir="ltr" class="compras-scatter-scroll flex-grow-1">
                                        <div id="chart-scatter-items" class="apex-charts" data-colors="#39afd1,#ce7e7e,#ffbc00,#6ac75a"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card compras-chart-card compras-chart-card-wide">
                                <div class="card-body d-flex flex-column">
                                    <h4 class="header-title mb-3">Distribución del monto por item</h4>
                                    <div dir="ltr" class="flex-grow-1">
                                        <div id="chart-treemap-items" class="apex-charts" data-colors="#ce7e7e,#6ac75a,#fa5c7c,#6c757d,#39afd1,#ffc35a"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="adicionales-negativos-modal" class="modal fade" tabindex="-1" aria-labelledby="adicionales-negativos-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header text-bg-danger border-0">
                    <h4 class="modal-title" id="adicionales-negativos-modalLabel">Adicionales negativos</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Item</th>
                                    <th>Detalle</th>
                                    <th class="text-end">Cantidad</th>
                                    <th class="text-end">Precio</th>
                                    <th class="text-end">Total $</th>
                                </tr>
                            </thead>
                            <tbody id="adicionalesNegativosBody">
                                <tr><td colspan="5" class="text-center text-muted py-4">Sin adicionales negativos.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <div class="me-auto fw-semibold text-muted">Suma adicionales negativos $: <span id="totalAdicionalesNegativos">0.00</span></div>
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="adicionales-positivos-modal" class="modal fade" tabindex="-1" aria-labelledby="adicionales-positivos-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header text-bg-success border-0">
                    <h4 class="modal-title" id="adicionales-positivos-modalLabel">Adicionales positivos</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-success bg-success-subtle text-success-emphasis border-0 fs-13">
                        Estos adicionales son informativos: no afectan el total ni el semáforo.
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Item</th>
                                    <th>Detalle</th>
                                    <th class="text-end">Cantidad</th>
                                    <th class="text-end">Precio</th>
                                    <th class="text-end">Total $</th>
                                </tr>
                            </thead>
                            <tbody id="adicionalesPositivosBody">
                                <tr><td colspan="5" class="text-center text-muted py-4">Sin adicionales positivos.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <div class="me-auto fw-semibold text-muted">Suma adicionales positivos $: <span id="totalAdicionalesPositivos">0.00</span></div>
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="cliente-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="cliente-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-bg-primary border-0">
                    <h4 class="modal-title" id="cliente-modalLabel">Información del cliente</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-lg-6">
                            <label class="form-label">RUC</label>
                            <input type="text" class="form-control" id="clienteRuc" readonly>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label">Nombre (Razón Social de la Empresa)</label>
                            <input type="text" class="form-control" id="clienteRazonSocial" readonly>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label">Nombre completo</label>
                            <input type="text" class="form-control" id="clienteNombreCompleto" readonly>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label">Correo</label>
                            <input type="email" class="form-control" id="clienteCorreo" readonly>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label">Celular</label>
                            <input type="text" class="form-control" id="clienteCelular" readonly>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label">Motivo</label>
                            <input type="text" class="form-control" id="clienteMotivo" readonly>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Dirección</label>
                            <textarea class="form-control" id="clienteDireccion" rows="3" readonly></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="condiciones-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="condiciones-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-bg-secondary border-0">
                    <h4 class="modal-title" id="condiciones-modalLabel">Datos comerciales</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-lg-4">
                            <label class="form-label" for="vendedor">Vendedor</label>
                            <input type="text" class="form-control" id="vendedor" maxlength="150" placeholder="Nombre del vendedor" <?= $verMontos ? '' : 'readonly' ?>>
                        </div>
                        <div class="col-lg-4">
                            <label class="form-label" for="vendedorCorreo">Email vendedor</label>
                            <input type="email" class="form-control" id="vendedorCorreo" maxlength="150" placeholder="correo@empresa.com" <?= $verMontos ? '' : 'readonly' ?>>
                        </div>
                        <div class="col-lg-4">
                            <label class="form-label" for="vendedorTelefono">Teléfono vendedor</label>
                            <input type="text" class="form-control" id="vendedorTelefono" maxlength="50" placeholder="Ej. 987654321" <?= $verMontos ? '' : 'readonly' ?>>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label" for="tiempoEntrega">Tiempo de entrega</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="tiempoEntrega" min="1" max="999" step="1" placeholder="Ej. 15" <?= $verMontos ? '' : 'readonly' ?>>
                                <span class="input-group-text">días</span>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-label" for="cantidadItemsReceta">Cantidad</label>
                            <input type="number" class="form-control" id="cantidadItemsReceta" min="1" max="5000" step="1" placeholder="Ej. 10" <?= $verMontos ? '' : 'readonly' ?>>
                        </div>
                        <div class="col-lg-12">
                            <label class="form-label" for="descripcionReceta">Descripcion</label>
                            <textarea class="form-control" id="descripcionReceta" maxlength="500" rows="3" placeholder="Descripcion de la receta" <?= $verMontos ? '' : 'readonly' ?>></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="condicionesPago">Condiciones de pago</label>
                            <textarea class="form-control" id="condicionesPago" rows="3" maxlength="200" placeholder="Ej. 50% adelanto, 50% contra entrega" <?= $verMontos ? '' : 'readonly' ?>></textarea>
                        </div>
                        <div class="col-12">
                            <div class="commercial-conditions-box">
                                <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
                                    <div class="commercial-conditions-title mb-0">Condiciones Económicas por Suspensión de Servicio:</div>
                                    <div class="form-check form-switch mb-0">
                                        <input class="form-check-input" type="checkbox" id="condicionesEconomicasVisible" <?= $verMontos ? '' : 'disabled' ?>>
                                        <label class="form-check-label" for="condicionesEconomicasVisible">Mostrar en oferta</label>
                                    </div>
                                </div>
                                <p class="commercial-conditions-text">
                                    En caso de que el servicio sea pausado o suspendido por un periodo superior a
                                    <span class="commercial-days-input">
                                        <input type="number" class="form-control form-control-sm" id="condicionesEconomicasDias" min="1" max="999" step="1" placeholder="10" <?= $verMontos ? '' : 'readonly' ?>>
                                        <span>días</span>
                                    </span>, debido a causas no imputables a nuestra empresa, y en concordancia con los principios generales establecidos, la propuesta inicial comercial perderá su vigencia. La reanudación del servicio estará sujeta a una reformulación de la oferta comercial que reconozca los costos directos e indirectos derivados de la postergación, tales como la reposición, adquisición o sustitución de materiales y componentes afectados por deterioro o caducidad, así como los costos de renovación de acreditaciones, homologaciones e inducciones del personal y demás requisitos técnicos o administrativos exigidos para la operatividad del proyecto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-secondary" id="btnGuardarCondiciones" <?= $verMontos ? '' : 'disabled' ?>>Guardar datos</button>
                </div>
            </div>
        </div>
    </div>

    <div id="info-header-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="info-header-modalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 840px;">
            <div class="modal-content">
                <div class="modal-header text-bg-info border-0">
                    <h4 class="modal-title" id="info-header-modalLabel">Buscar item para agregar a la compra</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Base</label>
                            <select id="filterBase" class="form-select"><option value="">-- Seleccione --</option></select>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Categoria</label>
                            <select id="categoria" class="form-select" disabled><option value="">-- Seleccione --</option></select>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Sub Categoria 1</label>
                            <select id="subCat1" class="form-select" disabled><option value="">-- Seleccione --</option></select>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Sub Categoria 2</label>
                            <select id="subCat2" class="form-select" disabled><option value="">-- Seleccione --</option></select>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label mb-2">Tipo de agregado</label>
                            <div class="btn-group flex-wrap" role="group" aria-label="Tipo de agregado">
                                <input type="radio" class="btn-check" name="tipoAgregadoCompras" id="tipoAgregadoCompraNormal" value="normal" checked>
                                <label class="btn btn-outline-dark" for="tipoAgregadoCompraNormal"><i class="ti ti-circle me-1"></i> Normal</label>

                                <input type="radio" class="btn-check" name="tipoAgregadoCompras" id="tipoAgregadoCompraPositivo" value="adicional_positivo">
                                <label class="btn btn-outline-success" for="tipoAgregadoCompraPositivo"><i class="ti ti-plus me-1"></i> Adicional positivo</label>

                                <input type="radio" class="btn-check" name="tipoAgregadoCompras" id="tipoAgregadoCompraNegativo" value="adicional_negativo">
                                <label class="btn btn-outline-danger" for="tipoAgregadoCompraNegativo"><i class="ti ti-minus me-1"></i> Adicional negativo</label>
                            </div>
                            <span class="text-muted fs-12 d-block mt-2">Los adicionales positivos son informativos; los negativos descuentan del total y afectan el semáforo.</span>
                        </div>
                        <div class="col-12">
                            <div id="productoFiltersWrap" class="row d-none">
                                <div class="col-md-6 mb-1">
                                    <select id="filterMarca" class="form-select" disabled data-choices data-search-enabled="true" data-search-placeholder-value="Buscar marca..."><option value="">-- Seleccione Marca --</option></select>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <select id="filterModelo" class="form-select" disabled data-choices data-search-enabled="true" data-search-placeholder-value="Buscar modelo..."><option value="">-- Seleccione Modelo --</option></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 mb-3">
                            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                                <div>
                                    <label class="form-label mb-0">Items disponibles</label>
                                    <span class="text-muted fs-12 d-block">Selecciona un item desde la tabla para agregarlo a la compra.</span>
                                </div>
                                <span class="badge bg-light text-dark" id="itemsResultCount">0 resultados</span>
                            </div>
                            <div class="input-group input-group-sm mb-2">
                                <span class="input-group-text"><i class="ti ti-search"></i></span>
                                <input type="search" class="form-control" id="itemsDisponiblesSearch" placeholder="Buscar item disponible...">
                            </div>
                            <div class="table-responsive receta-items-table-wrap">
                                <table class="table table-sm table-hover align-middle mb-0 receta-items-table">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th class="text-center">Cant.</th>
                                            <th class="text-end <?= $verMontos ? '' : 'd-none' ?>">Precio</th>
                                            <th class="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recetaItemsTableBody">
                                        <tr><td colspan="4" class="text-center text-muted py-4">Selecciona Base, Categoria y Sub Categorias para cargar los items.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
    <script src="./assets/js/compras_detalle.js?v=2.8"></script>
    <script src="./assets/js/apexcharts.min.js"></script>
    <script src="./assets/js/compras_charts.js?v=2.3"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
