<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once ROOT . '/controller/check_session.php';
require_once ROOT . '/model/tracking/tracking.php';
$cargo = (int)($_SESSION['session_cargo'] ?? 0);
$fasesActividades = Tracking::FASES_ACTIVIDADES;
$trackingUrl = trim((string)($_ENV['TRACKING_URL'] ?? ''));
$trackingIconUrl = trim((string)($_ENV['TRACKING_ICON'] ?? ''));
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
    <link href="./assets/css/tracking.css?v=2.2" rel="stylesheet" type="text/css" />
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
                            <div class="card-header border-bottom border-dashed tracking-card-header">
                                <form action="javascript:void(0);" class="tracking-filter-form">
                                    <div class="row g-2 mb-0 align-items-center tracking-filter-toolbar">
                                            <div class="tracking-filter-date">
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

                                            <div class="tracking-filter-state">
                                                <select id="filterEstado" class="form-select" aria-label="Filtrar por estado">
                                                    <option value="todos">Todos los estados</option>
                                                    <option value="abierto">Abiertos</option>
                                                    <option value="cerrado">Cerrados</option>
                                                </select>
                                            </div>

                                            <div class="tracking-filter-ruc-wrap">
                                                <input type="search" id="filterRuc" class="form-control tracking-filter-ruc" placeholder="RUC" aria-label="Filtrar por RUC" inputmode="numeric">
                                            </div>

                                            <div class="tracking-filter-code-wrap">
                                                <input type="search" id="filterCodTracking" class="form-control tracking-filter-code" placeholder="Código tracking" aria-label="Filtrar por código tracking">
                                            </div>

                                            <div class="tracking-filter-submit">
                                                <a href="#" id="btn_buscar" class="btn btn-sm rounded-pill btn-info"><i class="ti ti-search fs-22"></i> Buscar</a>
                                            </div>

                                            <div class="tracking-new-button-wrap">
                                                <a href="tracking_crear.php" class="btn btn-sm rounded-pill btn-primary"><i class="ti ti-plus fs-22"></i> Nuevo</a>
                                            </div>
                                    </div>
                                </form>
                            </div>

                            <div class="card-body">
                                <div id="table-gridjs" data-user-cargo="<?= $cargo ?>" data-tracking-url="<?= htmlspecialchars($trackingUrl, ENT_QUOTES, 'UTF-8') ?>" data-tracking-icon-url="<?= htmlspecialchars($trackingIconUrl, ENT_QUOTES, 'UTF-8') ?>"></div>
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
                    <div class="tracking-modal-heading">
                        <h4 class="modal-title mb-1" id="modalActividadesTrackingLabel">Actividades del tracking</h4>
                        <div class="tracking-modal-meta">
                            <span class="font-monospace text-muted" id="actTrackingCod">-</span>
                            <span><strong>RUC:</strong> <span id="actTrackingRuc">-</span></span>
                            <span><strong>Razón social:</strong> <span id="actTrackingRazonSocial">-</span></span>
                        </div>
                    </div>
                    <span class="badge rounded-pill tracking-state-badge is-open" id="actTrackingEstado">Abierto</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="actividadesModalBody">
                    <div class="tracking-progress-summary mb-3" aria-live="polite">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-semibold">Avance del proyecto</span>
                            <span class="fw-bold" id="trackingProjectProgressLabel">0.00%</span>
                        </div>
                        <div class="progress" id="trackingProjectProgress" role="progressbar" aria-label="Avance del proyecto" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                            <div class="progress-bar" id="trackingProjectProgressBar"></div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row g-3 align-items-end tracking-info-fields">
                            <div class="col-lg-4 col-md-6">
                                <label for="actTrackingNombre" class="form-label fw-semibold">Nombre</label>
                                <input type="text" class="form-control" id="actTrackingNombre" placeholder="Nombre del proyecto" maxlength="255">
                            </div>
                            <div class="col-lg-3 col-md-6">
                                <label for="actTrackingNumOc" class="form-label fw-semibold">Num. OC</label>
                                <input type="text" class="form-control" id="actTrackingNumOc" placeholder="Número de orden de compra" maxlength="100">
                            </div>
                            <div class="col-lg-5 col-12">
                                <label for="actTrackingDescripcion" class="form-label fw-semibold">Descripción</label>
                                <textarea class="form-control" id="actTrackingDescripcion" rows="1" placeholder="Descripción del proyecto..." maxlength="500"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="tracking-color-legend mb-3" aria-label="Significado de los colores de actividad">
                        <span class="tracking-color-legend-title">Estado de actividad:</span>
                        <span><i class="tracking-color-dot tracking-color-critical"></i> Retraso crítico</span>
                        <span><i class="tracking-color-dot tracking-color-delay"></i> Retraso leve</span>
                        <span><i class="tracking-color-dot tracking-color-scheduled"></i> Según cronograma</span>
                        <span><i class="tracking-color-dot tracking-color-completed"></i> Completada</span>
                    </div>
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
                            <?php $pesoFase = array_sum(Tracking::PESOS_PROYECTO[$fase] ?? []); ?>
                            <div
                                class="tab-pane fade <?= $i === 0 ? 'show active' : '' ?>"
                                id="tab-<?= md5($fase) ?>"
                                role="tabpanel"
                                aria-labelledby="tab-<?= md5($fase) ?>-tab"
                                data-fase="<?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>"
                                data-peso-fase="<?= number_format($pesoFase, 2, '.', '') ?>">
                                <div class="tracking-phase-summary mb-2">
                                    <div class="tracking-phase-summary-heading">
                                        <strong><?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?></strong>
                                        <span class="tracking-phase-contribution">0.00% | <?= number_format($pesoFase, 2, '.', '') ?>% del proyecto</span>
                                    </div>
                                    <div class="progress tracking-phase-progress-track" role="progressbar" aria-label="Avance de <?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                        <div class="progress-bar tracking-phase-progress-bar"></div>
                                    </div>
                                    <span class="tracking-phase-progress-label">0.00% de fase</span>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-centered align-middle table-hover tracking-activity-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Actividad</th>
                                                <th class="text-center">% proyecto</th>
                                                <th class="text-center">% fase</th>
                                                <th>Fecha</th>
                                                <th>Observación</th>
                                                <th>Guardado por</th>
                                                <th class="text-center">Color</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($actividades as $actividad): ?>
                                                <?php
                                                    $pesoProyecto = (float)(Tracking::PESOS_PROYECTO[$fase][$actividad] ?? 0);
                                                    $pesoEnFase = (float)(Tracking::PESOS_FASE[$fase][$actividad] ?? 0);
                                                ?>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                class="form-check-input act-check"
                                                                type="checkbox"
                                                                id="act-<?= md5($fase . '|' . $actividad) ?>"
                                                                value=""
                                                                data-fase="<?= htmlspecialchars($fase, ENT_QUOTES, 'UTF-8') ?>"
                                                                data-actividad="<?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?>"
                                                                data-peso-proyecto="<?= number_format($pesoProyecto, 2, '.', '') ?>"
                                                                data-peso-fase="<?= number_format($pesoEnFase, 2, '.', '') ?>">
                                                            <label
                                                                class="form-check-label"
                                                                for="act-<?= md5($fase . '|' . $actividad) ?>">
                                                                <?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?>
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td class="text-center tracking-weight"><?= number_format($pesoProyecto, 2, '.', '') ?>%</td>
                                                    <td class="text-center tracking-weight"><?= number_format($pesoEnFase, 2, '.', '') ?>%</td>
                                                    <td>
                                                        <input type="date" class="form-control form-control-sm act-fecha" disabled>
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control form-control-sm act-obs" maxlength="300" disabled>
                                                    </td>
                                                    <td><span class="act-guardado-por text-muted">-</span></td>
                                                    <td class="text-center">
                                                        <input type="color" class="act-color" value="#facc15" aria-label="Color de <?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?>" title="Seleccionar estado de la actividad">
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
                    <button type="button" class="btn btn-success" id="btnGuardarActividades">Guardar</button>
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

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/gridjs.umd.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
    <script src="./assets/js/table-gridjs-tracking.js?v=1.12"></script>
    <script src="./assets/js/tracking-actividades.js?v=1.18"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
</body>
</html>
