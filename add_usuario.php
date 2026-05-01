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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Usuarios</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Tables</a></li>
                            <li class="breadcrumb-item active">Usuarios</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <h4 class="header-title mb-0">Registrar Usuario</h4>
                                <button type="button" class="btn btn-dark btn-icon" onclick="window.location.href='usuarios.php'"><i class="ti ti-corner-up-left-double fs-18"></i> </button>
                            </div>

                            <div class="card-body">
                                <form class="needs-validation form-add-user" novalidate="">
                                    <div class="row">
                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="documento">Documento</label>
                                            <input type="number" class="form-control" id="documento" name="documento" placeholder="12345678" required="" min="9999999" max="9999999999">
                                            <div class="invalid-feedback">Please provide a document.</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="nombres">Nombres</label>
                                            <input type="text" class="form-control" id="nombres" name="nombres" placeholder="First name" required="" maxlength="70">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="apellidos">Apellidos</label>
                                            <input type="text" class="form-control" id="apellidos" name="apellidos" placeholder="Last name" required="" maxlength="70">
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>

                                        <div class="col-md-3 mb-3">
                                            <label class="form-label">Cargo</label>
                                            <select id="cargo" name="cargo" class="form-select" required="">
                                                <option value="">-- Seleccione --</option>
                                                <option value="1">Admin</option>
                                                <option value="2">Gestor</option>
                                                <option value="3">Supervisor</option>
                                                <option value="4">Tecnico</option>
                                                <option value="5">Compras</option>
                                            </select>
                                            <div class="invalid-feedback">
                                                Please select an option.
                                            </div>
                                        </div>

                                    </div>

                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label" for="email">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" placeholder="example@dominio.com" required="" maxlength="70">
                                            <div class="invalid-feedback">Please provide a valid email.</div>
                                        </div>

                                        <div class="col-md-4 mb-3">
                                            <label class="form-label" for="telefono">Teléfono</label>
                                            <input type="number" class="form-control" data-toggle="input-mask" data-mask-format="999999999" inputmode="number" min="99999999" id="telefono" name="telefono" placeholder="123456789" required="">
                                            <div class="invalid-feedback">Please provide a valid phone.</div>
                                        </div>

                                        <div class="col-md-4 mb-3">
                                            <label class="form-label d-block">Sexo</label>
                                            <input type="radio" class="form-check-input" id="sexo1" name="sexo" required value="1">
                                            <label for="sexo1" class="ms-1">Masculino</label>
                                            <input type="radio" class="form-check-input" id="sexo2" name="sexo" required value="2">
                                            <label for="sexo2" class="ms-1">Femenino</label>
                                            <div class="invalid-feedback">
                                                Please select an option.
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="invalidCheck" required="">
                                            <label class="form-check-label form-label" for="invalidCheck">
                                                Agree to terms and conditions
                                            </label>
                                            <div class="invalid-feedback">You must agree before submitting.</div>
                                        </div>
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
    <script src="./assets/js/form-validation.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>