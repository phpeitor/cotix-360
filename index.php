<?php
session_start();
require_once __DIR__ . '/config/bootstrap.php';
if (isset($_SESSION['session_usuario'])) {
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
    <?php
    // Inyectar la clave de site de reCAPTCHA (definir RECAPTCHA_SITE_KEY en .env)
    $recapSite = $_ENV['RECAPTCHA_SITE_KEY'] ?? '';
    if ($recapSite) {
      echo "<script src=\"https://www.google.com/recaptcha/api.js?render={$recapSite}\"></script>\n";
      echo "<script>window.RECAPTCHA_SITE_KEY = '{$recapSite}';</script>\n";
    } else {
      echo "<script>window.RECAPTCHA_SITE_KEY = '';</script>\n";
    }
    ?>
  </head>
  <body>
    <video autoplay loop muted playsinline id="background-video">
      <source src="./assets/resources/video.mp4" type="video/mp4">
      Tu navegador no soporta la reproducción de video.
    </video>
    <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
  <script>
    // Mover notificaciones para no tapar el badge de reCAPTCHA
    (function(){
      try {
        if (typeof alertify !== 'undefined' && alertify && typeof alertify.set === 'function') {
          alertify.set('notifier','position','top-right');
        } else {
          window.addEventListener('load', function(){
            if (window.alertify && typeof alertify.set === 'function') {
              alertify.set('notifier','position','top-right');
            }
          });
        }
      } catch (e) { console.warn('Could not set alertify position', e); }
    })();
  </script>
  </body>
</html>
