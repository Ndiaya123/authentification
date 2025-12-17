<?php
require 'config.php';
require 'UserApiService.php';
session_start();
// 3️⃣ Démarrer la session et vérifier l'expiration

// 4️⃣ Vérifier si la session a expiré (inactivité)
if (
    isset($_SESSION['LAST_ACTIVITY']) &&
    (time() - $_SESSION['LAST_ACTIVITY'] > $session_lifetime)
) {
    // Détruire la session si elle a expiré
    session_unset();
    session_destroy();
    header("Location: page-connexion");
    exit;
}

// 5️⃣ Mettre à jour le timestamp d'activité
$_SESSION['LAST_ACTIVITY'] = time();
$input = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];


if ($method == 'GET') {
    // $id_utilisateur = $_GET['id_utilisateur'];

    switch ($_GET['action']) {
        case 'get_default':
            echo json_encode(defaultTache($pdo));
            break;
        case 'current_user':
            echo json_encode($_SESSION['current_user']);
            break;
        case 'tacheUA1':
            $id = $_GET['id'];
            echo json_encode(tacheUA1($pdo, $id));
            break;
        case 'read':
            $id = $_GET['id'];
            echo json_encode(['utilisateur' => tacheUA2($pdo, $id)]);
            break;
        case 'tacheUA3':
            $id = $_GET['id'];
            echo json_encode(tacheUA3($pdo, $id));
            break;
        case 'get_agent':
            // echo json_encode(['utilisateur' => get_agent($pdo)]);
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

                echo json_encode($resultats);
            break;

        case 'get_tache_utilisateur':
            $id_agent = $_GET['agent'];
            $id = $_GET['sous_menu'];
            echo json_encode(['utilisateur' => get_tache_utilisateur($pdo, $id_agent, $id)]);
            break;

        case 'get_other_tache':
            $id_agent = $_GET['agent'];
            $id = $_GET['sous_menu'];
            echo json_encode(['utilisateur' => get_other_tache($pdo, $id_agent, $id)]);
            break;

        case 'delete':
            $id_tache_utilisateur = $_GET['id_tache_utilisateur'];
            delete_tache_utilisateur($pdo, $id_tache_utilisateur);
            break;

        case 'get_all':
            echo json_encode(get_all($pdo));
            break;

        case 'get_all_tache':
            echo json_encode(['tache' => get_taches($pdo)]);
            break;

        case 'delete_tache':
            $id_tache = $_GET['id_tache'];
            delete_tache($pdo, $id_tache);
            break;

        case 'get_one_tache':
            $id_tache = $_GET['id'];
            echo json_encode(['tache' => get_one_tache($pdo, $id_tache)]);
            break;
        case 'get_one_sous_menu':
            $id = $_GET['id'];
            echo json_encode(['sous_menu' => get_one_sous_menu($pdo, $id)]);
            break;
        case 'add_tache_utilisateur':
            $id_tache = $_GET['id_tache'];
            $id_utilisateur = $_GET['id_utilisateur'];
            if (add_tache_utilisateur($pdo, $id_utilisateur, $id_tache)) {

                return [
                    'status' => 'success',
                    'message' => 'Sous menu insérer avec succès'
                ];
            }
            // header('Location: index.php');
            break;
        case 'test':
            // echo json_encode(get_structures($pdo));
            echo json_encode($_SESSION['structures']);
            break;
        case 'get_icon':
            // echo json_encode(['icon' => get_icon($pdo)]);
            echo json_encode($_SESSION['icons']);
            break;
        case 'change_etat_compte':
            $id_utilisateur = $_GET['id_utilisateur'];
            $access = $_GET['access'];
            // if(change_etat_compte($pdo,$id_utilisateur,$access)){
            //     header('Location: index.php');

            // }
            echo json_encode(change_etat_compte($pdo, $id_utilisateur, $access));
            break;
        case 'get_sous_menu':
            echo json_encode(get_sous_menu($pdo));
            break;
        case 'get_UA':
            $niveau = $_GET['niveau'];
            echo json_encode(get_UA($pdo, $niveau));
            break;
        case 'get_one_compte':
            $id = $_GET['id'];
            echo json_encode(get_one_compte($pdo, $id));
            break;
        case 'update_compte':
            $id = $_GET['id'];
            $password = $_GET['password'];
            // $access = $_GET['access'];
            if (updateAgent($pdo, $id, $password)) {
                echo json_encode(['success' => true, 'message' => 'Compte mis à jour avec succès']);
            }
            break;

        case 'add_sous_menu':
            $nom = $_GET['nom'];
            $idIcon = $_GET['idIcon'];

$stmt = $pdo->prepare("SELECT COUNT(*) FROM sous_menu WHERE nom = ?");
            $stmt->execute([$nom]);
            if ($stmt->fetchColumn() > 0) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Ce nom de sous menu existe déjà'
                ]);
                exit;
            }
            if (add_sous_menu($pdo, $nom, $idIcon)) {

                return [
                    'status' => 'success',
                    'message' => 'Sous menu insérer avec succès'
                ];
            }
            break;
        case 'add_tache':
            $nom = $_GET['nom'];
            $idTypeTache = $_GET['idTypeTache'];
            $url = $_GET['url'];
            $idSousMenu = $_GET['idSousMenu'] ?? null;
            $idIcon = $_GET['idIcon'] ?? null;
            $autre_ressource = $_GET['autre_ressource'] ?? null;
            $commentaire = $_GET['commentaire'] ?? null;
            $id_UA = $_GET['id_UA'];
            $niveau_UA = $_GET['niveau_UA'];
            $id_fonction= $_GET['id_fonction'];
            $idDB = $_GET['idDB'];

            if (add_tache($pdo, $nom, $idTypeTache, $url, $idSousMenu, $idIcon, $autre_ressource, $commentaire, $id_UA, $niveau_UA,$id_fonction, $idDB)) {
                return [
                    'status' => 'success',
                    'message' => 'Tache insérer avec succès'
                ];
            }
            break;
        case 'getTacheUtilisateur':
            echo json_encode(getTacheUtilisateur($pdo));
            break;
        case 'voirUtilisateur':
            $idTache = $_GET['id'];

            echo json_encode(voirUtilisateur($pdo, $idTache));
            break;
        case 'getQualification':
            echo json_encode(getQualification($pdo));
            break;
        case 'addTacheQualification':
            $idTache = $_GET['idTache'];
            $idQualification = $_GET['idQualification'];
            if (addTacheQualification($pdo, $idTache, $idQualification)) {
                return [
                    'status' => 'success',
                    'message' => 'Tache insérer avec succès'
                ];
            }
            break;
        case 'getTacheQualification':
            echo json_encode(getTacheQualification($pdo));
            break;
        case 'get_code':
            $idUniteAdministrativeNiv = $_GET['idUniteAdministrativeNiv'];
            $niveauUniteAdministrative = $_GET['niveauUniteAdministrative'];
            echo json_encode(getCodeUA($pdo, $idUniteAdministrativeNiv, $niveauUniteAdministrative));
            break;
        case 'edit_tache':
            $id = $_GET['id'];
            $nom = $_GET['nom'];
            $type = $_GET['idTypeTache'];
            $idSousMenu = $_POST['idSousMenu'] == '' ? null : $_POST['idSousMenu'];
            $niveau_UA = $_GET['niveau_UA'] ?? null;
            $id_UA = $_GET['id_UA'] ?? null;
            $idIcon = $_GET['idIcon'] ?? null;
            if (!isset($_GET['id_fonction']) || $_GET['id_fonction'] == '' || $_GET['id_fonction'] == 0) {
                $_GET['id_fonction'] = null;
            }
            $id_fonction = $_GET['id_fonction'];
            $url = $_GET['url'];
            $autre_ressource = $_GET['autre_ressource'];
            $idDB = $_GET['idDB'] ?? null;

            if (edit_tache($pdo, $id, $nom, $type, $url, $autre_ressource, $idSousMenu, $idIcon, $niveau_UA, $id_UA, $id_fonction, $idDB)) {
                echo json_encode(['success' => 'true', 'message' => 'Tache modifié avec succès']);
            }
            break;
        case 'getTacheStructure':
            echo json_encode(getTacheStructure($pdo));
            break;
        case 'get_qualification':
            echo json_encode(getQualification($pdo));
            break;
        default:
            break;
    }
    exit;
}

