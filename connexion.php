<?php

header("Cache-Control: no-cache, no-store, must-revalidate"); // Désactive le cache
header("Pragma: no-cache"); // Désactive le cache pour les anciens navigateurs
header("Expires: 0"); // Expire immédiatement

require 'config.php';
// require_once './cmjlf&ctd/db.php';
// require_once './admission/controller_ENT/db.php';
// Durée de vie de la session (1h ou 14h)

// 1️⃣ Configuration PHP pour la durée de vie des sessions
ini_set('session.gc_maxlifetime', $session_lifetime);
ini_set('session.gc_probability', 100); // Force le GC à s'exécuter à chaque requête
ini_set('session.gc_divisor', 100);    // 100% de chance d'exécution

// 2️⃣ Paramètres du cookie de session
session_set_cookie_params([
    'lifetime' => $session_lifetime,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'samesite' => 'Strict' // Protection contre les attaques CSRF
]);
session_start();
header('Content-Type: application/json');  // Assurez-vous de bien renvoyer du JSON

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
        case 'connexion':
            connexion($pdo, $pdoCMJLF, $pdoENT);
            break;
        // Ajoutez d'autres actions si nécessaire
        default:
            echo json_encode(['status' => 'error', 'message' => 'Action non reconnue']);
            break;
    }
}

function connexion($pdo, $pdoCMJLF, $pdoENT)
{
    $email = $_GET['email'] ?? '';
    $password = $_GET['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email ou mot de passe manquant']);
        exit;
    }

    $user = getUserByEmailAndPassword($pdo, $email, $password);
   
   
    if ($user) {
        initializeSession($user, $pdo, $pdoCMJLF, $pdoENT);
        $response = generateUserResponse($user);

        
        echo json_encode($response);
    } else {
        
        echo json_encode(['status' => 'error', 'message' => 'Nom d\'utilisateur ou mot de passe incorrect.']);
    }
    exit;
}

// function getUserByEmailAndPassword($pdo, $email, $password)
// {
//     $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE email = ? AND password = MD5(?)');
//     $stmt->execute([$email, $password]);

    
//     return $stmt->fetch();
// }

function getUserByEmailAndPassword($pdo, $email, $password)
{
    // On récupère l'utilisateur par email uniquement
    $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE email = ?');
    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérification du mot de passe
    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }

    return false;
}


