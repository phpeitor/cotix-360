<?php
require_once ROOT . '/controller/check_session.php';
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
    <link href="./assets/css/receta.css?v=1.2" rel="stylesheet" type="text/css" />
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
                                    <a href="compras.php" class="btn btn-dark btn-icon" data-bs-toggle="tooltip" data-bs-title="Volver" data-bs-placement="bottom"><i class="ti ti-corner-up-left-double fs-18"></i></a>
                                </div>
                            </div>

                            <div class="card-body p-0">
                                <div class="bg-warning bg-opacity-10 py-1 text-center">
                                    <p class="m-0"><b id="total_item">0</b> item(s) en compras</p>
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
                                        <tbody id="comprasDetalleBody">
                                            <tr><td colspan="6" class="text-center text-muted py-4">Cargando detalle...</td></tr>
                                        </tbody>
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

    <div id="cliente-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-bg-primary border-0">
                    <h4 class="modal-title">Cliente</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12"><strong>RUC:</strong> <span id="clienteRuc">-</span></div>
                        <div class="col-12"><strong>Razón social:</strong> <span id="clienteRazonSocial">-</span></div>
                        <div class="col-12"><strong>Dirección:</strong> <span id="clienteDireccion">-</span></div>
                        <div class="col-12"><strong>Contacto:</strong> <span id="clienteNombreCompleto">-</span></div>
                        <div class="col-12"><strong>Correo:</strong> <span id="clienteCorreo">-</span></div>
                        <div class="col-12"><strong>Celular:</strong> <span id="clienteCelular">-</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/compras_detalle.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
