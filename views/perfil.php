<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Cotix360 | Mi cuenta</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css">
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style">
    <link href="./assets/css/branding.css?v=1.7" rel="stylesheet" type="text/css">
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css">
</head>
<body>
<div class="wrapper">
    <?php include ROOT . '/layout/menu.php'; ?>
    <header class="app-topbar"><?php include ROOT . '/layout/navbar.php'; ?></header>
    <div class="page-content">
        <div class="page-container">
            <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                <div class="flex-grow-1"><h4 class="fs-18 text-uppercase fw-bold mb-0">Mi cuenta</h4></div>
                <ol class="breadcrumb m-0 py-0"><li class="breadcrumb-item">Cotix 360</li><li class="breadcrumb-item active">Mi cuenta</li></ol>
            </div>
            <div class="row">
                <div class="col-xl-8">
                    <div class="card">
                        <div class="card-header border-bottom border-dashed"><h4 class="header-title mb-0">Información personal</h4></div>
                        <div class="card-body">
                            <form id="profile-form" class="needs-validation" novalidate>
                                <div class="row">
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-nombres">Nombres</label><input id="profile-nombres" name="nombres" class="form-control" maxlength="70" required></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-apellidos">Apellidos</label><input id="profile-apellidos" name="apellidos" class="form-control" maxlength="70" required></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-documento">Documento</label><input id="profile-documento" class="form-control" readonly></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-usuario">Usuario</label><input id="profile-usuario" class="form-control" readonly></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-email">Correo electrónico</label><input id="profile-email" name="email" type="email" class="form-control" maxlength="100" required></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-telefono">Teléfono</label><input id="profile-telefono" name="telefono" class="form-control" maxlength="20"></div>
                                    <div class="col-md-6 mb-3"><label class="form-label" for="profile-sexo">Sexo</label><select id="profile-sexo" name="sexo" class="form-select"><option value="0">No especificado</option><option value="1">Masculino</option><option value="2">Femenino</option></select></div>
                                </div>
                                <hr class="my-4">
                                <h5 class="mb-3">Cambiar contraseña <small class="text-muted fw-normal">(opcional)</small></h5>
                                <div class="row">
                                    <div class="col-md-4 mb-3"><label class="form-label" for="profile-password-actual">Contraseña actual</label><input id="profile-password-actual" name="password_actual" type="password" class="form-control" autocomplete="current-password"></div>
                                    <div class="col-md-4 mb-3"><label class="form-label" for="profile-password-new">Nueva contraseña</label><input id="profile-password-new" name="nueva_password" type="password" class="form-control" minlength="6" autocomplete="new-password"></div>
                                    <div class="col-md-4 mb-3"><label class="form-label" for="profile-password-confirm">Confirmar contraseña</label><input id="profile-password-confirm" name="confirmar_password" type="password" class="form-control" minlength="6" autocomplete="new-password"></div>
                                </div>
                                <button class="btn btn-primary" type="submit">Guardar cambios</button>
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
<script src="./assets/js/app.js?v=1.0"></script>
<script src="./assets/js/perfil.js?v=1.0"></script>
<script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