function initializeSession($user, $pdo, $pdoCMJLF, $pdoENT)
{
    $_SESSION['id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['matricule'] = $user['matricule'];
    $_SESSION['id_utilisateur'] = $user['id'];
    $_SESSION['statutUtilisateur'] = $user['statutUtilisateur'];

    if ($user['valideCompte'] == 0) {
        $_SESSION['loggedin'] = false;
        echo json_encode(['status' => 'invalid', 'message' => 'Votre compte n\'est pas validé. Veuillez vérifier votre compte mail pour effectuer la validation.']);
        exit;
    } elseif ($user['access'] == 0) {
        $_SESSION['loggedin'] = false;
        echo json_encode(['status' => 'error', 'message' => 'Votre compte a été bloqué']);
        exit;
    } elseif ($user['access'] == 2) {
        $_SESSION['loggedin'] = false;
        echo json_encode(['status' => 'defaultPass', 'message' => 'Votre compte a été crée, mais vous devez changer le mot de passe par défaut à travers le mail qui vous a été envoyé.']);
        exit;
    } else {
        if ($user['statutUtilisateur'] == 1) {
            $_SESSION['structures'] = get_structures($pdo);
        }
        $_SESSION['current_user'] = get_info_connexion($_SESSION['matricule']);
        if (is_array($_SESSION['current_user'])) {

            $_SESSION['info'] = array_merge(generateUserResponse($user), $_SESSION['current_user']);
            // if($_SESSION['current_user'][0]['PosteAResponsabilite'] == 'OUI'){
            //     loadTachePost($pdo,$_SESSION['current_user'][0]['idFonction']);
            // }
            // création de la session pour CMJLF
            // récupération de l'agent dans la table administration à travers son matricule et son email
            $stmtCMJLF = $pdoCMJLF->prepare('SELECT * FROM administration WHERE email = ?');
            $stmtCMJLF->execute([$_SESSION['email']]);
            $cmjlfUser = $stmtCMJLF->fetch(PDO::FETCH_ASSOC);   
            if ($cmjlfUser) {
                $_SESSION["id_user"] = $cmjlfUser['idAgent'] ?? null;
                $sql_compage = "SELECT *  FROM anneescolaire WHERE cloture='0'";
                $stmtCompage = $pdoCMJLF->prepare($sql_compage);
                $stmtCompage->execute();
                $anneesScolaires = $stmtCompage->fetchAll(PDO::FETCH_ASSOC);
                $_SESSION['campagne']= $anneesScolaires[0]['idAnneeScolaire'] ?? null;
                if ($anneesScolaires) {
                    $_SESSION['annees_scolaires'] = $anneesScolaires;
                }
                // Récupérer les infos de l'ecole à travers idEcole de l'agent
                $stmtEcole = $pdoCMJLF->prepare('SELECT * FROM ecole WHERE idEcole = ?');
                $stmtEcole->execute([$cmjlfUser['idEcole']]);
                $ecole = $stmtEcole->fetch(PDO::FETCH_ASSOC);
                if ($ecole) {
                    $_SESSION['ecole'] = $ecole;
                    $_SESSION['idEcole'] = $ecole['idEcole'];
                    $_SESSION['photoEcole'] = $ecole['photo'];
                    $_SESSION['nomCompletEcole'] = $ecole['nomComplet'];
                    $_SESSION['adresseEcole'] = $ecole['adresse'];
                    $_SESSION['iban'] = $ecole['iban'];
                    $_SESSION['couleurPrincipale'] = $ecole['couleurPrincipale'];
                    $_SESSION['couleurSecondaire'] = $ecole['couleurSecondaire'];
                }
            }
            //  else {
            //     echo json_encode(['status' => 'error', 'message' => 'Aucun compte trouvé pour cet email dans le collège.']);
            //     exit;
            // }
            // Création de la session pour ENT
            $stmtENT = $pdoENT->prepare('SELECT * FROM utilisateurs WHERE email = ?');
            $stmtENT->execute([$_SESSION['email']]);
            $entUser = $stmtENT->fetch(PDO::FETCH_ASSOC);
            if ($entUser) {

                $_SESSION['tmpPrenom'] = $entUser['prenom'] ?? '';
                $_SESSION['tmpNom'] = $entUser['nom'] ?? '';
                $_SESSION['tmpRole'] = $entUser['idRole'] ?? '';
                $_SESSION['tmpId'] = $entUser['id'] ?? '';
                $_SESSION['tmpPhoto'] = $entUser['photo'] ?? '';
                $_SESSION['tmpMatricule'] = $entUser['matricule'] ?? '';
                $_SESSION['tmpEmail'] = $entUser['email'] ?? '';
                $_SESSION['idDepartement'] = $entUser['idDepartement'] ?? '';
            }
            //  else {
            //     echo json_encode(['status' => 'error', 'message' => 'Aucun compte trouvé pour cet email dans l\'ENT.']);
            //     exit;
            // }


           

            // Vérifier si l'utilisateur est dans un sans ... ou pas
            if (isset($_SESSION['current_user'][0]['sans']) && $_SESSION['current_user'][0]['sans'] == 1) {
                // Dans le sans
                // Vérifier s'il est chef ou adjoint dans le sans
                if ($_SESSION['current_user'][0]['grade'] == 1) {
                    // CHEF
                    // $_SESSION['chefAgents'] = json_encode(getChefAgent($pdo));
                } else {
                    // Adjoint
                }
                # code...
            } else {
                // Vérifier s'il est chef ou adjoint dans le sans
                if (isset($_SESSION['current_user'][0]['grade']) && $_SESSION['current_user'][0]['grade'] == 1) {
                    // CHEF
                    # code...
                } else {
                    // Adjoint
                }
            }
            if ($user['statutUtilisateur'] !== 1) {

                loadUserTasks($pdo, $_SESSION['id'], $_SESSION['current_user'][0]['qualification']);
                // Redirection vers la tâche nommée "acceuil" si elle existe
                if (isset($_SESSION['getTacheForAgent']) && is_array($_SESSION['getTacheForAgent'])) {
                    foreach ($_SESSION['getTacheForAgent'] as $tache) {
                        if (isset($tache['tache']) && strtolower($tache['tache']) === 'Acceuil' && isset($tache['url']) && $_SESSION['current_user'][0]['PosteAResponsabilite'] == 'NON') {
                            header('Location: ' . $tache['url']);
                            exit;
                        }
                    }
                }
            } else {
                require_once 'getAllUsersInfo.php';

                $service = new MatriculeService($pdo);

                // 1. Récupérer tous les utilisateurs avec toutes leurs informations
                $utilisateurs = $service->getUtilisateurs();

                if (empty($utilisateurs)) {
                    throw new RuntimeException("Aucun utilisateur trouvé dans la base de données");
                }

                // 2. Extraire les matricules pour l'API
                $matricules = array_column($utilisateurs, 'matricule');

                // 3. Appeler l'API
                $apiData = $service->sendMatriculesToApi($matricules, '3501ce20ba20500f62b785e018853245');

                // 4. Fusionner les données par email
                $resultats = $service->mergeData($utilisateurs, $apiData, $pdo);

                // 5. Afficher le résultat final
                header('Content-Type: application/json');

                $_SESSION['Users'] = json_encode($resultats);
            }
        }
        defaultTasks($pdo);
        loadIcons($pdo);
        loadAdministrativeData($pdo, $_SESSION['info']);
    }

    $allAllowedTasks = [];

    // Ajoute les tâches agent
    if (isset($_SESSION['getTacheForAgent']) && is_array($_SESSION['getTacheForAgent'])) {
        $allAllowedTasks = array_merge($allAllowedTasks, $_SESSION['getTacheForAgent']);
    }

    // Ajoute les tâches par défaut
    if (isset($_SESSION['defaultTask']) && is_array($_SESSION['defaultTask'])) {
        $allAllowedTasks = array_merge($allAllowedTasks, $_SESSION['defaultTask']);
    }

    // Ajoute les tâches Niv1
    if (isset($_SESSION['tacheNiv1']) && is_array($_SESSION['tacheNiv1'])) {
        $allAllowedTasks = array_merge($allAllowedTasks, $_SESSION['tacheNiv1']);
    }

    // Ajoute les tâches Niv2 ou Niv3 (priorité à Niv2 si les deux existent)
    if (isset($_SESSION['tacheNiv2']) && is_array($_SESSION['tacheNiv2'])) {
        $allAllowedTasks = array_merge($allAllowedTasks, $_SESSION['tacheNiv2']);
    } elseif (isset($_SESSION['tacheNiv3']) && is_array($_SESSION['tacheNiv3'])) {
        $allAllowedTasks = array_merge($allAllowedTasks, $_SESSION['tacheNiv3']);
    }

    // Supprime les doublons par id de tâche
    $allAllowedTasks = array_values(array_unique($allAllowedTasks, SORT_REGULAR));

    // Stocke le résultat fusionné en session
    $_SESSION['allAllowedTasks'] = $allAllowedTasks;
    // 🔁 Crée les comptes locaux si nécessaire
    $pdoSet = [
        'CMJLF' => $pdoCMJLF,
        'ENT' => $pdoENT,
        'ERP' => $pdo // utilisé pour les infos ERP communes (ex : unite admin)
    ];

   // 1. Extraire tous les idDB valides depuis les tâches
$idDBsAutorises = array_unique(array_filter(array_column($_SESSION['allAllowedTasks'], 'idDB')));
$idDBsAutorises = array_values($idDBsAutorises); // ✅ réindexe proprement

// 2. Initialiser proprement la session
$_SESSION['authorized_idDBs'] = [];

if (!empty($idDBsAutorises)) {
    // 3. Créer les placeholders dynamiques
    $placeholders = implode(',', array_fill(0, count($idDBsAutorises), '?'));

    // 4. Construire la requête
    $query = "SELECT id, nom FROM base_donnees WHERE id IN ($placeholders)";
    $stmt = $pdo->prepare($query);

    // 6. Vérification stricte
    if (count($idDBsAutorises) === substr_count($query, '?')) {
        $stmt->execute($idDBsAutorises);
        $baseNomMap = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $_SESSION['authorized_idDBs'] = array_values($baseNomMap);
    } else {
        throw new Exception("Incohérence entre le nombre de placeholders et les paramètres.");
    }
}else {
    // Si aucune base de données n'est autorisée, on vide le tableau
    $_SESSION['authorized_idDBs'] = [];


}


    // Stocker les noms de base pour provisionnement
    foreach ($_SESSION['authorized_idDBs'] as $dbKey) {
        provisionCompteLocal($dbKey, $_SESSION['matricule'], $_SESSION['email'], $_SESSION['current_user'][0], $pdoSet);
    }
        $_SESSION['loggedin'] = true;
    $_SESSION['LAST_ACTIVITY'] = time();
}
function provisionCompteLocal($dbKey, $matricule, $email, $userData, $pdoSet)
{
    
    switch ($dbKey) {
        case 'o86fy_cmjlf': // CMJLF
            if (!compteCMJLFExiste($pdoSet['CMJLF'], $email)) {
                creerCompteCMJLF($pdoSet['CMJLF'], $matricule, $email, $userData);
                $stmtCMJLF = $pdoSet['CMJLF']->prepare('SELECT * FROM administration WHERE email = ?');
            $stmtCMJLF->execute([$_SESSION['email']]);
            $cmjlfUser = $stmtCMJLF->fetch(PDO::FETCH_ASSOC);   
            if ($cmjlfUser) {
                $_SESSION["id_user"] = $cmjlfUser['idAgent'] ?? null;
                // Récupérer les infos de l'ecole à travers idEcole de l'agent
                $stmtEcole = $pdoSet['CMJLF']->prepare('SELECT * FROM ecole WHERE idEcole = ?');
                $stmtEcole->execute([$cmjlfUser['idEcole']]);
                $ecole = $stmtEcole->fetch(PDO::FETCH_ASSOC);
                if ($ecole) {
                    $_SESSION['ecole'] = $ecole;
                    $_SESSION['idEcole'] = $ecole['idEcole'];
                    $_SESSION['photoEcole'] = $ecole['photo'];
                    $_SESSION['nomCompletEcole'] = $ecole['nomComplet'];
                    $_SESSION['adresseEcole'] = $ecole['adresse'];
                    $_SESSION['iban'] = $ecole['iban'];
                    $_SESSION['couleurPrincipale'] = $ecole['couleurPrincipale'];
                    $_SESSION['couleurSecondaire'] = $ecole['couleurSecondaire'];
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Aucun compte trouvé pour cet email dans le collège.']);
                exit;
            }
          
            }else {
                // Si le compte existe déjà, on récupère l'id de l'agent dans la base CMJLF
                // $stmtCMJLF = $pdoSet['CMJLF']->prepare('SELECT * FROM administration WHERE email = ?');
                // $stmtCMJLF->execute([$_SESSION['email']]);
                // $cmjlfUser = $stmtCMJLF->fetch(PDO::FETCH_ASSOC);
                // if ($cmjlfUser) {
                //     $_SESSION['idAgent'] = $cmjlfUser['idAgent'] ?? null;
                    
                // }
            }
            break;
        case 'o86fy_ent': // ENT
            if (!compteENTExiste($pdoSet['ENT'], $email)) {
                creerCompteENT($pdoSet['ENT'], $matricule, $email, $userData, $pdoSet['ERP']);
                  // Création de la session pour ENT
                $stmtENT = $pdoSet['ENT']->prepare('SELECT * FROM utilisateurs WHERE email = ?');
                $stmtENT->execute([$_SESSION['email']]);
                $entUser = $stmtENT->fetch(PDO::FETCH_ASSOC);
                if ($entUser) {

                    $_SESSION['tmpPrenom'] = $entUser['prenom'] ?? '';
                    $_SESSION['tmpNom'] = $entUser['nom'] ?? '';
                    $_SESSION['tmpRole'] = $entUser['idRole'] ?? '';
                    $_SESSION['tmpId'] = $entUser['id'] ?? '';
                    $_SESSION['tmpPhoto'] = $entUser['photo'] ?? '';
                    $_SESSION['tmpMatricule'] = $entUser['matricule'] ?? '';
                    $_SESSION['tmpEmail'] = $entUser['email'] ?? '';
                    $_SESSION['idDepartement'] = $entUser['idDepartement'] ?? '';
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Aucun compte trouvé pour cet email dans l\'ENT.']);
                    exit;
                }
            }else {
                // Si le compte existe déjà, on récupère l'id de l'utilisateur dans la base ENT
                // $stmtENT = $pdoSet['ENT']->prepare('SELECT * FROM utilisateurs WHERE email = ?');
                // $stmtENT->execute([$_SESSION['email']]);
                // $entUser = $stmtENT->fetch(PDO::FETCH_ASSOC);
                // if ($entUser) {
                //     $_SESSION['tmpId'] = $entUser['id'] ?? null;
                //     $_SESSION['tmpMatricule'] = $entUser['matricule'] ?? null;
                //     $_SESSION['tmpEmail'] = $entUser['email'] ?? null;
                // }
            }
        break;
            // Ajouter d'autres modules ici si besoin
    }
}