if ($method == 'POST') {
    // $action = $input['action'];
    $action = $_POST['action'] ?? $input['action'] ?? null;
    switch ($action) {
        case 'add_tache':
            // Récupération des données
            $nom = $_POST['nom'];
            $idTypeTache = $_POST['idTypeTache'];
            $url = $_POST['url'];
            $idSousMenu = $_POST['idSousMenu'] ?? null;
            $idIcon = $_POST['idIcon'] ?? null;
            $autre_ressource = $_POST['autre_ressource'] ?? null;
            $commentaire = $_POST['commentaire'] ?? null;
            $id_UA = $_POST['id_UA'];
            $niveau_UA = $_POST['niveau_UA'];
            if (!isset($_POST['id_fonction']) || $_POST['id_fonction'] == '' || $_POST['id_fonction'] == 0) {
                $_POST['id_fonction'] = null;
            }
            $id_fonction = $_POST['id_fonction'];
            if (!isset($_POST['idDB']) || $_POST['idDB'] == '') {
                $_POST['idDB'] = null;
            }
            $idDB = $_POST['idDB'] ?? null;
            // Ajout de la tâche
            $result = add_tache($pdo, $nom, $idTypeTache, $url, $idSousMenu, $idIcon, $autre_ressource, $commentaire, $id_UA, $niveau_UA,$id_fonction, $idDB);

                echo json_encode($result);
            
            break;
        case 'edit_tache':
            $id = $_POST['id'];
            $nom = $_POST['nom'];
            $type = $_POST['idTypeTache'];
            if (!isset($_POST['idSousMenu']) || $_POST['idSousMenu'] == '') {
                $_POST['idSousMenu'] = null;
            }
            $idSousMenu = $_POST['idSousMenu'];
            $niveau_UA = $_POST['niveau_UA'] ?? null;
            $id_UA = $_POST['id_UA'] ?? null;
            // $idIcon = $_POST['idIcon'] ?? null;
            if (!isset($_POST['idIcon']) || $_POST['idIcon'] == '') {
                $_POST['idIcon'] = null;
            }
            $idIcon = $_POST['idIcon'];
            $url = $_POST['url'];
            if (!isset($_POST['idDB']) || $_POST['idDB'] == '') {
                $_POST['idDB'] = null;
            }
            $idDB = $_POST['idDB'] ?? null;
            $autre_ressource = $_POST['autre_ressource'];
            if (!isset($_POST['id_fonction']) || $_POST['id_fonction'] == '' || $_POST['id_fonction'] == 0) {
                $_POST['id_fonction'] = null;
            }
            $id_fonction = $_POST['id_fonction'];
            // Récupération de la dernière qualification affectée à la tâche
            $stmt = $pdo->prepare('SELECT idQualification FROM tache_qualification WHERE idTache = ?');
            $stmt->execute([$id]);
            $lastQualification = $stmt->fetch(PDO::FETCH_ASSOC);

            // Récupérer l'ancienne valeur de niveau_UA et id_UA pour la tâche
            $stmtOld = $pdo->prepare('SELECT 
                CASE 
                    WHEN idUniteAdministrativeNiv1 IS NOT NULL THEN 1
                    WHEN idUniteAdministrativeNiv2 IS NOT NULL THEN 2
                    WHEN idUniteAdministrativeNiv3 IS NOT NULL THEN 3
                    ELSE NULL
                END AS old_niveau_UA,
                COALESCE(idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3) AS old_id_UA
                FROM tache WHERE id = ?');
            $stmtOld->execute([$id]);
            $old = $stmtOld->fetch(PDO::FETCH_ASSOC);

            $niveauUAChanged = (isset($old['old_niveau_UA']) && $old['old_niveau_UA'] != $niveau_UA);
            $idUAChanged = (isset($old['old_id_UA']) && $old['old_id_UA'] != $id_UA);

            $result = edit_tache($pdo, $id, $nom, $type, $url, $autre_ressource, $idSousMenu, $idIcon, $niveau_UA, $id_UA, $id_fonction, $idDB);
            if ($result['success']) {
                // Si le type de tâche est différent de 1, on change l'access de tache_utilisateur
                // Vérifier si la tâche est liée à une qualification
                $stmtCheckQualif = $pdo->prepare('SELECT COUNT(*) FROM tache_qualification WHERE idTache = ? AND valide = 1');
                $stmtCheckQualif->execute([$id]);
                $hasQualification = $stmtCheckQualif->fetchColumn() > 0;

                if ($type != 1 || $niveauUAChanged || $idUAChanged) {
                    $stmt = $pdo->prepare('UPDATE tache_utilisateur SET access = 0, idUtilisateurSupRetrait = ?, dateRetrait = ? WHERE idTache = ? and access = 1');
                    $stmt->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'), $id]);
                    if ($hasQualification) {
                        // Si la tâche est liée à une qualification, on change valide à 0
                        $stmt = $pdo->prepare('UPDATE tache_qualification SET valide = 0, updatedBy = ?, dateUpdate = ? WHERE idTache = ? AND valide = 1');
                        $stmt->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'), $id]);
                    }
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Tâche modifiée avec succès'
                ]);
            } else {
                echo json_encode($result);
            }
            break;
        case 'changeEtatTache':
            $id_tache = $_POST['id'] ?? $input['id'] ?? null;
            if ($id_tache) {
            $result = changeEtatTache($pdo, $id_tache);
            echo json_encode($result);
            } else {
            echo json_encode(['success' => false, 'message' => 'ID de tâche manquant']);
            }
            break;
        case 'add_sous_menu':
            $nom = $_POST['nom'];
            $idIcon = $_POST['idIcon'];
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sous_menu WHERE nom = ?");
            $stmt->execute([$nom]);
            if ($stmt->fetchColumn() > 0) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Ce nom de sous menu existe déjà'
                ]);
                exit;
            }
            if (add_sous_menu($pdo, $nom, $idIcon)) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Sous menu inséré avec succès'
                ]);
            }
            break;
        case 'get_icon':
            // echo json_encode(['icon' => get_icon($pdo)]);
            echo json_encode($_SESSION['icons']);
            break;
        case 'get_structure':
            // echo json_encode(get_structures($pdo));
            echo json_encode($_SESSION['structures']);
            break;
        case 'get_qualification':
            echo json_encode(getQualification($pdo));
            break;
        case 'get_UA':
            $niveau = $_POST['niveau'];
            echo json_encode(get_UA($pdo, $niveau));
            break;
        case 'get_code':
            $idUniteAdministrativeNiv = $_POST['idUniteAdministrativeNiv'];
            $niveauUniteAdministrative = $_POST['niveauUniteAdministrative'];
            echo json_encode(getCodeUA($pdo, $idUniteAdministrativeNiv, $niveauUniteAdministrative));
            break;
        case 'addTacheQualification':
            $idTache = $_POST['idTache'] ?? $input['idTache'] ?? null;
            $idQualification = $_POST['idQualification'] ?? $input['idQualification'] ?? null;
            if ($idTache && $idQualification) {
                echo json_encode(addTacheQualification($pdo, $idTache, $idQualification));
            } else {
                echo json_encode([
                    'statut' => 'error',
                    'message' => 'Paramètres manquants'
                ]);
            }
            break;
        case 'add_tache_utilisateur':
            $id_tache = $_POST['id_tache'];
            $id_utilisateur = $_POST['id_utilisateur'];

            if (add_tache_utilisateur($pdo, $id_utilisateur, $id_tache)) {
                return [
                    'status' => 'success',
                    'message' => 'Sous menu inséré avec succès'
                ];
            }
            break;
        case 'get_other_tache':
            $id_agent = $_POST['agent'];
            $id = $_POST['sous_menu']; // ou $_POST['service'] si c’est ça que tu voulais
            echo json_encode(['utilisateur' => get_other_tache($pdo, $id_agent, $id)]);
            break;
        case 'get_tache_utilisateur':
            $id_agent = $_POST['agent'];
            $id = $_POST['service']; // ou 'service' si c’est ce que tu utilises côté JS
            echo json_encode(['utilisateur' => get_tache_utilisateur($pdo, $id_agent, $id)]);
            break;
        case 'createAccount':
            $nom = $input['nom'] ?? $_POST['nom'] ?? null;
            $prenom = $input['prenom'] ?? $_POST['prenom'] ?? null;
            $photo = $input['photo'] ?? $_POST['photo'] ?? null;
            $ecole = $input['ecole'] ?? $_POST['ecole'] ?? null;
            $identifiant = $input['identifiant'] ?? $_POST['identifiant'];
            $matricule = $input['matricule'] ?? $_POST['matricule'];
            $email = $input['email'] ?? $_POST['email'];
            $password = $input['password'] ?? $_POST['password'];
            // vérifier s'il existe déjà un compte avec le même matricule ou email
            $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE matricule = ? OR email = ?');
            $stmt->execute([$matricule, $email]);
            $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($existingUser) {
                echo json_encode(['success' => false, 'message' => 'Un compte existe déjà avec ce matricule ou cet email.']);
                exit;
            }
            if (createAccount($pdo, $identifiant, $matricule, $email, $password)) {
                // // Récupération des autres champs si disponibles
                // $idRole = $input['idRole'] ?? $_POST['idRole'] ?? 6;
                // $sexe = $input['sexe'] ?? $_POST['sexe'] ?? null;
                // $dob = $input['dob'] ?? $_POST['dob'] ?? null;
                // $pob = $input['pob'] ?? $_POST['pob'] ?? 'Dakar';
                // $adresse = $input['adresse'] ?? $_POST['adresse'] ?? null;
                // $tel = $input['tel'] ?? $_POST['tel'] ?? null;
                // $cni = $input['cni'] ?? $_POST['cni'] ?? null;
                // $etat = $input['etat'] ?? $_POST['etat'] ?? 1;
                // $idEcole = $input['idEcole'] ?? $_POST['idEcole'] ?? 1;

                // // Vérification dans la base administration (pdoCMJLF)
                // $stmt = $pdoCMJLF->prepare("SELECT COUNT(*) FROM administration WHERE email = ?");
                // $stmt->execute([$email]);
                // $existsAdmin = $stmt->fetchColumn();

                // // if ($existsAdmin == 0) {
                // //     $entite = $input['entite'] ?? $_POST['entite'] ?? 'CMJLF';
                // //     // Insertion dans la table administration
                // //     $stmt = $pdoCMJLF->prepare("INSERT INTO administration 
                // //     (idRole, matricule, nomAgent, prenomAgent, sexeAgent, dobAgent, pobAgent, adresseAgent, telAgent, cni, photo, dateCreation, email, etat, ecole, idEcole) 
                // //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                // //     $stmt->execute([
                // //         $idRole,
                // //         $matricule,
                // //         $nom,
                // //         $prenom,
                // //         $sexe,
                // //         $dob,
                // //         $pob,
                // //         $adresse,
                // //         $tel,
                // //         $cni,
                // //         $photo,
                // //         gmdate('Y-m-d H:i:s'),
                // //         $email,
                // //         $etat,
                // //         $entite,
                // //         $idEcole
                // //     ]);
                // // }

                // // Vérification dans la base ENT (pdoENT)
                // $stmt = $pdoENT->prepare("SELECT COUNT(*) FROM utilisateurs WHERE email = ?");
                // $stmt->execute([$email]);
                // $existsEnt = $stmt->fetchColumn();

                // if ($existsEnt == 0) {
                //     $uniteAdministrative = $input['uniteAdministrative'] ?? $_POST['uniteAdministrative'] ?? null;

                //     // Récupérer le code dans la table unite_administrative_niv3
                //     $codeDepartement = null;
                //     $idDepartement = null;
                //     if ($uniteAdministrative) {
                //         $stmtUA = $pdo->prepare("SELECT codeNiv3 FROM unite_administrative_niv3 WHERE id = ?");
                //         $stmtUA->execute([$uniteAdministrative]);
                //         $uaRow = $stmtUA->fetch(PDO::FETCH_ASSOC);
                //         if ($uaRow && !empty($uaRow['codeNiv3'])) {
                //             $codeDepartement = $uaRow['codeNiv3'];

                //             // Chercher le département correspondant dans la table departements
                //             $stmtDep = $pdoENT->prepare("SELECT id FROM departements WHERE code_departement = ?");
                //             $stmtDep->execute([$codeDepartement]);
                //             $depRow = $stmtDep->fetch(PDO::FETCH_ASSOC);
                //             if ($depRow && !empty($depRow['id'])) {
                //                 $idDepartement = $depRow['id'];
                //             }
                //         }
                //     }
                //     // $stmt = $pdoENT->prepare("INSERT INTO utilisateurs (matricule, prenom, nom, email, password, photo, statut, last_activity, idRole, idDepartement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                //     // $stmt->execute([
                //     //     $matricule,
                //     //     $prenom,
                //     //     $nom,
                //     //     $email,
                //     //     md5('Passer2022'),
                //     //     $photo,
                //     //     $etat,
                //     //     gmdate('Y-m-d H:i:s'),
                //     //     22,
                //     //     $idDepartement
                //     // ]);
                // }
                echo json_encode(['success' => true, 'message' => 'Compte crée avec succé !!']);
            } else {
                echo json_encode(['success' => false, 'message' => "Erreur lors de l'inscription de l'agent."]);
            }
            break;
        case 'add':
            $id_utilisateur = $_POST['id_utilisateur'];
            $id_tache = $_POST['id_tache'];
            $success = add_tache_utilisateur($pdo, $id_utilisateur, $id_tache);
            header('Location: index.php');
            break;

        case 'add_agent':
            $nom = $input['nom'] ?? $_POST['nom'] ?? null;
            $prenom = $input['prenom'] ?? $_POST['prenom'] ?? null;
            $photo = $input['photo'] ?? $_POST['photo'] ?? null;
            $ecole = $input['ecole'] ?? $_POST['ecole'] ?? null;
            $identifiant = $input['identifiant'] ?? $_POST['identifiant'];
            $matricule = $input['matricule'] ?? $_POST['matricule'];
            $email = $input['email'] ?? $_POST['email'];
            $password = $input['password'] ?? $_POST['password'];
            if (empty($identifiant) || empty($matricule) || empty($email) || empty($password)) {
                echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont obligatoires.']);
                exit;
            }
            // vérifier s'il existe déjà un compte avec le même matricule ou email
            $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE matricule = ? OR email = ?');
            $stmt->execute([$matricule, $email]);
            $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($existingUser) {
                echo json_encode(['success' => false, 'message' => 'Un compte existe déjà avec ce matricule ou cet email.']);
                exit;
            }
            if (addAgent($pdo, $identifiant, $matricule, $email, $password)) {
                // $idRole = $input['idRole'] ?? $_POST['idRole'] ?? 6;
                // $sexe = $input['sexe'] ?? $_POST['sexe'] ?? null;
                // $dob = $input['dob'] ?? $_POST['dob'] ?? null;
                // $pob = $input['pob'] ?? $_POST['pob'] ?? 'Dakar';
                // $adresse = $input['adresse'] ?? $_POST['adresse'] ?? null;
                // $tel = $input['tel'] ?? $_POST['tel'] ?? null;
                // $cni = $input['cni'] ?? $_POST['cni'] ?? null;
                // $etat = $input['etat'] ?? $_POST['etat'] ?? 1;
                // $idEcole = $input['idEcole'] ?? $_POST['idEcole'] ?? 1;

                // // Vérification dans la base administration (pdoCMJLF)
                // $stmt = $pdoCMJLF->prepare("SELECT COUNT(*) FROM administration WHERE matricule = ? OR email = ?");
                // $stmt->execute([$matricule, $email]);
                // $existsAdmin = $stmt->fetchColumn();

                // if ($existsAdmin == 0) {
                //     $entite = $input['entite'] ?? $_POST['entite'] ?? 'CMJLF';
                //     // Insertion dans la table administration
                //     $stmt = $pdoCMJLF->prepare("INSERT INTO administration 
                //     (idRole, matricule, nomAgent, prenomAgent, sexeAgent, dobAgent, pobAgent, adresseAgent, telAgent, cni, photo, dateCreation, email, etat, ecole, idEcole) 
                //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                //     $stmt->execute([
                //         $idRole,
                //         $matricule,
                //         $nom,
                //         $prenom,
                //         $sexe,
                //         $dob,
                //         $pob,
                //         $adresse,
                //         $tel,
                //         $cni,
                //         $photo,
                //         gmdate('Y-m-d H:i:s'),
                //         $email,
                //         $etat,
                //         $entite,
                //         $idEcole
                //     ]);
                // }

                // // Vérification dans la base ENT (pdoENT)
                // $stmt = $pdoENT->prepare("SELECT COUNT(*) FROM utilisateurs WHERE matricule = ? OR email = ?");
                // $stmt->execute([$matricule, $email]);
                // $existsEnt = $stmt->fetchColumn();

                // if ($existsEnt == 0) {
                //     $uniteAdministrative = $input['uniteAdministrative'] ?? $_POST['uniteAdministrative'] ?? null;

                //     // Récupérer le code dans la table unite_administrative_niv3
                //     $codeDepartement = null;
                //     $idDepartement = null;
                //     if ($uniteAdministrative) {
                //         $stmtUA = $pdo->prepare("SELECT codeNiv3 FROM unite_administrative_niv3 WHERE id = ?");
                //         $stmtUA->execute([$uniteAdministrative]);
                //         $uaRow = $stmtUA->fetch(PDO::FETCH_ASSOC);
                //         if ($uaRow && !empty($uaRow['codeNiv3'])) {
                //             $codeDepartement = $uaRow['codeNiv3'];

                //             // Chercher le département correspondant dans la table departements
                //             $stmtDep = $pdoENT->prepare("SELECT id FROM departements WHERE code_departement = ?");
                //             $stmtDep->execute([$codeDepartement]);
                //             $depRow = $stmtDep->fetch(PDO::FETCH_ASSOC);
                //             if ($depRow && !empty($depRow['id'])) {
                //                 $idDepartement = $depRow['id'];
                //             }
                //         }
                //     }
                //     $stmt = $pdoENT->prepare("INSERT INTO utilisateurs (matricule, prenom, nom, email, password, photo, statut, last_activity, idRole, idDepartement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                //     $stmt->execute([
                //         $matricule,
                //         $prenom,
                //         $nom,
                //         $email,
                //         md5('Passer2022'),
                //         $photo,
                //         $etat,
                //         gmdate('Y-m-d H:i:s'),
                //         22,
                //         $idDepartement
                //     ]);
                // }
                echo json_encode(['status' => 'success', 'message' => 'Agent insérer avec succès']);
                // header('Location: acceuilAdmin.php');
            } else {
                echo "Erreur lors de l'ajout de l'agent.";
            }
            break;

        // case 'add_utilisateur':
        //     $nom = $_POST['nom'];
        //     $prenom = $_POST['prenom'];
        //     $email = $_POST['email'];
        //     $statut = $_POST['statut'];
        //     $password = $_POST['password'];

        //     if (addUtilisateur($pdo, $nom, $prenom, $email, $statut, $password)) {
        //         header('Location: index.php');
        //     } else {
        //         echo "Erreur lors de l'ajout de l'utilisateur.";
        //     }
        //     break;

        // case 'add_tache':
        //     $nom = $_POST['nom'];
        //     $idTypeTache = $_POST['idTypeTache'];
        //     $url = $_POST['url'];
        //     $idSousMenu = $_POST['idSousMenu'];
        //     $idIcon = $_POST['idIcon'];
        //     $autre_ressource = $_POST['autre_ressource'];
        //     $commentaire = $_POST['commentaire'];
        //     $id_UA = $_POST['id_UA'];
        //     $niveau_UA = $_POST['niveau_UA'];

        //     $result = add_tache($pdo, $nom, $idTypeTache, $url, $idSousMenu, $idIcon, $autre_ressource, $commentaire, $id_UA, $niveau_UA);
        //     if (is_array($result) && isset($result['success'])) {
        //         echo json_encode($result);
        //     } elseif ($result['success'] === true) {
        //         echo json_encode($result);
        //     } else {
        //         echo json_encode($result);
        //     }
        //     break;

        case 'add_structure':
            $nom = $_POST['nom'];

            if (add_structure($pdo, $nom)) {
                header('Location: index.php');
            }
            break;


        case 'edit_sous_menu':
            $id = $_POST['id_sous_menu'];
            $nom = $_POST['nom'];
            $idIcon = $_POST['idIcon'];

            if (edit_sous_menu($pdo, $id, $nom, $idIcon)) {
                echo json_encode(['status' => 'success', 'message' => 'Sous menu modifié avec succès']);
            }
            break;

        case 'add_icon':
            $icon = $_POST['icon'];
            if (add_icon($pdo, $icon)) {
                echo json_encode(['status' => 'success', 'message' => 'Icon insérer avec succès']);
            }
            break;
        case 'checkTacheAffecter':
            $id_tache = $_POST['id_tache'];
            $result = checkTacheAffecter($pdo, $id_tache);
            if ($result) {
                echo json_encode(['status' => true, 'message' => 'Tâche affectée à un utilisateur']);
            } else {
                echo json_encode(['status' => false, 'message' => 'Aucune affectation trouvée pour cette tâche']);
            }
            break;
        case 'changeValiditeTacheQualification':
            $idTacheQualification = $_POST['id'] ?? $input['id'] ?? null;
            echo json_encode(changeValiditeTacheQualification($pdo, $idTacheQualification));
            break;
        
        default:
            echo "Action non reconnue.";
            break;
    }
    exit;
}

