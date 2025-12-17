<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // $email = $_GET['email'];
  $email = 'yacoubagassama127@gmail.com';
    $nom = $_GET['nom'];
    $prenom = $_GET['prenom'];

    $matricule = $_GET['matricule'] ?? null;
    $timestamp = time(); // Récupère le timestamp actuel
    $uniqueToken = base64_encode($matricule . '|' . $timestamp); // Concatène le matricule et le timestamp avec un séparateur
    if (isset($_GET['action']) && $_GET['action']) {
        $body = " <html>
        <head>
          <title>Modification de mot de passe</title>
        </head>
        <body>
          <h4>Bonjour $prenom $nom </h4>
          <p>Veuillez cliquer sur le bouton ci-dessous pour modifier votre mot de passe :</p>
          <a href='http://localhost/personnel_uahb/editPassword?token=$uniqueToken' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Modifier mon mot de passe</a>
          <p>Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :</p>
          <p>http://localhost/personnel_uahb/editPassword?token=$uniqueToken</p>
          <br>
          <p>Cordialement,<br>L'équipe de la CRIAT</p>
        </body>
        </html>";
        $subject = 'Modification de mot de passe';
    } else {
        $body = " <html>
        <head>
          <title>Validation de votre compte</title>
        </head>
        <body>
          <h4>Bonjour $prenom $nom </h4>
          <p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour valider votre compte :</p>
          <a href='http://localhost/personnel_uahb/page-validation/$uniqueToken' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Valider mon compte</a>
          <p>Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :</p>
          <p>http://localhost/personnel_uahb/page-validation/$uniqueToken</p>
          <br>
          <p>Cordialement,<br>L'équipe de la CRIAT</p>
        </body>
        </html>";
        $subject = 'Validation de compte';
    }
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);
    
    try {
        //Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'yacouba.gassama@uahb.sn';
        $mail->Password = 'mjiezgobmollufny';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        $mail->SMTPOptions = array(
        'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
        )
        );
        //Recipients
        $mail->setFrom('yacouba.gassama@uahb.sn', 'Yacouba Gassama');
        $mail->addAddress($email, $prenom.' '.$nom);     //Add a recipient
        
        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $body;
    
    if($mail->send()){
        require_once '../config.php';
        
        $stmt = $pdo->prepare('UPDATE utilisateur SET linkSendDate = ?,  	linkValid = 0 WHERE matricule = ?');
        $stmt->execute([gmdate('Y-m-d H:i:s'), $_GET['matricule']]);
        echo json_encode(['message' => 'Message has been sent']);
    }else{
        echo json_encode(['message' => 'Message failed !']);
    }
} catch (Exception $e) {
    echo json_encode(['message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
}
