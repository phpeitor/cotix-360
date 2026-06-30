<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Categorías Receta</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
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

        <div class="page-content">
            <div class="page-container">
                <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                    <div class="flex-grow-1">
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Categorías Receta</h4>
                    </div>
                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="items_receta.php">Base Receta</a></li>
                            <li class="breadcrumb-item active">Categorías</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Gestión de Categorías</h4>
                                <button type="button" id="btnNuevo" class="btn btn-sm rounded-pill btn-success">
                                    <i class="ti ti-plus fs-18"></i> Nuevo
                                </button>
                            </div>
                            <div class="card-body">
                                <div id="table-gridjs"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>

    <div class="modal fade" id="categoriaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <form id="categoriaForm" class="needs-validation" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title" id="categoriaModalTitle">Nueva Categoría</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="categoriaId" name="id">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" for="tipo">Tipo</label>
                                <input type="text" class="form-control" id="tipo" name="tipo" maxlength="50" required placeholder="PRODUCTO">
                                <div class="invalid-feedback">Ingrese el tipo.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" for="categoria">Categoría</label>
                                <input type="text" class="form-control" id="categoria" name="categoria" maxlength="150" required placeholder="ENCLOUSED">
                                <div class="invalid-feedback">Ingrese la categoría.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" for="sub_cat_1">Sub Categoría 1</label>
                                <input type="text" class="form-control" id="sub_cat_1" name="sub_cat_1" maxlength="150">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" for="sub_cat_2">Sub Categoría 2</label>
                                <input type="text" class="form-control" id="sub_cat_2" name="sub_cat_2" maxlength="150">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label" for="estado">Estado</label>
                                <select id="estado" name="estado" class="form-select">
                                    <option value="1">Activo</option>
                                    <option value="0">Suspendido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>
    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="./assets/js/table-gridjs-receta-categorias.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
