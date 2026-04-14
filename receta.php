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
    <link href="./assets/css/receta.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
</head>

<body>
    <div class="wrapper">
        <?php include __DIR__ . '/menu.php'; ?>
        <header class="app-topbar">
           <?php include __DIR__ . '/navbar.php'; ?>
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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Templates</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Template</a></li>
                            <li class="breadcrumb-item active">Plantilla Receta</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Plantilla de Receta</h4>
                                <div class="d-flex align-items-center gap-2">
                                    <button type="button" class="btn btn-outline-info me-2" id="btnPreviewReceta" data-bs-toggle="modal" data-bs-target="#previewRecetaModal">
                                        <i class="ti ti-eye me-1" data-bs-toggle="tooltip" data-bs-title="Vista previa" data-bs-placement="top"></i> Preview
                                    </button>
                                    <button type="button" class="btn btn-dark btn-icon" data-bs-toggle="modal" data-bs-target="#info-header-modal"><i class="ti ti-search fs-18" data-bs-toggle="tooltip" data-bs-title="Buscar" data-bs-placement="bottom"></i></button>
                                    <button type="button" class="btn btn-dark btn-icon"><i class="ti ti-corner-up-left-double fs-18"></i> </button>
                                </div>
                            </div>
                            <form class="needs-validation form-receta" novalidate="">
                                <div class="card-body p-0">
                                    <div class="bg-success bg-opacity-10 py-1 text-center">
                                        <p class="m-0"><b id="total_item">0</b> item(s) agregados</p>
                                    </div>
                                    <div class="border border-dashed p-2 rounded text-center isadmin">
                                        <div class="row">
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total S/. </span> <span id="total_soles">0.00</span></p>
                                            </div>
                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-14 mb-0"><span class="text-dark">Total $ </span> <span id="total_dolares">0.00</span></p>
                                            </div>

                                            <div class="col-lg-3 col-6 border-end">
                                                <p class="text-muted fw-medium fs-12 mb-1"><span class="text-dark">Tipo de Cambio SUNAT (Venta)</span> <span id="tipo_cambio_sunat_fecha" class="text-muted"></span></p>
                                                <div class="input-step border bg-body-secondary p-1 rounded-pill d-inline-flex overflow-visible">
                                                    <button type="button" id="tcMinus" class="tc-minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
                                                    <input type="number" id="tipo_cambio_sunat" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1.000" min="0" step="0.001" />
                                                    <button type="button" id="tcPlus" class="tc-plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
                                                </div>
                                            </div>
                                            
                                            <div class="col-lg-3 col-12">
                                                <p class="text-muted fw-medium fs-14 mb-0"><iconify-icon icon="solar:money-bag-outline" class="text-success"></iconify-icon> <span class="text-dark">Total PE S/.</span> <span id="total_peru">0.00</span></p>
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
                                            <div class="text-muted" id="pagination_info">
                                                Showing <span class="fw-semibold" id="pagination_from">1</span> of <span class="fw-semibold" id="pagination_to">10</span> Results
                                            </div>
                                        </div>
                                        <div class="col-sm-auto mt-3 mt-sm-0" id="pagination_wrapper">
                                            <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center" id="pagination_list">
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

                                        <div class="col-sm-auto mt-3 mt-sm-0">
                                            <button type="submit" class="btn btn-success btn-icon">
                                                <i class="ti ti-send"></i>
                                            </button>
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

    <!-- Info Header Modal -->
    <div id="info-header-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="info-header-modalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 760px;">
            <div class="modal-content">
                <div class="modal-header text-bg-info border-0">
                    <h4 class="modal-title" id="info-header-modalLabel">
                        Buscar item para agregar a la receta
                    </h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Base</label>
                            <select id="filterBase" class="form-select">
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label class="form-label">Categoria</label>
                            <select id="categoria" class="form-select" disabled>
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label class="form-label">Sub Categoria 1</label>
                            <select id="subCat1" class="form-select" disabled>
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label class="form-label">Sub Categoria 2</label>
                            <select id="subCat2" class="form-select" disabled>
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-12 mb-3">
                            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                                <div>
                                    <label class="form-label mb-0">Items disponibles</label>
                                    <span class="text-muted fs-12 d-block">Selecciona un item desde la tabla para agregarlo a la receta.</span>
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
                                        <tr>
                                            <td colspan="4" class="text-center text-muted py-4">Selecciona Base, Categoria y Sub Categorias para cargar los items.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div><!--modal -->

    <div class="modal fade preview-modal" id="previewRecetaModal" tabindex="-1" aria-labelledby="previewRecetaModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <div>
                        <h4 class="modal-title mb-1" id="previewRecetaModalLabel">Vista previa de receta</h4>
                        <p class="text-muted mb-0 fs-13">Detalle completo de todos los items sin paginación.</p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="preview-summary">
                        <span class="badge bg-light text-dark">Items: <span id="previewTotalItems">0</span></span>
                        <span class="badge bg-light text-dark">S/.: <span id="previewTotalSoles">0.00</span></span>
                        <span class="badge bg-light text-dark">$: <span id="previewTotalDolares">0.00</span></span>
                        <span class="badge bg-light text-dark">PE: <span id="previewTotalPE">0.00</span></span>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0 preview-table">
                            <thead class="table-light">
                                <tr>
                                    <th>Item</th>
                                    <th>Detalle</th>
                                    <th>Tipo</th>
                                    <th class="text-center">Cant.</th>
                                    <th class="text-end">Precio</th>
                                </tr>
                            </thead>
                            <tbody id="previewRecetaTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include __DIR__ . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js?v=1.7"></script>
    <script src="./assets/js/formUtils.js"></script>
    <script src="./assets/js/form-receta.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>