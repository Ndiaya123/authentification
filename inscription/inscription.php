<?php
header('Content-Type: application/json'); // Déclare que la réponse sera en JSON
$method = $_SERVER['REQUEST_METHOD'];

require '../config.php';
if ($method == 'GET') {
    if ($_GET['action'] == 'verification') {
        $matricule = $_GET['matricule'];
        $email = $_GET['email'];
        echo json_encode(verification($pdo, $matricule, $email));
    }
    if ($_GET['action'] == 'editPassword') {
        $matricule = $_GET['matricule'];
        $password = $_GET['password'];

        echo json_encode(editPassword($pdo, $matricule, $password));
    }
    if($_GET['action'] == 'getEmailByMatricule'){
        echo json_encode(getEmailByMatricule($pdo,$_GET['matricule']));
    }
}


if (isset($_POST['matricule'])) {
    $matricule = $_POST['matricule'];
    get_info($matricule);
}

function get_info($matricule)
{
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://test.uahb.sn/api_authentification',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => http_build_query(array('option' => '1', 'matricule' => $matricule)), // Utilise http_build_query pour formater correctement les champs POST
        CURLOPT_HTTPHEADER => array(
            'Cookie: PHPSESSID=8cb0e85bed40346dc1e2e59ba2972678'
        ),
    ));

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        echo json_encode(['error' => curl_error($curl)]);
    } else {
        echo $response;
    }

    curl_close($curl);
}

function verification($pdo, $matricule, $email)
{
    // Requête pour récupérer les informations de l'utilisateur
    $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE matricule = ?');
    $stmt->execute([$matricule]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC); // Utiliser fetch pour récupérer une seule ligne

    if ($row == null) {
        // Vérifier si l'email existe dans la base de données
        $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC); // Utiliser fetch pour récupérer une seule ligne
        if ($row == null) {
            // Si aucun utilisateur n'est trouvé
            return [
                'status' => 'unexist',
                'message' => 'Votre compte n\'existe pas, veuillez d\abord créer un compte !!'
            ];
        } else {
            // Si aucun utilisateur n'est trouvé
            return [
                'status' => 'error',
                'message' => 'L\'email ne correspond pas au matricule fourni !!'
            ];
        }
        
    } else {
        // Vérifier si l'email correspond
        // Vérifier si le lien n'est pas expiré
        $expirationTime = 60 * 60; // 1 heure (3600 secondes)
        $currentTime = time();
        $linkSendDate = strtotime($row['linkSendDate']);
        if (($currentTime - $linkSendDate) > $expirationTime && $row['valideCompte'] == 0 && $row['email'] === $email) {
            return [
                'exist' => 'true',
                'status' => 'validationLinkExpiredAndAccountNotValid',
                'message' => 'Le lien a expiré et votre compte n\'est pas activé. Veuillez demander un nouveau lien.'
            ];
        }

        if (($currentTime - $linkSendDate) > $expirationTime && $row['valideCompte'] == 1 && $row['email'] === $email && $row['linkValid'] == 0) {
            return [
                'exist' => 'true',
                'status' => 'updatePasswordExpired',
                'message' => 'Le lien de modification de mot de passe a expiré. Veuillez demander un nouveau lien.'
            ];
        }
        if(($currentTime - $linkSendDate) < $expirationTime && $row['valideCompte'] == 1 && $row['email'] === $email && $row['linkValid'] == 0){
            return [
                'exist' => 'true',
                'status' => 'mailIsSendAndNotUsed',
                'message' => 'Veuillez vérifier votre boite mail, le lien de validation a déjà été envoyé !!'
            ];
        }
        if ($row['email'] === $email && $row['valideCompte'] == 1) {

            return [
                'exist' => 'true',
                'status' => 'success',
                'message' => 'Veuillez vérifier votre boite mail afin de confirmer qu\'il s\'agit bien de vous',
                'data' => $row
            ];
        } else if ($row['valideCompte'] == 0 && $row['email'] === $email) {
            return [
                'exist' => 'true',
                'status' => 'acountUnactivated',
                'message' => 'Votre compte existe déjà mais n\'est pas encore activé, veuilez d\'abord vérifier votre email pour l\'activé !!'
            ];
        } else {
            return [
                'exist' => 'true',
                'status' => 'error',
                'message' => 'L\'email ne correspond pas au matricule fourni !!'
            ];
        }
    }
}
function getEmailByMatricule($pdo,$matricule){
     $query = "SELECT email FROM utilisateur WHERE matricule = :matricule";
     $stmt = $pdo->prepare($query);
     $stmt->bindParam(':matricule', $matricule, PDO::PARAM_STR);
     $stmt->execute();
     return $stmt->fetch(PDO::FETCH_ASSOC);
}
function editPassword($pdo, $matricule, $password) {
    try {
        // 1. D'abord récupérer les infos de l'utilisateur
        $query = "SELECT createdBy, access FROM utilisateur WHERE matricule = :matricule";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':matricule', $matricule, PDO::PARAM_STR);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return [
                'status' => 'error',
                'message' => 'Ce compte n\'existe pas !!'
            ];
        }

        // 2. Préparer la requête de mise à jour (base)
        $updateQuery = "UPDATE utilisateur SET password = :password, linkValid = 1,valideCompte = 1";
        
        // 3. Vérifier les conditions pour changer l'access
        if ($user['createdBy'] === 'admin' && $user['access'] == 2) {
            $updateQuery .= ", access = 1"; // On ajoute la modification de l'access
        }
        
        $updateQuery .= " WHERE matricule = :matricule";
        
        // 4. Exécuter la mise à jour complète
        $updateStmt = $pdo->prepare($updateQuery);
        $hashedPassword = md5($password); // Utilisation de password_hash au lieu de md5
        
        $updateStmt->bindParam(':matricule', $matricule, PDO::PARAM_STR);
        $updateStmt->bindParam(':password', $hashedPassword);
        
        if ($updateStmt->execute()) {
            if($user['createdBy'] === 'admin' && $user['access'] == 2){

                return [
                    'status' => 'defaultPasswordModified',
                    'message' => 'Mot de passe modifié avec succès, vous pouvez vous connecter avec votre nouveau mot de passe !'
                ];
            }else{
                return [
                    'status' => 'passwordModified',
                    'message' => 'Mot de passe modifié avec succès, vous pouvez vous connecter avec votre nouveau mot de passe !'
                ];
            }
        } else {
            return [
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du mot de passe'
            ];
        }
        
    } catch (PDOException $e) {
        error_log("Erreur editPassword: " . $e->getMessage());
        return [
            'status' => 'error',
            'message' => 'Une erreur technique est survenue'
        ];
    }
}
