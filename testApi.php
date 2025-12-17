<?php
require_once 'getAllUsersInfo.php';
require_once 'config.php';

try {
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
    $resultats = $service->mergeData($utilisateurs, $apiData,$pdo);
    
    // 5. Afficher le résultat final
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $resultats,
        'count' => count($resultats)
    ], JSON_PRETTY_PRINT);

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Une erreur inattendue est survenue'], JSON_PRETTY_PRINT);
}
