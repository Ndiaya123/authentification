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
    <link rel="shortcut icon" href="../dist_assets/media/logos/1.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <link href="../dist_assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="../dist_assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="../dist_assets/css/style.css" rel="stylesheet" type="text/css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body id="kt_body" class="bg-body-secondary">
    <div class="d-flex flex-column flex-root">
        <div class="d-flex flex-column flex-lg-row flex-column-fluid">
            <div class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
                <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                    <div class="w-lg-600px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                        <div class="fv-row mb-10 text-center">
                            <div class="alert alert-warning d-flex align-items-center p-5">
                                <span class="svg-icon svg-icon-warning svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Code/Info-circle.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <defs />
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <rect x="0" y="0" width="24" height="24" />
                                            <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10" />
                                            <rect fill="#000000" x="11" y="10" width="2" height="7" rx="1" />
                                            <rect fill="#000000" x="11" y="7" width="2" height="2" rx="1" />
                                        </g>
                                    </svg><!--end::Svg Icon--></span>
                                <span id="alertMessage" class="bold " style="font-weight: bold;">
                                    <?php
                                    session_start();
                                    // Vérifier si la session existe
                                    if (!isset($_SESSION['alert_message'])) {
                                        // Si la session n'existe pas, rediriger vers la page de connexion
                                        header('Location: page-connexion');
                                        exit();
                                    }
                                    // Récupérer le message d'alerte
                                    if (!empty($_SESSION['alert_message'])) {
                                        $alert = json_decode($_SESSION['alert_message'], true);
                                    ?>
                                        <p><?php echo htmlspecialchars('Message : ' . $alert['text'], ENT_QUOTES, 'UTF-8'); ?></p>
                                    <?php
                                    }
                                    // unset($_SESSION['alert_message']); // Nettoyer après utilisation
                                    // détruire la session
                                    session_destroy();
                                    ?>
                                </span>
                            </div>
                            <div id="button" class="text-center">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>

</html>