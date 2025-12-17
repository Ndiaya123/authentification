<?php
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: page-connexion');
    exit;
}

// Définir une classe pour représenter une structure
class typetache
{
    public $id;
    public $nom;

    public function __construct($id, $nom)
    {
        $this->id = $id;
        $this->nom = $nom;
    }
}
class Icon
{
    public $id;
    public $nom;

    public function __construct($id, $typeTache)
    {
        $this->id = $id;
        $this->nom = $typeTache;
    }
}
class sous_menu
{
    public $id;
    public $nom;

    public function __construct($id, $nom)
    {
        $this->id = $id;
        $this->nom = $nom;
    }
}
require_once('config.php');

try {
    $stmt = $pdo->prepare('SELECT * FROM fonction');
    $stmt->execute();
    $listeFonction = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare('SELECT * FROM typetache');
    $stmt->execute();
    $typetaches = [];


    // Parcourir les résultats et créer des objets typetache
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $typetaches[] = new typetache($row['id'], $row['typeTache']);
    }

    $stmt = $pdo->prepare('SELECT * FROM icons where adminAcceuilIcone != 1');
    $stmt->execute();
    $icons = [];

    // Parcourir les résultats et créer des objets icon
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $icons[] = new Icon($row['id_icon'], $row['icon']);
    }

    $stmt = $pdo->prepare('SELECT * FROM sous_menu');
    $stmt->execute();
    $sous_menus = [];

    // Parcourir les résultats et créer des objets Structure
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $sous_menus[] = new sous_menu($row['id'], $row['nom']);
    }

} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
    return false;
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="https://ent.uahb.sn" />
    <link rel="shortcut icon" href="dist_assets/media/logos/1.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <link href="dist_assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />
    <link href="dist_assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="dist_assets/css/style.bundle1.css" rel="stylesheet" type="text/css" />
    <link href="dist_assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    <!-- <link href="dist_assets/css/style.css" rel="stylesheet" type="text/css" /> -->
    <link rel="stylesheet" href="style.css">
    <link href="dist_assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.min.css">
</head>

