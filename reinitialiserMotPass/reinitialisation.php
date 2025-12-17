<?php
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['url'])) {
    header('Location: ' . $_SESSION['url']);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Environnement Numérique de Travail">
  <meta name="author" content="uahb">
  <link rel="icon" href="/dist_assets/images/logo.png" type="image/x-icon">
  <link rel="shortcut icon" href="/dist_assets/images/logo.png" type="image/x-icon">
  <title>UAHB - Environnement Numérique de Travail</title>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/fontawesome.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/icofont.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/themify.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/flag-icon.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/feather-icon.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/bootstrap.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/style.css">
  <link rel="stylesheet" type="font/woff" href="/dist_assets/plugins/global/fonts/bootstrap-icons.woff">
  <link rel="stylesheet" type="font/woff2" href="/dist_assets/plugins/global/fonts/bootstrap-icons.woff2">
  <link rel="stylesheet" type="text/css" href="/dist_assets/plugins/global/plugins.bundle.css">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/style.bundle.css">
  <link id="color" rel="stylesheet" href="/dist_assets/css/color-1.css" media="screen">
  <link rel="stylesheet" type="text/css" href="/dist_assets/css/responsive.css">
  <link rel="stylesheet" type="font/woff" href="/dist_assets/css/themify/themify.woff">
  
</head>

<body>

  <div class="loader-wrapper">
    <div class="theme-loader">
      <div class="loader-p"></div>
    </div>
  </div>
  <section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-7"><img class="bg-img-cover bg-center" src="/dist_assets/images/uahb-login-ent-1.png" alt="looginpage"></div>
        <div class="col-xl-5 p-0">

          <div class="login-card">
            <form class="theme-form login-form" id="formLogin" name="formLogin" onsubmit=" verification(event)">
              <h4>Demande de Modification de mot de passe</h4>
              <p class="text-muted">Veuillez remplir le formulaire ci-dessous pour recevoir un mail.</p>
            <?php
if (!empty($_SESSION['alert_message'])) {
    $alert = json_decode($_SESSION['alert_message'], true);
    ?>
    <div class="alert alert-warning"  role="alert">
                <p><?= addslashes($alert['text']) ?></p>
              </div>
    <?php
}
?>
              <div class="form-group">
                <label>Matricule <strong class="text-danger">(*)</strong></label>
                <div class="input-group"><span class="input-group-text"><i class="icon-email"></i></span>
                  <input class="form-control" type="text" name="matricule" id="matricule" required="" placeholder="matricule" maxlength="7">
                </div>
              </div>
              <div class="form-group">
                <label>Email <strong class="text-danger">(*)</strong></label>
                <div class="input-group"><span class="input-group-text"><i class="icon-email"></i></span>
                  <input class="form-control" type="email" name="email" id="email" required="" placeholder="email institutionnel">
                </div>
              </div>
              <!-- <div class="form-group">
                  <label>Mot de passe</label>
                  <div class="input-group"><span class="input-group-text"><i class="icon-lock"></i></span>
                    <input class="form-control" type="password" name="password" id="password" required="" placeholder="*********">
                    <div class="show-hide"><span class="show"></span></div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Confirmé mot de passe</label>
                  <div class="input-group"><span class="input-group-text"><i class="icon-lock"></i></span>
                    <input class="form-control" type="password" name="confirm" id="confirm" required="" placeholder="*********">
                    <div class="show-hide"><span class="show"></span></div>
                  </div>
                </div> -->
              <div class="form-group">
                <a href="page-connexion" class="link-primary fw-bolder ">se connecter ?</a>
                <button class="btn btn-primary btn-block" type="submit" id="envoieMailBTN">valider</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <script src="resetPasswordJs">
  </script>
  <script src="/dist_assets/js/jquery-3.5.1.min.js"></script>
  <script src="/dist_assets/js/icons/feather-icon/feather.min.js"></script>
  <script src="/dist_assets/js/icons/feather-icon/feather-icon.js"></script>
  <script src="/dist_assets/js/sidebar-menu.js"></script>
  <script src="/dist_assets/js/config.js"></script>
  <script src="/dist_assets/js/bootstrap/popper.min.js"></script>
  <script src="/dist_assets/js/bootstrap/bootstrap.min.js"></script>
  <script src="/dist_assets/js/script.js"></script>
  <!-- <script src="/login-jquery"></script> -->
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js"></script>

  <?php
if (!empty($_SESSION['alert_message'])) {
    $alert = json_decode($_SESSION['alert_message'], true);
    unset($_SESSION['alert_message']); // Nettoyer après utilisation
    ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js"></script>

    <!-- <script>
      console.log ('Message : <?= addslashes($alert['text']) ?>')
        Swal.fire({
            title: '<?= addslashes($alert['title']) ?>',
            text: '<?= addslashes($alert['text']) ?>',
            icon: '<?= $alert['icon'] ?>',
            confirmButtonText: '<?= addslashes($alert['confirmButtonText']) ?>'
        }).then(() => {
            // Redirection supplémentaire si nécessaire
        });
    </script> -->
    <?php
}
?>
</body>

</html>