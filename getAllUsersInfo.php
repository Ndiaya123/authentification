<?php
require_once 'config.php';

class MatriculeService
{
    private PDO $pdo;
    private string $apiUrl = 'https://test.uahb.sn/api_authentification_3';

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Récupère les utilisateurs avec toutes leurs informations
     */
    public function getUtilisateurs(): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM utilisateur where statutUtilisateur != 1");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Envoie une liste de matricules à l'API d'authentification
     */
    public function sendMatriculesToApi(array $matricules, string $sessionId = ''): array
    {
        // Validation des matricules
        $matricules = array_filter($matricules, function ($matricule) {
            return is_numeric($matricule) && $matricule > 0;
        });

        if (empty($matricules)) {
            throw new InvalidArgumentException("Aucun matricule valide à envoyer");
        }

        $payload = array_map(function ($matricule) {
            return ['matricule' => (int)$matricule];
        }, $matricules);

        $jsonPayload = json_encode($payload);
        if ($jsonPayload === false) {
            throw new RuntimeException("Erreur d'encodage JSON: " . json_last_error_msg());
        }

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        if (!empty($sessionId)) {
            $headers[] = 'Cookie: PHPSESSID=' . $sessionId;
        }

        $options = [
            'http' => [
                'method'  => 'POST',
                'header'  => implode("\r\n", $headers),
                'content' => $jsonPayload,
                'timeout' => 30,
                'ignore_errors' => true // permet de récupérer la réponse même en cas d'erreur HTTP
            ]
        ];

        $context = stream_context_create($options);

        $response = @file_get_contents($this->apiUrl, false, $context);
        if ($response === false) {
            $err = error_get_last();
            $message = $err['message'] ?? 'Erreur lors de la requête HTTP';
            throw new RuntimeException("Erreur HTTP: $message");
        }

        // Récupérer le code HTTP depuis $http_response_header
        $httpCode = 0;
        if (!empty($http_response_header) && preg_match('#HTTP/\d+\.\d+\s+(\d+)#', $http_response_header[0], $m)) {
            $httpCode = (int)$m[1];
        }

        if ($httpCode !== 200) {
            throw new RuntimeException("Erreur HTTP $httpCode");
        }

        $data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException("Erreur de décodage JSON: " . json_last_error_msg());
        }

        return $data;
    }

    /**
     * Fusionne les informations de la BDD avec celles de l'API en fonction de l'email
     */
    public function mergeData(array $utilisateurs, array $apiData, PDO $pdo): array
    {
        // Indexer les données API par email
        $userIndex = [];
        foreach ($utilisateurs as $utilisateur) {
            if (isset($utilisateur['email'])) {
                $userIndex[$utilisateur['email']] = $utilisateur;
            }
        }
        $result = [];
        foreach ($apiData as $apiUser) {
            $email = $apiUser['email'] ?? null;

            if ($email && isset($userIndex[$email])) {
                $utilisateur = $userIndex[$email];

                // Récupérer le nom de l’unité administrative en utilisant les IDs venant de l’API
                $nomUniteAdministrative = $this->getNomUniteAdministrative(
                    $pdo,
                    $apiUser['idUniteAdministrativeNiv1'] ?? null,
                    $apiUser['idUniteAdministrativeNiv2'] ?? null,
                    $apiUser['idUniteAdministrativeNiv3'] ?? null
                );

                // Ajouter le nom de l'unité dans l'utilisateur fusionné
                $utilisateur['uniteAdministrative'] = $nomUniteAdministrative;

                // Fusionner les deux tableaux (utilisateur + API)
                $result[] = array_merge($utilisateur, $apiUser);
            }
        }
        return $result;
    }

    /**
     * Récupère le nom de l'unité administrative en fonction du niveau
     */
    function getNomUniteAdministrative(PDO $pdo, ?int $idNiv1, ?int $idNiv2, ?int $idNiv3): ?string
    {
        if ($idNiv3 != null) {
            $stmt = $pdo->prepare("SELECT codeNiv3 FROM unite_administrative_niv3 WHERE id = :id");
            $stmt->execute(['id' => $idNiv3]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['codeNiv3'] ?? null;
        } elseif ($idNiv2 != null) {
            $stmt = $pdo->prepare("SELECT codeNiv2 FROM unite_administrative_niv2 WHERE id = :id");
            $stmt->execute(['id' => $idNiv2]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['codeNiv2'] ?? null;
        } elseif ($idNiv1 != null) {
            $stmt = $pdo->prepare("SELECT codeNiv1 FROM unite_administrative_niv1 WHERE id = :id");
            $stmt->execute(['id' => $idNiv1]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['codeNiv1'] ?? null;
        }

        // Aucun ID fourni
        return null;
    }
}
