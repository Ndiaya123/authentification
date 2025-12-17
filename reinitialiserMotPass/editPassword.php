<?php
// header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
// header("Cache-Control: post-check=0, pre-check=0", false);
// header("Pragma: no-cache");
// Pour empêcher l'utilisateur de revenir en arrière avec le bouton "Retour"
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['url'])) {
  header('Location: ' . $_SESSION['url']);
  exit;
}
$method = $_SERVER['REQUEST_METHOD'];
$token = $_GET['token'] ?? null;
if(isset($_GET['token']) && $_GET['token']){

  $decodedToken = base64_decode($token);
  if (!$decodedToken || strpos($decodedToken, '|') === false) {
      afficherMessage("Token invalide ou mal formé", "error");
      exit;
  }
  list($matricule, $timestamp) = explode('|', $decodedToken);
  //echo 'le timestamp de création : '.$timestamp.' \n le timestamp actuel :'.time();

  if ((time() - $timestamp) > 3600) { // 1 heure de validité
              afficherMessage("Token expiré", "expired");
	 // Stocker le message dans la session pour l'afficher après redirection
        $_SESSION['alert_message'] = json_encode([
            'title' => 'Token expiré',
            'text' => 'Votre lien a expiré, veuillez en demander un nouveau.',
            'icon' => 'error',
            'confirmButtonText' => 'OK'
        ]);
	header('Location: resetPassword');
      exit;
          }
}

//list($matricule, $timestamp) = explode('|', $decodedToken);
// echo ('Le matricule : '.$decodedToken)
// $matricule = base64_decode($_GET['matricule']);

