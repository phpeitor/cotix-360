<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Ingeniería</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Cotix360 Ingeniería" name="description" />
    <meta content="amvsoft.tech" name="author" />
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <link rel="stylesheet" href="./assets/css/mermaid.min.css">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/receta.css?v=1.1" rel="stylesheet" type="text/css" />
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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Ingeniería</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="ingenieria.php">Ingeniería</a></li>
                            <li class="breadcrumb-item active">Detalle</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                <div>
                                    <h4 class="header-title mb-1">Receta Ingeniería #<span id="ingenieria_id">-</span></h4>
                                    <p class="text-muted fs-14 mb-0" id="receta_nombre_display">-</p>
                                </div>

                                <div class="d-flex align-items-center gap-2">
                                    <button type="button" class="btn btn-dark btn-icon js-navigate" data-href="ingenieria.php" data-bs-title="Volver" data-bs-placement="bottom">
                                        <i class="ti ti-corner-up-left-double fs-18"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="card-body">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Creado por</p>
                                            <h6 class="mb-0" id="usuario">-</h6>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Aprobado por</p>
                                            <h6 class="mb-0" id="usuario_aprobador">-</h6>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Estado</p>
                                            <h6 class="mb-0"><span class="badge badge-outline-success" id="estado">-</span></h6>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Fecha</p>
                                            <h6 class="mb-0" id="fecha">-</h6>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Cliente</p>
                                            <h6 class="mb-1" id="cliente_razon">-</h6>
                                            <p class="mb-1"><span class="text-muted">RUC:</span> <span id="cliente_ruc">-</span></p>
                                            <p class="mb-0"><span class="text-muted">Dirección:</span> <span id="cliente_direccion">-</span></p>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="border rounded p-3 h-100">
                                            <p class="text-muted mb-1 fs-12">Contacto</p>
                                            <h6 class="mb-1" id="cliente_contacto">-</h6>
                                            <p class="mb-1"><span class="text-muted">Correo:</span> <span id="cliente_correo">-</span></p>
                                            <p class="mb-0"><span class="text-muted">Celular:</span> <span id="cliente_celular">-</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div class="border border-dashed p-2 rounded text-center mb-2">
                                    <div class="row">
                                        <div class="col-lg-3 col-6 border-end">
                                            <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Items </span> <span id="total_item">0</span></p>
                                        </div>
                                        <div class="col-lg-3 col-6 border-end">
                                            <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total S/. </span> <span id="total_soles">0.00</span></p>
                                        </div>
                                        <div class="col-lg-3 col-6 border-end">
                                            <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total $ </span> <span id="total_dolares">0.00</span></p>
                                        </div>
                                        <div class="col-lg-3 col-6">
                                            <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Tipo Cambio </span> <span id="tipo_cambio">0.000</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Item</th>
                                                <th>Detalle</th>
                                                <th>Tipo</th>
                                                <th class="text-center">Cant.</th>
                                                <th class="text-end">Precio</th>
                                                <th class="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody id="ingenieriaDetalleBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/ingenieria_form.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
