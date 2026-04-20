<?php
  require_once __DIR__ . "/controller/check_session.php";
  require_once __DIR__ . "/model/item.php";
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
    <link rel="stylesheet" href="./assets/css/mermaid.min.css">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
</head>

<body>
    <div class="wrapper">
            <?php include __DIR__ . '/layout/menu.php'; ?>
        <header class="app-topbar">
            <?php include __DIR__ . '/layout/navbar.php'; ?>
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
                 <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                    <div class="flex-grow-1">
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Cotizaciones</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Template</a></li>
                            <li class="breadcrumb-item active">Cotizaciones</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Cotización #<span id="cotizacion_id"></span></h4>

                                <div class="row g-3">
                                    <div class="col-lg-4">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:shield-user-bold" class="fs-28 text-primary"></iconify-icon>
                                            </div>

                                            <div>
                                                <p class="text-dark fw-medium fs-12 mb-0"><span id="usuario"></span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:calendar-date-broken" class="fs-28 text-primary"></iconify-icon>
                                            </div>

                                            <div>
                                                <p class="text-dark fw-medium fs-12 mb-0"><span id="fecha"></span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                <iconify-icon icon="solar:refresh-square-bold" class="fs-28 text-primary"></iconify-icon>
                                            </div>

                                            <div>
                                                <p class="text-dark fw-medium fs-12 mb-0">
                                                    <span id="estado"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-dark btn-icon" onclick="window.location.href='cotizaciones.php'"><i class="ti ti-corner-up-left-double fs-18"></i> </button>
                            </div>
                            <form id="formCotizacion" class="needs-validation form-calculo" novalidate="">
                                <div class="card-body p-0">
                                    <div class="bg-success bg-opacity-10 py-1 text-center">
                                        <p class="m-0"><b id="total_item">0</b> item(s) agregados</p>
                                    </div>
                                    <div class="border border-dashed p-2 rounded text-center isadmin">
                                        <div class="row">
                                            <div class="col-lg-1 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:box-bold-duotone" class="text-danger"></iconify-icon> <span class="text-dark">Peso : </span> <span id="total_peso">0.00</span></p>
                                            </div>
                                            <div class="col-lg-1 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:dollar-outline" class="text-success"></iconify-icon> <span class="text-dark">FOB : </span> <span id="total_fob">0.00</span></p>
                                            </div>
                                            <div class="col-lg-2 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:dollar-broken" class="text-warning"></iconify-icon> <span class="text-dark">Flete : </span> <span id="total_flete">0.00</span></p>
                                            </div>
                                            <div class="col-lg-2 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:dollar-broken" class="text-info"></iconify-icon> <span class="text-dark">Gastos : </span> <span id="total_gasto">0.00</span></p>
                                            </div>
                                            <div class="col-lg-2 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:calculator-minimalistic-bold" class="text-primary"></iconify-icon> <span class="text-dark">Interés : </span> <span id="total_impuesto">0.00</span></p>
                                            </div>
                                            <div class="col-lg-2 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:money-bag-outline" class="text-success"></iconify-icon> <span class="text-dark">Total 🇵🇪: </span> <span id="total_peru">0.00</span></p>
                                            </div>
                                            <div class="col-lg-2 col-4 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:course-up-bold" class="text-danger"></iconify-icon> <span class="text-dark">Factor: </span> <span id="total_factor">0.00</span></p>
                                            </div>
                                        </div>
                                        <div class="row mt-2 pt-2 border-top border-dashed">
                                            <div class="col-12 text-end">
                                                <p class="text-muted fw-medium fs-12 mb-0">
                                                    Ajuste redondeo: <span id="total_ajuste_redondeo">0.00</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
                                            <tbody>
                                                
                                            </tbody>
                                        </table>
                                    </div> 
                                </div> 
                            
                                <div class="card-footer border-0">
                                    <div class="align-items-center justify-content-between row text-center text-sm-start">
                                        <div class="col-sm">
                                            <div class="text-muted">
                                                Showing <span class="fw-semibold">1</span> of <span class="fw-semibold">10</span> Results
                                            </div>
                                        </div>
                                        <div class="col-sm-auto mt-3 mt-sm-0">
                                            <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
                                                <li class="page-item disabled">
                                                    <a href="#" class="page-link"><i class="ti ti-chevron-left"></i></a>
                                                </li>
                                                <li class="page-item active">
                                                    <a href="#" class="page-link">1</a>
                                                </li>
                                                <li class="page-item">
                                                    <a href="#" class="page-link"><i class="ti ti-chevron-right"></i></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> 
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            <!-- End page-container-->                                  
            </div>

            <?php include __DIR__ . '/layout/footer.html'; ?>
        </div>
    </div>
    <?php include __DIR__ . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js?v=1.7"></script>
    <script src="./assets/js/formUtils.js"></script>
    <script src="./assets/js/form-cotizacion.js?v=3"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>