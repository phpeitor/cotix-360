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
                                <h4 class="header-title mb-0">Base Users</h4>
                                <button type="button" class="btn btn-primary mb-0" onclick="window.location.href='add_usuario.php'">Registrar</button>
                            </div>

                            <div class="card-body">
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
    <script src="./assets/js/table-gridjs.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
</body>
</html>