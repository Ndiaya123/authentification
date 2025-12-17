<?php
require '../config.php';
session_start();
if (
    isset($_SESSION['LAST_ACTIVITY']) &&
    (time() - $_SESSION['LAST_ACTIVITY'] > $session_lifetime)
) {
    // Détruire la session si elle a expiré
    session_unset();
    session_destroy();
header('Location: /page-connexion');
    exit;}
if(!isset($_SESSION['id'])){
    header('Location: /page-connexion');
    exit;
}

// 5️⃣ Mettre à jour le timestamp d'activité
$_SESSION['LAST_ACTIVITY'] = time();
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    switch ($_GET['action']) {
        case 'getInfos':
            $matricule = $_GET['matricule'];
            getInfo($matricule);
            break;
        case 'current_user':
            echo json_encode($_SESSION['current_user']);
            break;
        case 'get_icon':
            echo json_encode($_SESSION['icons']);

            break;
        case 'getTache':
            $idUniteAdministrativeNiv = $_GET['idUniteAdministrativeNiv'];
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];
            $responsabilite = $_GET['responsabilite'];
            if ($responsabilite == 'OUI') {
                # code...
                if ($niveauUniteAdministrative == 1) {
                    echo json_encode(tacheNiv1($pdo, $idUniteAdministrativeNiv));
                    // echo json_encode(tacheNiv2($pdo,$idUniteAdministrativeNiv));
                } elseif ($niveauUniteAdministrative == 2) {
                    $_SESSION['tacheNiv2'];
                    echo json_encode($_SESSION['tacheNiv2']);
                    // echo json_encode(tacheNiv3($pdo,$idUniteAdministrativeNiv));
                } elseif ($niveauUniteAdministrative == 3) {
                    echo json_encode($_SESSION['tacheNiv3']);
                    // echo json_encode(tacheNiv3($pdo,$idUniteAdministrativeNiv));
                }
            }
            break;
        case 'getDefaultTasks':
            echo json_encode($_SESSION['defaultTask']);
            break;
        case 'get_agent':
            // echo json_encode(['utilisateur' => get_agent($pdo)]);
            echo json_encode(['utilisateur' =>getChefAgent($pdo)]);
            break;
        case 'get_code':

            // echo json_encode(getCodeUA($pdo,$idUniteAdministrativeNiv,$niveauUniteAdministrative));
            echo json_encode($_SESSION['codeUA']);
            break;
        case 'get_codeNiv1':

            $idUniteAdministrativeNiv = $_GET['idUniteAdministrativeNiv'];

            echo json_encode(getCodeNiv1($pdo, $idUniteAdministrativeNiv));
            break;
        case 'getTacheChef':
            $idUniteAdministrativeNiv = $_GET['idUniteAdministrative'];
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];

            echo json_encode(getChefTaches($pdo, $idUniteAdministrativeNiv, $niveauUniteAdministrative));
            break;
        case 'getTacheChef2':
            $idUniteAdministrativeNiv = $_GET['idUniteAdministrative'];
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];

            echo json_encode(getChefTaches2($pdo, $idUniteAdministrativeNiv, $niveauUniteAdministrative));
            break;
        case 'getTacheSousChef':
            $idUniteAdministrativeNiv = $_GET['idUniteAdministrative'];
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];

            echo json_encode(getSousChefTaches($pdo, $idUniteAdministrativeNiv, $niveauUniteAdministrative));

            break;
        case 'getAllIdUniteAdministrativeNiv2':
            $idUniteAdministrativeNiv = $_GET['id'];

            // echo json_encode(getAllIdUniteAdministrativeNiv2($pdo,$idUniteAdministrativeNiv));
            echo json_encode($_SESSION['getAllIdUniteAdministrativeNiv2']);
            break;
        case 'getAllIdUniteAdministrativeNiv3':
            $idUniteAdministrativeNiv = $_GET['id'];

            // echo json_encode(getAllIdUniteAdministrativeNiv3($pdo,$idUniteAdministrativeNiv));
            echo json_encode($_SESSION['getAllIdUniteAdministrativeNiv3']);

            break;
        case 'getSousChefTacheToAffect':
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];
            $idUniteAdministrative = $_GET['idUniteAdministrative'];
            $idUtilisateur = $_GET['idUtilisateur'];

            echo json_encode(getSousChefTacheToAffect($pdo, $idUtilisateur, $idUniteAdministrative, $niveauUniteAdministrative));
            break;
        case 'getChefTacheNiv3ToAffect':
            $idUniteAdministrative = $_GET['idUniteAdministrative'];
            $idUtilisateur = $_GET['idUtilisateur'];
            echo json_encode(getChefTacheNiv3ToAffect($pdo, $idUtilisateur, $idUniteAdministrative));
            break;
        case 'getChefTacheNiv2ToAffect':
            $idUniteAdministrative = $_GET['idUniteAdministrative'];
            $idUtilisateur = $_GET['idUtilisateur'];
            echo json_encode(getChefTacheNiv2ToAffect($pdo, $idUtilisateur, $idUniteAdministrative));
            break;
        case 'getChefTacheNiv2ToRestrict':
            // $idUniteAdministrative = $_GET['idUniteAdministrative'];
            $idUtilisateur = $_GET['id'];
            echo json_encode(getChefTacheNiv2ToRestrict($pdo, $idUtilisateur));
            break;
        case 'restricteTache':
            $idUtilisateur = $_GET['idUtilisateur'];
            $idTache = $_GET['idTache'];
            if (restricteTache($pdo, $idUtilisateur, $idTache)) {
                return [
                    'status' => 'success',
                    'message' => 'Compte crée avec succès'
                ];
            }
            break;
        case 'getTacheForAgent':
            // echo json_encode(getTacheForAgent($pdo));
            echo json_encode($_SESSION['getTacheForAgent']);
            break;
        case 'add_tache_utilisateur':
            $id_tache = $_GET['id_tache'];
            $id_utilisateur = $_GET['id_utilisateur'];
            $qualification = $_GET['qualification'];
            echo json_encode(checkAndExecute($pdo, $id_tache, $id_utilisateur, $qualification));
            break;
	  	case 'getAllDirecteurs':
			  echo json_encode(['directeurs' => getAllDirecteurs($pdo)]);
			  break;
        default:
            echo ('Action inconnu !!');
            break;
    }
}else if($method == 'POST') {

    $data  = file_get_contents('php://input');
    if (!empty($data)) {
        $_POST = json_decode($data, true);
    }
    switch ($_POST['action'] ) {
        
        case 'add_tache_utilisateur':
            $id_tache = $_POST['id_tache'];
            $id_utilisateur = $_POST['id_utilisateur'];
            $qualification = $_POST['qualification'];
            echo json_encode(checkAndExecute($pdo, $id_tache, $id_utilisateur, $qualification));
            break;
        case 'restricteTache':
            $idUtilisateur = $_POST['idUtilisateur'];
            $idTache = $_POST['idTache'];
            if (restricteTache($pdo, $idUtilisateur, $idTache)) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Tâche restreinte avec succès'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Échec de la restriction de la tâche'
                ]);
            }
            break;
	  case 'legitimateCheck':
            if (!isset($_POST['idTache'], $_POST['idTypeTache'])) {
                echo json_encode(['status' => 'error', 'message' => 'Paramètres manquants']);
                exit;
            }

            $idTache = $_POST['idTache'];
            $idTypeTache = $_POST['idTypeTache'];
            $result = isLegitimate($pdo, $idTache, $idTypeTache);

            // Vérification que $result est valide
            if ($result === null || !isset($result['status'])) {
                http_response_code(500); // Internal Server Error
                echo json_encode(['status' => 'error', 'message' => 'Erreur interne du serveur']);
                exit;
            }
            echo json_encode($result);
            if ($result['status'] !== 'success') {
                http_response_code(403); // Forbidden
                session_destroy(); // Détruire la session si l'utilisateur n'est pas légitime
            }

            exit;
            break;
	  case 'isUrlAllowed':
            // echo json_encode($_SESSION['allAllowedTasks']);

            $result = isUrlAllowed($_POST['url']);
            
            if ($result['allowed']) {
                echo json_encode(['status' => 'success', 'idTache' => $result['idTache']]);
            } else {
                // Autoriser explicitement l'accès à ces deux URLs
                $allowedUrls = [
                    '/home',
                    '/gestion-taches'
                ];
                if (in_array($_POST['url'], $allowedUrls)) {
                    echo json_encode(['status' => 'success']);
                } else {
                    http_response_code(403);
                    echo json_encode(['status' => 'error', 'message' => 'Vous n\'avez pas le droit d\'accéder à cette page.']);
                }
            }
            exit;
            break;
	  		

        default:
            echo ('Action inconnu !!');
            break;
    }
}
function isUrlAllowed($url)
{
    if (!isset($_SESSION['allAllowedTasks']) || !is_array($_SESSION['allAllowedTasks'])) {
        return false;
    }
    // $_SESSION['allAllowedTasks'] est un tableau d'objets avec l'attribut 'url'
    foreach ($_SESSION['allAllowedTasks'] as $task) {
        if (isset($task['url']) && $task['url'] === $url) {

            global $pdoCMJLF, $pdoENT, $pdo;
            // Récupération des informations utilisateur depuis la session ou la requête POST
            $nom = $_SESSION['current_user'][0]['nom'] ??  null;
            $prenom = $_SESSION['current_user'][0]['prenom'] ?? null;
            $matricule = $_SESSION['current_user'][0]['matricule'] ?? null;
            $email = $_SESSION['current_user'][0]['email'] ?? null;
            $photo = $_SESSION['current_user'][0]['photo'] ?? null;
            if($task['idDB'] == 1){

                // Récupération des autres champs si disponibles
                    $idRole = $_SESSION['current_user'][0]['idRole'] ?? 6;
                    $sexe =$_SESSION['current_user'][0]['sexe'] ?? null;
                    $dob = $_SESSION['current_user'][0]['dob'] ?? null;
                    $pob = $_SESSION['current_user'][0]['pob'] ?? 'Dakar';
                    $adresse = $_SESSION['current_user'][0]['adresse'] ?? null;
                    $tel = $_SESSION['current_user'][0]['tel'] ?? null;
                    $cni = $_SESSION['current_user'][0]['cni'] ?? null;
                    $etat = $_SESSION['current_user'][0]['etat'] ?? 1;
                    $idEcole = $_SESSION['current_user'][0]['idEcole'] ?? 1;
    
                    // Vérification dans la base administration (pdoCMJLF)
                    $stmt = $pdoCMJLF->prepare("SELECT COUNT(*) FROM administration WHERE email = ?");
                    $stmt->execute([$email]);
                    $existsAdmin = $stmt->fetchColumn();
    
                    if ($existsAdmin == 0) {
                        $entite = $input['entite'] ?? $_POST['entite'] ?? 'CMJLF';
                        // Insertion dans la table administration
                        $stmt = $pdoCMJLF->prepare("INSERT INTO administration 
                        (idRole, matricule, nomAgent, prenomAgent, sexeAgent, dobAgent, pobAgent, adresseAgent, telAgent, cni, photo, dateCreation, email, etat, ecole, idEcole) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        $stmt->execute([
                            $idRole,
                            $matricule,
                            $nom,
                            $prenom,
                            $sexe,
                            $dob,
                            $pob,
                            $adresse,
                            $tel,
                            $cni,
                            $photo,
                            gmdate('Y-m-d H:i:s'),
                            $email,
                            $etat,
                            $entite,
                            $idEcole
                        ]);
                    }else{
                        // L'utilisateur existe déjà dans la base administration
                        // Récuperer l'id de l'utilisateur
                        $stmt = $pdoCMJLF->prepare("SELECT id FROM administration WHERE email = ?");
                        $stmt->execute([$email]);
                        $_SESSION["id_user"] = $stmt->fetch(PDO::FETCH_ASSOC);
                    }
            }else if($task['idDB'] == 2){

                // Vérification dans la base ENT (pdoENT)
                $stmt = $pdoENT->prepare("SELECT COUNT(*) FROM utilisateurs WHERE email = ?");
                $stmt->execute([$_SESSION['current_user'][0]['email']]);
                $existsEnt = $stmt->fetchColumn();

                if ($existsEnt == 0) {
                    $uniteAdministrative = $_SESSION['current_user'][0]['idUniteAdministrativeNiv3'] ?? $_POST['uniteAdministrative'] ?? null;

                    // Récupérer le code dans la table unite_administrative_niv3
                    $codeDepartement = null;
                    $idDepartement = null;
                    if ($uniteAdministrative) {
                        $stmtUA = $pdo->prepare("SELECT codeNiv3 FROM unite_administrative_niv3 WHERE id = ?");
                        $stmtUA->execute([$uniteAdministrative]);
                        $uaRow = $stmtUA->fetch(PDO::FETCH_ASSOC);
                        if ($uaRow && !empty($uaRow['codeNiv3'])) {
                            $codeDepartement = $uaRow['codeNiv3'];

                            // Chercher le département correspondant dans la table departements
                            $stmtDep = $pdoENT->prepare("SELECT id FROM departements WHERE code_departement = ?");
                            $stmtDep->execute([$codeDepartement]);
                            $depRow = $stmtDep->fetch(PDO::FETCH_ASSOC);
                            if ($depRow && !empty($depRow['id'])) {
                                $idDepartement = $depRow['id'];
                            }
                        }
                    }
                    $stmt = $pdoENT->prepare("INSERT INTO utilisateurs (matricule, prenom, nom, email, password, photo, statut, last_activity, idRole, idDepartement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $matricule,
                        $prenom,
                        $nom,
                        $email,
                        md5('Passer2022'),
                        $photo,
                        1,
                        gmdate('Y-m-d H:i:s'),
                        22,
                        $idDepartement
                    ]);
                }else{
                    // L'utilisateur existe déjà dans la base ENT
                    // Récuperer l'id de l'utilisateur
                    $stmt = $pdoENT->prepare("SELECT id FROM utilisateurs WHERE email = ?");
                    $stmt->execute([$email]);
                    $_SESSION['tmpId'] = $stmt->fetch(PDO::FETCH_ASSOC);
                }
            }
            
            // Retourne true et l'id de la tâche trouvée
            return [
                'allowed' => true,
                'idTache' => isset($task['id']) ? $task['id'] : null
            ];
        }
    }
    return [
        'allowed' => false,
        'idTache' => null
    ];
}
// vérifier si l'utilisateur est légitime à une tache
function isLegitimate($pdo, $idTache, $idTypeTache)
{

    if ($idTypeTache == 1) {
        // Vérifier si le idTypeTache est toujours 1
        $stmt = $pdo->prepare('SELECT idTypeTache FROM tache WHERE id = ?');
        $stmt->execute([$idTache]);
        $idTypeTache = $stmt->fetchColumn();
        if ($idTypeTache != 1) {
            return [
                'status' => 'error',
                'message' => 'Cette tâche n\'est plus de type structure, vous ne pouvez pas y accéder.'
            ]; // Si ce n'est pas une tâche de type 1, on ne continue pas
        } else {

            // Vérifier si l'utilisateur a la tâche associée
            $stmt = $pdo->prepare('SELECT * FROM tache_utilisateur WHERE idTache = ? AND idUtilisateur = ? and access = 1');
            $stmt->execute([$idTache, $_SESSION['id']]);
            $isTacheAssigned = $stmt->fetch();

            if (!$isTacheAssigned) {
                return [
                    'status' => 'error',
                    'message' => 'Vous n\'avez pas la tâche associée.'
                ];
            }
            // Vérifie si la tâche est liée à une qualification
            $stmt = $pdo->prepare('SELECT * FROM tache_qualification WHERE idTache = ? and valide = 1');
            $stmt->execute([$idTache]);
            $isQualificationLinked = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($isQualificationLinked)) {
                // vérifier si parmi les qualifications liées à la tâche, l'utilisateur a la qualification requise
                $hasQualification = false;
                foreach ($isQualificationLinked as $row) {
                    if ($row['idQualification'] == $_SESSION['current_user'][0]['idQualification']) {
                        $hasQualification = true;
                        break;
                    }
                }
                if ($hasQualification) {
                    return [
                        'status' => 'success',
                        'message' => 'Vous avez la qualification requise pour cette tâche.'
                    ];
                } else {
                    return [
                        'status' => 'error',
                        'message' => 'Vous n\'avez pas la qualification requise pour cette tâche.'
                    ];
                }
            } else {
                // Si aucune qualification n'est liée à la tâche, on autorise l'accès
                return [
                    'status' => 'success',
                    'message' => 'Aucune qualification requise pour cette tâche.'
                ];
            }
        }
    } elseif ($idTypeTache == 2) {
        // Vérifier si le idTypeTache est toujours 2
        $stmt = $pdo->prepare('SELECT idTypeTache FROM tache WHERE id = ? and active = 1');
        $stmt->execute([$idTache]);
        $idTypeTache = $stmt->fetchColumn();
        if ($idTypeTache != 2) {
            return [
                'status' => 'error',
                'message' => 'Cette tâche n\'est plus de type incarné, vous ne pouvez pas y accéder.'
            ]; // Si ce n'est pas une tâche de type 2, on ne continue pas
        }else{
            return [
                'status' => 'success',
                'message' => 'Vous avez accès à cette tâche de type incarné.'
            ]; // Si c'est une tâche de type 2, on continue
        }
    } elseif ($idTypeTache == 3) {
        // Vérifier si le idTypeTache est toujours 3
        $stmt = $pdo->prepare('SELECT idTypeTache FROM tache WHERE id = ? and active = 1');
        $stmt->execute([$idTache]);
        $idTypeTache = $stmt->fetchColumn();
        if ($idTypeTache != 3) {
            return [
                'status' => 'error',
                'message' => 'Cette tâche n\'est plus de type par défaut, vous ne pouvez pas y accéder.'
            ]; // Si ce n'est pas une tâche de type 3, on ne continue pas
        }else{
            return [
                'status' => 'success',
                'message' => 'Vous avez accès à cette tâche de type par défaut.'
            ]; // Si c'est une tâche de type 3, on continue
        }
    }else {
        return [
            'status' => 'error',
            'message' => 'Type de tâche inconnu.'
        ];
    }
}
function checkAndExecute($pdo, $idTache, $id_utilisateur, $qualification)
{
    $results = verifyQualification($pdo, $idTache);

    if ($results && count($results) > 0) {
        // Vérifie si la qualification demandée est présente parmi les qualifications liées à la tâche
        foreach ($results as $row) {
            if ($row['qualification'] === $qualification) {
                return add_tache_utilisateur($pdo, $id_utilisateur, $idTache);
            }
        }
        // Si aucune qualification ne correspond
        return [
            'status' => 'error',
            'message' => 'La qualification ne correspond pas !'
        ];
    } else {
        // Si aucune qualification n'est liée à la tâche, on autorise l'ajout
        return add_tache_utilisateur($pdo, $id_utilisateur, $idTache);
    }
}

