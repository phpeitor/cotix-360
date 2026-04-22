<?php
  require_once __DIR__ . "/controller/check_session.php";
  require_once __DIR__ . "/model/item.php";

  $selects = new Item();
  $tipos = $selects->obtenerRecetaTipos();
  $categorias = $selects->obtenerRecetaCategorias();
  $sub_cat_1 = $selects->obtenerRecetaSubCategorias1();
  $sub_cat_2 = $selects->obtenerRecetaSubCategorias2();

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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Items Receta</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Tables</a></li>
                            <li class="breadcrumb-item active">Items Receta</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Base Items</h4>
                                <div class="d-flex align-items-center gap-2">
                                    <a href="receta_add.php" id="btn_registrar" class="btn btn-sm rounded-pill btn-success"><i class="ti ti-plus fs-22"></i></a>
                                    <a href="#" id="btn_buscar" class="btn btn-sm rounded-pill btn-info"><i class="ti ti-search fs-22"></i> Buscar</a>
                                </div>
                            </div>

                            <div class="card-body">
                                <input type="hidden" id="filterMd5">
                                <div class="row mb-3" id="filtros">
                                    <div class="col-md-3">
                                        <label class="form-label">Tipo</label>
                                        <select id="filterTipo" class="form-select">
                                            <option value="">-- Todas --</option>
                                            <?php foreach ($tipos as $b): ?>
                                                <option value="<?= $b['tipo'] ?>"><?= $b['tipo'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-3">
                                        <label class="form-label">Categoría</label>
                                        <select id="filterCategoria" class="form-select">
                                            <option value="">-- Todos --</option>
                                            <?php foreach ($categorias as $b): ?>
                                                <option value="<?= $b['categoria'] ?>"><?= $b['categoria'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-3">
                                        <label class="form-label">Sub Categoría 1</label>
                                        <select id="filterSubCategoria1" class="form-select">
                                            <option value="">-- Todas --</option>
                                            <?php foreach ($sub_cat_1 as $b): ?>
                                                <option value="<?= $b['sub_cat_1'] ?>"><?= $b['sub_cat_1'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-3">
                                        <label class="form-label">Sub Categoría 2</label>
                                        <select id="filterSubCategoria2" class="form-select">
                                            <option value="">-- Todas --</option>
                                            <?php foreach ($sub_cat_2 as $b): ?>
                                                <option value="<?= $b['sub_cat_2'] ?>"><?= $b['sub_cat_2'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <div id="table-gridjs"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include __DIR__ . '/layout/footer.html'; ?>
        </div>
    </div>
    <?php include __DIR__ . '/layout/theme.html'; ?>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="./assets/js/table-gridjs-item-receta.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>