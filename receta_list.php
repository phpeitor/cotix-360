<?php
  require_once __DIR__ . "/controller/check_session.php";
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
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Tables</a></li>
                            <li class="breadcrumb-item active">Cotizaciones</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                
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
                                                        data-date-format="d M Y"
                                                        data-range-date="true"
                                                    />
                                                    <span class="input-group-text bg-primary border-primary text-white">
                                                        <i class="ti ti-calendar fs-15"></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="col-auto">
                                                <a href="#" id="btn_buscar" class="btn btn-sm rounded-pill btn-info"><i class="ti ti-search fs-22"></i> Buscar</a>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>

                            <div class="card-body">
                                <div id="table-gridjs"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include __DIR__ . '/layout/footer.html'; ?>

        </div>
    </div>
    
    <!-- Info Header Modal -->
    <div id="info-header-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="info-header-modalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 760px;">
            <div class="modal-content">
                <div class="modal-header text-bg-info border-0">
                    <h4 class="modal-title" id="info-header-modalLabel">
                        Total 🇵🇪: <span id="modal-total-peru"></span>
                    </h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3 align-items-center">

                        <!-- Tasa Anual -->
                        <div class="col-md-4">
                            <h6 class="text-muted fw-semibold mb-2 text-center">Tasa Anual</h6>
                            <div class="input-step border bg-body-secondary p-1 rounded-pill d-flex justify-content-center overflow-visible">
                                <button type="button" id="btn-anual-minus" class="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1">-</button>
                                <input type="number" id="input-tasa-anual" class="text-dark text-center border-0 bg-body-secondary rounded" value="25" min="1" max="50" readonly style="width:60px" />
                                <button type="button" id="btn-anual-plus" class="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1">+</button>
                            </div>
                        </div>

                        <!-- Tasa Mensual -->
                        <div class="col-md-4">
                            <h6 class="text-muted fw-semibold mb-2 text-center">Tasa Mensual</h6>
                            <div class="d-flex gap-2 align-items-center justify-content-center">
                                <div class="avatar-sm flex-shrink-0">
                                    <span class="avatar-title bg-success-subtle text-success rounded-circle fs-22">
                                        <iconify-icon icon="solar:banknote-2-bold-duotone"></iconify-icon>
                                    </span>
                                </div>
                                <h4 class="mb-0 fw-bold" id="display-tasa-mensual">-</h4>
                            </div>
                        </div>

                        <!-- Cuota -->
                        <div class="col-md-4">
                            <h6 class="text-muted fw-semibold mb-2 text-center">Cuota</h6>
                            <div class="d-flex gap-2 align-items-center justify-content-center">
                                <div class="avatar-sm flex-shrink-0">
                                    <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-22">
                                        <iconify-icon icon="solar:wallet-money-bold-duotone"></iconify-icon>
                                    </span>
                                </div>
                                <h4 class="mb-0 fw-bold" id="display-cuota">-</h4>
                            </div>
                        </div>

                    </div>

                    <hr class="my-3" />

                    <div class="table-responsive">
                        <table class="table table-sm table-bordered align-middle mb-0" id="tabla-financiamiento">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-center">Tiempo</th>
                                    <th class="text-end">Saldo</th>
                                    <th class="text-end">Amortización</th>
                                    <th class="text-end">Interés</th>
                                    <th class="text-end">Cuota</th>
                                </tr>
                            </thead>
                            <tbody id="financiamiento-body"></tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-info" id="btn-guardar-financiamiento">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <?php include __DIR__ . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="./assets/js/table-gridjs-cotizacion.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>