<?php
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: page-connexion');
    exit;
}

// Récupérer les informations de session
// $username = $_SESSION['nom'];
$email = $_SESSION['email'];
// $id_structure = $_SESSION['id_structure'];
$statutUtilisateur = $_SESSION['statutUtilisateur'];


?>
<!DOCTYPE html>

<html lang="fr">

<head>
<title>UAHB - Environnement Numérique de Travail</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://ent.uahb.sn" />
    <meta property="og:site_name" content="UAHB - ENT" />
    <link rel="canonical" href="https://ent.uahb.sn" />
    <link rel="shortcut icon" href="dist_assets/media/logos/1.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <link href="./dist_assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />
    <link href="./dist_assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="./dist_assets/css/style.bundle1.css" rel="stylesheet" type="text/css" />
    <!-- <link href="./dist_assets/css/style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link rel="stylesheet" href="style.css"> -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.min.css">
</head>

<body id="kt_body" style="background-image: url(dist_assets/media/patterns/2.png)" class="header-fixed header-tablet-and-mobile-fixed toolbar-enabled">
    <div class="d-flex flex-column flex-root">
        <div class="page d-flex flex-row flex-column-fluid">
            <div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
                <div id="kt_header" class="header align-items-stretch" data-kt-sticky="true" data-kt-sticky-name="header" data-kt-sticky-offset="{default: '200px', lg: '300px'}">
                    <div class="container-xxl d-flex align-items-center">
                        <div class="d-flex topbar align-items-center d-lg-none ms-n2 me-3" title="Show aside menu">
                            <div class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" id="kt_header_menu_mobile_toggle">
                                <span class="svg-icon svg-icon-2x">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="black" />
                                        <path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="black" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div class="header-logo me-5 me-md-10 flex-grow-1 flex-lg-grow-0">
                            <a href="#">
                                <!-- <img alt="Logo" src="dist_assets/media/logos/1.png" class="logo-default h-40px" /> -->
                                <img alt="Logo" src="dist_assets/media/logos/1.png" class="logo-sticky h-40px" />
                            </a>
                        </div>
                        <div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
                            <div class="d-flex align-items-stretch" id="kt_header_nav">
                                <div class="header-menu align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_header_menu_mobile_toggle" data-kt-swapper="true" data-kt-swapper-mode="prepend" data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}">
                                    <div class="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch" id="#kt_header_menu" data-kt-menu="true">
                                        <div  class="menu-item here show menu-lg-down-accordion me-lg-1">
                                            <a class="menu-link active py-3" href="">
                                                <span class="menu-title">Acceuil</span>
                                                <span class="menu-arrow d-lg-none"></span>
                                            </a>
                                        </div>
                                        <div  class="menu-item menu-lg-down-accordion me-lg-1">
                                            <a class="menu-link py-3" href="creation-compte-personnel-admin">
                                                <span class="menu-title">Inscription</span>
                                                <span class="menu-arrow d-lg-none"></span>
                                            </a>

                                        </div>
                                        <div  class="menu-item menu-lg-down-accordion me-lg-1">
                                            <a class="menu-link py-3" href="general">
                                                <span class="menu-title">Général</span>
                                                <span class="menu-arrow d-lg-none"></span>
                                            </a>

                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-stretch flex-shrink-0">
                                <div class="topbar d-flex align-items-stretch flex-shrink-0">
                                    <div class="d-flex align-items-center me-n3 ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
                                        <div class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" data-kt-menu-trigger="click" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                            <img class="h-30px w-30px rounded" src="" alt="" id="photo1"/>
                                        </div>
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px" data-kt-menu="true">
                                            <div class="menu-item px-3">
                                                <div class="menu-content d-flex align-items-center px-3">
                                                    <div class="symbol symbol-50px me-5">
                                                        <img alt="" src="" id="photo" />
                                                    </div>
                                                    <div class="d-flex flex-column">
                                                        <div class="fw-bolder d-flex align-items-center fs-5"> test
                                                        </div>
                                                        <a href="#" class="fw-bold text-muted text-hover-primary fs-7">test</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="separator my-2"></div>
                                            <div class="menu-item px-5">
                                                <a href="/uahb/admin-profil" class="menu-link px-5">Mon profil</a>
                                            </div>
                                            <div class="separator my-2"></div>
                                            <div class="menu-item px-5">
                                                <div class="menu-content px-5">
                                                    <label class="form-check form-switch form-check-custom form-check-solid pulse pulse-success" for="kt_user_menu_dark_mode_toggle">
                                                        <input class="form-check-input w-30px h-20px" type="checkbox" value="1" name="mode" id="kt_user_menu_dark_mode_toggle" data-kt-url="deconnexion.php" />
                                                        <span class="pulse-ring ms-n1"></span>
                                                        <span class="form-check-label text-gray-600 fs-7">Se déconnecter</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toolbar py-5 py-lg-15" id="kt_toolbar">
                    <div id="kt_toolbar_container" class="container-xxl d-flex flex-stack flex-wrap">
                        <div class="page-title d-flex flex-column me-3">
                            <h1 class="d-flex text-white fw-bolder ">Université Amadou Hampaté BA de Dakar</h1>
                            <ul class="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
                                <li class="breadcrumb-item text-white opacity-75">
                                    <a href="" class="text-white text-hover-primary"> Environnement Numérique de Travail</a>
                                </li>
                            </ul>
                        </div>
                        <div class="d-flex align-items-center py-3 py-md-1">
                            <!-- <h2 class="btn btn-bg-white btn-active-color-primary text-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_create_app" id="kt_toolbar_primary_button">Année académique : <span id="labelAnneeEnCours1"></span></h2> -->
                        </div>
                    </div>
                </div>
                <div id="kt_content_container" class="d-flex flex-column-fluid align-items-start container-xxl">
                    <div class="content flex-row-fluid" id="kt_content">
                        <div class="row g-5 g-xxl-8">
                            <div class="col-xl-4">
                                <div class="row mb-5 mb-xl-8 g-5 g-xl-8" id="unite_administrative_niv1">
                                    <div class="col-6">
                                        <div class="card card-stretch">
                                            <a href="" class="btn btn-flex btn-text-gray-800 btn-icon-gray-400 btn-active-color-primary bg-body flex-column justfiy-content-start align-items-start text-start w-100 p-10">
                                                <span class="svg-icon svg-icon-3x mb-5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M4.5 7C5.88071 7 7 5.88071 7 4.5C7 3.11929 5.88071 2 4.5 2C3.11929 2 2 3.11929 2 4.5C2 5.88071 3.11929 7 4.5 7Z" fill="black" />
                                                        <path opacity="0.3" d="M14 4.5C14 5.9 12.9 7 11.5 7C10.1 7 9 5.9 9 4.5C9 3.1 10.1 2 11.5 2C12.9 2 14 3.1 14 4.5ZM18.5 2C17.1 2 16 3.1 16 4.5C16 5.9 17.1 7 18.5 7C19.9 7 21 5.9 21 4.5C21 3.1 19.9 2 18.5 2ZM4.5 9C3.1 9 2 10.1 2 11.5C2 12.9 3.1 14 4.5 14C5.9 14 7 12.9 7 11.5C7 10.1 5.9 9 4.5 9ZM11.5 9C10.1 9 9 10.1 9 11.5C9 12.9 10.1 14 11.5 14C12.9 14 14 12.9 14 11.5C14 10.1 12.9 9 11.5 9ZM18.5 9C17.1 9 16 10.1 16 11.5C16 12.9 17.1 14 18.5 14C19.9 14 21 12.9 21 11.5C21 10.1 19.9 9 18.5 9ZM4.5 16C3.1 16 2 17.1 2 18.5C2 19.9 3.1 21 4.5 21C5.9 21 7 19.9 7 18.5C7 17.1 5.9 16 4.5 16ZM11.5 16C10.1 16 9 17.1 9 18.5C9 19.9 10.1 21 11.5 21C12.9 21 14 19.9 14 18.5C14 17.1 12.9 16 11.5 16ZM18.5 16C17.1 16 16 17.1 16 18.5C16 19.9 17.1 21 18.5 21C19.9 21 21 19.9 21 18.5C21 17.1 19.9 16 18.5 16Z" fill="black" />
                                                    </svg>
                                                </span>
                                                <span class="fs-4 fw-bolder">Acceuil</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="card card-stretch">
                                            <a href="TacheParDefaut" class="btn btn-flex btn-text-gray-800 btn-icon-gray-400 btn-active-color-primary bg-body flex-column justfiy-content-start align-items-start text-start w-100 p-10">
                                                <span class="svg-icon svg-icon-3x mb-5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
													<rect x="2" y="2" width="9" height="9" rx="2" fill="black" />
													<rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black" />
													<rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black" />
													<rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black" />
												</svg>
                                                </span>
                                                <span class="fs-4 fw-bolder">Par défaut</span>
                                            </a>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="col-xl-8 ps-xl-12">
                                <div class="card bgi-position-y-bottom bgi-position-x-end bgi-no-repeat bgi-size-cover min-h-250px bg-primary mb-5 mb-xl-8" style="background-position: center;background-size: cover;background-image:url('dist_assets/media/misc/24.jpg')">
                                    <div class="card-body d-flex flex-column justify-content-center">

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer py-4 d-flex flex-lg-column" id="kt_footer">
                    <div class="container-xxl d-flex flex-column flex-md-row align-items-center justify-content-between">
                        <div class="text-dark order-2 order-md-1">
                            <span class="text-muted fw-bold me-1">
                                <script type="text/javascript">
                                    document.write(new Date().getFullYear())
                                </script>©
                            </span>
                            <a href="https://uahb.sn/" target="_blank" class="text-gray-800 text-hover-primary">CRIAT</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
    console.log(<?php echo json_encode($_SESSION); ?>);
</script>

    <script src="dist_assets/plugins/global/plugins.bundle.js"></script>
    <script src="dist_assets/js/scripts.bundle.js"></script>
    <script src="dist_assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>
    <script src="dist_assets/js/custom/widgets.js"></script>
    <script src="dist_assets/js/custom/apps/chat/chat.js"></script>
    <script src="dist_assets/js/custom/modals/create-app.js"></script>
    <script src="dist_assets/js/custom/modals/upgrade-plan.js"></script>
    <!-- <script src="/scripts.bundle.14.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.0/dist/sweetalert2.all.min.js
    "></script>
    <script src="script.js"></script>
</body>

</html>