// header("Location: ./editPassword.php?matricule=".base64_encode($matricule));
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
            <form class="theme-form login-form" id="formPassword" name="formPassword" method="get">
              <div class="alert alert-warning d-none"  role="alert">
                <p id="msg">Pour des raison de sécurité vous devez définir votre propre mot de passe .</p>
              </div>
              <!-- Mot de passe -->
              <div class="mb-10 fv-row" data-kt-password-meter="true">
                <div class="mb-1">
                  <label class="form-label fw-bolder text-dark fs-6">Mot de passe <strong class="text-danger">(*)</strong></label>
                  <div class="position-relative mb-3">
                    <input class="form-control form-control-lg form-control-solid" id="password" type="password" name="password" placeholder="Mot de passe" oninput="validatePassword()" oncopy="return false" oncut="return false" onpaste="return false" required />
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
                <input class="form-control form-control-lg form-control-solid" type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmation du mot de passe" oninput="checkPasswordMatch()" required oncopy="return false" oncut="return false" onpaste="return false" />
                <div id="confirmPasswordMessage" style="font-size: 12px; margin-top: 5px;"></div>
              </div>
              <input type="hidden" id="matricule" name="matricule" value="<?php echo htmlspecialchars($matricule); ?>">

              <div class="form-group">
                <a href="page-connexion" class="link-primary fw-bolder ">se connecter ?</a>
                <button class="btn btn-primary btn-block" type="submit" id="formPasswordBTN" >valider</button>
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

  <script src="resetPasswordJs"></script>
  <script src="/dist_assets/js/jquery-3.5.1.min.js"></script>
  <script src="/dist_assets/js/icons/feather-icon/feather.min.js"></script>
  <script src="/dist_assets/js/icons/feather-icon/feather-icon.js"></script>
  <script src="/dist_assets/js/sidebar-menu.js"></script>
  <script src="/dist_assets/js/config.js"></script>
  <script src="/dist_assets/js/bootstrap/popper.min.js"></script>
  <script src="/dist_assets/js/bootstrap/bootstrap.min.js"></script>
  <script src="/dist_assets/js/script.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js"></script>
  <?php
  require '../config.php';


  if ($method == 'GET') {
      // Vérification de la présence du token
      if (!isset($_GET['token'])) {
          afficherMessage("Token manquant", "error");
      }
  
      try {
          // Décodage et validation du token
          $token = $_GET['token'];
          $decodedToken = base64_decode($token);
          list($matricule, $timestamp) = explode('|', $decodedToken);
          
          // Vérification de la validité du token
          if ((time() - $timestamp) > 3600) { // 1 heure de validité
              afficherMessage("Token expiré", "expired");
          }
  
          // Récupération des données utilisateur
          $stmt = $pdo->prepare("SELECT linkSendDate, linkValid, createdBy,valideCompte, access 
                               FROM utilisateur WHERE matricule = ?");
          $stmt->execute([$matricule]);
          $result = $stmt->fetch(PDO::FETCH_ASSOC);
  
          // Vérifications de sécurité
          if ($result) {
            echo "<script>console.log('resultat : " . json_encode($result) . "');</script>";
            $linkSendDate = strtotime($result['linkSendDate']);
            $linkValid = $result['linkValid'];
            $valideCompte = $result['valideCompte'];
            $createdBy = $result['createdBy'];
            $access = $result['access'];

            if ($createdBy == 'admin') {
              echo" <script>
              const alert = document.querySelector('.alert');
      alert.classList.remove('d-none');
              </script>";
              // header('page-connexion');
            afficherMessage("Veuillez saisir votre mot de passe", "createdBy");
            // afficherMessage("Veuillez saisir votre mot de passe", "success");
            exit;
            }
            if ($valideCompte == 1) {
                if($linkValid == 0){
                  echo" <script>
              const alert = document.querySelector('.alert');
              const msg = document.querySelector('#msg');
                  msg.textContent = 'Veuillez saisir le nouveau mot de passe .'
      alert.classList.remove('d-none');
              </script>
              ";
                    // afficherMessage("Veuillez vérifier votre boite mail un email vous a été envoyé .", "info");
                }else{
                  $_SESSION['alert_message'] = json_encode([
                    'title' => 'Token expiré',
                    'text' => 'Ce lien a déjà été utilisé, Veuillez effectuer une nouvelle demande, Veuillez effectuer une nouvelle demande .',
                    'icon' => 'error',
                    'confirmButtonText' => 'OK'
                ]);
          header('Location: resetPassword');
                  afficherMessage("Ce lien a déjà été utilisé, Veuillez effectuer une nouvelle demande.", "error");
                }
                exit;
            }

            // Vérifier si la date de création du lien est valide
            if (!$linkSendDate) {
                afficherMessage("Erreur : La date de création du lien est invalide.", "error");
                exit;
            }

            // Calculer le temps d'expiration (1 heure en secondes)
            $expirationTime = 3600; // 1 heure
            $currentTime = time(); // Temps actuel en secondes depuis l'époque Unix
            
            // Vérifier si le lien a expiré
            if (($currentTime - $linkSendDate) > $expirationTime) {
              $_SESSION['alert_message'] = json_encode([
                'title' => 'Token expiré',
                'text' => 'Votre lien a expiré, veuillez en demander un nouveau.',
                'icon' => 'error',
                'confirmButtonText' => 'OK'
            ]);
      header('Location: resetPassword');
                afficherMessage("Le lien de validation a expiré. Veuillez demander un nouveau lien.", "expired");
                exit;
            }

            // Vérifier si le lien a déjà été utilisé
            if ($linkValid == 1) {
                afficherMessage("Le lien de validation a déjà été utilisé. Veuillez demander un nouveau lien.", "used");
                exit;
            }

            // Valider le compte si le lien est valide et non expiré
            if ($linkValid == 0 && (($currentTime - $linkSendDate) < $expirationTime) && $valideCompte == 0) {
                if($createdBy == 'admin'){
                    $stmt = $pdo->prepare("UPDATE utilisateur SET valideCompte = 1, linkValid = 1 WHERE matricule = ?");
                    $stmt->execute([$matricule]);
                    afficherMessage("Votre compte a été vaildé, mais vous devez modifier votre mot de passe avant de vous connecter.", "mustChangePassword");
                }else if (validation($pdo, $matricule)) {
                    afficherMessage("Votre compte a été validé, vous pouvez désormais vous connecter.", "success");
                } else {
                    afficherMessage("Erreur lors de la validation du compte.", "error");
                }
            }
            
        } else {
            afficherMessage("Aucun utilisateur trouvé avec ce matricule.", "error");
            exit;
        }
    } catch (PDOException $e) {
        afficherMessage("Erreur SQL : " . $e->getMessage(), "error");
        exit;
    }
}
function validation($pdo, $matricule)
{
    try {
        $stmt = $pdo->prepare("UPDATE utilisateur SET valideCompte = 1, linkValid = 1 WHERE matricule = ?");
        return $stmt->execute([$matricule]);
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
        return false;
    }
}

  // Fonction améliorée de gestion des messages
  function afficherMessage($message, $status)
  {
    echo "<script>
      document.addEventListener('DOMContentLoaded', () => {
        if('{$status}' !== 'success'){
          Swal.fire({
            position: 'center',
            icon: '{$status}',
            title: '{$message}',
            showConfirmButton: true,
            didClose: () => {
              if ('{$status}' === 'error') {
                window.location.href = 'resetPassword';
              }
            }
                
          }); 
        }else if('{$status}' === 'success'){
            Swal.fire({
              position: 'center',
              icon: '{$status}',
              title: '{$message}',
              showConfirmButton: true,
            }); // Fermeture correcte de Swal.fire

        }else if('{$status}' === 'createdBy'){
            console.log('{$status}')
          
        }
          
      });
        
    </script>
    
    ";
  }
  ?>
  <!-- <script src="/Password-jquery"></script> -->
</body>

</html>