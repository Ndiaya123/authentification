<?php
session_start();
require (__DIR__ . '/config.php');
$id = $_SESSION['id'];
historiqueUtilisateur($pdo,$id);
session_unset(); // Supprimer toutes les variables de session
session_destroy(); // Détruire la session
header('Location: page-connexion');

function historiqueUtilisateur($pdo,$id){
    try {
        $pdo->beginTransaction();
    
        // Première requête pour récupérer l'utilisateur
        $stmt1 = $pdo->prepare('SELECT identifiant, matricule, statutUtilisateur FROM utilisateur WHERE id = ?');
        $stmt1->execute([$id]);
        $user = $stmt1->fetch(PDO::FETCH_ASSOC);
    
        if ($user) {
            // Deuxième requête pour insérer dans l'historique
            $stmt2 = $pdo->prepare("INSERT INTO  historiqueutilisateurs (identifiant , matricule, statut, dateEnregistremenent,idUtilisateur) VALUES (?, ?, ?, ?,?)");
            $stmt2->execute([$user['identifiant'], $user['matricule'], $user['statutUtilisateur'], gmdate('Y-m-d H:i:s'),$id]);
        }
    
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
    }
exit;
?>