function compteCMJLFExiste($pdoCMJLF, $email)
{
    $stmt = $pdoCMJLF->prepare("SELECT COUNT(*) FROM administration WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetchColumn() > 0;
}

function creerCompteCMJLF($pdoCMJLF, $matricule, $email, $userData)
{
    $stmt = $pdoCMJLF->prepare("INSERT INTO administration 
        (idRole, matricule, nomAgent, prenomAgent, sexeAgent, dobAgent, pobAgent, adresseAgent, telAgent, cni, photo, dateCreation, email, etat, ecole, idEcole) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        6,
        $matricule,
        $userData['nom'] ?? '',
        $userData['prenom'] ?? '',
        $userData['sexe'] ?? '',
        $userData['dob'] ?? null,
        $userData['pob'] ?? 'Dakar',
        $userData['adresse'] ?? '',
        $userData['tel'] ?? '',
        $userData['cni'] ?? '',
        $userData['photo'] ?? '',
        gmdate('Y-m-d H:i:s'),
        $email,
        1,
        'CMJLF',
        $userData['idEcole'] ?? 1
    ]);
}

function compteENTExiste($pdoENT, $email)
{
    $stmt = $pdoENT->prepare("SELECT COUNT(*) FROM utilisateurs WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetchColumn() > 0;
}

function creerCompteENT($pdoENT, $matricule, $email, $userData, $pdoERP)
{
    $uniteAdministrative = $userData['idUniteAdministrativeNiv3'] ?? null;
    $idDepartement = null;

    if ($uniteAdministrative && $_SESSION['current_user'][0]['grade'] == 1) {
        $stmtUA = $pdoERP->prepare("SELECT codeNiv3 FROM unite_administrative_niv3 WHERE id = ?");
        $stmtUA->execute([$uniteAdministrative]);
        $uaRow = $stmtUA->fetch(PDO::FETCH_ASSOC);
        if ($uaRow && !empty($uaRow['codeNiv3'])) {
            $stmtDep = $pdoENT->prepare("SELECT id FROM departements WHERE code_departement = ?");
            $stmtDep->execute([$uaRow['codeNiv3']]);
            $depRow = $stmtDep->fetch(PDO::FETCH_ASSOC);
            if ($depRow) {
                $idDepartement = $depRow['id'];
            }
        }
    }

    $stmt = $pdoENT->prepare("INSERT INTO utilisateurs (matricule, prenom, nom, email, password, photo, statut, last_activity, idRole, idDepartement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $matricule,
        $userData['prenom'] ?? '',
        $userData['nom'] ?? '',
        $email,
        password_hash('Passer2022', PASSWORD_DEFAULT),
        $userData['photo'] ?? '',
        1,
        gmdate('Y-m-d H:i:s'),
        22,
        $idDepartement
    ]);
}

