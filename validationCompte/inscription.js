

function createCompte(event) {
  event.preventDefault();

  // Déactivation du bouton de soumission
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.innerHTML = "Création du compte..."; // Changer le texte du bouton pour indiquer que le compte est en cours de création
  if (checkPasswordMatch() && validatePassword()) {
    console.log("Mot de passe valide et correspondance réussie !");
    let mat = document.getElementById("matricule").value;

    console.log(password)
    console.log(confirm)

    console.log("Matricule :", mat);

    const data = {
      action: "verification",
      matricule: mat,
      email: document.getElementById("email").value,
    };

    // Création de la query string à partir de l'objet data
    const queryString = new URLSearchParams(data).toString();

    // Requête Fetch vers le serveur
    fetch(
      `/authentification/authentification/createAcocunt?${queryString}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Traiter la réponse comme JSON
      })
      .then((result) => {
        // réactivation du bouton de soumission
        // submitButton.disabled = false;
        // submitButton.innerHTML = "Créer un compte"; // Rétablir le texte d'origine du bouton
        if (result.status == "unexist") {
          send(mat);

        } else if (result.status == "acountUnactivated") {
          // redirectToValidation("warning",mat, "Votre compte existe déjà, mais n'a pas était activé.\n Veuilez d'abord vérifier votre email pour l'activé !!");
          // send(mat);
Swal.fire({
            position: "center",
            icon: "info",
            title: result.message,
            showConfirmButton: true,
            didClose: () => {
              window.location.href = `/page-connexion`;
            }

          })
          // const timestamp = Math.floor(Date.now() / 1000);
          // const uniqueToken = btoa(`${mat}|${timestamp}`);
          // let msg = result.message
          // location.href = '/redirection?token=' + uniqueToken + '&message=' + msg;

        } else if (result.status == "updatePasswordExpired") {
          // redirectToValidation(matricule, "Votre compte a été activé avec succès, vous pouvez vous connecter maintenant .\nSi vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.");

          Swal.fire({
            position: "center",
            icon: "info",
            title: "Votre compte a été activé avec succès, vous pouvez vous connecter maintenant .\nSi vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.",
            showConfirmButton: true,
            didClose: () => {
              window.location.href = `/page-connexion`;
            }

          })
        } else if (!result.exist) {
          send(mat);
          Swal.fire({
            position: "center",
            icon: "success",
            title: result.message,
            showConfirmButton: true,
            showCancelButton: false,
            didClose: () => {
              window.location.href = '/authentification/api/validation/envoieMail';
            }
          })

        } else if (result.status == "mailIsSendAndNotUsed") {
          redirectToValidation("info", mat, "Votre compte a déjà été créé, mais il n'est pas activé. Veuillez vérifier votre boîte de réception pour le lien d'activation.");
          // Swal.fire({
          //   position: "center",
          //   icon: "info",
          //   title: result.message,
          //   showConfirmButton: true,
          //   didClose: () => {
          //       window.location.href = 'page-connexion';
          //       }

          // })
        } else if (result.status == "success" && result.exist) {
          // redirectToValidation(matricule, "Votre compte a été activé avec succès, vous pouvez vous connecter maintenant .\nSi vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.");

          Swal.fire({
            position: "center",
            icon: "info",
            title: "Ce compte existe déjà, vous pouvez vous connecter maintenant. Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.",
            showConfirmButton: true,
            showCancelButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              location.href = `/page-connexion`
            }
          });

        } else if (result.status == "validationLinkExpiredAndAccountNotValid") {
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Ce compte existe déjà et n'a pas été validé. Le lien de validation a expiré, veuiller demander un nouveau lien de validation.",
            showConfirmButton: true,
            showCancelButton: false,
            didClose: () => {
              window.location.href = '/authentification/api/validation/envoieMail';
            }
          })
        }
        else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: result.message,
            showConfirmButton: true,
            // timer: 1500,
          });
          // activation du bouton de soumission
           submitButton.disabled = false;
          submitButton.innerHTML = "Valider"; // Rétablir le texte d'origine du bouton
        }
        console.log("Result:", result); // Afficher le résultat dans la console
      })
      .catch((error) => {
        console.error("Error:", error); // Afficher les erreurs dans la console
      });
  } else if (checkPasswordMatch() && !validatePassword()) {
    submitButton.disabled = false;
    submitButton.innerHTML = "Valider";
    const passwordMessage = document.getElementById('passwordMessage');
    passwordMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    passwordMessage.style.color = "red";
  } else if (!checkPasswordMatch() && validatePassword()) {
    submitButton.disabled = false;
          submitButton.innerHTML = "Valider";
    const passwordMessage = document.getElementById('confirmPasswordMessage');
    passwordMessage.textContent = "Les mots de passe ne correspondent pas.";
    passwordMessage.style.color = "red";
  }

}
// Désactivation du bouton de soumission
function disableButton(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = true;
    button.innerHTML = text;
  }
}

// Réactivation du bouton de soumission
function enableButton(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = false;
    button.innerHTML = text;
  }
}
async function verification(event) {
  event.preventDefault();
  // déactivation du bouton de soumission
  
  try {
    const email = document.getElementById('email').value;
    const matricule = document.getElementById('matricule').value;
    const action = document.getElementById('action').value;

    console.log('Email:', email);
    console.log('Matricule:', matricule);

    const data = {
      action: "verification",
      matricule: matricule,
      email: email
    };

    const queryString = new URLSearchParams(data).toString();
    const response = await fetch(`../createAcocunt?${queryString}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Réponse du serveur:", result);
    
    // Gestion des différents statuts de réponse
    switch (result.status) {
      case "validationLinkExpiredAndAccountNotValid":
        const submitButtonId = "boutonReenvoiValidationMail";
        disableButton(submitButtonId, "Envoie mail...");
        if (action == "renouvellementValidation" && result.exist) {
          if (await send(matricule)) {
            // réactivation du bouton de soumission
           enableButton(submitButtonId, "valider");
            // const msg = "Veuillez vérifier votre boite mail afin de confirmer qu'il s'agit bien de vous et modifier votre mot de passe";
            // await redirectToValidation("warning", matricule, msg);
            const timestamp = Math.floor(Date.now() / 1000);
            const uniqueToken = btoa(`${matricule}|${timestamp}`);
            let msg = "Veuillez vérfier votre boite mail un email vous a été envoyé ."
            location.href = '/redirection?token=' + uniqueToken + '&message=' + msg;
          }
        }
        break;

      case "error":
        await Swal.fire({
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
        });
        break;

      case "invalid":
        const invalidResult = await Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
          showCancelButton: false,
        });
        if (invalidResult.isConfirmed) {
          location.href = 'page-connexion';
        }
        break;

      case "success":
        await send(matricule);
        await redirectToValidation("success", matricule,
          "Votre compte a été activé avec succès, vous pouvez vous connecter maintenant.\n" +
          "Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.");
        break;

      case "expired":
        await Swal.fire({
          position: "center",
          icon: "info",
          title: result.message,
          showConfirmButton: true,
        });
        await send(matricule);
        break;

      case "unexist":
        await Swal.fire({
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
        });
        break;

      case "updatePasswordExpired":
        await Swal.fire({
          position: "center",
          icon: "info",
          title: "Votre compte est déjà activé, vous pouvez vous connecter maintenant.\n" +
            "Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur 'Mot de passe oublié' sur la page de connexion.",
          showConfirmButton: true
        });
        break;
      case "acountUnactivated":
        if (email) {
          fetch(
            `/authentification/gestionCompte/sendmail?email=${email}&matricule=${matricule}`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              if (response.status === 200) {
                const timestamp = Math.floor(Date.now() / 1000);
                const uniqueToken = btoa(`${matricule}|${timestamp}`);
                let msg = "Veuillez vérfier votre boite mail un email vous a été envoyé ."
                location.href = '/redirection?token=' + uniqueToken + '&message=' + msg;

                console.log("Email envoyé avec succès !");
              }
              return response.json(); // Traiter la réponse comme JSON
            })
            .then((result) => {
              console.log("Result:", result); // Afficher le résultat dans la console
            })
            .catch((error) => {
              console.error("Error:", error); // Afficher les erreurs dans la console
            });
        }
        break;

      default:
        console.warn("Statut non géré:", result.status);

    }
  } catch (error) {
    console.error("Error:", error);
    await Swal.fire({
      position: "center",
      icon: "error",
      title: "Une erreur s'est produite",
      text: error.message,
      showConfirmButton: true,
    });
  }
}
function redirectToValidation(statuts, matricule, msg) {
  // Créer un formulaire HTML
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/redirection'; // URL de la page cible

  // Ajouter les champs nécessaires au formulaire
  const matriculeInput = document.createElement('input');
  matriculeInput.type = 'hidden';
  matriculeInput.name = 'matricule';
  matriculeInput.value = matricule;

  const msgInput = document.createElement('input');
  msgInput.type = 'hidden';
  msgInput.name = 'msg';
  msgInput.value = msg;

  const statusInput = document.createElement('input');
  statusInput.type = 'hidden';
  statusInput.name = 'status';
  statusInput.value = statuts;

  // Ajouter les champs au formulaire
  form.appendChild(matriculeInput);
  form.appendChild(msgInput);
  form.appendChild(statusInput);

  // Ajouter le formulaire au document et le soumettre
  document.body.appendChild(form);
  form.submit();
}
function send(mat) {
  // Envoi de la requête avec fetch
  fetch("/authentification/createAcocunt", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Déclare que les données envoyées sont de type URL-encoded
    },
    body: `matricule=${mat}`, // Envoi du matricule via le corps de la requête
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Traiter la réponse comme un JSON
    })
    .then((result) => {
      // console.log(result); // Afficher le résultat dans la console
      if (result[0].statut == "Error") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: result[0].Message,
          showConfirmButton: false,
          timer: 1500,
        });
		const submitButton = document.getElementById("submitButton");
        if (submitButton) {
          submitButton.disabled = false; 
          submitButton.innerHTML = "Valider"; // Rétablir le texte d'origine du bouton
        }
      } else if (result[0].statut == "Successful") {

        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: "Veuillez vérifiez votre boites mail pour confirmer qu'il s'agit bien de vous et valider votre compte",
        //   showCancelButton: false,
        //   showConfirmButton: true,
        //   // timer: 1500,
        //   didClose: () => {
        //     redirectToValidation("success",matricule, "Le lien de validation a été envoyé avec succès, veuillez vérifier votre boîte de réception et cliquer sur le lien pour valider votre compte.\nSi vous ne trouvez pas l'email, vérifiez votre dossier de spam ou de courrier indésirable.");
        //   }
        //   // confirmButtonText: "Yes, delete it!"
        // })

        const email = document.getElementById('email');
        if (result[0].email == email.value) {
          fetch(
            `/authentification/gestionCompte/sendmail?email=${email.value}&matricule=${mat}&nom=${result[0].nom}&prenom=${result[0].prenom}`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              if (response.status === 200) {
                console.log("Email envoyé avec succès !");
                const action = document.getElementById('action')
                if(action) {
                if(action.value == "renouvellementValidation") {
                  const timestamp = Math.floor(Date.now() / 1000);
                  const uniqueToken = btoa(`${mat}|${timestamp}`);
                  let msg = "Veuillez vérfier votre boite mail un email vous a été envoyé ."
                  location.href = '/redirection?token=' + uniqueToken + '&message=' + msg;

                }
              }
                show_info(result[0], mat);


              }
              return response.json(); // Traiter la réponse comme JSON
            })
            .then((result) => {
              console.log("Result:", result); // Afficher le résultat dans la console
            })
            .catch((error) => {
              console.error("Error:", error); // Afficher les erreurs dans la console
            });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ladresse mail ne correspond pas",
            text: "Veuillez saisir l'adresse mail correspondant au matricule",
            showConfirmButton: true,
          });
          const submitButton = document.getElementById("submitButton");
  if (submitButton) {
    submitButton.disabled = false; 
  submitButton.innerHTML = "Valider"; // Rétablir le texte d'origine du bouton
  }
        }
      }
      // if (result.error) {
      //   alert("Erreur : " + result.error);
      // } else {
      //   alert("Succès : " + JSON.stringify(result));
      // }
    })
    .catch((error) => {
      console.error("Error:", error); // Afficher les erreurs dans la console
    });
}

