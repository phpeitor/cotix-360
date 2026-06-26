<?php
session_start();
require_once __DIR__ . '/config/bootstrap.php';
if (isset($_SESSION['session_usuario'], $_SESSION['session_cargo'])) {
    header("Location: home.php");
    exit();
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./assets/resources/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cotix360</title>
    <script type="module" crossorigin src="./assets/js/index-qXMyHo4h.js?v=3.3"></script>
    <link rel="stylesheet" crossorigin href="./assets/css/index-D03ZEYWy.css?v=3.4">    
    <link rel="stylesheet" href="./assets/css/login-validation.css">    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
    <!-- reCAPTCHA site key is provided to the frontend via data attribute on #root -->
  </head>
  <body>
    <video autoplay loop muted playsinline id="background-video">
      <source src="./assets/resources/video.mp4" type="video/mp4">
      Tu navegador no soporta la reproducción de video.
    </video>
    <div id="root" data-recaptcha-site-key="<?= htmlspecialchars($_ENV['RECAPTCHA_SITE_KEY'] ?? '') ?>"></div>
  <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
  </body>
</html>
