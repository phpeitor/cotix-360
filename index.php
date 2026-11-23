<?php
session_start();
require_once __DIR__ . '/config/bootstrap.php';

if (isset($_SESSION['session_usuario'], $_SESSION['session_cargo'])) {
    header('Location: home.php');
    exit();
}

$recaptchaSiteKey = htmlspecialchars((string)($_ENV['RECAPTCHA_SITE_KEY'] ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#eef3f8">
    <meta name="description" content="Ingreso seguro a Cotix360">
    <title>Cotix360 | Iniciar sesión</title>
    <link rel="icon" type="image/x-icon" href="./assets/images/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/login-cotix.css?v=1.0">
    <link rel="stylesheet" href="./assets/css/login-validation.css?v=1.1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css">
</head>
<body>
    <video id="login-background-video" class="login-page-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>
    <div class="login-page-overlay" aria-hidden="true"></div>
    <main id="login-app" class="login-shell" data-recaptcha-site-key="<?= $recaptchaSiteKey ?>">
        <section class="login-panel" aria-label="Acceso a Cotix360">
            <header class="login-header">
                <a class="brand" href="./index.php" aria-label="Cotix360, inicio">
                    <img id="brand-logo" class="brand-logo" src="./assets/resources/phpeitor-dark.svg?v=2.0" alt="Cotix360" width="170" height="34">
                </a>
                <div class="header-actions">
                    <ol class="login-steps" aria-label="Pasos para ingresar">
                        <li id="step-indicator-verify" class="is-active" aria-current="step"><span>1</span> Verifica</li>
                        <li id="step-indicator-login"><span>2</span> Ingresa</li>
                    </ol>
                    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar tema">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>
                    </button>
                </div>
            </header>

            <div class="login-content">
                <p class="step-caption"><b id="step-number">01</b><span>/</span><span id="step-name">Verificación</span></p>

                <section id="verification-step" class="verification-card" aria-labelledby="verification-title">
                    <div class="section-heading">
                        <span class="security-icon" aria-hidden="true">
                            <svg class="lock-closed" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>
                            <svg class="lock-open" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0"></path></svg>
                        </span>
                        <div>
                            <h1 id="verification-title">Verifica que eres tú</h1>
                            <p id="verification-message">Mantén presionado para preparar tu acceso seguro.</p>
                        </div>
                    </div>

                    <div class="verification-visual" aria-hidden="true">
                        <div class="visual-grid"></div>
                        <div class="visual-flow">
                            <div class="data-card">
                                <span class="data-card-head"><i></i><i></i><i></i><b>cotix360</b></span>
                                <span class="data-line"></span><span class="data-line short"></span>
                                <span class="data-line"></span><span class="data-line medium"></span>
                                <span class="data-line short"></span>
                            </div>
                            <span class="flow-track"><i class="flow-dot dot-one"></i><i class="flow-dot dot-two"></i><i class="flow-dot dot-three"></i></span>
                            <div class="secure-database"><span class="database-cylinder"><i></i><i></i><i></i></span><span class="database-check">✓</span></div>
                        </div>
                        <div class="visual-labels"><span>SESIÓN</span><span>VERIFICACIÓN</span><span>ACCESO</span></div>
                    </div>

                    <div class="verification-progress" aria-label="Progreso de verificación">
                        <span class="progress-step is-current" data-progress-step="0"><i></i>Conexión</span>
                        <span class="progress-connector"></span>
                        <span class="progress-step" data-progress-step="1"><i></i>Validación</span>
                        <span class="progress-connector"></span>
                        <span class="progress-step" data-progress-step="2"><i></i>Acceso</span>
                    </div>

                    <button type="button" class="verify-button" id="verify-button" aria-describedby="verify-help">
                        <span class="verify-fill" id="verify-fill"></span>
                        <span class="verify-button-label" id="verify-label">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"></path></svg>
                            <span>Mantén presionado para verificar</span>
                        </span>
                    </button>
                    <p class="verify-help" id="verify-help">Mantén el botón hasta completar la verificación</p>
                    <p class="sr-only" id="verification-live" aria-live="polite"></p>
                </section>

                <form id="login-form" class="credentials-form" novalidate hidden>
                    <h1 class="form-title" id="form-title">Ingresa a Cotix360</h1>
                    <p class="form-subtitle" id="form-subtitle">Usa tu usuario y contraseña para continuar.</p>

                    <label class="form-field" for="login-user">
                        <span>Usuario</span>
                        <input id="login-user" name="usuario" type="text" placeholder="cotix.user" maxlength="35" autocomplete="username" autocapitalize="none" spellcheck="false" required>
                    </label>

                    <label class="form-field" for="login-password">
                        <span>Contraseña</span>
                        <div class="password-control">
                            <input id="login-password" name="password" type="password" placeholder="*********" autocomplete="current-password" required>
                            <button type="button" id="toggle-password" class="password-toggle" aria-label="Mostrar contraseña" aria-pressed="false">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                        </div>
                        <small id="caps-lock-hint" class="caps-lock-hint" hidden>Bloq Mayús está activado</small>
                    </label>

                    <label class="remember-user"><input type="checkbox" id="remember-user"><span>Recordar mi usuario</span></label>
                    <div id="login-error" class="login-error" role="alert" aria-live="polite"></div>
                    <button type="submit" id="login-submit" class="login-submit">
                        <span id="login-submit-label">Ingresar</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"></path></svg>
                    </button>
                    <p class="login-help"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4m0-4h.01"></path></svg>¿Olvidaste tu contraseña? Contacta al administrador.</p>
                </form>
            </div>

            <footer class="login-footer"><span>© <?= date('Y') ?> Cotix360</span><span>Acceso seguro · MG INDUSOL</span></footer>
        </section>

        <aside class="bear-panel" aria-label="Bienvenido a Cotix360">
            <div class="bear-panel-glow"></div>
            <div class="bear-chips" aria-hidden="true"><span>Cotizaciones</span><span>Recetas</span><span>Compras</span><span>Ingeniería</span></div>
            <canvas id="bear-canvas" aria-hidden="true"></canvas>
            <div class="bear-caption"><span><strong>Cotix360</strong><small>Gestión para avanzar</small></span></div>
        </aside>
    </main>

    <script src="./assets/js/login-cotix.js?v=1.1" defer></script>
</body>
</html>