function show_info(data, matricule) {
  // vérifier si le bouton de soumission existe avant de le désactiver et est actif
  const submitButton = document.getElementById("submitButton");
  if (submitButton) {
    submitButton.disabled = false; 
  }
  pass = document.getElementById("password").value;
  let uniteAdministrative = (data.grade == 1 && data.idUniteAdministrativeNiv3 != null) ? data.idUniteAdministrativeNiv3 : null;
  let accountData = {
    action: "createAccount",
    matricule: matricule,
    email: data.email,
    identifiant: data.identifiant,
    password: pass,
    nom: data.nom,
    prenom: data.prenom,
    photo: data.photo,
    ecole: data.entite,
    idUniteAmindistrative: uniteAdministrative,
    entite: data.entite,
  };
  let queryString = new URLSearchParams(accountData).toString()
fetch('/authentification/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData)
}).then((response) => response.json()) // Traiter la réponse comme JSON
    .then((result) => {
      if (submitButton) {
        // vérifier si le bouton de soumission est actif avant de le désactiver
        if (submitButton.disabled) {
    
        enableButton("submitButton", "Création du compte...");
        }
      }
      console.log('La réponse du sereur pour la création de compte :' + result); // Afficher le résultat de la réponse (ex: message de succès)
      if (result.success) {

        const timestamp = Math.floor(Date.now() / 1000);
        const uniqueToken = btoa(`${matricule}|${timestamp}`);
        let msg = "Veuillez vérfier votre boite mail un email vous a été envoyé ."
        location.href = '/redirection?token=' + uniqueToken + '&message=' + msg;


      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Erreur lors de la mise à jour du compte !",
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi des données :", error);
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