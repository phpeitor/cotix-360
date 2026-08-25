<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
require_once ROOT . '/model/tracking/tracking.php';
$cargo = (int)($_SESSION['session_cargo'] ?? 0);
$fasesActividades = Tracking::FASES_ACTIVIDADES;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Cotix360 | Trackings</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Cotix360 Trackings" name="description" />
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
                        <h4 class="fs-18 text-uppercase fw-bold mb-0">Trackings</h4>
                    </div>

                    <div class="text-end">
                        <ol class="breadcrumb m-0 py-0">
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Cotix 360</a></li>
                            <li class="breadcrumb-item"><a href="javascript: void(0);">Tables</a></li>
                            <li class="breadcrumb-item active">Trackings</li>
                        </ol>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header border-bottom border-dashed d-flex justify-content-between align-items-center">
                                <div class="mt-3 mt-sm-0">
                                    <form action="javascript:void(0);">
                                        <div class="row g-2 mb-0 align-items-center">
                                            <div class="col-sm-auto">
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        id="filterDate"
                                                        class="form-control"
                                                        data-provider="flatpickr"
                                                        data-date-format="d M Y"
                                                        data-range-date="true"
                                                    />
                                                    <span class="input-group-text bg-primary border-primary text-white">
                                                        <i class="ti ti-calendar fs-15"></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="col-auto">
                                                <a href="#" id="btn_buscar" class="btn btn-sm rounded-pill btn-info"><i class="ti ti-search fs-22"></i> Buscar</a>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div class="text-end">
                                    <a href="tracking_crear.php" class="btn btn-sm rounded-pill btn-primary"><i class="ti ti-plus fs-22"></i> Nuevo tracking</a>
                                </div>
                            </div>

                            <div class="card-body">
                                <div id="table-gridjs" data-user-cargo="<?= $cargo ?>"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include ROOT . '/layout/footer.html'; ?>
        </div>
    </div>

    <?php include ROOT . '/layout/theme.html'; ?>

    <div class="modal fade" id="modalActividadesTracking" tabindex="-1" aria-labelledby="modalActividadesTrackingLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <div>
                        <h4 class="modal-title mb-1" id="modalActividadesTrackingLabel">Actividades del tracking</h4>
                        <p class="text-muted mb-0">
                            <span class="font-monospace" id="actTrackingCod">-</span>
                        </p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="actividadesModalBody">
                    <ul class="nav nav-tabs mb-3" id="fasesActividadesTabs" role="tablist">
                        <?php $i = 0; foreach ($fasesActividades as $fase => $actividades): ?>
                            <li class="nav-item" role="presentation">
                                <button
                                    type="button"
                                    class="nav-link <?= $i === 0 ? 'active' : '' ?>"
                                    id="tab-<?= md5($fase) ?>-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#tab-<?= md5($fase) ?>"
                                    role="tab"
                                    aria-controls="tab-<?= md5($fase) ?>"
                                    aria-selected="<?= $i === 0 ? 'true' : 'false' ?>">
                                    <?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>
                                </button>
                            </li>
                        <?php $i++; endforeach; ?>
                    </ul>

                    <div class="tab-content" id="fasesActividadesTabsContent">
                        <?php $i = 0; foreach ($fasesActividades as $fase => $actividades): ?>
                            <div
                                class="tab-pane fade <?= $i === 0 ? 'show active' : '' ?>"
                                id="tab-<?= md5($fase) ?>"
                                role="tabpanel"
                                aria-labelledby="tab-<?= md5($fase) ?>-tab"
                                data-fase="<?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>">
                                <div class="table-responsive">
                                    <table class="table table-centered align-middle table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th class="w-25">Actividad</th>
                                                <th class="w-20">Fecha</th>
                                                <th>Observación</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($actividades as $actividad): ?>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                class="form-check-input act-check"
                                                                type="checkbox"
                                                                id="act-<?= md5($fase . '|' . $actividad) ?>"
                                                                value=""
                                                                data-fase="<?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>"
                                                                data-actividad="<?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?>">
                                                            <label
                                                                class="form-check-label"
                                                                for="act-<?= md5($fase . '|' . $actividad) ?>">
                                                                <?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?>
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="date" class="form-control form-control-sm act-fecha" disabled>
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control form-control-sm act-obs" placeholder="Observación" maxlength="300" disabled>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        <?php $i++; endforeach; ?>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <span class="text-muted me-auto" id="actividades-count-info">0 actividades registradas</span>
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" id="btnGuardarActividades">Guardar actividades</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalTimelineTracking" tabindex="-1" aria-labelledby="modalTimelineTrackingLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <div>
                        <h4 class="modal-title mb-1" id="modalTimelineTrackingLabel">Timeline del tracking</h4>
                        <p class="text-muted mb-0">
                            <span class="font-monospace" id="timelineTrackingCod">-</span>
                        </p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="trackingTimelineContainer" class="tracking-timeline"></div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        .tracking-timeline {
            position: relative;
            padding-left: 50px;
            padding-top: 20px;
        }
        .tracking-timeline::before {
            content: '';
            position: absolute;
            top: 0;
            left: 24px;
            height: 100%;
            width: 2px;
            background: #e2e8f0;
        }
        .timeline-item {
            position: relative;
            margin-bottom: 40px;
        }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-marker {
            position: absolute;
            left: -50px;
            top: 0;
            width: 50px;
            height: 50px;
            background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            color: #6c757d;
        }
        .timeline-item.active .timeline-marker {
            border-color: #0d6efd;
            background: #0d6efd;
            color: #fff;
            box-shadow: 0 0 0 6px rgba(13,110,253,0.15);
        }
        .timeline-item.completed .timeline-marker {
            border-color: #0d6efd;
            background: #fff;
            color: #0d6efd;
        }
        .timeline-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            border: 1px solid #f1f5f9;
        }
        .timeline-content::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 20px;
            width: 14px;
            height: 14px;
            background: #fff;
            border-left: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            transform: rotate(45deg);
        }
        .timeline-content .date {
            display: block;
            font-size: 0.8rem;
            color: #0d6efd;
            font-weight: 600;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .timeline-content .title {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 10px;
            color: #212529;
        }
        .fase-actividades {
            list-style: none;
            margin: 14px 0 0;
            padding: 0;
            display: grid;
            gap: 6px;
        }
        .fase-actividades li {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            font-size: 0.9rem;
        }
        .fase-actividades li > i { color: #10b981; flex-shrink: 0; }
        .fase-actividades .act-title { display: block; font-weight: 600; color: #212529; }
        .fase-actividades .act-obs { display: block; font-size: 0.82rem; color: #6c757d; margin-top: 2px; }
        .fase-actividades .act-fecha { margin-left: auto; color: #6c757d; font-size: 0.8rem; white-space: nowrap; flex-shrink: 0; }
        .timeline-item.active .fase-actividades li { border-color: rgba(13,110,253,0.25); background: rgba(13,110,253,0.04); }
    </style>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
    <script src="./assets/js/table-gridjs-tracking.js?v=1.6"></script>
    <script src="./assets/js/tracking-actividades.js?v=1.5"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>