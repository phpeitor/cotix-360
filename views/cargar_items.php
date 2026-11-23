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
    <link rel="stylesheet" href="./assets/css/mermaid.min.css">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/branding.css?v=1.9" rel="stylesheet" type="text/css" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/cargar_items.css?v=1.1" rel="stylesheet" type="text/css" />
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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Items</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Files</a></li>
                            <li class="breadcrumb-item active">Items</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card cargar-items-card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <h4 class="header-title mb-1">Carga masiva de items</h4>
                                    <span class="text-muted fs-13">Importa o actualiza el catálogo usando una plantilla Excel.</span>
                                </div>
                                <span class="badge rounded-pill bg-primary-subtle text-primary"><i class="ti ti-file-spreadsheet me-1"></i>Excel .xls / .xlsx</span>
                            </div>

                            <div class="card-body">
                                <form class="form-cargar-item" novalidate>
                                    <input class="visually-hidden" type="file" id="fileItems" name="fileItems" accept=".xls,.xlsx" aria-label="Seleccionar archivo Excel">
                                    <div class="cargar-items-dropzone" id="cargarItemsDropzone" role="group" tabindex="0" aria-label="Seleccionar o arrastrar archivo Excel">
                                        <div class="cargar-items-dropzone-icon"><i class="ti ti-cloud-upload"></i></div>
                                        <div class="cargar-items-dropzone-copy">
                                            <h5 class="mb-1">Arrastra tu archivo aquí</h5>
                                            <p class="text-muted mb-0">o selecciona un archivo Excel desde tu equipo</p>
                                        </div>
                                        <button type="button" class="btn btn-outline-primary" id="btnSeleccionarArchivo"><i class="ti ti-folder-open me-1"></i>Elegir archivo</button>
                                    </div>

                                    <div class="cargar-items-file d-none" id="cargarItemsFileInfo">
                                        <div class="cargar-items-file-icon"><i class="ti ti-file-spreadsheet"></i></div>
                                        <div class="min-w-0 flex-grow-1">
                                            <strong class="d-block text-truncate" id="cargarItemsFileName"></strong>
                                            <small class="text-muted" id="cargarItemsFileSize"></small>
                                        </div>
                                        <button type="button" class="btn btn-sm btn-light btn-icon" id="btnQuitarArchivo" aria-label="Quitar archivo" title="Quitar archivo"><i class="ti ti-x"></i></button>
                                    </div>

                                    <div class="d-flex justify-content-end mt-3">
                                        <button type="submit" class="btn btn-success" id="btnSubirItems" disabled>
                                            <i class="ti ti-upload me-1"></i><span>Iniciar carga</span>
                                        </button>
                                    </div>

                                    <div class="cargar-items-progress d-none" id="cargarItemsProgress" aria-live="polite">
                                        <div class="d-flex justify-content-between gap-2 mb-2">
                                            <span id="cargarItemsProgressText">Preparando archivo…</span>
                                            <span class="fw-semibold" id="cargarItemsProgressPercent">0%</span>
                                        </div>
                                        <div class="progress" role="progressbar" aria-label="Progreso de carga" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated" id="cargarItemsProgressBar" style="width:0%"></div>
                                        </div>
                                    </div>
                                </form>

                                <details class="cargar-items-schema mt-4">
                                    <summary><span><i class="ti ti-list-details me-2"></i>Formato requerido del Excel</span><span class="text-muted small">12 columnas, en este orden</span></summary>
                                    <div class="cargar-items-schema-grid">
                                        <?php foreach (["MODELO", "PRECIO UNITARIO", "MONEDA", "GRUPO DE DESCUENTO", "DESCRIPCION", "CATEGORIA DE PRODUCTO", "CLASE DE PRODUCTO", "PAIS DE ORIGEN", "PESO EN KG", "STATUS", "PROVEEDOR", "ORIGEN"] as $index => $columna): ?>
                                            <div class="cargar-items-schema-field"><span><?= $index + 1 ?></span><code><?= htmlspecialchars($columna, ENT_QUOTES, 'UTF-8') ?></code></div>
                                        <?php endforeach; ?>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row" id="cards-container"></div>
                <div id="pagination-container"></div>
            </div>

            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>
    <div class="modal fade" id="modalErroresCarga" tabindex="-1" aria-labelledby="modalErroresCargaTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <div>
                        <h5 class="modal-title" id="modalErroresCargaTitle">Filas con errores</h5>
                        <p class="text-muted small mb-0" id="modalErroresCargaSubtitle"></p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body pt-0">
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-light"><tr><th>Fila Excel</th><th>Modelo</th><th>Error detectado</th></tr></thead>
                            <tbody id="erroresCargaBody"><tr><td colspan="3" class="text-center text-muted py-4">Cargando errores…</td></tr></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include ROOT . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/form-carga.js?v=2.1"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>

</html>
