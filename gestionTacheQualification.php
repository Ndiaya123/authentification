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
                    <a href="general" class="nav-link link-success" ><strong>utilisateur</strong> </a>
                    <a href="sousMenu" class="nav-link link-success "><strong>sous_menus</strong> </a>
                    <a href="tache" class="nav-link link-success " ><strong>taches</strong> </a>
                    <a href="tacheQualification" class="nav-link link-success active" ><strong>Tache Post</strong> </a>
                </div>
            </nav>
            </nav>
        </div>
    </div>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane show active" id="nav-tachePost" role="tabpanel" aria-labelledby="nav-tachePost-tab">

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
    <script src="gestionTacheQualification.js"></script>
</body>

</html>