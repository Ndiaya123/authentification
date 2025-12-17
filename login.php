<?php
session_start();
if (!empty($_SESSION['id']) && !empty($_SESSION['url']) && filter_var($_SESSION['url'], FILTER_VALIDATE_URL)) {
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
  <link rel="icon" href="./dist_assets/images/logo.png" type="image/x-icon">
  <link rel="shortcut icon" href="./dist_assets/images/logo.png" type="image/x-icon">
  <title>UAHB - Environnement Numérique de Travail</title>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link
  href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  rel="stylesheet">
  <link
  href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet">
    <link
    href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/fontawesome.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/icofont.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/themify.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/flag-icon.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/feather-icon.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/style.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/themify.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/plugins/global/plugins.bundle.css">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/style.bundle.css">
    <link id="color" rel="stylesheet" href="./dist_assets/css/color-1.css" media="screen">
    <link rel="stylesheet" type="text/css" href="./dist_assets/css/responsive.css">
    <!--<link rel="stylesheet" type="text/css" href="login.css">-->
  
  <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"> -->

</head>

<body id="kt_body" class="bg-body bg">

  <div class="loader-wrapper">
    <div class="theme-loader">
      <div class="loader-p"></div>
    </div>
  </div>
  <section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-7"><img class="bg-img-cover bg-center" src="./dist_assets/images/ENT.png"
            alt="looginpage"></div>
        <div class="col-xl-5 p-0">
          <div class="login-card">
            <form class="theme-form login-form" id="formLogin" name="formLogin"
              onsubmit="event.preventDefault(); connexion();">
              <h4 class="text">Page de connexion</h4>
              <div class="text-gray-400 fw-bold fs-6">Pas de compte ?
                <a href="" class="link-primary fw-bolder "
                  data-bs-toggle="modal" data-bs-target="#creationCompte">créer un compte</a>
                <!-- Modal -->
                <div class="modal fade" id="creationCompte" tabindex="-1" aria-labelledby="creationCompteLabel"
                  aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="creationCompteLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <p>En tant que </p>
                        <a href="creation-compte-personnel" class="btn btn-primary m-3">Membre du personnel</a>
                        <a href="./creationCompte/creationCompte.html" class="btn btn-primary m-3">Vacataire</a>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
              <!-- <h6>Bienvenue...</h6> -->
              <div class="form-group">
                <label>Email</label>
                <div class="input-group"><span class="input-group-text"><i class="icon-email"></i></span>
                  <input class="form-control" type="email" name="email" id="email" required=""
                    placeholder="test@uahb.sn">
                </div>
              </div>
              <div class="form-group">
                <label>Mot de passe</label>
                <div class="input-group"><span class="input-group-text"><i class="icon-lock"></i></span>
                  <input class="form-control" type="password" name="password" id="password" required=""
                    placeholder="*********">
                  <div class="show-hide"><span class="show"></span></div>
                </div>
              </div>
              <div class="fv-row mb-10 text-end">
                <a href="resetPassword" class="link-primary fs-6 fw-bolder">Mot de passe
                  oublié ?</a>
              </div>
              <div class="text-center">
                <button class="btn btn-lg btn-primary w-100 mb-5" type="submit" id="connexionButton">se connecter</button>
              </div>

              <div class="login-social-title">
                <h5>nous rejoindre sur les reseaux</h5>
              </div>
              <div class="form-group">
                <ul class="login-social">
                  <li><a href="https://www.linkedin.com/company/universit%C3%A9-amadou-hampat%C3%A9-ba-de-dakar/"
                      target="_blank"><i data-feather="linkedin"></i></a></li>
                  <li><a href="https://twitter.com_officiel" target="_blank"><i data-feather="twitter"></i></a></li>
                  <li><a href="https://www.facebook.com/Universit%C3%A9-Amadou-Hampat%C3%A9-BA-de-DAKAR-111761771444655"
                      target="_blank"><i data-feather="facebook"></i></a></li>
                  <li><a href="https://www.instagram.com_officiel/" target="_blank"><i data-feather="instagram">
                      </i></a></li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <script src="connexion.js"> </script>
  <script src="./dist_assets/js/jquery-3.5.1.min.js"></script>
  <script src="./dist_assets/js/icons/feather-icon/feather.min.js"></script>
  <script src="./dist_assets/js/icons/feather-icon/feather-icon.js"></script>
  <script src="./dist_assets/js/sidebar-menu.js"></script>
  <script src="./dist_assets/js/config.js"></script>
  <script src="./dist_assets/js/bootstrap/popper.min.js"></script>
  <script src="./dist_assets/js/bootstrap/bootstrap.min.js"></script>
  <script src="./dist_assets/js/script.js"></script>
  <!-- <script src="/login-jquery"></script> -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js"></script>
</body>

</html>