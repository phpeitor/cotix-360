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
                            <div class="card-header receta-form-header border-bottom border-dashed d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div class="receta-title-wrap">
                                    <h4 class="header-title mb-0">Receta #<span id="ingenieria_id"></span></h4>
                                    <div class="d-flex align-items-center gap-2 flex-wrap receta-name-row">
                                        <p class="text-muted fs-14 mb-0" id="receta_nombre_display"></p>
                                        <button type="button" class="btn btn-sm btn-outline-secondary" id="btnEditRecetaNombre" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar nombre"><i class="ti ti-edit"></i></button>
                                    </div>
                                    <input type="text" id="inputRecetaNombre" class="form-control form-control-sm d-none" style="max-width:400px;" placeholder="Nombre de la receta">
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
                                                <iconify-icon icon="solar:verified-check-bold" class="fs-28 text-success"></iconify-icon>
                                            </div>
                                            <div><p class="text-dark fw-medium fs-12 mb-0"><span id="estado"></span></p></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end receta-header-actions">
                                    <button type="button" class="btn btn-dark btn-icon" data-bs-toggle="modal" data-bs-target="#cliente-modal" data-bs-title="Cliente" data-bs-placement="bottom"><i class="ti ti-user-circle fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon" data-bs-toggle="modal" data-bs-target="#info-header-modal" data-bs-title="Buscar items" data-bs-placement="bottom"><i class="ti ti-search fs-18"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon js-navigate" data-href="ingenieria.php" data-bs-title="Volver" data-bs-placement="bottom"><i class="ti ti-corner-up-left-double fs-18"></i></button>
                                </div>
                            </div>

                            <form class="form-ingenieria" novalidate>
                                <div class="card-body p-0">
                                    <div class="bg-success bg-opacity-10 py-1 text-center">
                                        <p class="m-0"><b id="total_item">0</b> item(s) agregados</p>
                                    </div>
                                    <div class="border border-dashed p-2 rounded text-center">
                                        <div class="row align-items-center">
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total S/. </span> <span id="total_soles">0.00</span></p>
                                            </div>
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total $ </span> <span id="total_dolares">0.00</span></p>
                                            </div>
                                            <div class="col-lg-3 col-12 border-end">
                                                <p class="tipo-cambio-highlight text-muted fw-medium fs-12 mb-1">
                                                    <span class="tipo-cambio-label">Tipo de Cambio SUNAT (Venta)</span>
                                                    <span id="tipo_cambio_sunat" class="external-event fc-event bg-warning-subtle text-warning-emphasis tipo-cambio-pulse">0.000</span>
                                                    <button type="button" class="btn btn-sm btn-outline-secondary ms-2" id="btnEditTipoCambio" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar tipo de cambio"><i class="ti ti-edit"></i></button>
                                                    <input type="number" step="0.001" id="tipo_cambio_input" class="form-control form-control-sm d-none" style="width:110px;display:inline-block;margin-left:8px;">
                                                </p>
                                            </div>
                                            <div class="col-lg-3 col-12">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:money-bag-outline" class="text-success"></iconify-icon> <span class="text-dark">Total PE S/.</span> <span id="total_peru">0.00</span></p>
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:dollar-minimalistic-outline" class="text-success"></iconify-icon> <span class="text-dark">Total PE $</span> <span id="total_peru_dolares">0.00</span></p>
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
                                                    <th class="text-center">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ingenieriaDetalleBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="card-footer border-0 text-end">
                                    <button type="submit" class="btn btn-success btn-icon" data-bs-toggle="tooltip" data-bs-title="Guardar receta">
                                        <i class="ti ti-device-floppy"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>

    <div id="info-header-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="info-header-modalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 840px;">
            <div class="modal-content">
                <div class="modal-header text-bg-info border-0">
                    <h4 class="modal-title" id="info-header-modalLabel">Buscar item para agregar a ingeniería</h4>
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
                                    <span class="text-muted fs-12 d-block">Selecciona un item desde la tabla para agregarlo.</span>
                                </div>
                                <span class="badge bg-light text-dark" id="itemsResultCount">0 resultados</span>
                            </div>
                            <div class="table-responsive receta-items-table-wrap">
                                <table class="table table-sm table-hover align-middle mb-0 receta-items-table">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th class="text-center">Cant.</th>
                                            <th class="text-end">Precio</th>
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

    <div id="cliente-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="cliente-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
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

                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarCliente" disabled aria-disabled="true">Guardar cliente</button>
                </div>
            </div>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>
    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js?v=1.7"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="./assets/js/ingenieria_form.js?v=1.2"></script>
</body>
</html>
