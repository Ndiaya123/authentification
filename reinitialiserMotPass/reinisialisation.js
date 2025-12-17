function verification(event) {
  event.preventDefault();
  const email = document.getElementById('email').value
  const matricule = document.getElementById('matricule').value
  // Désactiver le bouton de soumission
  const submitButton = document.getElementById('envoieMailBTN');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span> En cours...
    `;
  }
  console.log('Email : ', email)
  console.log('Matricule : ', matricule)
  const data = {
    action: "verification",
    matricule: matricule,
    email: email
  };

  // Création de la query string à partir de l'objet data
  const queryString = new URLSearchParams(data).toString();

  // Requête Fetch vers le serveur
  fetch(
    `/authentification/gestionCompte/verification/${matricule}/${email}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
	if(submitButton) {
        submitButton.disabled = false; // Réactiver le bouton
        submitButton.innerHTML = 'valider'; // Restaurer le texte original
      }
      console.log("Réponse du serveur :", result);
      if (result.status == "error") {
        // send(mat);
        Swal.fire({
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
          // timer: 1500,
        });
      } else if (result.status == "invalid") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = 'page-connexion'
          }
        }
        );
      } else if (result.status == "success" || result.status == "updatePasswordExpired") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // connexion()
          }
        });
        // location.href = `./editPassword.php?matricule=${matricule}`
        // }else {
        // if(result.data[0].email == email){

        fetch(
          `/authentification/user/get_user/${matricule}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Traiter la réponse comme JSON
          }).then((result) => {
            console.log(result)
            sendMail(email, matricule, result[0].nom, result[0].prenom)
          })

        Swal.fire({
          position: "center",
          icon: "info",
          title: "Veuillez vérifier votre boite mail afin de confirmer qu'il s'agit bien de vous",
          showCancelButton: false,
          showConfirmButton: true,

          // confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            const timestamp = Math.floor(Date.now() / 1000);
const uniqueToken = btoa(`${matricule}|${timestamp}`);
let msg = "Veuillez vérfier votre boite mail un email vous a été envoyé ."
location.href = 'redirection?token=' + uniqueToken+'&message='+msg;            // connexion()
          }
        });

        // location.href = `./editPassword.php?matricule=${matricule}`
      } else if (result.status == "unexist") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
        });
      } else if (result.status == "validationLinkExpiredAndNotValid") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = 'validation/envoieMail'

          }
        });
      } else if (result.status == "acountUnactivated") {
        redirectToValidation(matricule, "Votre compte existe déjà, mais n'a pas était activé.\n Veuilez d'abord vérifier votre email pour l'activé !!");

        // Swal.fire({
        //   position: "center",
        //   icon: "info",
        //   title: result.message,
        //   showConfirmButton: true,
        //   showCancelButton: false,
        //   didClose: () => {
        //     window.location.href = 'page-connexion';
        //   }

        // })

      } else if (result.status == "validationLinkExpiredAndAccountNotValid") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
          didClose: () => {
            window.location.href = 'validation/envoieMail';
          }

        })
      }else if(result.status == "mailIsSendAndNotUsed"){
        Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
          didClose: () => {
            window.location.href = 'page-connexion';
          }

        })
      }
      console.log("Result:", result); // Afficher le résultat dans la console
    })
    .catch((error) => {
      console.error("Error:", error); // Afficher les erreurs dans la console
    });
}
function redirectToValidation(matricule, msg) {
  // Créer un formulaire HTML
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/page-validation'; // URL de la page cible

  // Ajouter les champs nécessaires au formulaire
  const matriculeInput = document.createElement('input');
  matriculeInput.type = 'hidden';
  matriculeInput.name = 'matricule';
  matriculeInput.value = matricule;

  const msgInput = document.createElement('input');
  msgInput.type = 'hidden';
  msgInput.name = 'msg';
  msgInput.value = msg;

  // Ajouter les champs au formulaire
  form.appendChild(matriculeInput);
  form.appendChild(msgInput);

  // Ajouter le formulaire au document et le soumettre
  document.body.appendChild(form);
  form.submit();
}
document.getElementById('formPassword').addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le rechargement de la page
  const passwordMessage = document.getElementById('passwordMessage');
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  // Décodage du token pour obtenir le matricule
  let matricule = null;
  try {
    const decodedToken = atob(token); // Décodage base64
    [matricule] = decodedToken.split('|'); // Extraction matricule
  } catch (e) {
    console.error('Erreur de décodage du token', e);
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Token invalide',
      showConfirmButton: true
    });
    return;
  }
  if (checkPasswordMatch() && validatePassword()) {
    // editPassword(password)
// déactivation du bouton de soumission
    const submitButton = document.getElementById('formPasswordBTN');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span> En cours...
      `;
    }

    const data = {
      action: "editPassword",
      matricule: document.getElementById('matricule').value,
      password: document.getElementById('password').value,
    };

    // Création de la query string à partir de l'objet data
    const queryString = new URLSearchParams(data).toString();

    // Requête Fetch vers le serveur
    fetch(
      `/authentification/gestionCompte/inscription/editPassword/${document.getElementById('matricule').value}/${document.getElementById('password').value}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json(); // Traiter la réponse comme JSON
      })
      .then((result) => {
	  // Réactivation du bouton de
        if (submitButton) {
          submitButton.disabled = false; // Réactiver le bouton
          submitButton.innerHTML = 'valider'; // Restaurer le texte original
        }
        console.log('Réponse du serveur :', result);
        if (result.status === 'defaultPasswordModified') {
          
            connexion()
        }else if(result.status === 'passwordModified'){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: result.message,
            showConfirmButton: true,
            // timer: 1500,
             didClose: () => {
             location.href = 'page-connexion'
             }
          })
        }else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: result.message,
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        console.error('Erreur :', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Une erreur est survenue.',
          showConfirmButton: true,
        });
      });
  } else if (checkPasswordMatch() && !validatePassword()) {
    passwordMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    passwordMessage.style.color = "red";
  } else if (!checkPasswordMatch() && validatePassword()) {
    const passwordMessage = document.getElementById('confirmPasswordMessage');
    passwordMessage.textContent = "Les mots de passe ne correspondent pas.";
    passwordMessage.style.color = "red";
  } else if (!checkPasswordMatch() && !validatePassword()) {
    passwordMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    passwordMessage.style.color = "red";
  } else if (!validatePassword()) {
    passwordMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    passwordMessage.style.color = "red";
  }
});

// Fonction pour obtenir l'ID depuis l'URL
function getIDFromURL() {
  // Exemple : URL = http://exemple.com/?id=encodedID
  const urlParams = new URLSearchParams(window.location.search);
  const matricule = urlParams.get("matricule"); // Récupère l'ID encodé

  return matricule

}

function sendMail(mail, mat, nom, prenom) {
  let data = {
    action: 'editPassword',
    email: mail,
    matricule: mat,
    nom: nom,
    prenom: prenom
  }
  let queryString = new URLSearchParams(data).toString()
  fetch(
    `/authentification/gestionCompte/sendmail?${queryString}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      location.href = 'page-connexion'
      console.log("Result:", result); // Afficher le résultat dans la console
    })
    .catch((error) => {
      console.error("Error:", error); // Afficher les erreurs dans la console
    });
}
function validatePassword() {
  var password = document.getElementById('password').value;
  var passwordMessage = document.getElementById('passwordMessage');
  var strengthMeter = document.querySelector('[data-kt-password-meter-control="highlight"]');

  // Regex patterns
  var weakPassword = /^.{1,7}$/; // Moins de 8 caractères
  var acceptablePassword = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/; // Au moins 8 caractères avec lettres et chiffres
  var acceptablePassword2 = /^(?=.*[a-zA-Z])(?=.*[@$!%*?&]).{8,}$/; // Au moins 8 caractères avec lettres et caractères spéciaux
  var mediumPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/; // Lettres, chiffres et caractères spéciaux
  var strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/; // Lettres majuscules, minuscules, chiffres et caractères spéciaux

  let strengthLevel = 0;

  if (strongPassword.test(password)) {
    passwordMessage.textContent = "Mot de passe solide.";
    passwordMessage.style.color = "green";
    strengthLevel = 4;
  } else if (mediumPassword.test(password)) {
    passwordMessage.textContent = "Mot de passe moyen.";
    passwordMessage.style.color = "orange";
    strengthLevel = 3;
  } else if (acceptablePassword.test(password) || acceptablePassword2.test(password)) {
    passwordMessage.textContent = "Mot de passe acceptable.";
    passwordMessage.style.color = "blue";
    strengthLevel = 2;
  } else if (weakPassword.test(password)) {
    passwordMessage.textContent = "Mot de passe trop faible.";
    passwordMessage.style.color = "red";
    strengthLevel = 1;
  } else {
    passwordMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    passwordMessage.style.color = "red";
    strengthLevel = 0;
  }

  // Mettre à jour l'affichage du niveau de sécurité
  if (strengthMeter) {
    strengthMeter.querySelectorAll('.bg-active-success').forEach((el, index) => {
      if (index < strengthLevel) {
        el.classList.add('bg-success');
        el.classList.remove('bg-secondary');
      } else {
        el.classList.remove('bg-success');
        el.classList.add('bg-secondary');
      }
    });
  }

  return strengthLevel >= 3; // Retourne true si le mot de passe est au moins de niveau 3
}