function getFonction($pdo){
    $stmt = $pdo->prepare('SELECT * FROM fonction');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
// Vérifie une tache est affecter à un utilisateur

function checkTacheAffecter($pdo, $id_tache)
{
    // Utiliser COUNT(*) pour éviter de charger inutilement toutes les lignes
    $stmt = $pdo->prepare('SELECT COUNT(*) as nb FROM tache_utilisateur WHERE idTache = ? AND access = 0');
    $stmt->execute([$id_tache]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Retourne true si au moins une affectation existe, sinon false
    return !empty($result) && $result['nb'] > 0;
}
//Fonction pour récupérer les taches structure pour les affecter à des qualifications
function getTacheStructure($pdo)
{
    $stmt = $pdo->prepare('
        SELECT 
            t.id, 
            t.nom, 
            ua2.codeNiv2, 
            ua1.codeNiv1,
            ua3.codeNiv3,
            t.idSousMenu, 
            sm.nom AS nomSousMenu 
        FROM tache t
        JOIN typetache tt ON tt.id = t.idTypeTache
        LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
        LEFT JOIN unite_administrative_niv2 ua2 ON ua2.id = t.idUniteAdministrativeNiv2
        LEFT JOIN unite_administrative_niv1 ua1 ON ua1.id = t.idUniteAdministrativeNiv1
        LEFT JOIN unite_administrative_niv3 ua3 ON ua3.id = t.idUniteAdministrativeNiv3
        WHERE t.idTypeTache = 1
        GROUP BY t.id, t.nom, ua2.codeNiv2, t.idSousMenu, sm.nom
    ');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getTacheQualification($pdo)
{
    $stmt = $pdo->prepare('SELECT t.nom as tache,q.qualification as qualification, tq.id as id, t.id as idTache, q.id as idQualification,
    coalesce(ua3.codeNiv3, ua2.codeNiv2, ua1.codeNiv1) as codeUA
     FROM tache_qualification tq
    JOIN tache t ON t.id = tq.idTache
    JOIN qualifications q ON q.id = tq.idQualification
    LEFT JOIN unite_administrative_niv2 ua2 ON ua2.id = t.idUniteAdministrativeNiv2
    LEFT JOIN unite_administrative_niv1 ua1 ON ua1.id = t.idUniteAdministrativeNiv1
    LEFT JOIN unite_administrative_niv3 ua3 ON ua3.id = t.idUniteAdministrativeNiv3
    WHERE tq.valide = 1
        ORDER BY tq.id DESC');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
// fonction pour changer la validité d'une tache_qualification
// Récupérer les informations des utilisateurs ayant la tâche liée à la qualification
function changeValiditeTacheQualification(PDO $pdo, int $idTacheQualification): array
{
    try {
        // Démarrer la transaction
        $pdo->beginTransaction();

        // 1. Récupérer la tâche et la qualification liées
        $stmt = $pdo->prepare('SELECT idTache, idQualification FROM tache_qualification WHERE id = ?');
        $stmt->execute([$idTacheQualification]);
        $association = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$association) {
            $pdo->rollBack(); // Annuler la transaction si pas d'association
            return [
                'success' => false,
                'message' => 'Association tâche-qualification introuvable.',
                'matricules' => []
            ];
        }

        $idTache = $association['idTache'];
        $idQualification = $association['idQualification'];

        // 2. Vérifier le nombre de qualifications restantes valides pour la tâche
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM tache_qualification WHERE idTache = ? AND valide = 1');
        $stmt->execute([$idTache]);
        $remainingQualifications = (int) $stmt->fetchColumn();

        // 3. Désactiver la validité
        $stmt = $pdo->prepare('UPDATE tache_qualification SET valide = 0, updatedBy = ?, dateUpdate = ? WHERE id = ?');
        $stmt->execute([$_SESSION['id'],gmdate('Y-m-d H:i:s'), $idTacheQualification]);

        // Si c'était la dernière qualification valide
        if ($remainingQualifications == 1) {
            $pdo->commit(); // Valider la transaction
            return [
                'success' => true,
                'message' => 'Validité changée. Dernière qualification restante.',
                'matricules' => []
            ];
        }

        // 4. Récupérer les utilisateurs ayant cette tâche
        $stmt = $pdo->prepare('
            SELECT u.id AS idUtilisateur, u.matricule
            FROM tache_utilisateur tu
            JOIN utilisateur u ON tu.idUtilisateur = u.id
            WHERE tu.idTache = ?
        ');
        $stmt->execute([$idTache]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($users)) {
            $pdo->commit(); // Valider la transaction
            return [
                'success' => true,
                'message' => 'Aucun utilisateur lié à cette tâche.',
                'matricules' => []
            ];
        }

        // 5. Préparer la liste des matricules
        $matricules = array_column($users, 'matricule');

        // 6. Récupérer les informations utilisateurs via API
        $infos = get_info($matricules);

        $updatedMatricules = [];
// 7. Mise à jour des accès pour les utilisateurs qualifiés
$stmtGetLast = $pdo->prepare('
    SELECT id FROM tache_utilisateur 
    WHERE idUtilisateur = ? AND idTache = ? 
    ORDER BY id DESC 
    LIMIT 1
');

$stmtUpdate = $pdo->prepare('
    UPDATE tache_utilisateur 
    SET access = 0, idUtilisateurSupRetrait = ?, dateRetrait = ? 
    WHERE id = ?
');

foreach ($users as $user) {
    $matricule = $user['matricule'];
    $idUtilisateur = $user['idUtilisateur'];

    if (!isset($infos[$matricule]) || !is_array($infos[$matricule])) {
        continue;
    }

    $qualifications = $infos[$matricule];
    $isQualified = array_filter($qualifications, function ($qualif) use ($idQualification) {
        return isset($qualif['idQualification']) && $qualif['idQualification'] == $idQualification;
    });

    if (!empty($isQualified)) {
        // Récupère la dernière ligne correspondante
        $stmtGetLast->execute([$idUtilisateur, $idTache]);
        $lastId = $stmtGetLast->fetchColumn();

        if ($lastId) {
            $stmtUpdate->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'), $lastId]);
            $updatedMatricules[] = $matricule;
        }
    }
}

        // Valider la transaction après toutes les mises à jour
        $pdo->commit();

        return [
            'success' => true,
            'message' => 'Validité changée. Accès mis à jour pour les utilisateurs qualifiés.',
            'matricules' => $updatedMatricules
        ];

    } catch (PDOException $e) {
        $pdo->rollBack(); // Annuler la transaction en cas d'erreur PDO
        error_log('Erreur PDO : ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Erreur lors de la mise à jour : ' . $e->getMessage(),
            'matricules' => []
        ];
    } catch (Exception $e) {
        $pdo->rollBack(); // Annuler la transaction en cas d'erreur générale
        error_log('Erreur : ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Erreur inattendue : ' . $e->getMessage(),
            'matricules' => []
        ];
    }
}


function addTacheQualification(PDO $pdo, int $idTache, int $idQualification): array
{
    if ($idTache <= 0 || $idQualification <= 0) {
        return ['success' => false, 'message' => 'IDs invalides'];
    }

    try {
        // On démarre une transaction
        $pdo->beginTransaction();

        // 1. Vérifier si l'association existe déjà
        $stmt = $pdo->prepare("SELECT 1 FROM tache_qualification 
                               WHERE idTache = ? AND idQualification = ? AND valide = 1 LIMIT 1");
        $stmt->execute([$idTache, $idQualification]);

        if ($stmt->fetch()) {
            // Si l'association existe, on annule la transaction et on quitte
            $pdo->rollBack();
            return ['success' => false, 'message' => 'Cette association existe déjà'];
        }

        // 2. Récupérer les qualifications déjà associées à la tâche
        $stmt = $pdo->prepare("SELECT idQualification FROM tache_qualification 
                               WHERE idTache = ? AND valide = 1");
        $stmt->execute([$idTache]);
        $qualificationsExistantes = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Ajouter la nouvelle qualification à la liste
        $qualificationsExistantes[] = $idQualification;

        // 3. Récupérer les utilisateurs associés à la tâche
        $stmt = $pdo->prepare("SELECT u.id, u.matricule, u.email
                               FROM tache_utilisateur tu
                               JOIN utilisateur u ON tu.idUtilisateur = u.id
                               WHERE tu.idTache = ? AND tu.access = 1");
        $stmt->execute([$idTache]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. Appel API batch pour récupérer les qualifications des utilisateurs
        $matricules = array_column($users, 'matricule');
        $usersInfo = get_info($matricules);

        // 5. Préparer les requêtes
$stmtGetLast = $pdo->prepare("
    SELECT id 
    FROM tache_utilisateur 
    WHERE idTache = ? AND idUtilisateur = ?
    ORDER BY id DESC 
    LIMIT 1
");

$updateStmt = $pdo->prepare("
    UPDATE tache_utilisateur 
    SET access = 0,
        idUtilisateurSupRetrait = ?,
        dateRetrait = ?
    WHERE id = ?
");

foreach ($users as $user) {
    $userQualifications = [];

    if (isset($usersInfo[$user['matricule']])) {
        foreach ($usersInfo[$user['matricule']] as $qualificationData) {
            if (isset($qualificationData['idQualification'])) {
                $userQualifications[] = $qualificationData['idQualification'];
            }
        }
    }

    // Vérifier si l'utilisateur a au moins une des qualifications de la tâche
    $hasRequiredQualification = false;
    foreach ($userQualifications as $qualif) {
        if (in_array($qualif, $qualificationsExistantes)) {
            $hasRequiredQualification = true;
            break;
        }
    }

    // Si l'utilisateur n'a aucune des qualifications, on lui retire l'accès
    if (!$hasRequiredQualification) {
        // 1. Récupérer la dernière ligne correspondante
        $stmtGetLast->execute([$idTache, $user['id']]);
        $lastId = $stmtGetLast->fetchColumn();

        // 2. Faire la mise à jour uniquement si une ligne est trouvée
        if ($lastId) {
            $updateStmt->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'), $lastId]);
        }
    }
}

        // 6. Créer la nouvelle association
        $pdo->prepare("INSERT INTO tache_qualification 
                      (idTache, idQualification, dateEnregistrement, createdBy) 
                      VALUES (?, ?, ?, ?)")
            ->execute([$idTache, $idQualification, gmdate('Y-m-d H:i:s'),$_SESSION['id']]);

        // 7. Valider la transaction
        $pdo->commit();

        return ['success' => true, 'message' => 'Association réussie !!'];

    } catch (Exception $e) {
        // Si une erreur survient, on annule tout
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log("Erreur addTacheQualification: " . $e->getMessage());
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

function getQualification($pdo)
{
    $stmt = $pdo->prepare('SELECT * FROM qualifications');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Récupération de tache par défaut
function defaultTache($pdo)
{
    $stmt = $pdo->prepare('SELECT t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url,t.autre_ressource as autre_ressource, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon 
FROM tache t 
JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
JOIN icons i ON sm.idIcon = i.id_icon
WHERE  t.idTypeTache = 3
GROUP BY t.id
order by t.nom ASC
');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function voirUtilisateur($pdo, $id)
{
    $stmt = $pdo->prepare('SELECT 
    u.id AS idUtilisateur,
    u.matricule AS matricule,
    u.email AS email,
    u.id as id,
        tu.access as access,
    tu.idTache AS idTache,
    t.nom AS nomTache
FROM 
    utilisateur u
JOIN 
    tache_utilisateur tu ON u.id = tu.idUtilisateur
JOIN 
    tache t ON tu.idTache = t.id
WHERE 
    t.id = ? AND tu.access = 1;
');
    $stmt->execute([$id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getTacheUtilisateur($pdo)
{
    $stmt = $pdo->prepare('SELECT 
        t.id AS idTache, 
        t.nom AS nomTache, 
        COUNT(tu.idTache) AS nombreOccurrences,
        COALESCE(ua3.codeNiv3, ua2.codeNiv2, ua1.codeNiv1) AS codeUA
    FROM tache t 
    LEFT JOIN tache_utilisateur tu ON t.id = tu.idTache 
    LEFT JOIN unite_administrative_niv1 ua1 ON t.idUniteAdministrativeNiv1 = ua1.id
    LEFT JOIN unite_administrative_niv2 ua2 ON t.idUniteAdministrativeNiv2 = ua2.id
    LEFT JOIN unite_administrative_niv3 ua3 ON t.idUniteAdministrativeNiv3 = ua3.id
    WHERE t.idTypeTache = 1
    GROUP BY t.id, t.nom, codeUA
    ');

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function tacheUA1($pdo, $id)
{
    $stmt = $pdo->prepare("SELECT ua1.id as idUniteAdministrativeNiv,ua1.codeNiv1 as service,t.idTypeTache as idTypeTache,t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon 
    FROM unite_administrative_niv1 ua1
JOIN tache t ON t.idUniteAdministrativeNiv1 = ua1.id
JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua1.id = ?
GROUP BY t.id
    ");
    $stmt->execute([$id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
// Fonction pour récupérer tous les items
function tacheUA2($pdo, $id)
{
    $id_utilisateur = $_SESSION['id_utilisateur'];


    $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE id = ?');
    $stmt->execute([$id_utilisateur]);
    $user = $stmt->fetch(PDO::FETCH_OBJ);


    if ($user->statutUtilisateur == 0) {
        require_once('utilisateur.php');

        $stmt = $pdo->prepare(" SELECT t.url as url,t.autre_ressource as autre_ressource,t.id as id, i.icon as icon, s.nom AS sous_menu_nom, t.nom AS tache_nom 
            FROM tache t
            JOIN sous_menu s ON t.id = s.id
 JOIN icons i ON i.id_icon = s.id_icon
            JOIN structure st ON s.id_structure = st.id_structure
            WHERE st.id_structure = :id_structure OR t.type = 'par défaut' ORDER BY t.id DESC
        ");
        $stmt->execute([]);
    } elseif ($user->statutUtilisateur == 1) {
        $stmt = $pdo->prepare(" SELECT ua2.id as idUniteAdministrativeNiv,ua2.codeNiv2 as service,t.idTypeTache as idTypeTache,t.nom as tache,t.autre_ressource as autre_ressource, t.id as id, sm.nom as sousMenu, i.icon as icon,t.url as url, t.idSousMenu as idSousMenu, t.idIcon as tacheIcon FROM unite_administrative_niv2 ua2
JOIN unite_administrative_niv1 ua1 ON ua2.idUniteAdministrativeNiv1 = ua1.id
JOIN tache t ON t.idUniteAdministrativeNiv2 = ua2.id
JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null
JOIN icons i ON sm.idIcon = i.id_icon
WHERE ua1.id = ?
GROUP BY t.id
    ");
        $stmt->execute([$id]);
    } elseif ($user->statut == 'agent') {
        $stmt = $pdo->prepare("SELECT t.url as url,t.id as id, i.icon as icon,s.nom AS sous_menu_nom, t.nom AS tache_nom 
FROM tache t
LEFT JOIN sous_menu s ON t.id = s.id
 JOIN icons i ON i.id_icon = s.idIcon
LEFT JOIN tache_utilisateur tu ON t.id = tu.id
LEFT JOIN utilisateur u ON tu.id_utilisateur = u.id_utilisateur
WHERE u.id_utilisateur = :id_utilisateur OR t.type = 'par défaut' ORDER BY t.id DESC
        ");
        $stmt->execute([':id_utilisateur' => $id_utilisateur]);
    }

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Récupérer tous les résultats

    return $result;
}

function tacheUA3($pdo, $id)
{
    $stmt = $pdo->prepare(" SELECT ua3.id as idUniteAdministrativeNiv, ua2.codeNiv2 as service,
     ua3.codeNiv3 as service2, t.nom as tache, t.id as id, sm.nom as sousMenu, i.icon as icon, t.url as url,t.autre_ressource as autre_ressource,
      t.idSousMenu as idSousMenu, t.idIcon as tacheIcon 
      FROM unite_administrative_niv3 ua3
       JOIN unite_administrative_niv2 ua2 ON ua3.idUniteAdministrativeNiv2 = ua2.id 
       JOIN unite_administrative_niv2 ua1 ON ua2.idUniteAdministrativeNiv1 = ua1.id 
       JOIN tache t ON t.idUniteAdministrativeNiv3 = ua3.id 
       JOIN sous_menu sm ON t.idSousMenu = sm.id OR t.idSousMenu IS null 
       JOIN icons i ON sm.idIcon = i.id_icon 
       WHERE ua1.id = ? GROUP BY t.id; 
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Récupérer tous les résultats

    return $result;
}
function getCodeUA($pdo, $idUniteAdministrative, $niveauUniteAdministrative)
{
    $nivSup = $niveauUniteAdministrative - 1;
    $stmt = $pdo->prepare('SELECT ua.codeNiv' . $niveauUniteAdministrative . ' FROM unite_administrative_niv' . $niveauUniteAdministrative . ' ua 
    WHERE ua.id = ?');

    $stmt->execute([$idUniteAdministrative]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function get_agent($pdo)
{
    $statut = $_SESSION['statutUtilisateur'];
    // $id_structure = $_SESSION['id_structure'];
   if ($statut == 1) {
        $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE statutUtilisateur != ?');
        $stmt->execute([$statut]);
    }
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
//Affichage de la structure, du sous_menu de l'utilisateur
function get_all($pdo)
{
    $stmt = $pdo->prepare('SELECT s.id AS id,s.nom AS nom_s, i.icon AS icon FROM sous_menu s
                        JOIN icons i ON i.id_icon = s.idIcon ORDER BY s.id DESC
                        ');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Liste des sous_menus
function get_sous_menu($pdo)
{
    if ($_SESSION['statut'] == 'admin') {
        $stmt = $pdo->prepare('SELECT * FROM sous_menu ORDER BY id DESC');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM sous_menu WHERE id_structure =" . $_SESSION['id_structure']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

function get_one_sous_menu($pdo, $id)
{
    $stmt = $pdo->prepare('SELECT * FROM sous_menu 
	    join icons i on i.id_icon = sous_menu.idIcon
	WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function delete_sous_menu($pdo, $id)
{
    $stmt = $pdo->prepare('DELETE FROM sous_menu WHERE id = ?');
    $stmt->execute([$id]);
}
function edit_sous_menu($pdo, $id, $nom, $idIcon)
{
    $stmt = $pdo->prepare("UPDATE sous_menu SET nom = ?, idIcon = ? WHERE id = ?");
    return $stmt->execute([$nom, $idIcon, $id]);
}
//Liste des structures
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

//liste des taches 
function get_taches($pdo)
{
    $stmt = $pdo->prepare('SELECT 
    t.id AS id, 
    t.nom AS nom,
    tt.typeTache AS type,
    t.url AS url,
    t.autre_ressource AS autre_ressource,
    t.commentaire AS commentaire,
COALESCE(
        ua1.codeNiv1,
        ua2.codeNiv2,
        ua3.codeNiv3
    ) AS code,
    -- Obtenir le code UA Niv1 peu importe le niveau de rattachement
    COALESCE(
        ua1.id,
        ua1_from_niv2.id,
        ua1_from_niv3.id
    ) AS id_structure,

    COUNT(tu.idUtilisateur) AS nombre_utilisateurs,
    active

FROM tache t

JOIN typetache tt ON tt.id = t.idTypeTache

-- Lien direct
LEFT JOIN unite_administrative_niv1 ua1 ON t.idUniteAdministrativeNiv1 = ua1.id

-- Lien indirect depuis UA Niv2
LEFT JOIN unite_administrative_niv2 ua2 ON t.idUniteAdministrativeNiv2 = ua2.id
LEFT JOIN unite_administrative_niv1 ua1_from_niv2 ON ua2.idUniteAdministrativeNiv1 = ua1_from_niv2.id

-- Lien indirect depuis UA Niv3
LEFT JOIN unite_administrative_niv3 ua3 ON t.idUniteAdministrativeNiv3 = ua3.id
LEFT JOIN unite_administrative_niv2 ua2_from_niv3 ON ua3.idUniteAdministrativeNiv2 = ua2_from_niv3.id
LEFT JOIN unite_administrative_niv1 ua1_from_niv3 ON ua2_from_niv3.idUniteAdministrativeNiv1 = ua1_from_niv3.id

-- Utilisateurs liés à la tâche
LEFT JOIN tache_utilisateur tu ON t.id = tu.idTache AND tu.access = 1

GROUP BY 
    t.id, 
    t.nom,
    tt.typeTache,
    t.url,
    t.autre_ressource,
    id_structure

ORDER BY t.nom ASC;

');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
//Affichage d'une tache
function get_one_tache($pdo, $id)
{
    $stmt = $pdo->prepare('SELECT t.id as id, t.nom as nom,t.idFonction, tt.typeTache as type,tt.id as idTypeTache
    , t.url as url, t.autre_ressource as autre_ressource, t.idSousMenu as idSousMenu, t.idIcon as idIcon, sm.nom as nom_sous_menu, i.icon as icon
	    , t.commentaire as commentaire, t.idUniteAdministrativeNiv1 as idUniteAdministrativeNiv1, t.idUniteAdministrativeNiv2 as idUniteAdministrativeNiv2, t.idUniteAdministrativeNiv3 as idUniteAdministrativeNiv3,
        q.qualification as qualification, q.id as idQualification, t.idDB as idDB
     FROM tache t
LEFT JOIN typetache tt ON tt.id = t.idTypeTache
LEFT JOIN sous_menu sm ON t.idSousMenu = sm.id
LEFT JOIN icons i ON t.idIcon = i.id_icon
LEFT JOIN tache_qualification tq ON t.id = tq.idTache
LEFT JOIN qualifications q ON q.id = tq.idQualification
    WHERE t.id = ?');
    $stmt->execute([$id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function delete_tache($pdo, $id)
{
    $stmt = $pdo->prepare('DELETE FROM tache WHERE id = ?');
    $stmt->execute([$id]);
}

function edit_tache($pdo, $id, $nom, $type, $url, $autre_ressource, $idSousMenu, $idIcon, $nivUA, $idUA, $id_fonction, $idDB)
{
    try {
        $pdo->beginTransaction();

        // Vérifier si l'URL existe déjà pour une autre tâche
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM tache WHERE url = ? AND id != ?");
        $stmtCheck->execute([$url, $id]);
        if ($stmtCheck->fetchColumn() > 0) {
            $pdo->rollBack();
            return [
                'success' => false,
                'message' => "Une tâche avec cette URL existe déjà."
            ];
        }

        // Vérifier si une tâche avec le même nom, même type et même UA existe déjà (hors celle en cours d'édition)
        $stmtCheckNom = $pdo->prepare("SELECT COUNT(*) FROM tache WHERE nom = ? AND idTypeTache = ? AND id != ?");
        $params = array_merge([$nom, $type], [$id]);
        $stmtCheckNom->execute($params);
        if ($stmtCheckNom->fetchColumn() > 0) {
            $pdo->rollBack();
            return [
                'success' => false,
                'message' => "Une tâche avec ce nom et ce type existe déjà."
            ];
        }

        $idUA = ($idUA === '' || $idUA === 0) ? null : $idUA;
        // Préparer les valeurs des niveaux administratifs
        $idNiv1 = null;
        $idNiv2 = null;
        $idNiv3 = null;
        if ($nivUA == 1) {
            $idNiv1 = $idUA;
        } elseif ($nivUA == 2) {
            $idNiv2 = $idUA;
        } elseif ($nivUA == 3) {
            $idNiv3 = $idUA;
        }

        if ($type != 2) {
            $id_fonction = null;
        } elseif ($type == 2) {
            // Si id_fonction n'est pas null, récupérer ses unités administratives et les affecter à la tâche
            if (!empty($id_fonction)) {
                // Récupérer les unités administratives liées à la fonction
                $stmtUA = $pdo->prepare("SELECT idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3 FROM fonction WHERE id = ?");
                $stmtUA->execute([$id_fonction]);
                $ua = $stmtUA->fetch(PDO::FETCH_ASSOC);

                if ($ua) {
                    if (!empty($ua['idUniteAdministrativeNiv1'])) {
                        $idNiv1 = $ua['idUniteAdministrativeNiv1'];
                        $idNiv2 = null;
                        $idNiv3 = null;
                    } elseif (!empty($ua['idUniteAdministrativeNiv2'])) {
                        $idNiv1 = null;
                        $idNiv2 = $ua['idUniteAdministrativeNiv2'];
                        $idNiv3 = null;
                    } elseif (!empty($ua['idUniteAdministrativeNiv3'])) {
                        $idNiv1 = null;
                        $idNiv2 = null;
                        $idNiv3 = $ua['idUniteAdministrativeNiv3'];
                    }
                }
            }
        }

        $sql = "UPDATE tache SET nom = ?, idTypeTache = ?, url = ?, autre_ressource = ?, idSousMenu = ?, idIcon = ?, idFonction = ?, idUniteAdministrativeNiv1 = ?, idUniteAdministrativeNiv2 = ?, idUniteAdministrativeNiv3 = ?, idDB = ? WHERE id = ?";
        $params = [
            $nom,
            $type,
            $url,
            $autre_ressource,
            $idSousMenu,
            $idIcon,
            $id_fonction,
            $idNiv1,
            $idNiv2,
            $idNiv3,
            $idDB,
            $id
        ];
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute($params)) {
            // Récupérer l'attribut createdBy de la tâche avant modification
            $stmtGetCreatedBy = $pdo->prepare("SELECT createdBy FROM tache WHERE id = ?");
            $stmtGetCreatedBy->execute([$id]);
            $createdBy = $stmtGetCreatedBy->fetchColumn();

            // Insertion dans la table historiqueTache
            $stmtHist = $pdo->prepare("INSERT INTO historiqueTache (
                idUtilisateur, idTache, nom, autre_ressource, url, idTypeTache, commentaire, idSousMenu, idIcon, idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3, dateEnregistrement, active, idFonction, createdBy, idDB
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtHist->execute([
                $_SESSION['id'] ?? null,
                $id,
                $nom,
                $autre_ressource,
                $url,
                $type,
                null, // commentaire non fourni ici
                $idSousMenu,
                $idIcon,
                $idNiv1,
                $idNiv2,
                $idNiv3,
                gmdate('Y-m-d H:i:s'),
                1,
                $id_fonction,
                $createdBy,
                $idDB
            ]);
            $pdo->commit();
            return ['success' => true, 'message' => 'Tâche modifiée avec succès'];
        } else {
            $pdo->rollBack();
            return ['success' => false, 'message' => 'Erreur lors de la modification de la tâche'];
        }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        return ['success' => false, 'message' => 'Erreur lors de la modification de la tâche : ' . $e->getMessage()];
    }
}


//Affichage des des taches de l'agent
function get_tache_utilisateur($pdo, $id_agent, $id)
{
    $stmt = $pdo->prepare('SELECT t.*,tu.id_tache_utilisateur as id_TU, s.nom as nom_sous_menu FROM utilisateur u 
            JOIN tache_utilisateur tu ON u.id = tu.idUtilisateur
            JOIN tache t ON t.id = tu.idTache
        -- JOIN sous_menu s ON t.idSousMenu = s.id
    WHERE u.id = ? and t.id= ?');
    $stmt->execute([$id_agent, $id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Fonction pour récupérer les taches qui n'appartient pas l'utilisateur
function get_other_tache($pdo, $id_agent)
{
    $stmt = $pdo->prepare('SELECT t.*, s.nom as nom_sous_menu
        FROM tache t
        -- JOIN sous_menu s ON t.id = s.id
        LEFT JOIN tache_utilisateur tu ON t.id = tu.idTache AND tu.idUtilisateur = ?
        WHERE tu.idTache IS NULL and t.type != "par défaut" ');
    $stmt->execute([$id_agent]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Fonction pour octroyer une tache à un utilisateur
function add_tache_utilisateur($pdo, $id_utilisateur, $id_tache)
{
    // Vérifier si une entrée existe déjà pour le même utilisateur et la même tâche
    $stmt = $pdo->prepare("SELECT * FROM tache_utilisateur WHERE idUtilisateur = ? AND idTache = ?");
    $stmt->execute([$id_utilisateur, $id_tache]);
    $existing_entry = $stmt->fetch();

    if ($existing_entry) {
        // Si une entrée existe déjà, mettre à jour l'attribut access de 1 à 0
        if ($existing_entry['access'] == 1) {
            $stmt_update = $pdo->prepare("UPDATE tache_utilisateur SET access = 0,idUtilisateurSupRetrait = ?, dateRetrait = ? WHERE idUtilisateur = ? AND idTache = ?");
            return $stmt_update->execute([$_SESSION['id'], gmdate('Y-m-d H:i:s'),$id_utilisateur, $id_tache]);
               
        } else {
            // Si l'accès est déjà à 0, rien à faire
            return true;
        }
    } else {
        // récupérer le nom de la base de données à travers l'attribut idDB de la tâche
        $stmt_tache = $pdo->prepare("SELECT idDB FROM tache WHERE id = ?");
        $stmt_tache->execute([$id_tache]);
        $idDB = $stmt_tache->fetchColumn();
        if ($idDB) {
            $stmt_db = $pdo->prepare("SELECT nom FROM base_donnees WHERE id = ?");
            $stmt_db->execute([$idDB]);
            $db_name = $stmt_db->fetchColumn();
            if ($db_name) {
                
                // récupérer l'email de l'utilisateur à partir de son identifiant
                // Récupérer l'email et le matricule de l'utilisateur
                $stmt_user = $pdo->prepare("SELECT email, matricule FROM utilisateur WHERE id = ?");
                $stmt_user->execute([$id_utilisateur]);
                $user_info = $stmt_user->fetch(PDO::FETCH_ASSOC);
                $email = $user_info['email'] ?? null;
                $matricule = $user_info['matricule'] ?? null;
                // récupérer les informations de l'utilisateur à partir de l'API
                $user_info_api = get_info([$matricule]);
                
                // vérifier si l'email existe dans la base de données $db_name dans la table utilisateur
                $pdo_db = new PDO("mysql:host=localhost;dbname=$db_name;charset=utf8", 'root', '');
                $stmt_email = $pdo_db->prepare("SELECT id FROM utilisateur WHERE email = ?");
                $stmt_email->execute([$email]);
                $email_exists = $stmt_email->fetchColumn();
                if (!$email_exists) {
                    // Si l'email n'existe pas, on 
                    if($db_name == 'o86fy_cmjlf'){
                        // Insérer l'utilisateur dans la table administration de la base o86fy_cmjlf
                        try {
                            // Récupérer les informations nécessaires depuis l'API ou la base principale
                            $idRole = 6;
                            $nomAgent = $user_info_api[$matricule][0]['nom'] ?? null;
                            $prenomAgent = $user_info_api[$matricule][0]['prenom'] ?? null;
                            $sexeAgent = $user_info_api[$matricule][0]['sexe'] ?? null;
                            $dobAgent = $user_info_api[$matricule][0]['dob'] ?? null;
                            $pobAgent = $user_info_api[$matricule][0]['pob'] ?? 'Dakar';
                            $adresseAgent = $user_info_api[$matricule][0]['adresse'] ?? null;
                            $telAgent = $user_info_api[$matricule][0]['tel'] ?? null;
                            $cni = $user_info_api[$matricule][0]['cni'] ?? null;
                            $photo = $user_info_api[$matricule][0]['photo'] ?? null;
                            $dateCreation = gmdate('Y-m-d H:i:s');
                            $etat = 1;
                            $ecole = $user_info_api[$matricule][0]['ecole'] ?? null;
                            $idEcole = $user_info_api[$matricule][0]['idEcole'] ?? 1;
                            
                            $pdo_cmjlf = new PDO("mysql:host=localhost;dbname=o86fy_cmjlf;charset=utf8", 'root', '');
                            $stmt_admin = $pdo_cmjlf->prepare("INSERT INTO administration (idRole, matricule, nomAgent, prenomAgent, sexeAgent, dobAgent, pobAgent, adresseAgent, telAgent, cni, photo, dateCreation, email, etat, ecole, idEcole) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                            $stmt_admin->execute([
                                $idRole,
                                $matricule,
                                $nomAgent,
                                $prenomAgent,
                                $sexeAgent,
                                $dobAgent,
                                $pobAgent,
                                $adresseAgent,
                                $telAgent,
                                $cni,
                                $photo,
                                $dateCreation,
                                $email,
                                $etat,
                                $ecole,
                                $idEcole
                            ]);
                        } catch (Exception $e) {
                            error_log("Erreur insertion administration CMJLF: " . $e->getMessage());
                        }
                        
                        
                    }elseif($db_name == 'o86fy_ent'){
                        try {
                            // Récupérer les informations nécessaires depuis l'API ou la base principale
                            $prenomEnt = $user_info_api[$matricule][0]['prenom'] ?? $prenom ?? null;
                            $nomEnt = $user_info_api[$matricule][0]['nom'] ?? $nom ?? null;
                            $photoEnt = $user_info_api[$matricule][0]['photo'] ?? $photo ?? null;
                            $emailEnt = $email ?? null;
                            $statutEnt = 1;
                            $passwordEnt = 'Passer2022';
                            $idDepartementEnt = null;
                            $idRoleEnt = 22; // Rôle par défaut pour les agents
                            $grade = $user_info_api[$matricule][0]['grade'] ?? null;
                            if($grade == 1){
                                
                            }
                            $pdo_ent = new PDO("mysql:host=localhost;dbname=o86fy_ent;charset=utf8", 'root', '');
                            $stmt_ent = $pdo_ent->prepare("INSERT INTO ent (prenom, nom, photo, email, statut, password, idDepartement, idRole) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                            $stmt_ent->execute([
                                $prenomEnt,
                                $nomEnt,
                                $photoEnt,
                                $emailEnt,
                                $statutEnt,
                                $passwordEnt,
                                $idDepartementEnt,
                                $idRoleEnt
                            ]);
                        } catch (Exception $e) {
                            error_log("Erreur insertion ENT: " . $e->getMessage());
                        }
                    }
                }
            }
        }


        // Si aucune entrée n'existe, faire une nouvelle insertion
        $stmt_insert = $pdo->prepare("INSERT INTO tache_utilisateur (idUtilisateur, idTache, idUtilisateurSupOctroiement, dateOctroiement, dateEnregistrement) VALUES (?, ?, ?, ?, ?)");
        return $stmt_insert->execute([$id_utilisateur, $id_tache, $_SESSION['id'], gmdate('Y-m-d H:i:s'), gmdate('Y-m-d H:i:s')]);
    }
}


//Fonction pour supprimer une tache
function delete_tache_utilisateur($pdo, $id)
{
    $stmt = $pdo->prepare("DELETE FROM tache_utilisateur WHERE id_tache_utilisateur = ?");
    return $stmt->execute([$id]);
}


// function addAgent($pdo, $identifiant, $matricule, $email, $password)
// {
//     try {
//         // Configuration du fuseau horaire GMT/UTC
//         date_default_timezone_set('UTC');
//         $gmtDate = new DateTime();
//         $createdAt = $gmtDate->format('Y-m-d H:i:s');

//         // Vérification des droits admin
//         $isAdmin = ($_SESSION['statutUtilisateur'] ?? 0) == 1;
//         $access = 2;
//         $createdBy = 'admin' ?? null;

//         // Hachage sécurisé du mot de passe
//         $hashedPassword = md5($password);

//         // Préparation de la requête
//         $query = "INSERT INTO utilisateur 
//                   (identifiant, matricule, email, statutUtilisateur, password, created_at" .
//             ($isAdmin ? ", createdBy, access" : "") . ") 
//                   VALUES (:identifiant, :matricule, :email, 0, :password, :created_at" .
//             ($isAdmin ? ", :createdBy, :access" : "") . ")";

//         $stmt = $pdo->prepare($query);

//         // Liaison des paramètres
//         $stmt->bindParam(':identifiant', $identifiant, PDO::PARAM_STR);
//         $stmt->bindParam(':matricule', $matricule, PDO::PARAM_STR);
//         $stmt->bindParam(':email', $email, PDO::PARAM_STR);
//         $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
//         $stmt->bindParam(':created_at', $createdAt, PDO::PARAM_STR);

//         if ($isAdmin) {
//             $stmt->bindParam(':createdBy', $createdBy, PDO::PARAM_INT);
//             $stmt->bindParam(':access', $access, PDO::PARAM_INT);
//         }

//         // Exécuter la requête
//         if ($stmt->execute()) {
//             return ['success' => true, 'message' => 'Agent ajouté avec succès'];
//         } else {
//             return ['success' => false, 'message' => 'Erreur lors de l\'ajout de l\'agent'];
//         }
//     } catch (PDOException $e) {
//         // Journaliser l'erreur au lieu de l'afficher directement
//         error_log("Erreur lors de l'ajout de l'agent : " . $e->getMessage());
//         return ['success' => false, 'message' => 'Une erreur est survenue lors de l\'ajout de l\'agent'];
//     }
// }
function addAgent($pdo, $identifiant, $matricule, $email, $password)
{
    try {
        date_default_timezone_set('UTC');
        $createdAt = (new DateTime())->format('Y-m-d H:i:s');

        // Vérification des droits admin
        $isAdmin = ($_SESSION['statutUtilisateur'] ?? 0) == 1;
        $access = 2;
        $createdBy = $isAdmin ? 'admin' : null;

        // 🔐 Hachage sécurisé du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Requête SQL
        $query = "INSERT INTO utilisateur 
            (identifiant, matricule, email, statutUtilisateur, password, created_at" .
            ($isAdmin ? ", createdBy, access" : "") . ")
            VALUES (:identifiant, :matricule, :email, 0, :password, :created_at" .
            ($isAdmin ? ", :createdBy, :access" : "") . ")";

        $stmt = $pdo->prepare($query);

        // Bind des paramètres
        $stmt->bindParam(':identifiant', $identifiant);
        $stmt->bindParam(':matricule', $matricule);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':created_at', $createdAt);

        if ($isAdmin) {
            $stmt->bindParam(':createdBy', $createdBy);
            $stmt->bindParam(':access', $access);
        }

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Agent ajouté avec succès'];
        }

        return ['success' => false, 'message' => 'Erreur lors de l’ajout de l’agent'];

    } catch (PDOException $e) {
        error_log("Erreur addAgent : " . $e->getMessage());
        return ['success' => false, 'message' => 'Une erreur est survenue'];
    }
}

// function createAccount($pdo, $identifiant, $matricule, $email, $password)
// {
//     try {

//         // Prépare la requête SQL pour l'insertion
//         $stmt = $pdo->prepare("INSERT INTO utilisateur (identifiant, matricule, email, password, created_at, linkSendDate,linkValid ) VALUES (:identifiant, :matricule, :email, :password, :created_at,:linkSendDate,0)");

//         // Hachage du mot de passe pour des raisons de sécurité
//         $hashedPassword = md5($password);
//         $currentDate = gmdate('Y-m-d H:i:s');
//         // Lier les paramètres à la requête préparée
//         $stmt->bindParam(':identifiant', $identifiant);
//         $stmt->bindParam(':matricule', $matricule);
//         $stmt->bindParam(':email', $email);
//         $stmt->bindParam(':password', $hashedPassword);
//         $stmt->bindParam(':created_at', $currentDate);
//         $stmt->bindParam(':linkSendDate', $currentDate);

//         // Exécuter la requête
//         if ($stmt->execute()) {
//             return true; // Succès
//         } else {
//             return false; // Échec
//         }
//     } catch (PDOException $e) {
//         echo "Erreur : " . $e->getMessage();
//         return false;
//     }
// }
function createAccount($pdo, $identifiant, $matricule, $email, $password)
{
    try {
        // Prépare la requête SQL pour l'insertion
        $stmt = $pdo->prepare("INSERT INTO utilisateur 
            (identifiant, matricule, email, password, created_at, linkSendDate, linkValid) 
            VALUES (:identifiant, :matricule, :email, :password, :created_at, :linkSendDate, 0)");

        // Hachage sécurisé du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $currentDate = gmdate('Y-m-d H:i:s');
        
        // Lier les paramètres à la requête préparée
        $stmt->bindParam(':identifiant', $identifiant);
        $stmt->bindParam(':matricule', $matricule);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':created_at', $currentDate);
        $stmt->bindParam(':linkSendDate', $currentDate);

        // Exécuter la requête
        if ($stmt->execute()) {
            return true; // Succès
        } else {
            return false; // Échec
        }
    } catch (PDOException $e) {
        error_log("Erreur lors de la création du compte : " . $e->getMessage());
        return false;
    }
}

// function updateAgent($pdo, $id, $password)
// {
//     try {
//         // Prépare la requête SQL pour la mise à jour
//         $stmt = $pdo->prepare("UPDATE utilisateur SET password = :password WHERE id = :id");

//         // Hachage du mot de passe pour des raisons de sécurité
//         $hashedPassword = md5($password);

//         // Lier les paramètres à la requête préparée
//         $stmt->bindParam(':id', $id, PDO::PARAM_INT);

//         $stmt->bindParam(':password', $hashedPassword);

//         // Exécuter la requête
//         if ($stmt->execute()) {
//             return true; // Succès
//         } else {
//             return false; // Échec
//         }
//     } catch (PDOException $e) {
//         echo "Erreur : " . $e->getMessage();
//         return false;
//     }
// }

function updateAgent($pdo, $id, $password)
{
    try {
        // Prépare la requête SQL pour la mise à jour
        $stmt = $pdo->prepare("UPDATE utilisateur SET password = :password WHERE id = :id");

        // Hachage sécurisé du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Lier les paramètres à la requête préparée
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':password', $hashedPassword);

        // Exécuter la requête
        if ($stmt->execute()) {
            return true; // Succès
        } else {
            return false; // Échec
        }
    } catch (PDOException $e) {
        error_log("Erreur lors de la mise à jour de l'agent : " . $e->getMessage());
        return false;
    }
}

function add_tache($pdo, $nom, $idTypeTache, $url, $idSousMenu, $idIcon, $autre_ressource, $commentaire, $id_UA, $niveau_UA, $id_fonction,$idDB = null)
{
    try {
        $pdo->beginTransaction();

        // Vérifier si l'URL existe déjà
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM tache WHERE url = ?");
        $stmtCheck->execute([$url]);
        if ($stmtCheck->fetchColumn() > 0) {
            $pdo->rollBack();
            return [
                'success' => false,
                'message' => "Une tâche avec cette URL existe déjà."
            ];
        }

        // Initialisation des niveaux
        $idNiv1 = null;
        $idNiv2 = null;
        $idNiv3 = null;

        if (empty($idSousMenu) || $idSousMenu == 0) {
            $idSousMenu = null;
        }
        if (empty($idIcon) || $idIcon == 0) {
            $idIcon = null;
        }
        if ($niveau_UA == 1) {
            $idNiv1 = $id_UA;
        } elseif ($niveau_UA == 2) {
            $idNiv2 = $id_UA;
        } elseif ($niveau_UA == 3) {
            $idNiv3 = $id_UA;
        }

        // Vérifier si une tâche avec le même nom, même type et même UA existe déjà
        $whereUA = '';
        $paramsUA = [];
        if ($niveau_UA == 1) {
            $whereUA = 'idUniteAdministrativeNiv1 = ?';
            $paramsUA[] = $idNiv1;
        } elseif ($niveau_UA == 2) {
            $whereUA = 'idUniteAdministrativeNiv2 = ?';
            $paramsUA[] = $idNiv2;
        } elseif ($niveau_UA == 3) {
            $whereUA = 'idUniteAdministrativeNiv3 = ?';
            $paramsUA[] = $idNiv3;
        }

        if ($whereUA) {
            $stmtCheckNom = $pdo->prepare("SELECT COUNT(*) FROM tache WHERE nom = ? AND idTypeTache = ? AND $whereUA");
            $params = array_merge([$nom, $idTypeTache], $paramsUA);
            $stmtCheckNom->execute($params);
            if ($stmtCheckNom->fetchColumn() > 0) {
                $pdo->rollBack();
                return [
                    'success' => false,
                    'message' => "Une tâche avec ce nom, ce type et cette unité administrative existe déjà."
                ];
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO tache (nom, idTypeTache, url, idSousMenu, idIcon, autre_ressource, commentaire, idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3, dateEnregistrement, idFonction, createdBy, idDB) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULLIF(?, 0), ?, ?)
        ");
        // Si id_fonction n'est pas null, récupérer ses unités administratives et les affecter à la tâche
        if (!empty($id_fonction)) {
            // Récupérer les unités administratives liées à la fonction
            $stmtUA = $pdo->prepare("SELECT idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3 FROM fonction WHERE id = ?");
            $stmtUA->execute([$id_fonction]);
            $ua = $stmtUA->fetch(PDO::FETCH_ASSOC);

            if ($ua) {
                if (!empty($ua['idUniteAdministrativeNiv1'])) {
                    $idNiv1 = $ua['idUniteAdministrativeNiv1'];
                    $idNiv2 = null;
                    $idNiv3 = null;
                } elseif (!empty($ua['idUniteAdministrativeNiv2'])) {
                    $idNiv1 = null;
                    $idNiv2 = $ua['idUniteAdministrativeNiv2'];
                    $idNiv3 = null;
                } elseif (!empty($ua['idUniteAdministrativeNiv3'])) {
                    $idNiv1 = null;
                    $idNiv2 = null;
                    $idNiv3 = $ua['idUniteAdministrativeNiv3'];
                }
            }
        }
        $id_fonction = (int)$id_fonction;

        if ($stmt->execute([$nom, $idTypeTache, $url, $idSousMenu, $idIcon, $autre_ressource, $commentaire, $idNiv1, $idNiv2, $idNiv3, gmdate('Y-m-d H:i:s'), $id_fonction, $_SESSION['id'], $idDB])) {
            // Récupérer l'id de la tâche insérée
            $idTache = $pdo->lastInsertId();

            // Insertion dans la table historiqueTache
            $stmtHist = $pdo->prepare("INSERT INTO historiqueTache (
                idUtilisateur, idTache, nom, autre_ressource, url, idTypeTache, commentaire, idSousMenu, idIcon, idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3, dateEnregistrement, active, idFonction, createdBy, idDB
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtHist->execute([
                $_SESSION['id'] ?? null,
                $idTache,
                $nom,
                $autre_ressource,
                $url,
                $idTypeTache,
                $commentaire,
                $idSousMenu,
                $idIcon,
                $idNiv1,
                $idNiv2,
                $idNiv3,
                gmdate('Y-m-d H:i:s'),
                1,
                ($id_fonction === null || $id_fonction == 0) ? null : $id_fonction,
                $_SESSION['id'] ?? null,
                $idDB
            ]);

            $pdo->commit();
            return [
                'success' => true,
                'message' => 'Tâche ajoutée avec succès'
            ];
        } else {
            $pdo->rollBack();
            return [
                'success' => false,
                'message' => "Erreur lors de l'ajout de la tâche"
            ];
        }
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log("Erreur add_tache: " . $e->getMessage());
        return [
            'success' => false,
            'message' => "Erreur add_tache: " . $e->getMessage()
        ];
    }
}
function changeEtatTache($pdo, $id_tache)
{
    try {
        $pdo->beginTransaction();
        // Vérifier l'état actuel de la tâche
        $stmtEtat = $pdo->prepare("SELECT active FROM tache WHERE id = ?");
        $stmtEtat->execute([$id_tache]);
        $etat = $stmtEtat->fetchColumn();

        // Inverser l'état (0 -> 1, 1 -> 0)
        $nouvelEtat = ($etat == 1) ? 0 : 1;

        // Mettre à jour l'état de la tâche
        $stmt = $pdo->prepare("UPDATE tache SET active = ? WHERE id = ?");
        $stmt->execute([$nouvelEtat, $id_tache]);
        

        // Récupérer les infos de la tâche pour l'historique
        $stmtTache = $pdo->prepare("SELECT * FROM tache WHERE id = ?");
        $stmtTache->execute([$id_tache]);
        $tache = $stmtTache->fetch(PDO::FETCH_ASSOC);

        // Insertion dans la table historiqueTache
        $stmtHist = $pdo->prepare("INSERT INTO historiqueTache (
            idUtilisateur, idTache, nom, autre_ressource, url, idTypeTache, commentaire, idSousMenu, idIcon, idUniteAdministrativeNiv1, idUniteAdministrativeNiv2, idUniteAdministrativeNiv3, dateEnregistrement, active, idFonction, createdBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmtHist->execute([
            $_SESSION['id'] ?? null,
            $id_tache,
            $tache['nom'] ?? null,
            $tache['autre_ressource'] ?? null,
            $tache['url'] ?? null,
            $tache['idTypeTache'] ?? null,
            $tache['commentaire'] ?? null,
            $tache['idSousMenu'] ?? null,
            $tache['idIcon'] ?? null,
            $tache['idUniteAdministrativeNiv1'] ?? null,
            $tache['idUniteAdministrativeNiv2'] ?? null,
            $tache['idUniteAdministrativeNiv3'] ?? null,
            gmdate('Y-m-d H:i:s'),
            $nouvelEtat,
            $tache['idFonction'] ?? null,
            $tache['createdBy'] ?? null
        ]);

        $pdo->commit();
        return ['success' => true, 'message' => 'Tâche désactivée et historique enregistré'];
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        return ['success' => false, 'message' => 'Erreur lors de la désactivation : ' . $e->getMessage()];
    }
}
//Fonction pour insérer un sous_menu
function add_sous_menu($pdo, $nom, $idIcon)
{
    $stmt = $pdo->prepare("INSERT INTO sous_menu (nom, idIcon,dateEnregistrement) VALUES (?, ?, ?)");
    return $stmt->execute([$nom, $idIcon, gmdate('Y-m-d H:i:s')]);
}

//Fonction pour insérer une sous_menu
function add_structure($pdo, $nom)
{
    $stmt = $pdo->prepare("INSERT INTO structure (nom) VALUES (?)");
    return $stmt->execute([$nom]);
}
//Afficher les icons 
function get_icon($pdo)
{
    $stmt = $pdo->prepare('SELECT * FROM `icons`');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
//Ajouter un icon
function add_icon($pdo, $icon)
{
    $stmt = $pdo->prepare('INSERT INTO icons (icon) VALUES (?)');
    return $stmt->execute([$icon]);
}
function call_ndiaya($action, $id_utilisateur)
{
    $url = "./ndiaya.php?action=$action&id_utilisateur=$id_utilisateur";

    // Initialiser une session cURLs
    $ch = curl_init($url);

    // Ajouter des en-têtes d'authentification (exemple avec un Bearer Token)
    $headers = [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json'
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Configurer cURL pour retourner la réponse sous forme de chaîne
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Vérifier les certificats SSL
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

    // Définir un timeout
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);

    // Exécuter la requête cURL
    $response = curl_exec($ch);

    // Gérer les erreurs cURL
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        die('Erreur cURL : ' . $error_msg);
    }

    // Fermer la session cURL
    curl_close($ch);

    // Décoder la réponse JSON
    $data = json_encode($response);

    // Afficher les données reçues de l'API

    return $data;
}

function get_one_compte($pdo, $id_utilisateur)
{
    $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE id = ?');
    $stmt->execute([$id_utilisateur]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function change_etat_compte($pdo, $id_utilisateur, $access)
{
    $stmt = $pdo->prepare('UPDATE utilisateur SET access = ? WHERE id = ?');
    return $stmt->execute([$access, $id_utilisateur]);
}

//Récupérationdes UniteAdministrative
function get_UA($pdo, $niveau)
{
    $stmt = $pdo->prepare('SELECT * FROM unite_administrative_niv' . $niveau);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function get_info($matricules)
{
    $results = [];
    foreach ($matricules as $matricule) {
        $url = 'https://test.uahb.sn/api_authentification';
        $postData = http_build_query(['option' => '2', 'matricule' => $matricule]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\nCookie: PHPSESSID=8cb0e85bed40346dc1e2e59ba2972678\r\n",
                'content' => $postData,
                'timeout' => 30,
                'follow_location' => true,
            ],
            'ssl' => [
                'verify_peer' => true,
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            $results[$matricule] = ['error' => 'Failed to fetch data'];
        } else {
            $results[$matricule] = json_decode($response, true);
        }
    }
    return $results;
}
