<?php
session_start();

// Vérifiez si une session est active
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // Déterminez la page d'accueil en fonction du statut de l'utilisateur
    $redirect_url = ($_SESSION['statutUtilisateur'] == 1) ? 'adminHome' : 'home';

    // Renvoyez une réponse JSON avec l'URL de redirection
    echo json_encode([
        'session_active' => true,
        'redirect_url' => $redirect_url,
        'id' => $_SESSION['statutUtilisateur']
    ]);
    exit();
}

// Si aucune session active, renvoyez une réponse JSON
$response = [
    'session_active' => false // La session n'est pas active
];

header('Content-Type: application/json');
echo json_encode($response);
?>