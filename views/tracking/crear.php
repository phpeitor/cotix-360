<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Nuevo Tracking</title>
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
        <?php include ROOT . '/layout/menu.php'; ?>
        <header class="app-topbar">
            <?php include ROOT . '/layout/navbar.php'; ?>
        </header>

        <div class="page-content">
            <div class="page-container">
                <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                    <div class="flex-grow-1">
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Nuevo Tracking</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="tracking.php">Trackings</a></li>
                            <li class="breadcrumb-item active">Nuevo Tracking</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Registrar tracking manual</h4>
                                <button type="button" class="btn btn-dark btn-icon js-navigate" data-href="tracking.php"><i class="ti ti-corner-up-left-double fs-18"></i> </button>
                            </div>

                            <div class="card-body">
                                <form class="needs-validation form-add-tracking" method="post" novalidate="">
                                    <div class="row">

                                        <div class="col-md-6 mb-3">
                                            <label class="form-label" for="ruc">RUC</label>
                                            <input type="text" class="form-control" id="ruc" name="ruc" placeholder="12345678901" required="" inputmode="numeric" minlength="11" maxlength="11">
                                            <div class="invalid-feedback">Ingrese un RUC de 11 dígitos.</div>
                                        </div>

                                        <div class="col-md-6 mb-3">
                                            <label class="form-label" for="razon_social_empresa">Razón Social</label>
                                            <input type="text" class="form-control" id="razon_social_empresa" name="razon_social_empresa" placeholder="Razón social de la empresa" required="" maxlength="200">
                                            <div class="invalid-feedback">Ingrese la razón social.</div>
                                        </div>

                                        <div class="col-md-12 mb-3">
                                            <label class="form-label" for="nombre">Nombre</label>
                                            <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Nombre del proyecto/receta" required="" maxlength="200">
                                            <div class="invalid-feedback">Ingrese el nombre.</div>
                                        </div>

                                    </div>

                                    <button class="btn btn-primary" type="submit">Guardar</button>
                                </form>
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
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="./assets/js/tracking-form.js?v=1.0"></script>
</body>
</html>