<?php
session_start();
$id = $_GET['id'];
$url = "/ndiaya.php?action=get_taches&id_utilisateur=".$id;

// Initialiser une session cURL
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

echo $data;
?>
