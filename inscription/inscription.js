document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inscriptionForm");
    const submitButton = document.getElementById("submitInscriptionBTN");

    if (form && submitButton) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            // Désactiver le bouton
            submitButton.disabled = true;
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span> En cours...
            `;

        });
    }
});
function send(mat) {
  // Envoi de la requête avec fetch
  fetch('/authentification/createAcocunt', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Déclare que les données envoyées sont de type URL-encoded
    },
    body: `matricule=${mat}` // Envoi du matricule via le corps de la requête
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Traiter la réponse comme un JSON
  })
  .then((result) => {
    console.log(result); // Afficher le résultat dans la console
    if(result[0].statut == 'Error'){
      Swal.fire({
        position: "center",
        icon: "error",
        title: result[0].Message,
        showConfirmButton: true,
        // timer: 1500
      });
    }else if(result[0].statut == 'Successful'){
      // Swal.fire({
      //   position: "center",
      //   icon: "success",
      //   title: result[0].Message,
      //   showConfirmButton: false,
      //   timer: 1500
      // });
      const matVerificationFrom = document.getElementById("matVerificationFrom")
      matVerificationFrom.reset();
      show_info(result[0],mat)
    }
    // if (result.error) {
    //   alert("Erreur : " + result.error);
    // } else {
    //   alert("Succès : " + JSON.stringify(result));
    // }
  })
  .catch((error) => {
    console.error('Error:', error); // Afficher les erreurs dans la console
  });
}

function show_info(data, matricule) {
  var div = document.getElementById('info');
  var mat = document.getElementById('getMat');
  console.log(matricule);

  // Ajout des champs hidden si non existants
  let uniteAdministrative = (data.grade == 1 && data.idUniteAdministrativeNiv3 != null) ? data.idUniteAdministrativeNiv3 : null;
  let accountData = {
    matricule: matricule,
    email: data.email,
    identifiant: data.identifiant,
    password: '', // 'pass' n'est pas défini ici, à adapter selon votre logique
    nom: data.nom,
    prenom: data.prenom,
    photo: data.photo,
    ecole: data.entite,
    idUniteAmindistrative: uniteAdministrative,
    entite: data.entite,
  };

  const form = document.getElementById('inscriptionForm');
  if (form) {
    Object.entries(accountData).forEach(([key, value]) => {
      if (form.querySelector(`[name="${key}"]`) === null && value !== undefined && value !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });
  }

  if (div.style.display === 'none') {
    div.style.display = 'block';
    mat.style.display = 'none';
    document.getElementById('mat').value = matricule;
    document.getElementById('img').src = data.photo ?? 'dist_assets/media/avatars/blank.png';
    document.getElementById('nom').value = data.nom;
    document.getElementById('prenom').value = data.prenom;
    document.getElementById('identifiant').value = data.identifiant;
    document.getElementById('email2').value = data.email;
  } else {
    div.style.display = 'none';
    mat.style.display = 'block';
  }
}
function previous(event){
  event.preventDefault(); // Empêche le rechargement de la page
  var mat = document.getElementById('getMat');
  var div = document.getElementById('info');

  if (div.style.display === 'none') {
    div.style.display = 'block';
    mat.style.display = 'none';

  } else {
    div.style.display = 'none';
    mat.style.display = 'block';
  }
}

function inscription (event){
event.preventDefault()
}

function verification(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  let mat = document.getElementById('matricule').value;
  let email = document.getElementById('email').value;
  console.log('Matricule :', mat);
  
  const data = {
    action: 'verification',
    matricule: mat,
    email: email
  };
  
  // Création de la query string à partir de l'objet data
  const queryString = new URLSearchParams(data).toString();
  
  // Requête Fetch vers le serveur
  fetch(`/authentification/createAcocunt?${queryString}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      if(result.status == 'unexist'){
        send(mat)
      }else if(result.exist){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Ce compte est déjà crée !!!",
          showConfirmButton: true,
          // timer: 1500
        });
      }
      else{
        Swal.fire({
          position: "center",
          icon: "error",
          title: result.message,
          showConfirmButton: true,
          // timer: 1500
        });
      }
      console.log('Result:', result); // Afficher le résultat dans la console
    })
    .catch((error) => {
      console.error('Error:', error); // Afficher les erreurs dans la console
    });
}
document.getElementById('inscriptionForm').addEventListener('submit', function(event) {
  // Récupération des valeurs des champs et envoi de la requête
  event.preventDefault(); // Empêche le rechargement de la page
  let mat = document.getElementById('mat').value;
  let email = document.getElementById('email2').value;
  let nom = document.getElementById('nom').value;
  let prenom = document.getElementById('prenom').value;
  let identifiant = document.getElementById('identifiant').value;
  let password = document.getElementById('password').value;
  
  sendValidationEmail()
})
function sendValidationEmail() {

  let mat = document.getElementById('mat').value;
  let email = document.getElementById('email2').value;
  let nom = document.getElementById('nom').value;
  let prenom = document.getElementById('prenom').value;

// Récupérer les données du formulaire
const form = document.getElementById("inscriptionForm");
const formData = new FormData(form);

// Convertir FormData en objet pour affichage (optionnel)
const data = {};
formData.forEach((value, key) => {
    data[key] = value;
});
console.log("Données envoyées :", Object.fromEntries(formData));
  fetch('/authentification/api', {
    method: 'POST',
    body: formData, // Envoi des données du formulaire
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      console.log(result); // Afficher le résultat dans la console
      if (result.status == 'success') {
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: "L'inscription a été effectuée avec succès, l'agent doit vérrifier son adresse email afin de valider son compte.",
        //   confirmButtonText: "OK",
        //   showConfirmButton: true,
        //   didClose: () => {
        //     window.location.href = '../admin.php'
        //   }
        // })
      

  console.log('Matricule :', mat);
  
  const data = {
    action: 'verification',
    matricule: mat,
    email: email
  };
  
  // Envoi du mail de validation
  
  fetch(
    `/authentification/gestionCompte/sendmail?email=${email}&matricule=${mat}&nom=${nom}&prenom=${prenom}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.status === 200) {
        console.log("Email envoyé avec succès !");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "L'inscription a été effectuée avec succès, l'agent doit vérrifier son adresse email afin de valider son compte.",
          confirmButtonText: "OK",
          showConfirmButton: true,
          didClose: () => {
            window.location.href = 'general'
          }
        })

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
      title: result.message,
      showConfirmButton: true,
      // timer: 1500
    });
  }
})
.catch((error) => {
  console.error('Error:', error); // Afficher les erreurs dans la console
});
}