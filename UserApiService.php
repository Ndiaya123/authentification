<?php
class UserApiService {
    private const API_URL = 'https://test.uahb.sn/api_authentification';
    private const BATCH_SIZE = 50;
    private const TIMEOUT = 8;

    /**
     * Récupère les infos de connexion pour plusieurs matricules
     */
    public static function getUsersInfoBatch(array $matricules): array {
        // Validation et nettoyage des inputs
        $validMatricules = array_filter(array_unique($matricules), function($m) {
            return is_string($m) && preg_match('/^[A-Z0-9]{4,20}$/i', $m);
        });

        if (empty($validMatricules)) {
            return [];
        }

        // Découpage en lots pour éviter les requêtes trop larges
        $chunks = array_chunk($validMatricules, self::BATCH_SIZE);
        $results = [];

        foreach ($chunks as $chunk) {
            $batchResults = self::callApiBatch($chunk);
            $results = array_merge($results, $batchResults);
        }

        return $results;
    }

    /**
     * Appel API batch optimisé
     */
    public static function callApiBatch(array $matricules): array {
        $postData = [
            'option' => 'batch_query',
            'matricules' => implode(',', $matricules),
            'timestamp' => time()
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => self::API_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => self::TIMEOUT,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'X-Requested-With: PHP-cURL'
            ],
            CURLOPT_FAILONERROR => true
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpCode !== 200) {
            error_log("API Batch Error - HTTP $httpCode");
            return [];
        }

        $data = json_decode($response, true) ?? [];

        // Formatage des résultats en tableau associatif [matricule => data]
        return array_reduce($data['users'] ?? [], function($carry, $user) {
            if (!empty($user['matricule'])) {
                $carry[$user['matricule']] = $user;
            }
            return $carry;
        }, []);
    }

    /**
     * Récupère les infos pour un seul matricule (wrapper du batch)
     */
    public static function getUserInfo(string $matricule): ?array {
        $results = self::getUsersInfoBatch([$matricule]);
        return $results[$matricule] ?? null;
    }
}