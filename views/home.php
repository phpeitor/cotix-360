<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Admin Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
    <meta content="amvsoft.tech" name="author" />
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/branding.css?v=1.9" rel="stylesheet" type="text/css" />
    <link href="./assets/css/dashboard.css?v=2.7" rel="stylesheet" type="text/css" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
</head>

<body>
    <div class="wrapper">
            <?php include ROOT . '/layout/menu.php'; ?>
        <header class="app-topbar">
            <?php include ROOT . '/layout/navbar.php'; ?>
        </header>

        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-transparent">
                    <div class="card mb-0 shadow-none">
                        <div class="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                            <i class="ti ti-search fs-22"></i>
                            <input type="search" class="form-control border-0" id="search-modal-input" placeholder="Search for actions, people,">
                            <button type="button" class="btn p-0" data-bs-dismiss="modal" aria-label="Close">[esc]</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="page-container">

                <div class="row">
                    <div class="col-12">
                        <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column">
                            <div class="flex-grow-1">
                                <h4 class="fs-18 text-uppercase fw-bold m-0">Resumen general</h4>
                                <p class="text-muted mb-0 mt-1">Indicadores y actividad reciente</p>
                            </div>
                            <div class="mt-3 mt-sm-0">
                                <form action="javascript:void(0);">
                                    <div class="row g-2 mb-0 align-items-center">
                                        <div class="col-sm-auto">
                                            <div class="input-group">
                                               <input
                                                    type="text"
                                                    id="filterDate"
                                                    class="form-control"
                                                    data-provider="flatpickr"
                                                    data-date-format="d M"
                                                    data-range-date="true"
                                                />
                                                <span class="input-group-text bg-primary border-primary text-white">
                                                    <i class="ti ti-calendar fs-15"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-3 dashboard-layout">
                    <div class="col-xxl-9 col-lg-8 dashboard-main">
                        <div class="row g-3 row-cols-xxl-4 row-cols-md-2 row-cols-1 text-center">
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Usuarios"> Usuarios</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:user-heart-linear"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_user" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="usuarios" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Cotizaciones"> Cotizaciones</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:bill-list-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_cotizacion" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="cotizaciones" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Items"> Items</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:box-minimalistic-broken"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_item" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="items" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Excels"> Excels</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:file-send-outline"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_carga" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="carga" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Recetas"> Recetas</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:document-add-broken"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_receta" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="recetas" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Items"> Items Receta</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:cart-large-2-outline"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_item_receta" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="receta_items" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Productos Receta"> Productos Receta</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:box-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_receta_producto" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="productos" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Total Servicios Receta"> Servicios Receta</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:settings-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 id="total_receta_servicio" class="mb-0 fw-bold">0</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="dashboard-card-change" data-dashboard-variation="servicios" title="Variación del período seleccionado"></span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                        </div><!-- end row -->

                        <div class="row g-3">
                            <div class="col-xxl-6 col-lg-6">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center border-bottom border-dashed">
                                        <h4 class="header-title">Cotizaciones por estado</h4>
                                    </div>

                                    <div class="card-body">
                                        <div id="multiple-radialbar" class="apex-charts"></div>

                                        <div class="row mt-2">
                                           <div class="col" id="donut-legend"></div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xxl-6 col-lg-6">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center border-bottom border-dashed">
                                        <h4 class="header-title">Recetas por estado</h4>
                                    </div>

                                    <div class="card-body">
                                        <div id="multiple-radialbar-receta" class="apex-charts"></div>

                                        <div class="row mt-2">
                                           <div class="col" id="donut-legend-receta"></div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xxl-6 col-lg-6">
                                <div class="card dashboard-chart-card" data-dashboard-chart-card="revenue-chart">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h4 class="header-title">Tendencia de cotizaciones</h4>
                                        <div class="dashboard-chart-controls" role="group" aria-label="Controles del gráfico de cotizaciones">
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="zoom-in" title="Acercar" aria-label="Acercar"><i class="ti ti-zoom-in"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="zoom-out" title="Alejar" aria-label="Alejar"><i class="ti ti-zoom-out"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="reset" title="Restablecer" aria-label="Restablecer"><i class="ti ti-home"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="fullscreen" title="Ampliar" aria-label="Ampliar"><i class="ti ti-maximize"></i></button>
                                        </div>
                                    </div>
                                    
                                    <div class="card-body pt-0">
                                        <div dir="ltr">
                                            <div id="revenue-chart" class="apex-charts"></div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xxl-6 col-lg-6">
                                <div class="card dashboard-chart-card" data-dashboard-chart-card="receta-chart">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h4 class="header-title">Tendencia de recetas</h4>
                                        <div class="dashboard-chart-controls" role="group" aria-label="Controles del gráfico de recetas">
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="zoom-in" title="Acercar" aria-label="Acercar"><i class="ti ti-zoom-in"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="zoom-out" title="Alejar" aria-label="Alejar"><i class="ti ti-zoom-out"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="reset" title="Restablecer" aria-label="Restablecer"><i class="ti ti-home"></i></button>
                                            <button type="button" class="btn btn-sm btn-light" data-dashboard-chart-action="fullscreen" title="Ampliar" aria-label="Ampliar"><i class="ti ti-maximize"></i></button>
                                        </div>
                                    </div>
                                    
                                    <div class="card-body pt-0">
                                        <div dir="ltr">
                                            <div id="receta-chart" class="apex-charts"></div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div> <!-- end row-->

                    </div> <!-- end col-->

                    <div class="col-xxl-3 col-lg-4 info-sidebar">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex mb-3 justify-content-between align-items-center">
                                    <h4 class="header-title">Cotizaciones recientes</h4>
                                    <div>
                                        <a href="calculo.php" class="btn btn-sm btn-primary rounded-circle btn-icon"><i class="ti ti-plus"></i></a>
                                    </div>
                                </div>

                                <div id="dashboard-cotizaciones"></div>

                                <div class="mt-3 text-center">
                                    <a href="cotizaciones.php" class="text-decoration-underline fw-semibold ms-auto link-offset-2 link-dark">Ver todas</a>
                                </div>
                            </div>

                            <div class="card-body p-0 border-top border-dashed">
                                <div class="px-3 pt-3 d-flex mb-3 justify-content-between align-items-center">
                                    <h4 class="header-title mb-0">Recetas recientes</h4>
                                    <div>
                                        <a href="receta.php" class="btn btn-sm btn-primary rounded-circle btn-icon"><i class="ti ti-plus"></i></a>
                                    </div>
                                </div>

                                <div class="px-3" id="dashboard-recetas"></div>

                                <div class="mt-3 mb-3 text-center">
                                    <a href="receta_list.php" class="text-decoration-underline fw-semibold ms-auto link-offset-2 link-dark">Ver todas</a>
                                </div>
                            </div>

                            <div class="card-body p-0 border-top border-dashed">
                                <h4 class="header-title px-3 mb-2 mt-3">Ítems recientes</h4>
                                <div class="my-3 px-3 dashboard-recent-items-scroll" data-simplebar>
                                    <div id="dashboard-items" class="timeline-alt py-0"></div>
                                </div> 
                            </div>

                            <div class="card-body">
                                <div class="card mb-0 bg-warning bg-opacity-25">
                                    <div class="card-body dashboard-upgrade-card" id="dashboardUpgradeCard">
                                        <div class="dashboard-upgrade-content">
                                            <h1><i class="ti ti-receipt-tax text-warning"></i></h1>
                                            <h4 class="text-warning">Actualizar a Profesional</h4>
                                            <p class="text-warning text-opacity-75" id="dashboardUpgradeHint" aria-live="polite">Completa el reto visual para continuar con tu actualización.</p>
                                        </div>
                                        <div class="dashboard-puzzle" role="group" aria-label="Rompecabezas para completar el nombre Cotix360">
                                            <div class="dashboard-puzzle-board">
                                                <span class="dashboard-puzzle-piece piece-a has-tab-right has-tab-bottom" data-puzzle-letter="C" data-puzzle-row="1" data-puzzle-column="1">C</span>
                                                <span class="dashboard-puzzle-piece piece-b has-tab-right has-tab-bottom" data-puzzle-letter="O" data-puzzle-row="1" data-puzzle-column="2">O</span>
                                                <span class="dashboard-puzzle-piece piece-c has-tab-right has-tab-bottom" data-puzzle-letter="T" data-puzzle-row="1" data-puzzle-column="3">T</span>
                                                <span class="dashboard-puzzle-piece piece-d has-tab-bottom" data-puzzle-letter="I" data-puzzle-row="1" data-puzzle-column="4">I</span>
                                                <span class="dashboard-puzzle-piece piece-e has-tab-right" data-puzzle-letter="X" data-puzzle-row="2" data-puzzle-column="1">X</span>
                                                <span class="dashboard-puzzle-piece piece-f has-tab-right" data-puzzle-letter="6" data-puzzle-row="2" data-puzzle-column="3">6</span>
                                                <span class="dashboard-puzzle-piece piece-g" data-puzzle-letter="0" data-puzzle-row="2" data-puzzle-column="4">0</span>
                                                <button type="button" class="dashboard-puzzle-slot has-tab-right" id="dashboardPuzzleSlot" aria-label="Espacio para una pieza de COTIX360" hidden><span class="dashboard-puzzle-slot-letter"></span><i class="ti ti-check"></i></button>
                                            </div>
                                            <button type="button" class="dashboard-puzzle-moving" id="dashboardPuzzlePiece" aria-label="Arrastra esta ficha al espacio vacío o pulsa Enter" title="Arrastra la ficha al espacio vacío" disabled>
                                                <span class="dashboard-puzzle-moving-letter">?</span>
                                            </button>
                                        </div>
                                        <button type="button" class="btn btn-sm rounded-pill btn-info dashboard-upgrade-action" id="dashboardUpgradeActivate">
                                            <span class="dashboard-upgrade-action-label">Activar</span>
                                            <span class="dashboard-upgrade-action-loading" aria-hidden="true">
                                                <i class="ti ti-loader-2"></i>
                                            </span>
                                        </button>
                                        <div class="dashboard-upgrade-success" aria-live="polite">
                                            <i class="ti ti-circle-check-filled"></i>
                                            <span>Reto completado</span>
                                        </div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div>
                        </div> <!-- end card-->
                    </div> <!-- end col-->
                </div> <!-- end row-->

            </div> <!-- container -->

            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>
    <?php include ROOT . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/apexcharts.min.js"></script>
    <script src="./assets/js/formUtils.js?v=2.1"></script>
    <script src="./assets/js/dashboard-sales.js?v=1.2"></script>
    <script src="./assets/js/dashboard.js?v=2.9"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>