<body>

    <div class="toolbar" id="kt_toolbar">
        <div id="kt_toolbar_container" class="container-fluid d-flex flex-stack">
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <a href="acceuilAdmin.php" class="nav-link link-primary"><strong>
                        <span class="svg-icon svg-icon-1 rotate-180">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="black" />
                                    <path d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z" fill="black" />
                                </svg>
                            </span></strong>
                            <strong> Home</strong>
                    </a>
                    <a href="general" class="nav-link link-success active" ><strong>utilisateur</strong> </a>
                    <a href="sousMenu" class="nav-link link-success "><strong>sous_menus</strong> </a>
                    <a href="tache" class="nav-link link-success " ><strong>taches</strong> </a>
                    <a href="tacheQualification" class="nav-link link-success " ><strong>Tache Post</strong> </a>
                </div>
            </nav>
        </div>
    </div>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane" id="nav-tachePost" role="tabpanel" aria-labelledby="nav-tachePost-tab">

            <div class="card-body d-flex align-items-center justify-content-center">
                <div class="card card-xl-stretch mb-5 mb-xl-8">
                    <form action="" id="addTacheQualificaionForm" method="post" class="row g-2" onsubmit="addTacheQualification(event)">

                        <div class="d-flex align-items-center justify-content-around p-3">

                            <div class="mb-3">
                                <div class="form-group">
                                    <Label class="form-label">Tâche</Label>
                                    <br>
                                    <label for="unite-select">Unité administrative:</label>
                                    <select id="unite-select" class="form-control" required>
                                        <option value="">Sélectionnez une unité</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="sousmenu-select">Sous-menu:</label>
                                    <select id="sousmenu-select" class="form-control" disabled required>
                                        <option value="">Sélectionnez un sous-menu</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="tache_post">Tâche:</label>
                                    <select id="tache_post" name="tache_post" class="form-control" disabled required>
                                        <option value="">Sélectionnez une tâche</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Post</label>
                                <select name="post_tache" class="form-control w-500px" id="post_tache" required>
                                    <option value="">Selectionner un Post</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                            <button type="submit" class="btn btn-success w-200px m-3" id="addTacheQualificationButtonForm">valider</button>
                        </div>

                    </form>
                </div>
            </div>
            <div class="modal fade" id="update_tache_qualification_modal" tabindex="-1" aria-labelledby="updateTacheQualificationLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="updateTacheQualificationLabel">Modifier une Tâche Qualification</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="updateTacheQualificationForm" onsubmit="updateTacheQualification(event)">
                                <input type="hidden" id="id_tache_qualification" name="id">
                                <div class="mb-3">
                                    <label for="tache_post" class="form-label">Tâche</label>
                                    <select id="tache_post" name="idTache" class="form-control" required>
                                        <option value="">Sélectionner une tâche</option>
                                        <!-- Options dynamiques -->
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="post_tache" class="form-label">Qualification</label>
                                    <select id="post_tache" name="idQualification" class="form-control" required>
                                        <option value="">Sélectionner une qualification</option>
                                        <!-- Options dynamiques -->
                                    </select>
                                </div>
                                <button type="submit" id="updateTacheQualificationButton" class="btn btn-primary">Modifier</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">

                <div class="py-2">
                    <table id="kt_table_tache_qualification" class="table align-middle table-row-dashed fs-6 gy-5">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                                <th>Tache</th>
                                <th>Post</th>
                                <th>Qualification</th>

                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600 fw-bold" id="tacheQualification"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane" id="nav-tacheUtilisateur" role="tabpanel" aria-labelledby="nav-tacheUtilisateur-tab">
            <div class="card-body">
                <div class="py-2">
                    <table id="kt_table_tache_utilisateur" class="table align-middle table-row-dashed fs-6 gy-5">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                                <th>Nom</th>
                                <th>Unité Administrative</th>
                                <th>Nombre d'Utilisateurs</th>
                                <!-- <th>access</th> -->
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600 fw-bold" id="tacheUtilisateur"></tbody>
                    </table>
                </div>

            </div>
        </div>
        <div class="tab-pane fade" id="nav-tache" role="tabpanel" aria-labelledby="nav-tache-tab">
            <div class="col-sm-12">
                <div class="row">
                    <div id="kt_content_container" class="container-xxl">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card card-xl-stretch mb-5 mb-xl-8">
                                    <div class="card-body py-3">
                                        <div class="py-2">
                                            <div class="d-flex align-items-center justify-content-start py-3">

                                                <button type="button" class="btn btn-primary text text-center w-250px h-50px" data-bs-toggle="modal" data-bs-target="#add_tache">
                                                    Ajouter tache
                                                </button>
                                            </div>
                                            <div class="py-2">
                                                <table id="kt_table_tache" class="table align-middle table-row-dashed fs-6 gy-5">
                                                    <thead>
                                                        <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                                                            <th>Nom</th>
                                                            <th>Type</th>
                                                            <th>Nombre d'utilisateur</th>
                                                            <th>code</th>
                                                            <th>Autre ressource</th>
                                                            <th>Url</th>
                                                            <!-- <th>access</th> -->
                                                            <th>action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="text-gray-600 fw-bold" id="tache"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modification -->
            <div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editLabel">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="modalBody">
                            <form action="controller.php" method="post" class="row g-2 d-flex align-items-center justify-content-center m-3">
                                <input type="hidden" name="action" value="edit_tache">
                                <input type="hidden" name="id" id="id" value="">
                                <div class="mb-3">
                                    <label class="form-label">Nom</label>
                                    <input type="text" name="nom" class="form-control" id="nom_tache" placeholder="nom">
                                </div>
                                <div class="mb-3">
                                    <div class="mb-3">
                                        <label class="form-label">sous_menu</label>
                                        <select name="id_sous_menu" class="form-control" id="sous_menu_tache">
                                            <!-- <option value="">Selectionner une sous_menu</option> -->
                                            <?php
                                            // Parcourir le tableau $services (d'objets)
                                            for ($i = 0; $i < count($sous_menus); $i++) {
                                                $sous_menu = $sous_menus[$i];
                                            ?>
                                                <option value="<?= htmlspecialchars($sous_menu->id); ?>">
                                                    <?= htmlspecialchars($sous_menu->nom); ?>
                                                </option>
                                            <?php
                                            }
                                            ?>
                                        </select>
                                    </div>
                                    <label class="form-label">type</label>
                                    <select name="type" class="form-control" id="type_tache">
                                        <option value="">Selectionner un type</option>
                                        <?php
                                        // Parcourir le tableau $services (d'objets)
                                        for ($i = 0; $i < count($typetaches); $i++) {
                                            $typetache = $typetaches[$i];
                                        ?>
                                            <option value="<?= htmlspecialchars($typetache->id); ?>">
                                                <?= htmlspecialchars($typetache->nom); ?>
                                            </option>
                                        <?php
                                        }
                                        ?>

                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">URL</label>
                                    <input type="text" name="url" class="form-control" id="url_tache">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Autre ressource</label>
                                    <textarea name="autre_ressource" class="form-control" id="autre_ressource"></textarea>

                                </div>

                                <button type="submit" class="btn btn-success w-500px m-2">valider</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade show active" id="nav-user" role="tabpanel" aria-labelledby="nav-user-tab">
            <!-- utilisateur -->
            <div class="d-flex align-items-center justify-content-start">

                <!-- <button type="button" class="btn btn-primary text text-center w-250px h-100px m-3" data-bs-toggle="modal" data-bs-target="#structure">
                Ajouter structure
            </button>
            <button type="button" class="btn btn-primary text text-center w-250px h-100px m-3" data-bs-toggle="modal" data-bs-target="#service">
                Ajouter service
            </button>
            <button type="button" class="btn btn-primary text text-center w-250px h-100px m-3" data-bs-toggle="modal" data-bs-target="#add_tache">
                Ajouter tache
            </button> -->
                <!-- <button type="button" class="btn btn-primary text text-center w-250px h-100px m-3" data-bs-toggle="modal" data-bs-target="#add_utilisateur">
                    Ajouter utilisateur
                </button> -->
            </div>

            <?php require_once('chef.php') ?>
        </div>
        <div class="tab-pane fade" id="nav-sous_menu" role="tabpanel" aria-labelledby="nav-sous_menu-tab">


            <div>

                <div class="modal fade" id="add_icon" tabindex="-1" aria-labelledby="add_icon" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Ajouter icon</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="col sm-12">
                                    <div class="card m-5 mb-xl-8">
                                        <form id="addIconForm" method="post" class="row g-2 d-flex align-items-center justify-content-center m-3">
                                            <input type="hidden" name="action" value="add_icon">
                                            <div class="mb-3">
                                                <label class="form-label">Icon <strong class="text-danger">(*)</strong></label>
                                                <textarea name="icon" id="iconInput" class="form-control" placeholder="icon"></textarea>
                                                <small id="iconError" class="text-danger" style="display: none;">Veuillez entrer une icône valide.</small>
                                            </div>
                                            <button type="submit" class="btn btn-success w-300px m-2 submitAddIconButton" onclick="validateIcon(event)">Valider</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="row">
                    <div id="kt_content_container" class="container-xxl">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card card-xl-stretch mb-5 mb-xl-8">
                                    <div class="card-body py-3">
                                        <div class="py-2">
                                            <div class="d-flex align-items-center justify-content-start py-3">

                                                <div>

                                                    <button type="button" class="btn btn-primary text text-center" data-bs-toggle="modal" data-bs-target="#service-modal">
                                                        Ajouter sous_menu
                                                    </button>
                                                    <!-- <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_icon">Ajouter Icon</button> -->
                                                </div>

                                            </div>
                                        </div>
                                        <table id="kt_table_sous_menu" class="table align-middle table-row-dashed fs-6 gy-5">
                                            <thead>
                                                <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                                                    <th>Icon</th>
                                                    <th>sous_menu</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody class="text-gray-600 fw-bold" id="fonctionnalité"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="post d-flex flex-column-fluid" id="kt_post">

        </div>
    </div>
    <div class="modal fade" id="add_utilisateur" tabindex="-1" aria-labelledby="utilisateur" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="utilisateur">Ajouter utilisateur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="controller.php" method="post" class="row g-2 d-flex align-items-center justify-content-center">
                        <input type="hidden" name="action" value="add_agent">
                        <div class="mb-3">
                            <label class="form-label">Identifiant</label>
                            <input type="text" name="identifiant" class="form-control" placeholder="identifiant">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Matricule</label>
                            <input type="text" name="matricule" class="form-control" placeholder="matricule">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" placeholder="prenom.nom@uahb.sn">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mot de pass</label>
                            <input type="text" name="password" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-success w-500px ps-15 m-2">valider</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
    <div class="modal fade" id="edit_utilisateur" tabindex="-1" aria-labelledby="utilisateur" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="utilisateur">Modification de mot de pass</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">


                    <form action="" method="post" class="row g-2 d-flex align-items-center justify-content-center" onsubmit="update_compte(event)">
                        <!-- <div class="row">
                            <div class="col-md-6">
                        <input type="hidden" name="action" value="edit_compte">
                        <div class="mb-3">
                            <label class="form-label">Identifiant</label>
                            <input type="text" name="identifiant" id="identifiant" class="form-control" placeholder="identifiant">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Matricule</label>
                            <input type="text" name="matricule" id="matricule" class="form-control" placeholder="matricule">
                        </div>
                        </div>
                        <div class="col-md-6 ms-auto">
                            <img src="" alt="Phofil" style="height: 200px; width: 200px;" id="photo-profil">
                        </div>
                    </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" id="email" class="form-control" placeholder="prenom.nom@uahb.sn">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Access</label>
                            <select name="access" id="access" class="form-control">
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="0">0 </option>
                            </select>
                        </div> -->
                        <div class="mb-3">
                            <label class="form-label">Nouveau mot de pass</label>
                            <input type="text" name="password" id="password" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-success w-500px ps-15 m-2">valider</button>
                    </form>

                </div>

            </div>
        </div>
    </div>
    <div class="modal fade" id="service-modal" tabindex="-1" aria-labelledby="service" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ajouter sous_menu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="" id="addSousMenuForm" method="post" class="row g-2 d-flex align-items-center justify-content-center m-3" onsubmit="addSousMenu(event)">
                        <input type="hidden" name="action" value="add_sous_menu">
                        <div class="mb-3">
                            <label class="form-label">Nom <strong class="text-danger">(*)</strong></label>
                            <input type="text" name="nom" class="form-control" id="nom" placeholder="nom" aria-describedby="validationSousMenuFeedback" required>
                            <div id="validationSousMenuFeedback" class="invalid-feedback">
                                Ce champ est obligatoire.
                            </div>
                        </div>

                        <input type="hidden" name="idIcon" class="" id="selectedIconId" aria-describedby="validationIconFeedback" required>
                        <div id="validationIconFeedback" class="invalid-feedback">
                            Vous devez choisir un icône.
                        </div>
                        <div class="mb-3 d-flex align-items-center justify-content-center">
                            <div class="btn-group">
                                <span class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    Icône
                                </span>
                                <ul class="dropdown-menu dropdown-menu-lg-start  scrollable-dropdown" aria-labelledby="dropdownMenuButton">
                                    <?php foreach ($icons as $icon) { ?>
                                        <li>
                                            <div class="dropdown-item btn btn-outline-primary" onclick="selectIcon(<?php echo ($icon->id); ?>,this)">
                                                <?= $icon->nom; ?>
                                            </div>
                                        </li>
                                    <?php } ?>
                                </ul>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-success w-500px m-2 submitAddSousMenuButton">Valider</button>
                    </form>

                </div>
            </div>
        </div>
    </div>
    <!-- Modification de service -->
    <div class="modal fade" id="edit_sous_menu" tabindex="-1" aria-labelledby="edit_sous_menu" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modifier sous_menu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="" id="editSousMenuFrom" method="post" onsubmit="updateSousMenuOne(event)" class="row g-2 d-flex align-items-center justify-content-center m-3">
                        <input type="hidden" name="action" value="edit_sous_menu">
                        <input type="hidden" name="id_sous_menu" id="id_sous_menu">

                        <div class="mb-3">
                            <label class="form-label">Nom</label>
                            <input type="text" id="nomTacheToEdit" name="nom" class="form-control" placeholder="nom">
                        </div>
                        <div class="mb-3 d-flex align-items-center justify-content-center border bg-light-primary">
                            <label for="" class="form-label m-3">Icon actuel</label>
                            <div id="ancienIcon" class="m-3"></div>
                            <!-- <div class="btn-group">
                                <span class="btn btn-primary" type="button" id="dropdownMenuButton">
                                    Sélectionner une icône
                                </span>
                            </div> -->
                        </div>
                        <label for="" class="form-label">Liste icons</label>
                        <div class="icon-container d-flex flex-wrap justify-content-start bg-light-warning" style="max-height: 300px; overflow-y: auto;">
                            <?php foreach ($icons as $icon) { ?>
                                <div class="icon-item d-flex align-items-center justify-content-center btn btn-outline-primary m-2"
                                    onclick="selectIcon(<?php echo $icon->id; ?>, this)">
                                    <span class="icon-preview me-2"><?= $icon->nom; ?></span> <!-- Prévisualisation de l'icône -->
                                </div>
                            <?php } ?>
                        </div>
                        <input type="hidden" name="idIcon" id="selectedIconIdToEdit">
                        <style>
                            /* Style pour l'icône active */
                            .icon-item.active {
                                background-color: rgb(41, 90, 29);
                                color: white;
                                border-color: rgb(66, 114, 76);
                            }

                            /* Conteneur des icônes */
                            .icon-container {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 10px;
                                margin-top: 10px;
                            }

                            /* Style pour chaque icône */
                            .icon-item {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 10px;
                                border: 1px solid rgb(40, 88, 46);
                                border-radius: 5px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                min-width: 100px;
                                text-align: center;
                            }

                            /* Prévisualisation de l'icône */
                            .icon-preview {
                                font-size: 20px;
                                /* Taille de l'icône */
                                color: rgb(41, 90, 29);
                                /* Couleur de l'icône */
                                margin-right: 10px;
                            }

                            /* Effet au survol */
                            .icon-item:hover {
                                background-color: rgb(68, 110, 74);
                                color: white;
                                border-color: rgb(154, 212, 168);
                            }
                        </style>
                        <button type="submit" class="btn btn-success w-500px m-2 submitEditSousMenuButton">valider</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="voirUtilisateur" tabindex="-1" aria-labelledby="voirUtilisateurLabel" aria-hidden="true">
        <div class="modal-dialog  modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="voirUtilisateurLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="utilisateurTache">
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="add_tache" tabindex="-1" aria-labelledby="tache" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Tache</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="" id="tacheForm" method="post" class="row g-2 d-flex align-items-center justify-content-center m-3">
                        <input type="hidden" name="action" value="add_tache">
                        <input type="hidden" name="id" id="id_tache">

                        <div class="mb-3">
                            <label class="form-label">Nom <strong class="text-danger">(*)</strong></label>
                            <input type="text" name="nom" class="form-control" placeholder="nom" aria-describedby="validationNameFeedback" required>
                            <div id="validationNameFeedback" class="invalid-feedback">
                                Veuillez entrer un nom.
                            </div>

                        </div>
                        <div class="mb-3">
                            <label class="form-label">Type <strong class="text-danger">(*)</strong></label>
                            <select name="idTypeTache" class="form-control" id="idTypeTache" onchange="type_tache(this.value)" aria-describedby="validationTypeFeedback" required>
                                <option value="">Selectionner un type</option>
                                <?php
                                // Parcourir le tableau $services (d'objets)
                                for ($i = 0; $i < count($typetaches); $i++) {
                                    $typetache = $typetaches[$i];
                                ?>
                                    <option value="<?= htmlspecialchars($typetache->id); ?>">
                                        <?= htmlspecialchars($typetache->nom); ?>
                                    </option>
                                <?php
                                }
                                ?>
                            </select>
                            <div id="validationTypeFeedback" class="invalid-feedback">
                                Veuillez entrer un le type de la tache.
                            </div>
                        </div>
                        <div class="">
                            <input type="hidden" name="niveau_UA">
                            <div class="mb-3" id="niveau_UA" style="display:none">

                            </div>

                            <input type="hidden" name="id_UA">
                            <div class="mb-3" id="selected_UA">

                            </div>

                        </div>
                        <div class="mb-3 d-none" id="selected_fonction">
                            <label class="form-label">Fonction</label>
                            <select name="id_fonction" class="form-control" id="id_fonction">
                                <option value="">Selectionner une fonction</option>
                                <?php
                                foreach ($listeFonction as $fonction) {
                                    echo '<option value="' . htmlspecialchars($fonction['id']) . '">' . htmlspecialchars($fonction['fonction']) . '</option>';
                                }
                                ?>
                            </select>

                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sous menu <strong class="text-danger">(*)</strong></label>
                            <select name="idSousMenu" class="form-control" id="idSousMenu">
                                <option value=''>Selectionner un sous menu</option>
                                <?php
                                for ($i = 0; $i < count($sous_menus); $i++) {
                                    $sous_menu = $sous_menus[$i];
                                ?>
                                    <option value="<?= htmlspecialchars($sous_menu->id); ?>">
                                        <?= htmlspecialchars($sous_menu->nom); ?>
                                    </option>
                                <?php
                                }
                                ?>
                            </select>
                            <div id="validationidSousMenuFeedback" class="invalid-feedback">
                                Vous devez choisir un sous menu.
                            </div>
                        </div>

                        <label class="form-label">Icône <strong class="text-danger">(*)</strong></label>
                        <div class="mb-1 d-flex align-items-center justify-content-start">
                            <div id="iconPreview" class="border bg-light b-1px btn "></div>
                            <div class="w-50 m-2">
                                <select class="form-control select2-icon" name="idIcon" id="id_icon_tache">
                                    <option value="">Sélectionner une icône</option>
                                    <?php foreach ($icons as $icon) { ?>
                                        <option value="<?= htmlspecialchars($icon->id); ?>">
                                            <?= htmlspecialchars($icon->nom); ?>
                                        </option>
                                    <?php } ?>
                                </select>
                                <div id="validationid_icon_tacheFeedback" class="invalid-feedback">
                                    Vous devez choisir une icône ou un sous menu !.
                                </div>
                            </div>
                            <style>
                                .select2-container--default .select2-selection--single {
                                    height: 38px;
                                    padding: 5px;
                                }

                                .svg-icon {
                                    display: inline-block;
                                    margin-right: 8px;
                                    vertical-align: middle;
                                }
                            </style>
                            <script>
                                $(document).ready(function() {
                                    $('.select2-icon').select2({
                                        templateResult: formatIcon,
                                        templateSelection: formatIcon
                                    });

                                    // Validation HTML5 + custom feedback
                                    $('#tacheForm').on('submit', function(e) {
                                        let valid = true;

                                        if (!$('#id_icon_tache').val()) {
                                            $('#id_icon_tache').addClass('is-invalid');
                                            $('#validationid_icon_tacheFeedback').show();
                                            valid = false;
                                        } else {
                                            $('#id_icon_tache').removeClass('is-invalid');
                                            $('#validationid_icon_tacheFeedback').hide();
                                        }
                                        if (!valid) e.preventDefault();
                                    });

                                    $('#idSousMenu').on('change', function() {
                                        if ($(this).val()) {
                                            $(this).removeClass('is-invalid');
                                            $('#validationidSousMenuFeedback').hide();
                                        }
                                    });
                                    $('#id_icon_tache').on('change', function() {
                                        if ($(this).val()) {
                                            $(this).removeClass('is-invalid');
                                            $('#validationid_icon_tacheFeedback').hide();
                                        }
                                    });

                                    // Réinitialise Select2 lors du reset du formulaire
                                    $('#tacheForm').on('reset', function() {
                                        $('#id_icon_tache').val('').trigger('change');
                                    });
                                });

                                function formatIcon(option) {
                                    if (!option.id) return option.text;
                                    var svgIcon = $(option.element).data('icon');
                                    var $wrapper = $('<span></span>');
                                    $wrapper.append(option.text);
                                    return $wrapper;
                                }

                                function updateIconPreview(select) {
                                    const selectedOption = select.options[select.selectedIndex];
                                    const preview = document.getElementById("iconPreview");
                                    if (selectedOption.value) {
                                        preview.innerHTML = `
                                            <span class="menu-icon">
                                                <span class="svg-icon svg-icon-2">
                                                    ${selectedOption.getAttribute("data-svg")}
                                                </span>
                                                ${selectedOption.text}
                                            </span>
                                        `;
                                    } else {
                                        preview.innerHTML = "";
                                    }
                                }
                            </script>
                        </div>
                        <script>
                            document.getElementById("id_icon_tache").addEventListener("change", function() {
                                const selectedOption = this.options[this.selectedIndex];
                                const iconPreview = document.getElementById("iconPreview");

                                if (selectedOption.value) {
                                    // Afficher l'icône dans l'aperçu
                                    iconPreview.innerHTML = `<span class="icon-preview">${selectedOption.getAttribute("data-icon")}</span>`;
                                } else {
                                    // Réinitialiser l'aperçu si aucune icône n'est sélectionnée
                                    iconPreview.innerHTML = "";
                                }
                            });
                        </script>
                        <div class="mb-3">
                            <label class="form-label">URL <strong class="text-danger">(*)</strong></label>
                            <input type="text" name="url" id="urlInput" class="form-control" placeholder="url" aria-describedby="validationUrlFeedback" required>
                            <div id="validationUrlFeedback" class="invalid-feedback">
                                Veuillez entrer une URL.
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Autre ressource <strong class="text-danger">(*)</strong></label>
                            <textarea name="autre_ressource" class="form-control"></textarea>

                        </div>
                        <div class="mb-3">
                            <label class="form-label">Commentaire</label>
                            <textarea name="commentaire" class="form-control"></textarea>
                        </div>

                        <button type="button" class="btn btn-success w-500px m-2 submitButton" onclick="submitForm()">valider</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
    <script src="dist_assets/plugins/global/plugins.bundle.js"></script>
    <script src="dist_assets/js/scripts.bundle.js"></script>
    <script src="dist_assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>
    <script src="dist_assets/js/custom/widgets.js"></script>
    <script src="dist_assets/js/custom/apps/chat/chat.js"></script>
    <script src="dist_assets/js/custom/modals/create-app.js"></script>
    <script src="dist_assets/js/custom/modals/upgrade-plan.js"></script>
    <script src="./dist_assets/plugins/custom/datatables/datatables.bundle.js"></script>
    <!-- <script src="/scripts.bundle.14.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js
    "></script>
    <script src="script.js"></script>
</body>

</html>