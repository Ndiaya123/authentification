<?php
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['url']) && filter_var($_SESSION['url'], FILTER_VALIDATE_URL)) {
  if ($_SESSION['url'] !== $_SERVER['REQUEST_URI']) { // Éviter les boucles de redirection
      header('Location: ' . $_SESSION['url']);
      exit;
  }
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
    <link rel="icon" href="dist_assets/images/logo.png" type="image/x-icon">
    <link rel="shortcut icon" href="dist_assets/images/logo.png" type="image/x-icon">
    <title>UAHB - Environnement Numérique de Travail</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/fontawesome.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/icofont.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/themify.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/flag-icon.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/feather-icon.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/style.css">
    <link rel="stylesheet" type="font/woff"  href="dist_assets/plugins/global/fonts/bootstrap-icons.woff">
    <link rel="stylesheet" type="font/woff2" href="dist_assets/plugins/global/fonts/bootstrap-icons.woff2">
    <link rel="stylesheet" type="text/css" href="dist_assets/plugins/global/plugins.bundle.css">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/style.bundle.css">
    <link id="color" rel="stylesheet" href="dist_assets/css/color-1.css" media="screen">
    <link rel="stylesheet" type="text/css" href="dist_assets/css/responsive.css">
    <link rel="stylesheet" type="font/woff" href="dist_assets/css/themify/themify.woff">
    
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
          <div class="col-xl-7"><img class="bg-img-cover bg-center" src="dist_assets/images/uahb-login-ent-1.png" alt="looginpage"></div>
          <div class="col-xl-5 p-0">
            
            <div class="login-card">
			  
              <form class="theme-form login-form" id="formLogin" name="formLogin" onsubmit=" createCompte(event)">
                <h4>Création de compte</h4>
              <p class="text-muted">Veuillez remplir le formulaire ci-dessous pour créer un compte.</p>
                <div class="form-group">
                  <label class="form-label fw-bolder text-dark fs-6">Matricule <strong class="text-danger">(*)</strong></label>
                  <div class="input-group"><span class="input-group-text"><i class="icon-email"></i></span>
                    <input class="form-control" type="text" name="matricule" id="matricule"  required="" placeholder="matricule" maxlength="7">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label fw-bolder text-dark fs-6">Email  <strong class="text-danger">(*)</strong></label>
                  <div class="input-group"><span class="input-group-text"><i class="icon-email"></i></span>
                    <input class="form-control" type="email" name="email" id="email"  required="" placeholder="email institutionnel">
                  </div>
                </div>
               
                <!-- Mot de passe -->
                <div class="mb-10 fv-row" data-kt-password-meter="true">
                  <div class="mb-1">
                      <label class="form-label fw-bolder text-dark fs-6">Mot de passe <strong class="text-danger">(*)</strong></label>
                      <div class="position-relative mb-3">
                          <input class="form-control form-control-lg form-control-solid" id="password" type="password" name="password" placeholder="Mot de passe" oninput="validatePassword()" 
                          oncopy="return false" oncut="return false" onpaste="return false" required />
                          <div class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2 show-hide2">
                            <span class="show2"><i class="bi bi-eye-slash fs-2"></i></span>
                              <span class="hide" style="display: none;"><i class="bi bi-eye fs-2"></i></span>
                          </div>
                      </div>
                      <div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
                          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                      </div>
                      <div id="passwordMessage" class="" style="font-size: 12px;"></div>
                  </div>
              </div>

              <!-- Confirmation mot de passe -->
              <div class="fv-row mb-10">
                  <label class="form-label fw-bolder text-dark fs-6">Confirmez votre mot de passe <strong class="text-danger">(*)</strong></label>
                  <input class="form-control form-control-lg form-control-solid" type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmation du mot de passe" oninput="checkPasswordMatch()"
                  oncopy="return false" oncut="return false" onpaste="return false" required />
                  <div id="confirmPasswordMessage" style="font-size: 12px; margin-top: 5px;"></div>
              </div>
                <div class="form-group">
                  <a href="page-connexion" class="link-primary fw-bolder ">se connecter ?</a>
                  <button class="btn btn-primary btn-block" id="submitButton" type="submit">valider</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <STYle>
      .bg-success {
    background-color: rgb(4, 168, 4) !important;
}

.bg-secondary {
    background-color: rgb(179, 174, 174) !important;
}
    </STYle>
    <script src="creation-compte-js">
       </script>
    <script src="dist_assets/js/jquery-3.5.1.min.js"></script>
    <script src="dist_assets/js/icons/feather-icon/feather.min.js"></script>
    <script src="dist_assets/js/icons/feather-icon/feather-icon.js"></script>
    <script src="dist_assets/js/sidebar-menu.js"></script>
    <script src="dist_assets/js/config.js"></script>
    <script src="dist_assets/js/bootstrap/popper.min.js"></script>
    <script src="dist_assets/js/bootstrap/bootstrap.min.js"></script>
    <script src="dist_assets/js/script.js"></script>
    <!-- <script src="/login-jquery"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js"></script>
  </body>
</html>