function checkPasswordMatch() {
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;
  var confirmPasswordMessage = document.getElementById('confirmPasswordMessage');

  if (password === confirmPassword && password !== "") {
    confirmPasswordMessage.textContent = "Les mots de passe correspondent.";
    confirmPasswordMessage.style.color = "green";
    return true;
  } else {
    confirmPasswordMessage.textContent = password === "" ? "Veuillez d'abord saisir un mot de passe." : "Les mots de passe ne correspondent pas.";
    confirmPasswordMessage.style.color = "red";
    return false;
  }
}
// Fonction pour gérer l'affichage/masquage du mot de passe
document.querySelectorAll('.show-hide2').forEach((toggle) => {
  toggle.addEventListener('click', function () {
    const input = this.previousElementSibling; // Champ de mot de passe associé
    const showIcon = this.querySelector('.show2');
    const hideIcon = this.querySelector('.hide');

    if (input.type === 'password') {
      input.type = 'text'; // Affiche le mot de passe
      showIcon.style.display = 'none'; // Cache l'icône "show"
      hideIcon.style.display = 'inline'; // Affiche l'icône "hide"
    } else {
      input.type = 'password'; // Masque le mot de passe
      showIcon.style.display = 'inline'; // Affiche l'icône "show"
      hideIcon.style.display = 'none'; // Cache l'icône "hide"
    }
  })
})
async function getEmailByMatricule() {
  try {
      // 1. Récupération et décodage sécurisé du matricule
      const urlParams = new URLSearchParams(window.location.search);
      // const matriculeBase64 = urlParams.get('matricule');
      
      // if (!matriculeBase64) {
      //     throw new Error('Paramètre matricule manquant dans l\'URL');
      // }

      // Décodage avec gestion des caractères spéciaux
      const matricule = document.getElementById('matricule').value;

      // 2. Préparation de la requête
      const params = new URLSearchParams({
          action: 'getEmailByMatricule',
          matricule: matricule
      });

      // 3. Exécution de la requête
      const response = await fetch(`/authentification/gestionCompte/inscription/getEmailByMatricule/${matricule}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json'
          }
      });

      // 4. Vérification de la réponse
      if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // 5. Traitement de la réponse
      const data = await response.json();
      
      if (!data.email) {
          throw new Error('Email non trouvé dans la réponse');
      }
      
      return data.email;

  } catch (error) {
      console.error('Erreur dans getEmailByMatricule:', error);
      throw error;
  }
}

async function connexion() {
  try {
      const mail = await getEmailByMatricule();
      const passInput = document.getElementById('password');
      
      if (!passInput) {
          throw new Error('Champ password non trouvé');
      }

      const data = {
          action: 'connexion',
          email: mail, // Utilisation directe de la valeur retournée (pas besoin de .value)
          password: passInput.value
      };

      const queryString = new URLSearchParams(data).toString();
      const response = await fetch(`/authentification/gestionCompte/connexion/connexion/${mail}/${passInput.value}`, {
          method: "GET"
      });

      if (!response.ok) {
          await Swal.fire({
              position: "center",
              icon: 'error',
              title: 'Mot de passe ou email incorrect !',
              showConfirmButton: true,
          });
          throw new Error("Network response was not ok");
      }

      const result = await response.json();
      
      if (response.redirected) {
          window.location.href = '../'+response.url;
          return;
      }

      if (result.status === 'success') {
          window.location.href = '../'+result.url;
      } else if (result.status === 'invalid' || result.status === 'defaultPass') {
          await Swal.fire({
              position: "center",
              icon: 'info',
              title: result.message,
              showConfirmButton: true,
          });
      } else {
          await Swal.fire({
              position: "center",
              icon: result.status,
              title: result.message,
              showConfirmButton: false,
              timer: 3000
          });
      }

  } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Vous pourriez ajouter une notification à l'utilisateur ici
  }
}