function verifyQualification($pdo, $idTache)
{
    $stmt = $pdo->prepare('SELECT 
        t.nom AS tache,
        t.id AS id,
        q.qualification
    FROM tache t
        JOIN tache_qualification tq ON t.id = tq.idTache
        JOIN qualifications q ON tq.idQualification = q.id
    WHERE 
        t.id = ? and
        tq.valide = 1
    GROUP BY q.id');
    $stmt->execute([$idTache]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function add_tache_utilisateur($pdo, $id_utilisateur, $id_tache)
{
    // Vérifier si une entrée existe déjà pour le même utilisateur et la même tâche
    $stmt = $pdo->prepare("SELECT * FROM tache_utilisateur WHERE idUtilisateur = ? AND idTache = ?");
    $stmt->execute([$id_utilisateur, $id_tache]);
    $existing_entry = $stmt->fetch();

    // if ($existing_entry) {
    //     // Si une entrée existe déjà, mettre à jour l'attribut access de 1 à 0
    //     if ($existing_entry['access'] == 0) {
    //         $stmt_update = $pdo->prepare("UPDATE tache_utilisateur SET access = 1 WHERE idUtilisateur = ? AND idTache = ?");
    //         return $stmt_update->execute([$id_utilisateur, $id_tache]);
    //     } else {
    //         // Si l'accès est déjà à 0, rien à faire
    //         return true;
    //     }
    // } else {
    //     // Si aucune entrée n'existe, faire une nouvelle insertion
    //     // Récupérer le matricule et l'identifiant de l'utilisateur courant depuis la session
    //     // Récupérer le matricule à partir de l'id utilisateur dans la table utilisateur
    // }
    $stmtMatricule = $pdo->prepare("SELECT matricule FROM utilisateur WHERE id = ?");
    $stmtMatricule->execute([$id_utilisateur]);
    $matricule = $stmtMatricule->fetchColumn();
    $identifiant = isset($_SESSION['current_user'][0]['identifiant']) ? $_SESSION['current_user'][0]['identifiant'] : null;

    $stmt_insert = $pdo->prepare("INSERT INTO tache_utilisateur (idUtilisateur, idTache, idUtilisateurSupOctroiement, dateOctroiement, dateEnregistrement, access, matricule, identifiant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    return $stmt_insert->execute([
        $id_utilisateur,
        $id_tache,
        $_SESSION['id'],
        gmdate('Y-m-d H:i:s'),
        gmdate('Y-m-d H:i:s'),
        1,
        $matricule,
        $identifiant
    ]);
}

function get_agent($pdo)
{
    // $statut = $_SESSION['statutUtilisateur'];
    // $id_structure = $_SESSION['id_structure'];
    $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE statutUtilisateur != :statut ');
    $stmt->execute([':statut' => 1]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllDirecteurs(PDO $pdo, ?string $sessionId = null): array
{
    $agents = get_agent($pdo);

    $directeurs = [];
    foreach ($agents as $agent) {
        if($agent['matricule'] == $_SESSION['matricule']){
            continue;
        }
        $info = getInfo($agent['matricule']);
        if (isset($info[0]['sans'])) {
            if ($info[0]['sans'] == 1 && $info[0]['grade'] == 1) {
            // Ajoute l'id de l'agent dans le tableau info
            $info[0]['id'] = $agent['id'];
            $directeurs[] = $info;
            }
        }
    }

    return $directeurs;
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
  $_SESSION['current_user'][0]['id'] = $_SESSION['id'];
    $result[] = isset($_SESSION['current_user'][0]) ? $_SESSION['current_user'][0] : null;
    foreach ($chefs as $chef) {
        $email = $chef['email'] ?? null;

        if ($email && isset($utilisateurIndex[$email])) {
            $result[] = array_merge($utilisateurIndex[$email], $chef);
        }
    }

    // Ajouter les informations de l'utilisateur courant au résultat
    return $result; // Tableau final fusionné
}
function tacheNiv1($pdo, $idUniteAdministrative)
{
    $sql = "SELECT ua1.id as idUniteAdministrativeNiv,ua1.codeNiv1 as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon 
            FROM unite_administrative_niv1 ua1
            JOIN tache t ON t.idUniteAdministrativeNiv1 = ua1.id AND t.idTypeTache != 1
            JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
            JOIN icons i ON sm.idIcon = i.id_icon
            WHERE ua1.id = ?
            GROUP BY t.id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idUniteAdministrative]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function tacheNiv2($pdo, $idUniteAdministrative)
{
    $sql = 'SELECT ua2.id as idUniteAdministrativeNiv,ua2.codeNiv2 as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv2 ua2
    -- JOIN unite_administrative_niv1 ua1 ON ua2.idUniteAdministrativeNiv1 = ua1.id
    JOIN tache t ON t.idUniteAdministrativeNiv2 = ua2.id AND t.idTypeTache != 1
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
    WHERE ua2.id = ?
    GROUP BY t.id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idUniteAdministrative]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function tacheNiv3($pdo, $idUniteAdministrative)
{
    $sql = 'SELECT ua3.id as idUniteAdministrativeNiv,ua3.codeNiv3 as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv3 ua3
    JOIN tache t ON t.idUniteAdministrativeNiv3 = ua3.id AND t.idTypeTache != 1
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
    WHERE ua3.id = ?
    GROUP BY t.id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idUniteAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function get_tache($pdo, $idUniteAdministrative, $Niv)
{
    $stmt = $pdo->prepare('SELECT * FROM tache WHERE idUniteAdministrative' + $Niv + ' = ?');
    $stmt = $pdo->execute([$idUniteAdministrative]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCodeUA($pdo, $idUniteAdministrative, $niveauUniteAdministrative)
{
    $nivSup = $niveauUniteAdministrative - 1;
    $stmt = $pdo->prepare('SELECT ua2.codeNiv' . $niveauUniteAdministrative . ', ua1.codeNiv' . $nivSup . ' FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua2 
JOIN unite_administrative_niv' . $nivSup . ' ua1 ON ua2.idUniteAdministrativeNiv' . $nivSup . ' = ua1.id
WHERE ua2.id = ?');

    $stmt->execute([$idUniteAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCodeNiv1($pdo, $idUniteAdministrative)
{
    $stmt = $pdo->prepare('SELECT ua1.codeNiv1 FROM unite_administrative_niv1 ua1
WHERE ua1.id = ?');

    $stmt->execute([$idUniteAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getChefTaches($pdo, $idUniteaAdministrative, $niveauUniteAdministrative)
{
    $supNiveau = $niveauUniteAdministrative - 1;
    $stmt = $pdo->prepare('SELECT ua' . $niveauUniteAdministrative . '.id as idUniteAdministrativeNiv,ua' . $niveauUniteAdministrative . '.codeNiv' . $niveauUniteAdministrative . ' as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . '
    -- JOIN unite_administrative_niv1 ua1 ON ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' = ua' . $supNiveau . '.id
    JOIN tache t ON t.idUniteAdministrativeNiv' . $niveauUniteAdministrative . ' = ua' . $niveauUniteAdministrative . '.id AND t.idTypeTache = 1
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' IN (SELECT ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . ' WHERE ua' . $niveauUniteAdministrative . '.id = ?)
GROUP BY t.id');
    $stmt->execute([$idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getChefTaches2($pdo, $idUniteaAdministrative, $niveauUniteAdministrative)
{
    $niveauUniteAdministrative = $niveauUniteAdministrative + 1;
    $supNiveau = $niveauUniteAdministrative - 1;
    $topNiveau = $supNiveau - 1;
    $stmt = $pdo->prepare('SELECT ua' . $niveauUniteAdministrative . '.id as idUniteAdministrativeNiv,ua' . $niveauUniteAdministrative . '.codeNiv' . $niveauUniteAdministrative . ' as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . '
    JOIN tache t ON t.idUniteAdministrativeNiv' . $niveauUniteAdministrative . ' = ua' . $niveauUniteAdministrative . '.id AND t.idTypeTache = 1
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' IN (SELECT ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . ' 
WHERE ua' . $niveauUniteAdministrative . '.idUniteAdministrativeNiv' . $supNiveau . ' IN (SELECT ua' . $supNiveau . '.id FROM unite_administrative_niv' . $supNiveau . ' ua' . $supNiveau . ' 
WHERE ua' . $supNiveau . '.idUniteAdministrativeNiv' . $topNiveau . ' IN (SELECT ua' . $supNiveau . '.idUniteAdministrativeNiv' . $topNiveau . ' FROM unite_administrative_niv' . $supNiveau . ' ua' . $supNiveau . ' 
WHERE ua' . $supNiveau . '.id = ?) ))
GROUP BY t.id');
    $stmt->execute([$idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getSousChefTaches($pdo, $idUniteaAdministrative, $niveauUniteAdministrative)
{
    $supNiveau = $niveauUniteAdministrative - 1;

    $stmt = $pdo->prepare('SELECT ua' . $niveauUniteAdministrative . '.id as idUniteAdministrativeNiv,ua' . $niveauUniteAdministrative . '.codeNiv' . $niveauUniteAdministrative . ' as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . '
    JOIN tache t ON t.idUniteAdministrativeNiv' . $niveauUniteAdministrative . ' = ua' . $niveauUniteAdministrative . '.id AND t.idTypeTache = 1
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua' . $niveauUniteAdministrative . '.id = ?
GROUP BY t.id');
    $stmt->execute([$idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


//Récupération des agents du chef de service
function getAgentsPourChef($pdo, $tabMatricule)
{
    // Vérifier si le tableau est non vide
    if (empty($tabMatricule)) {
        return [];
    }

    // Créer un ensemble de points d'interrogation pour chaque matricule dans le tableau
    $placeholders = implode(',', array_fill(0, count($tabMatricule), '?'));

    // Préparer la requête avec les placeholders
    $stmt = $pdo->prepare("SELECT * FROM utilisateur u WHERE u.matricule IN ($placeholders)");

    // Exécuter la requête en passant le tableau comme argument
    $stmt->execute($tabMatricule);

    // Récupérer et retourner les résultats
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Récupération des agents pour le directeur
function getAgentsPourDirecteur($pdo)
{
    $stmt = $pdo->prepare('SELECT matricule FROM utilisateur');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getInfo(string $matricule, ?string $sessionId = null): ?array
{
    static $cache = [];
    if (isset($cache[$matricule])) {
        return $cache[$matricule];
    }

    $url  = 'https://test.uahb.sn/api_authentification';
    $post = http_build_query(['option' => '2', 'matricule' => $matricule]);

    $headers = "Content-Type: application/x-www-form-urlencoded\r\n";
    if ($sessionId) {
        $headers .= "Cookie: PHPSESSID={$sessionId}\r\n";
    }

    $ctx = stream_context_create([
        'http' => [
            'method'        => 'POST',
            'header'        => $headers,
            'content'       => $post,
            'timeout'       => 15,
            'ignore_errors' => true, // lire le corps même si 4xx/5xx
        ],
    ]);

    $response = @file_get_contents($url, false, $ctx);
    if ($response === false) {
        return null;
    }

    // Vérifie le code HTTP
    $httpCode = 0;
    if (isset($http_response_header)) {
        foreach ($http_response_header as $h) {
            if (stripos($h, 'HTTP/') === 0 && preg_match('#\s(\d{3})\b#', $h, $m)) {
                $httpCode = (int)$m[1];
                break;
            }
        }
    }
    if ($httpCode !== 200) {
        return null;
    }

    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }

    // Mise en cache
    return $cache[$matricule] = $data;
}

function getAllIdUniteAdministrativeNiv2($pdo, $idUniteaAdministrative)
{
    $stmt = $pdo->prepare('SELECT ua2.codeNiv2, ua2.id FROM unite_administrative_niv2 ua2 WHERE ua2.idUniteAdministrativeNiv1 IN (SELECT ua2.idUniteAdministrativeNiv1 FROM unite_administrative_niv2 ua2 WHERE ua2.id = ?)');
    $stmt->execute([$idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllIdUniteAdministrativeNiv3($pdo, $idUniteaAdministrative)
{
    $stmt = $pdo->prepare('SELECT ua3.codeNiv3, ua3.id FROM unite_administrative_niv3 ua3
WHERE ua3.idUniteAdministrativeNiv2 IN (SELECT ua3.idUniteAdministrativeNiv2 FROM unite_administrative_niv3 ua3
WHERE ua3.idUniteAdministrativeNiv2 IN (SELECT ua2.id FROM unite_administrative_niv2 ua2 
WHERE ua2.idUniteAdministrativeNiv1 IN (SELECT ua2.idUniteAdministrativeNiv1 FROM unite_administrative_niv2 ua2 
WHERE ua2.id = ?) ))
');

    $stmt->execute([$idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


function getTacheForAgent($pdo)
{
    $stmt = $pdo->prepare('SELECT 
    
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon
FROM 
     tache t
    LEFT JOIN tache_utilisateur tu ON t.id = tu.idTache AND tu.idUtilisateur = ?
    LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
    LEFT JOIN icons i ON sm.idIcon = i.id_icon
WHERE 
     tu.idTache IS NOT NULL 
    AND tu.access = 0
   GROUP BY t.id');
    $stmt->execute([$_SESSION['id']]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getChefTacheNiv3ToAffect($pdo, $idUtilisateur, $idUniteaAdministrative)
{
    $sql = '';
    if ($_SESSION['current_user'][0]['sans'] == 1 && $_SESSION['current_user'][0]['grade'] == 1) {
        $sql = 'SELECT 
    ua3.id AS idUniteAdministrativeNiv,
    ua3.codeNiv3 AS service,
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon
    
FROM 
    unite_administrative_niv3 ua3
    JOIN unite_administrative_niv2 ua2
        ON ua2.idUniteAdministrativeNiv2 = ua2.id
    JOIN tache t 
        ON t.idUniteAdministrativeNiv2 = ua2.id 
        AND t.idTypeTache = 1
    LEFT JOIN sous_menu sm 
        ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
    LEFT JOIN icons i 
        ON sm.idIcon = i.id_icon
WHERE 
    ua3.id = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM tache_utilisateur tu
        WHERE tu.idTache = t.id 
          AND tu.idUtilisateur = ? AND tu.idUtilisateurSupRetrait IS NULL AND tu.access = 1
    )
GROUP BY t.id;';
    } elseif ($_SESSION['current_user'][0]['sans'] == 0 && $_SESSION['current_user'][0]['grade'] == 1) {
        $sql = 'SELECT 
    ua3.id AS idUniteAdministrativeNiv,
    ua3.codeNiv3 AS service,
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon
FROM 
    unite_administrative_niv3 ua3
    JOIN tache t 
        ON t.idUniteAdministrativeNiv3 = ua3.id 
        AND t.idTypeTache = 1
    LEFT JOIN sous_menu sm 
        ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
    LEFT JOIN icons i 
        ON sm.idIcon = i.id_icon
WHERE 
    ua3.id = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM tache_utilisateur tu
        WHERE tu.idTache = t.id 
          AND tu.idUtilisateur = ? AND tu.idUtilisateurSupRetrait IS NULL AND tu.access = 1
    )
GROUP BY t.id';
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idUtilisateur, $idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getChefTacheNiv2ToAffect($pdo, $idUtilisateur, $idUniteaAdministrative)
{
    $sql = '';
    if ($_SESSION['current_user'][0]['sans'] == 1 && $_SESSION['current_user'][0]['grade'] == 1) {
        $sql = 'SELECT 
    ua2.id AS idUniteAdministrativeNiv,
    ua2.codeNiv2 AS service,
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon
    
FROM 
    unite_administrative_niv2 ua2
    JOIN unite_administrative_niv1 ua1 
        ON ua2.idUniteAdministrativeNiv1 = ua1.id
    JOIN tache t 
        ON t.idUniteAdministrativeNiv1 = ua1.id 
        AND t.idTypeTache = 1
    LEFT JOIN sous_menu sm 
        ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
    LEFT JOIN icons i 
        ON sm.idIcon = i.id_icon
WHERE 
    ua2.id = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM tache_utilisateur tu
        WHERE tu.idTache = t.id 
          AND tu.idUtilisateur = ? AND tu.idUtilisateurSupRetrait IS NULL AND tu.access = 1
    )
GROUP BY t.id;';
    } elseif ($_SESSION['current_user'][0]['sans'] == 0 && $_SESSION['current_user'][0]['grade'] == 1) {
        $sql = 'SELECT 
    ua2.id AS idUniteAdministrativeNiv,
    ua2.codeNiv2 AS service,
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    sm.nom AS sousMenu,
    i.icon AS icon,
    t.url AS url,
    t.idSousMenu AS idSousMenu,
    t.idIcon AS tacheIcon
FROM 
    unite_administrative_niv2 ua2
    JOIN tache t 
        ON t.idUniteAdministrativeNiv2 = ua2.id 
        AND t.idTypeTache = 1
    LEFT JOIN sous_menu sm 
        ON t.idSousMenu = sm.id OR t.idSousMenu IS NULL
    LEFT JOIN icons i 
        ON sm.idIcon = i.id_icon
WHERE 
    ua2.id = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM tache_utilisateur tu
        WHERE tu.idTache = t.id 
          AND tu.idUtilisateur = ? AND tu.idUtilisateurSupRetrait IS NULL AND tu.access = 1
    )
GROUP BY t.id';
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idUniteaAdministrative, $idUtilisateur ]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function restricteTache($pdo, $idUtilisateur, $idTache)
{
    // Étape 1 : récupérer l'ID de la dernière ligne correspondante
    $stmt = $pdo->prepare('
        SELECT id 
        FROM tache_utilisateur 
        WHERE idTache = ? AND idUtilisateur = ? 
        ORDER BY id DESC 
        LIMIT 1
    ');
    $stmt->execute([$idTache, $idUtilisateur]);
    $lastId = $stmt->fetchColumn();

    if (!$lastId) {
        return false; // Aucune ligne à mettre à jour
    }

    // Étape 2 : mettre à jour uniquement cette ligne
    $stmt = $pdo->prepare('
        UPDATE tache_utilisateur 
        SET access = 0, idUtilisateurSupRetrait = ?, dateRetrait = ? 
        WHERE id = ?
    ');
    return $stmt->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'), $lastId]);
}
function getChefTacheNiv2ToRestrict($pdo, $idUtilisateur)
{
    $stmt = $pdo->prepare('SELECT 
    t.idTypeTache AS idTypeTache,
    t.nom AS tache,
    t.id AS id,
    tu.access AS access

FROM tache t
   JOIN tache_utilisateur tu ON t.id = tu.idTache AND tu.idUtilisateur = ?
WHERE tu.access = 1
    GROUP BY t.id
');
    $stmt->execute([$idUtilisateur]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getSousChefTacheToAffect($pdo, $idUtilisateur, $idUniteaAdministrative, $niveauUniteAdministrative)
{
    $stmt = $pdo->prepare('SELECT ua' . $niveauUniteAdministrative . '.id as idUniteAdministrativeNiv,ua' . $niveauUniteAdministrative . '.codeNiv' . $niveauUniteAdministrative . ' as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua' . $niveauUniteAdministrative . '
    JOIN tache t ON t.idUniteAdministrativeNiv' . $niveauUniteAdministrative . ' = ua' . $niveauUniteAdministrative . '.id 
        LEFT JOIN tache_utilisateur tu ON t.id = tu.id AND tu.idUtilisateur = ?
    JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
    JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua' . $niveauUniteAdministrative . '.id = ? AND tu.idTache IS NULL
GROUP BY t.id');
    $stmt->execute([$idUtilisateur, $idUniteaAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
