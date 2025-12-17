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
                    <a href="general" class="nav-link link-success" ><strong>utilisateur</strong> </a>
                    <a href="sousMenu" class="nav-link link-success active"><strong>sous_menus</strong> </a>
                    <a href="tache" class="nav-link link-success " ><strong>taches</strong> </a>
                    <a href="tacheQualification" class="nav-link link-success " ><strong>Tache Post</strong> </a>
                </div>
        </div>
    </div>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-sous_menu" role="tabpanel" aria-labelledby="nav-sous_menu-tab">

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