function getChefAgent($pdo)
{
    // 1. Vérification du matricule
    if (empty($_SESSION['matricule']) || !is_numeric($_SESSION['matricule'])) {
        throw new InvalidArgumentException("Matricule invalide ou non défini.");
    }

    // 2. Appel de l'API pour récupérer les chefs d'agents
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://test.uahb.sn/api_authentification_2',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => [
            'option' => '2',
            'matricule' => $_SESSION['matricule']
        ],
        CURLOPT_HTTPHEADER => [
            'Cookie: PHPSESSID=3501ce20ba20500f62b785e018853245'
        ],
    ]);

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        $error = curl_error($curl);
        curl_close($curl);
        throw new RuntimeException("Erreur cURL : $error");
    }

    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($httpCode !== 200) {
        throw new RuntimeException("Erreur HTTP : $httpCode");
    }

    $chefs = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException("Erreur de décodage JSON : " . json_last_error_msg());
    }

    if (empty($chefs)) {
        throw new RuntimeException("Aucun chef d'agent trouvé via l'API.");
    }

    // 3. Extraire la liste des emails uniques
    $emails = [];
    foreach ($chefs as $chef) {
        if (!empty($chef['email'])) {
            $emails[] = $chef['email'];
        }
    }

    if (empty($emails)) {
        throw new RuntimeException("Aucun email trouvé dans la réponse de l'API.");
    }

    // Supprimer les doublons
    $emails = array_unique($emails);

    // 4. Récupérer uniquement les utilisateurs dont l'email est dans la liste
    $placeholders = implode(',', array_fill(0, count($emails), '?'));
    $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email IN ($placeholders)");
    $stmt->execute($emails);
    $utilisateurs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($utilisateurs)) {
        throw new RuntimeException("Aucun utilisateur correspondant trouvé dans la base.");
    }

    // 5. Indexer les utilisateurs par email
    $utilisateurIndex = [];
    foreach ($utilisateurs as $user) {
        $utilisateurIndex[$user['email']] = $user;
    }

    // 6. Fusion des données
    $result = [];
    foreach ($chefs as $chef) {
        $email = $chef['email'] ?? null;

        if ($email && isset($utilisateurIndex[$email])) {
            $result[] = array_merge($utilisateurIndex[$email], $chef);
        }
    }

    return $result; // Tableau final fusionné
}
// Récupération des 
// Récupérer toutes UniteAdministrativeNiv2 dont l'idUniteAdministrativeNiv1 = 4
function getUniteAdministrativeNiv2($pdo, $idUniteAdministrativeNiv1)
{
    try {
        $stmt = $pdo->prepare('SELECT * FROM unite_administrative_niv2 WHERE idUniteAdministrativeNiv1 = ?');
        $stmt->execute([$idUniteAdministrativeNiv1]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Erreur lors de la récupération des unités administratives : " . $e->getMessage();
        return [];
    }
}
function get_structures($pdo)
{
    try {
        // Préparation de la requête avec une jointure explicite
        $stmt = $pdo->prepare('
            SELECT 
                ua.id AS id, 
                ua.codeNiv1 AS codeNiv1, 
                i.icon AS icon 
            FROM 
                unite_administrative_niv1 ua
            INNER JOIN 
                icons i 
            ON 
                i.id_icon = ua.idIcon
        ');

        // Exécution de la requête
        $stmt->execute();

        // Retourner tous les résultats sous forme de tableau associatif
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // En cas d'erreur, afficher un message d'erreur
        echo "Erreur lors de la récupération des structures : " . $e->getMessage();
        return [];
    }
}


function generateUserResponse($user)
{
    if ($user['statutUtilisateur'] == 1) {
        // $_SESSION['isAdmin'] = true;
        $_SESSION['url'] = 'adminHome';
    } else {
        // $_SESSION['isAdmin'] = false;
        $_SESSION['url'] = 'home';
    }
    return [
        'status' => 'success',
        'url' => ($user['statutUtilisateur'] == 1) ? 'adminHome' : 'home',
        'email' => $user['email'],
        'matricule' => $user['matricule']
    ];
}

function loadUserTasks($pdo, $userId, $userQualifications)
{
    // 1. Récupérer d'abord toutes les tâches avec access=1
    $stmt = $pdo->prepare('SELECT 
        t.id AS id,
        t.idTypeTache AS idTypeTache,
        t.nom AS tache,
        sm.nom AS sousMenu,
        i.icon AS icon,
        t.url AS url,
        t.autre_ressource AS autre_ressource,
        t.idSousMenu AS idSousMenu,
        t.idIcon AS tacheIcon,
        t.idDB AS idDB
        FROM tache t
        JOIN tache_utilisateur tu ON t.id = tu.idTache AND tu.idUtilisateur = ? AND tu.access = 1
        LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
        LEFT JOIN icons i ON sm.idIcon = i.id_icon
        where t.active = 1
        GROUP BY t.id');

    $stmt->execute([$userId]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Pour chaque tâche avec access=1, vérifier les qualifications
    foreach ($tasks as $task) {
        // Récupérer les qualifications requises VALIDES pour cette tâche
        $qualifStmt = $pdo->prepare('SELECT qualification 
                                    FROM tache_qualification tq
                                    JOIN qualifications q on q.id = tq.idQualification
                                    WHERE idTache = ? AND valide = 1');
        $qualifStmt->execute([$task['id']]);
        $requiredQualifications = $qualifStmt->fetchAll(PDO::FETCH_COLUMN);

        // Si la tâche a des qualifications requises actives
        if (!empty($requiredQualifications)) {
            $hasRequiredQualification = false;

            // Vérifier si l'utilisateur a au moins une qualification requise
            foreach ($requiredQualifications as $reqQualif) {
                if ($reqQualif === $userQualifications) {
                    $hasRequiredQualification = true;
                    break;
                }
            }

            // Si l'utilisateur n'a AUCUNE qualification requise
            if (!$hasRequiredQualification) {
                // Désactiver l'accès
                $updateStmt = $pdo->prepare('UPDATE tache_utilisateur SET access = 0 
                                           WHERE idTache = ? AND idUtilisateur = ?');
                $updateStmt->execute([$task['id'], $userId]);

                // Retirer la tâche du résultat final
                $tasks = array_filter($tasks, function ($t) use ($task) {
                    return $t['id'] != $task['id'];
                });
            }
        }
    }

    // 3. Stocker dans la session uniquement les tâches accessibles
    $_SESSION['getTacheForAgent'] = array_values($tasks);
}

function loadIcons($pdo)
{
    $stmt = $pdo->prepare('SELECT * FROM icons');
    $stmt->execute();
    $_SESSION['icons'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function loadTachePost($pdo, $idFonction)
{
    $sql = 'SELECT ua1.id AS idUniteAdministrativeNiv, ua1.codeNiv1 AS service, t.idTypeTache AS idTypeTache,
            t.nom AS tache, t.id AS id, sm.nom AS sousMenu, i.icon AS icon, t.url AS url, t.autre_ressource AS autre_ressource, t.idSousMenu AS idSousMenu,
            t.idIcon AS tacheIcon, t.idDB AS idDB
            FROM unite_administrative_niv1 ua1
            JOIN tache t ON t.idUniteAdministrativeNiv2 = ua1.id AND t.idTypeTache = 2
            LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
            LEFT JOIN icons i ON sm.idIcon = i.id_icon
            WHERE t.idFonction = ? and t.active = 1
            GROUP BY t.id
            ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idFonction]);
    $_SESSION['TaskPost'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function loadAdministrativeData($pdo, $userInfo)
{
    if (isset($userInfo[0])) {
        $userInfo = $userInfo[0];
        if (isset($userInfo['idUniteAdministrativeNiv2'])) {
            loadTasksForNiv2($pdo);
            loadUACodes($pdo, $userInfo['idUniteAdministrativeNiv2'], true);
            if (isset($_SESSION['tacheNiv2']) && is_array($_SESSION['tacheNiv2'])) {
                foreach ($_SESSION['tacheNiv2'] as $tache) {
                    if (isset($tache['tache']) && strtolower($tache['tache']) === 'Acceuil' && isset($tache['url'])) {
                        header('Location: ' . $tache['url']);
                        exit;
                    }
                }
            }
        } elseif (isset($userInfo['idUniteAdministrativeNiv3'])) {
            loadTasksForNiv3($pdo);
            loadUACodes($pdo, $userInfo['idUniteAdministrativeNiv3'], false);
            if (isset($_SESSION['tacheNiv3']) && is_array($_SESSION['tacheNiv3'])) {
                foreach ($_SESSION['tacheNiv3'] as $tache) {
                    if (isset($tache['tache']) && strtolower($tache['tache']) === 'Acceuil' && isset($tache['url'])) {
                        header('Location: ' . $tache['url']);
                        exit;
                    }
                }
            }
        } elseif (isset($userInfo['idUniteAdministrativeNiv1'])) {
            loadTasksForNiv1($pdo);
            loadUACodes($pdo, $userInfo['idUniteAdministrativeNiv1'], false);
            if (isset($_SESSION['tacheNiv1']) && is_array($_SESSION['tacheNiv1'])) {
                foreach ($_SESSION['tacheNiv1'] as $tache) {
                    if (isset($tache['tache']) && strtolower($tache['tache']) === 'Acceuil' && isset($tache['url']) && $_SESSION['current_user'][0]['PosteAResponsabilite'] == 'OUI') {
                        header('Location: ' . $tache['url']);
                        exit;
                    }
                }
            }
        }
    }
}

function defaultTasks($pdo)
{
    $sql = 'SELECT 
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.autre_ressource AS autre_ressource,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon,
    t.idDB AS idDB
FROM tache t
LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
LEFT JOIN icons i ON sm.idIcon = i.id_icon
WHERE t.idTypeTache = 3 and active = 1
';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $_SESSION['defaultTask'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function loadTasksForNiv1($pdo)
{
    $sql = 'SELECT ua1.id AS idUniteAdministrativeNiv, ua1.codeNiv1 AS service, t.idTypeTache AS idTypeTache,
            t.nom AS tache, t.id AS id, sm.nom AS sousMenu, i.icon AS icon, t.url AS url, t.autre_ressource AS autre_ressource, t.idSousMenu AS idSousMenu,
            t.idIcon AS tacheIcon, t.idDB AS idDB
            FROM tache t
            LEFT JOIN fonction f ON f.id = t.idFonction
            JOIN unite_administrative_niv1 ua1 ON f.idUniteAdministrativeNiv1 = ua1.id
            LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
            LEFT JOIN icons i ON sm.idIcon = i.id_icon
            WHERE t.`idFonction` = ? AND t.idTypeTache = 2 and t.active = 1
            GROUP BY t.id
            ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['current_user'][0]['idFonction']]);
    $_SESSION['tacheNiv1'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function loadTasksForNiv2($pdo)
{
    $sql = 'SELECT ua2.id AS idUniteAdministrativeNiv, ua2.codeNiv2 AS service, t.idTypeTache AS idTypeTache,
            t.nom AS tache, t.id AS id, sm.nom AS sousMenu, i.icon AS icon, t.url AS url, t.autre_ressource AS autre_ressource, t.idSousMenu AS idSousMenu,
            t.idIcon AS tacheIcon , t.idDB AS idDB
            FROM tache t
            LEFT JOIN fonction f ON f.id = t.idFonction
            JOIN unite_administrative_niv2 ua2 ON f.idUniteAdministrativeNiv2 = ua2.id
            LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
            LEFT JOIN icons i ON sm.idIcon = i.id_icon
            WHERE t.`idFonction` = ? AND t.idTypeTache = 2 and t.active = 1
            GROUP BY t.id
            ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['current_user'][0]['idFonction']]);
    $_SESSION['tacheNiv2'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function loadTasksForNiv3($pdo)
{

    $sql = 'SELECT ua3.id AS idUniteAdministrativeNiv, ua3.codeNiv3 AS service, t.idTypeTache AS idTypeTache,
            t.nom AS tache, t.id AS id, sm.nom AS sousMenu, i.icon AS icon, t.url AS url, t.idSousMenu AS idSousMenu,
            t.idIcon AS tacheIcon , t.idDB AS idDB
            FROM tache t
            LEFT JOIN fonction f ON f.id = t.idFonction
            JOIN unite_administrative_niv3 ua3 ON f.idUniteAdministrativeNiv3 = ua3.id
            JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
            JOIN icons i ON sm.idIcon = i.id_icon
            WHERE t.`idFonction` = ? AND t.idTypeTache = 2 and t.active = 1
            GROUP BY t.id
            ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['current_user'][0]['idFonction']]);
    $_SESSION['tacheNiv3'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function loadUACodes($pdo, $id, $isNiv2)
{
    if ($isNiv2) {
        $stmt = $pdo->prepare('SELECT ua2.codeNiv2, ua1.codeNiv1 FROM unite_administrative_niv2 ua2 
                               JOIN unite_administrative_niv1 ua1 ON ua2.idUniteAdministrativeNiv1 = ua1.id
                               WHERE ua2.id = ?');
        $stmt->execute([$id]);
        $_SESSION['codeUA'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = $pdo->prepare('SELECT ua3.codeNiv3, ua2.codeNiv2 FROM unite_administrative_niv3 ua3 
                               JOIN unite_administrative_niv2 ua2 ON ua3.idUniteAdministrativeNiv2 = ua2.id
                               WHERE ua3.id = ?');
        $stmt->execute([$id]);
        $_SESSION['codeUA'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    $stmt = $pdo->prepare('SELECT ua2.codeNiv2, ua2.id FROM unite_administrative_niv2 ua2 
                               WHERE ua2.idUniteAdministrativeNiv1 IN 
                               (SELECT ua2.idUniteAdministrativeNiv1 FROM unite_administrative_niv2 ua2 WHERE ua2.id = ?)');
    $stmt->execute([$id]);
    $_SESSION['getAllIdUniteAdministrativeNiv2'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt = $pdo->prepare('SELECT ua3.codeNiv3, ua3.id FROM unite_administrative_niv3 ua3
                               WHERE ua3.idUniteAdministrativeNiv2 IN 
                               (SELECT ua3.idUniteAdministrativeNiv2 FROM unite_administrative_niv3 ua3 
                               WHERE ua3.idUniteAdministrativeNiv2 IN 
                               (SELECT ua2.id FROM unite_administrative_niv2 ua2 
                               WHERE ua2.idUniteAdministrativeNiv1 IN 
                               (SELECT ua2.idUniteAdministrativeNiv1 FROM unite_administrative_niv2 ua2 
                               WHERE ua2.id = ?)))');
    $stmt->execute([$id]);
    $_SESSION['getAllIdUniteAdministrativeNiv3'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function get_info_connexion($matricule)
{
    $url = 'https://test.uahb.sn/api_authentification';
    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n" .
                         "Cookie: PHPSESSID=8cb0e85bed40346dc1e2e59ba2972678\r\n",
            'method'  => 'POST',
            'content' => http_build_query(['option' => '2', 'matricule' => $matricule]),
        ]
    ];
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return null;
    }

    return json_decode($response, true);
}


// Créationde session pour CMJLF

function getAdmissionSession($pdoENT,$email, $password)
{

    // $email = $input['email'] ?? '';
    // $password = $input['password'] ?? ''
    // $dbClass = new DBmay();

    // $conn = $dbClass->connect();
    $sql = "SELECT * FROM utilisateurs WHERE email = ?";
    $stmt = $pdoENT->prepare($sql);

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (password_verify($password, $user['mot_de_passe'])) {
            if ($user['role'] == 'admin') {
                $_SESSION['user_id'] = $user['id_utilisateur'];
                $_SESSION['admin_name'] = $user['prenom'] . ' ' . $user['nom'];
            } elseif ($user['role'] == 'etu' && $user['etat'] == 1) {
                $_SESSION['user_id'] = $user['id_utilisateur'];
            } else {
                echo json_encode(['success' => false, 'message' => "Votre compte n'est pas activé. Consultez votre boîte mail."]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun compte trouvé pour cet email.']);
    }
}
