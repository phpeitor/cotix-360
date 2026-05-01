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
                                <h4 class="header-title mb-0">Registrar Item </h4>
                                <button type="button" class="btn btn-dark btn-icon" onclick="window.location.href='items_receta.php'"><i class="ti ti-corner-up-left-double fs-18"></i> </button>
                            </div>

                            <div class="card-body">
                                <form class="needs-validation form-add-item-receta" novalidate="">
                                    <div class="row">

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Tipo</label>
                                            <select id="filterTipo" name="tipo" class="form-select" required>
                                                <option value="">-- Todas --</option>
                                                <?php foreach ($tipos as $b): ?>
                                                    <option value="<?= $b['tipo'] ?>"><?= $b['tipo'] ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Categoría</label>
                                            <select id="filterCategoria" name="categoria" class="form-select" required>
                                                <option value="">-- Todos --</option>
                                                <?php foreach ($categorias as $b): ?>
                                                    <option value="<?= $b['categoria'] ?>"><?= $b['categoria'] ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Sub Categoría 1</label>
                                            <select id="filterSubCategoria1" name="sub_cat_1" class="form-select" required>
                                                <option value="">-- Todas --</option>
                                                <?php foreach ($sub_cat_1 as $b): ?>
                                                    <option value="<?= $b['sub_cat_1'] ?>"><?= $b['sub_cat_1'] ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Sub Categoría 2</label>
                                            <select id="filterSubCategoria2" name="sub_cat_2" class="form-select" required>
                                                <option value="">-- Todas --</option>
                                                <?php foreach ($sub_cat_2 as $b): ?>
                                                    <option value="<?= $b['sub_cat_2'] ?>"><?= $b['sub_cat_2'] ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="nombre">Nombre</label>
                                            <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Item Name" required="" maxlength="200">
                                            <div class="invalid-feedback">Please provide a nombre.</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="descripcion">Descripcion</label>
                                            <input type="text" class="form-control" id="descripcion" name="descripcion" placeholder="ZB H 50PPR DUAL CHNL" maxlength="350">
                                            <div class="invalid-feedback">Please provide a descripcion.</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="modelo">Modelo</label>
                                            <input type="text" class="form-control" id="modelo" name="modelo" placeholder="ZBH00502" required="" maxlength="70">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="marca">Marca</label>
                                            <input type="text" class="form-control" id="marca" name="marca" placeholder="PROMART" required="" maxlength="70">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="uni_medida">Unidad Medida</label>
                                            <input type="text" class="form-control" id="uni_medida" name="uni_medida" placeholder="UND" required="" maxlength="70">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-2 mb-3" style="display: none;">
                                            <label class="form-label" for="stock">Stock</label>
                                            <input type="number" class="form-control" id="stock" name="stock" placeholder="0" value="0" min="0" step="1" max="100">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Moneda</label>
                                            <select id="moneda" name="moneda" class="form-select" required="">
                                                <option value="">-- Seleccione --</option>
                                                <option value="SOL">S/</option>
                                                <option value="DOLLAR">$</option>
                                            </select>
                                            <div class="invalid-feedback">
                                                Please select an option.
                                            </div>
                                        </div>

                                        <?php if ((int)$_SESSION['session_cargo'] !== 4): ?>
                                        <div class="col-md-2 mb-3">
                                            <label class="form-label" for="precio">Precio </label>
                                            <input type="number" class="form-control" id="precio" name="precio" placeholder="100.00" value="0" required="" min="0" max="9999999" step="0.01">
                                            <div class="invalid-feedback">Please provide a valid precio.</div>
                                        </div>
                                        <?php endif; ?>
                                    </div>

                                    <button class="btn btn-primary" type="submit">Enviar</button>
                                </form>
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
    <script src="./assets/js/app.js?v=1.0"></script>
    <script src="./assets/js/add-item-receta.js?v=1.0"></script>
    <script src="./assets/js/form-validation.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>