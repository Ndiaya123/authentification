<?php
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['url']) && filter_var($_SESSION['url'], FILTER_VALIDATE_URL)) {
    header('Location: ' . $_SESSION['url']);
    exit;
}
?>
<!doctype html>
<html lang="en">

<head>
    <title>UAHB</title>
    <meta name="description" content="UAHB" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:title" content="UAHB" />
    <meta property="og:site_name" content="UAHB" />
    <link rel="shortcut icon" href="/dist_assets/media/logos/1.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <link href="/dist_assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="/dist_assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="/dist_assets/css/style.css" rel="stylesheet" type="text/css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body id="kt_body" class="bg-body-secondary">
    <div class="d-flex flex-column flex-root">
        <div class="d-flex flex-column flex-lg-row flex-column-fluid">
            <div class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
                <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                    <div class="w-lg-600px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                        <div class="fv-row mb-10 text-center">
                            <div class="alert alert-success d-flex align-items-center p-5">
                                <span class="svg-icon svg-icon-2hx svg-icon-success me-3 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path opacity="0.3" d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z" fill="black"></path>
                                        <path d="M10.5606 11.3042L9.57283 10.3018C9.28174 10.0065 8.80522 10.0065 8.51412 10.3018C8.22897 10.5912 8.22897 11.0559 8.51412 11.3452L10.4182 13.2773C10.8099 13.6747 11.451 13.6747 11.8427 13.2773L15.4859 9.58051C15.771 9.29117 15.771 8.82648 15.4859 8.53714C15.1948 8.24176 14.7183 8.24176 14.4272 8.53714L11.7002 11.3042C11.3869 11.6221 10.874 11.6221 10.5606 11.3042Z" fill="black"></path>
                                    </svg>
                                </span>
                                <span id="alertMessage" class="bold" style="font-weight: bold;">Votre compte a été validé, vous pouvez désormais vous connecter</span>
                            </div>
                            <div id="button" class="text-center">

                                <button class="btn btn-success" onclick="connection()">Se connecter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        function connection() {
            location.href = '/page-connexion';
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>



    <?php
    // header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    // header("Cache-Control: post-check=1, pre-check=0", false);
    // header("Pragma: no-cache");
    // // Pour empêcher l'utilisateur de revenir en arrière avec le bouton "Retour"
    // // header("Location: page-connexion");
    require '../config.php';

    // Activer l'affichage des erreurs
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // Vérification de la méthode HTTP
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
        $matricule = $_POST['matricule'] ?? null;
        $msg = $_POST['msg'] ?? null;
        $status = $_POST['status'] ?? null;
        // $msg = addslashes($msg);
        echo "<script>
        const alertContainer = document.querySelector('.alert');
        const alertMessage = document.querySelector('#alertMessage');
        const icon = document.querySelector('.svg-icon');
        alertMessage.innerHTML = `" . addslashes($msg) . "`;
        alertContainer.classList.add('alert-{$status}');

        icon.classList.remove('svg-icon-success');
        icon.classList.add('svg-icon-{$status}');
        
    </script>";
        // Vérifier si le matricule est fourni
        if (empty($matricule)) {
            afficherMessage("Erreur : Matricule manquant.", "error");
            exit;
        }
    }
    if ($method == 'GET') {
        // Vérification obligatoire du token
        if (!isset($_GET['token']) || empty($_GET['token'])) {
            afficherMessage("Token de validation manquant", "error");
            exit;
        }

        try {
            // Décodage et validation du token
            $token = $_GET['token'];
            $decodedToken = base64_decode($token);

            // Vérification du format du token décodé
            if (strpos($decodedToken, '|') === false) {
                afficherMessage("Format de token invalide", "error");
                exit;
            }

            list($matricule, $timestamp) = explode('|', $decodedToken, 2);

            // Validation des données du token
            if (empty($matricule) || !is_numeric($timestamp)) {
                afficherMessage("Token corrompu", "error");
                exit;
            }

            // Vérification de l'expiration du token (24h)
            $tokenAge = time() - (int)$timestamp;
            if ($tokenAge > 86400) {
                afficherMessage("Le lien de validation a expiré", "expired");
                exit;
            }
            if (isset($_GET['message']) && !empty($_GET['message'])) {
                $message = $_GET['message'];
                afficherMessage($message, 'success');
                exit;
            }
            // Récupération des données utilisateur de manière sécurisée
            $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE matricule = ?');
            $stmt->execute([$matricule]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                afficherMessage("Utilisateur introuvable", "error");
                exit;
            }

            // Traitement des redirections spéciales
            // if ($user['access'] == 2) {
            //     // Si l'utilisateur est un étudiant, rediriger vers la page de modification du mot de passe
            //     header("Location: /editPassword?token=" . urlencode($token));
            //     exit;
            // }

            // Vérification de l'état du compte
            if ($user['valideCompte'] == 1) {
                $message = ($user['linkValid'] == 0)
                    ? "Veuillez vérifier votre boite mail, un email vous a été envoyé."
                    : "Votre compte est déjà validé.";
                afficherMessage($message, "info");
                exit;
            }

            // Validation de la durée du lien (1 heure)
            if (!empty($user['linkSendDate'])) {
                $linkSendDate = strtotime($user['linkSendDate']);
                $expirationTime = 3600; // 1 heure en secondes

                if ($linkSendDate === false || (time() - $linkSendDate) > $expirationTime) {
                    afficherMessage("Lien expiré. Un nouveau lien doit être généré.", "expired");
                    exit;
                }
            }

            if ($user['linkValid'] == 1) {
                afficherMessage("Ce lien a déjà été utilisé.", "used");
                exit;
            }

            // Préparation de la mise à jour
            $updateFields = [
                'valideCompte' => 1,
                'linkValid' => 1,
                'linkSendDate' => gmdate('Y-m-d H:i:s') // Ajout d'un timestamp de validation
            ];

            if ($user['createdBy'] == 'admin') {
                $updateFields['access'] = 1;
            }

            // Construction dynamique de la requête SQL
            $setClauses = [];
            foreach ($updateFields as $field => $value) {
                $setClauses[] = "$field = :$field";
            }

            $updateQuery = "UPDATE utilisateur SET " . implode(', ', $setClauses) . " WHERE matricule = :matricule";
            $stmt = $pdo->prepare($updateQuery);

            // Ajout du matricule aux paramètres
            $updateFields['matricule'] = $matricule;

            // Exécution de la mise à jour
            if ($stmt->execute($updateFields)) {
                $message = ($user['createdBy'] == 'admin')
                    ? "Compte validé. Veuillez modifier votre mot de passe."
                    : "Votre compte a été validé avec succès.";

                $status = ($user['createdBy'] == 'admin')
                    ? "mustChangePassword"
                    : "success";

                afficherMessage($message, $status);
                exit;
            }

            afficherMessage("Erreur lors de la validation du compte", "error");
            exit;
        } catch (PDOException $e) {
            error_log("Erreur de validation: " . $e->getMessage());
            afficherMessage($e->getMessage(), "error");
            exit;
        }
    }

    // Fonction d'affichage des messages améliorée
    function afficherMessage($message, $status)
    {
        $token = $_GET['token']; // Encoder le matricule

        echo "<script>
        
        const alertContainer = document.querySelector('.alert');
        const alertMessage = document.querySelector('#alertMessage');
        const icon = document.querySelector('.svg-icon');
        alertMessage.innerHTML = '{$message}';
        alertContainer.classList.add('alert-{$status}');
        if('{$status}' == 'success'){
            if (alertContainer.classList.contains('alert-danger')) {
                icon.classList.remove('svg-icon-danger');
                icon.classList.add('svg-icon-success');
                alertContainer.classList.remove('alert-danger');
                alertContainer.classList.add('alert-success');
            }
        } else if('{$status}' == 'error'){
            if (alertContainer.classList.contains('alert-success')) {
                icon.classList.remove('svg-icon-success');
                icon.classList.add('svg-icon-danger');
                alertContainer.classList.remove('alert-success');
                alertContainer.classList.add('alert-danger');
            }
        } else if('{$status}' == 'expired' || '{$status}' == 'used'){
            const button = document.querySelector('#button');
            button.innerHTML = '<a class=\"btn btn-primary\" href=\"validation/envoieMail\">Demander un nouveau lien</a>';
            icon.classList.remove('svg-icon-success');
            icon.classList.add('svg-icon-danger');
            alertContainer.classList.remove('alert-success');
            alertContainer.classList.add('alert-danger');
            
        }else if('{$status}' == 'valide'){
            
            icon.classList.remove('svg-icon-success');
            icon.classList.add('svg-icon-info');
            alertContainer.classList.remove('alert-success');
            alertContainer.classList.add('alert-info');
            
        }else if('{$status}' === 'mustChangePassword'){
            //const button = document.querySelector('#button');

            //button.innerHTML = '<a class=\"btn btn-primary\" href=\"editPassword?matricule=$token\">Changer le mot de passe</a>';
            //icon.classList.remove('svg-icon-success');
            //icon.classList.add('svg-icon-warning');
            //alertContainer.classList.remove('alert-success');
            //alertContainer.classList.add('alert-warning');
            //window.location.href = `../editPassword?token={$token}`;
            if (!window.location.href.includes('editPassword.php')) {
                window.location.href = `../editPassword?token={$token}`;
            }
        }
        
    </script>";
        exit;
    }

    ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>

</html>