<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';

if ((int)($_SESSION['session_cargo'] ?? 0) !== 1) {
    http_response_code(403);
    exit('Acceso denegado');
}

$_SESSION['csrf_permisos'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf_permisos'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Gestión de Permisos</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/permisos.css?v=1.1" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css" />
</head>
<body>
    <div class="wrapper">
        <?php include ROOT . '/layout/menu.php'; ?>
        <header class="app-topbar">
            <?php include ROOT . '/layout/navbar.php'; ?>
        </header>

        <main class="page-content">
            <div class="page-container">
                <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                    <div class="flex-grow-1"><h4 class="fs-18 text-uppercase fw-bold mb-0">Gestión de Permisos</h4></div>
                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="home.php">Cotix 360</a></li>
                            <li class="breadcrumb-item active">Permisos</li>
                        </ol>
                    </div>
                </div>

                <div class="card" id="permissionsManager" data-csrf="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>">
                    <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 class="header-title mb-1">Roles y accesos</h4>
                            <p class="text-muted mb-0">Administra qué páginas puede abrir cada rol.</p>
                        </div>
                        <button type="button" class="btn btn-primary" id="btnGuardarPermisos">
                            <i class="ti ti-device-floppy me-1"></i> Guardar cambios
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info border-0">
                            El rol Administrador conserva acceso total para evitar bloquear la gestión del sistema.
                        </div>

                        <section class="permission-new-role mb-4" aria-labelledby="newRoleHeading">
                            <h5 id="newRoleHeading" class="mb-3">Agregar rol</h5>
                            <div class="row g-2 align-items-end">
                                <div class="col-sm-3 col-md-2">
                                    <label class="form-label" for="newRoleId">ID del rol</label>
                                    <input type="number" class="form-control" id="newRoleId" min="1" step="1" placeholder="Ej. 7">
                                </div>
                                <div class="col-sm-6 col-md-5">
                                    <label class="form-label" for="newRoleName">Nombre</label>
                                    <input type="text" class="form-control" id="newRoleName" maxlength="80" placeholder="Ej. Logística">
                                </div>
                                <div class="col-sm-auto">
                                    <button type="button" class="btn btn-outline-primary" id="btnAgregarRol">
                                        <i class="ti ti-plus me-1"></i> Agregar rol
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div id="permissionsLoading" class="text-center text-muted py-5">
                            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                            Cargando roles y páginas...
                        </div>
                        <div id="permissionsRoles" class="permission-manager-layout d-none">
                            <aside class="permission-role-sidebar">
                                <div class="permission-role-sidebar-heading">
                                    <h5 class="mb-0">Cargos</h5>
                                    <span class="badge bg-light text-dark" id="permissionRoleCount">0</span>
                                </div>
                                <div id="permissionRoleList" class="permission-role-list" role="tablist" aria-label="Seleccionar cargo"></div>
                            </aside>
                            <section id="permissionRolePanel" class="permission-role-panel" aria-live="polite"></section>
                        </div>
                    </div>
                </div>
            </div>
            <?php include ROOT . '/layout/footer.html'; ?>
        </main>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>
    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/permisos.js?v=1.1"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
