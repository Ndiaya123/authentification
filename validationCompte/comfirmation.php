<?php
// Destinataire
$to = "yacoubagassama127@gmail.com";

// Sujet du mail
$subject = "Validation de compte";

// Génération d'un lien unique (à personnaliser selon ton application)
$token = bin2hex(random_bytes(32));
$validationLink = "http://10.1.66.75/UAHB/personnel_uahb/gestionCompte/validation?token=" . $token;

// Message
$message = "
<html>
<head>
  <title>Validation de compte</title>
</head>
<body>
  <h1>Bienvenue sur notre site</h1>
  <p>Merci de créer un compte. Veuillez valider votre compte en cliquant sur le lien suivant :</p>
  <a href='$validationLink'>Valider mon compte</a>
</body>
</html>
";

// En-têtes pour l'e-mail HTML
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// En-têtes additionnels
$headers .= 'From: noreply@ton-site.com' . "\r\n";

// Envoi du mail
if(mail($to, $subject, $message, $headers)) {
    echo "E-mail de validation envoyé.";
} else {
    echo "Erreur lors de l'envoi du mail.";
}
?>
