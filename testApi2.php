<?php
session_start();
function getUtilisateursFusionnes(PDO $pdo): array
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
