document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("add_tache");
  const form = document.getElementById("tacheForm");

  if (modal && form) {

    // Réinitialiser le formulaire lorsque le modal est fermé
    modal.addEventListener("hidden.bs.modal", function () {
      form.reset(); // Réinitialise tous les champs du formulaire
      const actionInput = form.querySelector('input[name="action"]');
      if (actionInput) {
        actionInput.value = "add_tache"; // Réinitialiser l'action à sa valeur par défaut
      }
      const idTypeTache = document.getElementById('idTypeTache');
      idTypeTache.value = ""
      
      const invalidFields = form.querySelectorAll(".is-invalid");
      invalidFields.forEach(field => field.classList.remove("is-invalid")); // Supprime les classes d'erreur
      document.getElementById("iconPreview").innerHTML = ""; // Réinitialise l'aperçu de l'icône
    });
  }

  const sousMenuModal = document.getElementById('service-modal')
  const addSousMenuForm = document.getElementById('addSousMenuForm')
  if(addSousMenuForm && sousMenuModal){
    sousMenuModal.addEventListener("hidden.bs.modal", function () {
      addSousMenuForm.reset(); // Réinitialise tous les champs du formulaire
            const selectedLi = addSousMenuForm.querySelector('.dropdown-item.active');
            addSousMenuForm.querySelector('#selectedIconId').classList.remove("is-invalid")
      addSousMenuForm.querySelector('#selectedIconId').value = '';
     
            if (selectedLi) {
              selectedLi.classList.remove('active');
            }
    })
  }
  //SIDEBAR
  const vihoTemple = document.getElementsByClassName('main-navbar');

  if (vihoTemple) {
    //fetchItemsForViho()
    // alert('Viho Temple !!!');
  } else {

    // fetchItems();
  }
  get_current_user()
  //Affichage des unité administrative de niveau 1 pour l'admin
  getIDFromURL();
  get_structure()
  //getQualification()
  //getTacheQualification()
});

// Fonction pour sélectionner l'icône
function selectIcon(iconId, element) {
  // Mettre à jour l'ID de l'icône sélectionnée dans le champ caché
  document.getElementById('selectedIconId').value = iconId;

  // Supprimer la classe 'active' de toutes les icônes
  const allIcons = document.querySelectorAll('.icon-item');
  allIcons.forEach(icon => icon.classList.remove('active'));

  // Ajouter la classe 'active' à l'icône sélectionnée
  element.classList.add('active');

  // Afficher une notification (optionnel)
  Swal.fire({
    icon: 'success',
    title: 'Icône sélectionnée',
    text: `Vous avez sélectionné l'icône avec l'ID ${iconId}.`
  });
}

// Ajout de sous menu
function addSousMenu(event) {
  event.preventDefault(); // Empêcher le rechargement de la page

  const nom = document.getElementById('nom').value; // Récupérer la valeur du nom
  const idIcon = document.getElementById('selectedIconId').value; // Récupérer l'ID de l'icône sélectionnée
  const form = event.target;
  if (!idIcon) {
    const iconInput = document.getElementById('selectedIconId');
    iconInput.classList.add('is-invalid'); // Ajoute une classe d'erreur si le champ est vide
    return;
  }
  if (!nom) {
    const nomInput = document.getElementById('nom');
    nomInput.classList.add('is-invalid'); // Ajoute une classe d'erreur si le champ est vide
  }
  if (nom && idIcon) {
    // Sélectionner tous les boutons de soumission des formulaires
    const submitButton = document.querySelector('.submitAddSousMenuButton');
    submitButton.disabled = true;

    // Optionnel : Ajouter un indicateur de chargement
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> En cours...';

    const data = {
      action: "add_sous_menu",
      nom: nom,
      idIcon: idIcon,
    };

    fetch("/authentification/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString()
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Utilisez `text()` pour inspecter la réponse brute
      })
      .then((result) => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText; // Réinitialiser le texte du bouton
        console.log('Résultat message:', result.message);
        if(result.status == 'success'){

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sous-menu ajouté avec succès",
            showConfirmButton: false,
            timer: 1500
          });
          window.location.reload()
          const modal = bootstrap.Modal.getInstance(document.getElementById("service-modal"));
          if (modal) {
            modal.hide(); // Ferme le modal si une instance existe
          }
          // déactiver le li qui est déjà sélectionné
          const selectedLi = document.querySelector('.dropdown-item.active');
          if (selectedLi) {
            selectedLi.classList.remove('active'); // Supprime la classe 'active' de l'icône sélectionnée
          }
          KTDatatablesSousMenu.init(); // Rafraîchir la liste des sous-menus
          form.reset();  // Réinitialise tous les champs du formulaire
          document.getElementById('selectedIconId').value = '';
        }else{
          Swal.fire({
            position: "center",
            icon: 'info',
            title: result.message,
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'ajout du sous-menu.',
        });
      });
  }
}
//Admin uniteAdministrativeNiv1
function decodeBase64(encodedString) {
  return atob(encodedString);
}

// Fonction qui s'exécute en fonction de l'ID
function executeBasedOnID(id) {
  let resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `ID Unite Administrative : ${id}`;

}

async function get_icon(id) {
  let icon = null;
  try {
    let response = await fetch("/authentification/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ action: "get_icon" }).toString()
    });

    let data = await response.json();

    data.icon.forEach((element) => {
      if (id == element.id_icon) {
        icon = element.icon;
      }
    });
    return icon;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'icône :', error);
  }
  return icon;
}


function sanitizeClassName(name) {
  // Remplace les espaces et autres caractères spéciaux par un tiret
  return name.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Fonction pour obtenir l'ID depuis l'URL
function getIDFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedID = urlParams.get('id'); // Récupère l'ID encodé
  if (encodedID) {
    const decodedID = decodeBase64(encodedID); // Décoder l'ID
    executeBasedOnID(decodedID); // Exécuter la fonction en fonction de l'ID
  }
}
//Affichage
function get_structure() {
  fetch('/authentification/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ action: 'get_structure' }).toString()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((data) => {
      const uniteElement = document.getElementById('unite_administrative_niv1');
      const kt_header_menu = document.getElementById('#kt_header_menu')
      if (!uniteElement) {
        return; // Arrête l'exécution de la fonction si l'élément n'existe pas
      }
      uniteElement.innerHTML += '';
      kt_header_menu.innerHTML += ''

      // Parcourir les données pour ajouter les éléments à la page
      data.forEach((element) => {
        // console.log(btoa('UAHB/personnel_uahb/acceuilAdmin.php/element.id'));
        let urlencoded = btoa(`${element.id}`)
        let url = `uniteAdministrative?id=${urlencoded}`
        // console.log('URL : ',url)
        let urldecoded = atob(urlencoded);
        // console.log(urldecoded);
        uniteElement.innerHTML += `
          <div class="col-6">
              <div class="card card-stretch">
                  <a href="${url}" class="btn btn-flex btn-text-gray-800 btn-icon-gray-400 btn-active-color-primary bg-body flex-column justfiy-content-start align-items-start text-start w-100 p-10">
                      ${element.icon}
                      <span class="fs-4 fw-bolder">${element.codeNiv1}</span>
                  </a>
              </div>
          </div>
        `;
        kt_header_menu.innerHTML += `
        <div  class="menu-item menu-lg-down-accordion me-lg-1">
            <a class="menu-link py-3" href="${url}">
                <span class="menu-title">${element.codeNiv1}</span>
                <span class="menu-arrow d-lg-none"></span>
            </a>

        </div>
        `
      });
    })
    .catch((error) => {
      console.error('Error:', error); // Afficher les erreurs dans la console
    });
}

function get_current_user() {
  const data = {
    action: 'current_user',
  };

  fetch('/authentification/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data).toString()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      console.log(result)
      console.log('Post à responsabilité : ', result[0].PosteAResponsabilite)

      if (result && result.length > 0 && result[0].photo) {
        if (result[0].idUniteAdministrativeNiv1 != null) {
          if (result[0].PosteAResponsabilite == 'OUI') {
            console.log(' Chef de l\'unité administrative de niveau 1 ')
          } else {
            console.log('Agent de l\'unité administrative de niveau 1 ')
          }
          console.log('Unité Administrative de niveau 1 ', result[0].idUniteAdministrativeNiv1)
        } else if (result[0].idUniteAdministrativeNiv2 != null) {
          if (result[0].PosteAResponsabilite == 'OUI') {
            console.log(' Chef de l\'unité administrative de niveau 2 ')
          } else {
            console.log('Agent de l\'unité administrative de niveau 2 ')
          }
          console.log('Unité Administrative de niveau 2 ', result[0].idUniteAdministrativeNiv2)
        } else if (result[0].idUniteAdministrativeNiv3 != null) {
          if (result[0].PosteAResponsabilite == 'OUI') {
            console.log(' Chef de l\'unité administrative de niveau 3 ')
          } else {
            console.log('Agent de l\'unité administrative de niveau 3 ')
          }
          console.log('Unité Administrative de niveau 3 ', result[0].idUniteAdministrativeNiv3)
        }
        // Vérifie si l'objet a bien une propriété 'photo'
        document.getElementById('photo1').src = result[0].photo;
        document.getElementById('photo').src = result[0].photo;
        document.getElementById('nom').innerHTML = result[0].nom;
        console.log('Photo : ', result[0].photo); // Afficher le chemin de l'image dans la console
      } else {
        document.getElementById('photo1').src = './dist_assets/media/avatars/blank.png';
        document.getElementById('photo').src = './dist_assets/media/avatars/blank.png';
        // console.error('Erreur : Photo non trouvée dans la réponse');
      }
    })
    .catch((error) => {
      // console.error('Error:', error); // Afficher les erreurs dans la console
    });
}
const urlInput = document.getElementById("urlInput");

if (urlInput) {

  urlInput.addEventListener("input", function () {
    const urlValue = urlInput.value.trim();
    const feedback = document.getElementById("validationUrlFeedback");

    // Expression régulière Unicode pour accepter les lettres accentuées (domaines et chemins)
    // Utilise le flag 'u' pour les propriétés Unicode (\p{L} = lettres, \p{N} = chiffres)
    const urlRegex = /^(https?:\/\/)?([\p{L}\p{N}_-]+\.)+[\p{L}\p{N}_-]{2,}(\/[\p{L}\p{N}\-._~:/?#[\]@!$&'()*+,;=%]*)?$/u;

    if (urlRegex.test(urlValue)) {
      urlInput.classList.remove("is-invalid");
      urlInput.classList.add("is-valid");
      if (feedback) feedback.textContent = "URL valide !";
    } else {
      urlInput.classList.remove("is-valid");
      urlInput.classList.add("is-invalid");
      if (feedback) feedback.textContent = "URL invalide !";
    }
  });
}
function submitForm() {

  const form = document.getElementById('tacheForm');
  // vérifier si les champs obligatoires contenant l'attribut required sont remplis
  const requiredFields = form.querySelectorAll('[required]');
  let allFieldsFilled = true;
  requiredFields.forEach(field => {
    if (!field.value) {
      allFieldsFilled = false;
      field.classList.add('is-invalid'); // Ajoute une classe d'erreur si le champ est vide
    } else {
      field.classList.remove('is-invalid'); // Supprime la classe d'erreur si le champ est rempli
    }
  })
  const typeTache = document.getElementById('type_tache').value;
  if (typeTache == 1) {
    const niveauUA = document.getElementById('nivUA').value;
    const id_UA = document.getElementById('id_UA').value;
    if (!niveauUA) {
      allFieldsFilled = false;
      document.getElementById('nivUA').classList.add('is-invalid');
    }
    if (!id_UA) {
      allFieldsFilled = false;
      document.getElementById('id_UA').classList.add('is-invalid');
    }
  }
  if (typeTache == 2) {
    const fonction = document.getElementById('id_fonction');
    if (fonction) {
      if (fonction.value.trim() === "") {
        allFieldsFilled = false;
        fonction.classList.add('is-invalid');
        return;
      } else {
        allFieldsFilled = true
        fonction.classList.remove('is-invalid');

      }
    }
  }
  const id_icon_tache = document.getElementById('id_icon_tache');
  const idSousMenu = document.getElementById('idSousMenu');
  // Si le sous-menu est vide, rendre id_icon_tache requis
  if (id_icon_tache) {
    if (!idSousMenu.value) {
      id_icon_tache.setAttribute('required', 'required');
    } else {
      id_icon_tache.removeAttribute('required');
    }
  }
  // Les deux champs doivent être remplis (non vides)
  if (!id_icon_tache.value && !idSousMenu.value) {
    allFieldsFilled = false;
 
    if (!id_icon_tache.value) {
      id_icon_tache.classList.add('is-invalid');
    } else {
      id_icon_tache.classList.remove('is-invalid');
    }
   return;
  } else {
    id_icon_tache.classList.remove('is-invalid');
  }

  if (!form) {
    console.error("Formulaire introuvable !");
    return;
  }

  // Créer un objet FormData pour récupérer les champs du formulaire
  const formData = new FormData(form);

  // Convertir FormData en objet simple
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  if (data.idTypeTache == 3) {
    data.niveau_UA = null; // Réinitialiser le niveau UA
    const niveauUA = document.getElementById('nivUA');
    const id_UA = document.getElementById('id_UA');
    if (!niveauUA) {

      allFieldsFilled = true;
    }
    if (!id_UA) {
      allFieldsFilled = true;
    }

  }
  // Validation de l'URL
  const urlInput = document.getElementById("urlInput");
  const urlRegex = /^(https?:\/\/)?([\p{L}\p{N}_-]+\.)+[\p{L}\p{N}_-]{2,}(\/[\p{L}\p{N}\-._~:/?#[\]@!$&'()*+,;=%]*)?$/u;
  if (urlInput) {
    const urlValue = urlInput.value.trim();
    if (!urlRegex.test(urlValue)) {
      allFieldsFilled = false;
      urlInput.classList.add('is-invalid');
      const feedback = document.getElementById('validationUrlFeedback');
      if (feedback) feedback.textContent = "Veuillez entrer une URL valide.";
    } else {
      urlInput.classList.remove('is-invalid');
      urlInput.classList.add('is-valid');
    }
  }
  console.log("Données envoyées :", data);
  console.log("Type de tâche :", data.idTypeTache);
  console.log("Tous les champs remplis :", allFieldsFilled);


  if (allFieldsFilled) {

    const submitButton = document.querySelector('.submitButton');
    submitButton.disabled = true;

    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> En cours...';

    const queryString = new URLSearchParams(data).toString();

    fetch('/authentification/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString()
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json(); // Traiter la réponse comme JSON
    })
      .then(result => {
        console.log("Réponse du serveur :", result);
        submitButton.disabled = false;
        submitButton.innerHTML = originalText; // Réinitialiser le texte du bouton
        if (result.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: result.message || "Tâche ajoutée avec succès !",
            showConfirmButton: false,
            timer: 1500
          });
window.location.reload()
          // Réinitialiser le formulaire
          form.reset();

          // Fermer le modal
          const modal = bootstrap.Modal.getInstance(document.getElementById("add_tache"));
          if (modal) {
            modal.hide();
          }

          // Rafraîchir la liste des tâches
          KTDatatablesTache.init();
          KTDatatablesTacheQualification.init();
          getTacheQualification();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: result.message || "Une erreur est survenue lors de l'ajout de la tâche.",
          });
        }
      })
      .catch(error => {
        console.error("Erreur lors de la requête :", error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur est survenue lors de la soumission du formulaire.",
        });
      });
  }
}
//Choix type tache
async function type_tache(choix) {
  const niveauUAElement = document.getElementById('niveau_UA');

  const selected_UA = document.getElementById('selected_UA');
  selected_UA.innerHTML = ''; // Réinitialise le contenu de l'élément
  niveauUAElement.style.display = 'none'; // Affiche l'élément
  if ( choix == 1) {
    niveauUAElement.style.display = 'block'; // Masque l'élément
    niveauUAElement.innerHTML = `
                                <label class="form-label">Unite Administrative</label>

    <select name="niveau_UA" id="nivUA" class="form-select" required aria-label="select example"  onchange="get_UA(this.value)" >
                                    <option value="">Selectionner un niveau</option>
                                    <option value="1">Niveau 1</option>
                                    <option value="2">Niveau 2</option>
                                    <option value="3">Niveau 3</option>

                                </select>
<div class="invalid-feedback">Veuillez choisir le niveau de l'unité administrative.</div>
    `
  }
  if (choix == 2){
      document.getElementById('id_fonction').setAttribute('required', 'required');
        document.getElementById('selected_fonction').classList.remove('d-none')
  }else{
    document.getElementById('id_fonction').removeAttribute('required');
    document.getElementById('selected_fonction').classList.add('d-none');
  }
 

  console.log(choix);
}
// récupération des qualifications avec la methode POST
function getQualification() {
  const container = document.getElementById('selected_qualification');
  if (!container) {
    console.error('Élément #selected_qualification non trouvé');
    return;
  }
  // container.classList.remove('d-none'); // Supprime la classe d-none pour afficher le conteneur
  const data = { action: 'get_qualification' };

  fetch('/authentification/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data).toString()
  }).then((response) => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
    .then((data) => {
      console.log('Résultat reçu :', data);


      let selectHTML = document.getElementById('id_qualification').innerHTML;

      data.forEach(item => {
        selectHTML += `<option value="${item.id}">${item.qualification}</option>`;
      });

    })
    .catch((error) => {
      console.error('Erreur lors du fetch :', error);
    });
}


//Affichage des elements de l'unité administrative correspondant
function get_UA(UA_value) {
  const selected_UA = document.getElementById('selected_UA');
  selected_UA.innerHTML = ''; // Réinitialise le contenu de l'élément

  const select = document.createElement('select');
  select.classList.add('form-control'); // Ajoute la classe au select
  // Ajouter l'attribut id à l'élément select
  select.setAttribute('id', 'id_UA'); // Ajoute l'ID à l'élément select

  // Rendre le champ obligatoire

  select.name = 'id_UA'
  select.setAttribute('required', 'required'); // Rendre le champ obligatoire
  select.innerHTML = `
  <option value="">Selectionner une unité administrative</option>`; // Ajoute une option par défaut
  let data = {
    action: 'get_UA',
    niveau: UA_value, // Peut-être 1, 2, ou 3
  };

  fetch('/authentification/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data).toString()
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
    .then((data) => {
      console.log(data);

      // Traiter les données en fonction du niveau reçu
      data.forEach((element) => {
        if (element.sans == 0 ) {
          
          const option = document.createElement('option');
          option.classList.add('form-control'); // Ajoute la classe au select
          option.setAttribute('required', ''); // Rendre le champ obligatoire
          
          
          
          // Affiche des informations distinctes en fonction du niveau
          if (UA_value == 1) {
            option.value = element.id;
            option.innerHTML = element.niveau1;
          } else if (UA_value == 2) {
            option.value = element.id;
            option.innerHTML = element.niveau2;
          } else if (UA_value == 3) {
            option.value = element.id;
            option.innerHTML = element.niveau3;
          }
          console.log(option.value)
          select.appendChild(option);
        }
      });

      selected_UA.appendChild(select); // Ajoute le select au DOM une fois qu'il est complet
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// async function get_user_compte() {
//   const data = {
//     action: "get_agent",
//   };

//   const queryString = new URLSearchParams(data).toString();
//   const tbody = document.getElementById("utilisateur");

//   try {
//     // Afficher un indicateur de chargement
//     tbody.innerHTML = "<tr><td colspan='8'>Chargement...</td></tr>";

//     const response = await fetch(`controller.php?${queryString}`);
//     const result = await response.json();

//     // Réinitialiser le contenu du tableau
//     tbody.innerHTML = "";

//     // Construire les lignes du tableau
//     const rows = result.utilisateur.map((element) => {
//       const accessClass = element.access == 1 ? "badge badge-light-success" : "badge badge-light-danger";
//       const etat = element.access == 1 ? "débloqué" : "bloqué";
//       const changeAccess = element.access == 1
//         ? `<input class="form-check-input" type="checkbox" onchange='alerte(${element.id},${element.access})' checked>`
//         : `<input class="form-check-input" type="checkbox" onchange='alerte(${element.id},${element.access})'>`;

//       return `
//         <tr>
//           <td class="cursor-pointer symbol symbol-30px symbol-md-40px"><img src="" id="photo-${element.id}"></img></td>
//           <td>${element.email}</td>
//           <td id="responsabilite-${element.id}"></td>
//           <td id="Niveau-${element.id}"></td>
//           <td id="UniteAdministrative-${element.id}"></td>
//           <td>${element.matricule}</td>
//           <td>${element.identifiant}</td>
//           <td>
//             <span class="${accessClass} w-50">${etat}</span>
//             <input type="hidden" name="action" value="change_etat_compte">
//             ${changeAccess}
//           </td>
//         </tr>
//       `;
//     }).join("");

//     tbody.innerHTML = rows;

//     // Appeler `get_user` pour chaque utilisateur si nécessaire
//     result.utilisateur.forEach((element) => {
//       get_user(element.matricule, element.id);
//     });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des utilisateurs :", error);
//     tbody.innerHTML = "<tr><td colspan='8'>Erreur lors du chargement des données.</td></tr>";
//   }
// }
var KTDatatablesServerSide = function () {
  var dt;

  function initDatatable(subject) {
    // Vérifiez si DataTables est déjà initialisé
    if ($.fn.DataTable.isDataTable('#kt_table_user')) {
      // Détruisez l'instance existante
      $('#kt_table_user').DataTable().destroy();
      $('#kt_table_user tbody').empty();
    }

    // Initialisez DataTables avec des valeurs par défaut
    dt = $("#kt_table_user").DataTable({
      responsive: true,
      ajax: {
        url: `api/get_agent`,
        method: 'GET',
        dataSrc: function (response) {
          console.log("Données reçues :", response);
          return response.map(item => {
            // Détermination du niveau et de l'unité administrative
            let niveau = '';
            let unite_administrative = '';
            if (item.idUniteAdministrativeNiv1) {
              niveau = 'Niveau 1';
              unite_administrative = item.uniteAdministrative || '';
            } else if (item.idUniteAdministrativeNiv2) {
              niveau = 'Niveau 2';
              unite_administrative = item.uniteAdministrative || '';
            } else if (item.idUniteAdministrativeNiv3) {
              niveau = 'Niveau 3';
              unite_administrative = item.uniteAdministrative || '';
            }

            return {
              id: item.id || '',
              nomComplet: item.prenom+' '+item.nom || '',
              // prenom: item.prenom || '',
              email: item.email || '',
              qualification: item.qualification || '',
              niveau: niveau,
              photo: item.photo || null,
              unite_administrative: unite_administrative,
              matricule: item.matricule || '',
              identifiant: item.identifiant || '',
              access: item.access || 0,
              grade: item.grade,
              sans: item.sans
            };
          });
        }
      },

      columns: [
        {
              data: "photo",
              render: function (data, type, row) {
                // Vérifier si la photo est définie, sinon utiliser l'URL par défaut
                let photoUrl = './dist_assets/media/avatars/blank.png';
                if (data) {
                  photoUrl = data;
                }
                return `<img src="${photoUrl}" id="photo-${row.id}" class="symbol symbol-30px symbol-md-40px" style="width: 50px; height: 50px; object-fit: cover;"/>`;
              }
            },
        {data: "nomComplet" , title:"Nom Complet"},
        // {data: "nom" , title:"Nom"},
        { data: "email" },
        {
          data: "qualification",
          render: function (data, type, row) {
            return `<span id="responsabilite-${row.id}">${data}</span>`;
          }
        },
        {
          data: "grade",
          render: function (data, type, row) {
            if(row.grade == 1 && row.sans == 1){

              return `<span >Directeur</span>`;
            }else if(row.grade == 1 && row.sans == 0){
              return `<span >Chef </span>`;
            }else{
              return `<span >Agent </span>`;
            }
          }
        },
        {
          data: "unite_administrative",
          render: function (data, type, row) {
            return `<span id="UniteAdministrative-${row.id}">${data}</span>`;
          }
        },
        { data: "matricule" },
        { data: "identifiant" },
        {
          data: "access",
          render: function (data, type, row) {
            let accessClass;
            let etat;
            let buttons = "";

            if (data == 0) {
              accessClass = "badge badge-light-danger";
              etat = "Compte bloqué";
              buttons = `
            <button class="btn btn-sm btn-outline-success m-1" onclick='alerte(${row.id}, ${data})'>
            <span class="svg-icon svg-icon-primary svg-icon-2x"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
    <title>Débloquer le compte</title>
    <desc>Débloquer le compte.</desc>
    <defs/>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect x="0" y="0" width="24" height="24"/>
        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
        <path d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z" fill="#000000" fill-rule="nonzero"/>
    </g>
</svg></span>
           Débloquer le compte </button>
        `;
            } else if (data == 1) {
              accessClass = "badge badge-light-success";
              etat = "Compte valide";
              buttons = `
            <button class="btn btn-sm btn-outline-danger m-1" onclick='alerte(${row.id}, ${data})'>
            <span class="svg-icon svg-icon-danger svg-icon-2x"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
    <title>Bloquer le compte</title>
    <desc>Bloquer le compte.</desc>
    <defs/>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect x="0" y="0" width="24" height="24"/>
        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
        <path d="M12.0355339,10.6213203 L14.863961,7.79289322 C15.2544853,7.40236893 15.8876503,7.40236893 16.2781746,7.79289322 C16.6686989,8.18341751 16.6686989,8.81658249 16.2781746,9.20710678 L13.4497475,12.0355339 L16.2781746,14.863961 C16.6686989,15.2544853 16.6686989,15.8876503 16.2781746,16.2781746 C15.8876503,16.6686989 15.2544853,16.6686989 14.863961,16.2781746 L12.0355339,13.4497475 L9.20710678,16.2781746 C8.81658249,16.6686989 8.18341751,16.6686989 7.79289322,16.2781746 C7.40236893,15.8876503 7.40236893,15.2544853 7.79289322,14.863961 L10.6213203,12.0355339 L7.79289322,9.20710678 C7.40236893,8.81658249 7.40236893,8.18341751 7.79289322,7.79289322 C8.18341751,7.40236893 8.81658249,7.40236893 9.20710678,7.79289322 L12.0355339,10.6213203 Z" fill="#000000"/>
    </g>
</svg></span>
            Bloquer le compte</button>
        `;
            } else if (data == 2) {
              accessClass = "badge badge-light-warning";
              etat = "default";
              buttons = ""; // Aucun bouton dans ce cas
            }

            return `
        <div class="d-flex align-items-center justify-content-center">
        <input type="hidden" name="action" value="change_etat_compte">
        <span class="${accessClass} mb-1">${etat}</span>
        ${buttons}
        </div>
    `;
          }
        }
      ],
      columnDefs: [
        {
          targets: [1, 2, 3, 4, 5, 6],
          searchable: true,
        }
      ],
      language: {
        lengthMenu: "Afficher _MENU_",
        zeroRecords: "Aucun service trouvé",
        info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        infoEmpty: "Aucune entrée disponible",
        infoFiltered: "(filtré à partir de _MAX_ entrées totales)",
        search: `<span class="svg-icon svg-icon-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                        <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                    </svg>
                </span>`,
        searchPlaceholder: "Rechercher...",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Suivant",
          previous: "Précédent"
        }
      },
      paging: true,
      pageLength: 10,
      lengthMenu: [5, 10, 20],
      dom: 'ftlip',
      drawCallback: function (settings) {
        const api = this.api();
        api.rows({ page: 'current' }).data().each(function (rowData) {
          // Plus besoin d'appeler get_user ici, tout est déjà dans la ligne
        });
      },
    });
  }

  return {
    init: function (subject = '') {
      initDatatable(subject);
    }
  };
}();

// Initialisation
KTDatatablesServerSide.init();

function get_user(matricule, id) {
  const data = {
    action: 'get_user',
    matricule: matricule
  };
  let photo
  // Création de la query string à partir de l'objet data
  const queryString = new URLSearchParams(data).toString();

  // Requête Fetch vers le serveur
  fetch(`/authentification/user/get_user/${matricule}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      // console.log(result[0].photo)
      photo = result[0].photo
      document.getElementById(`photo-${id}`).src = result[0].photo ? result[0].photo : './dist_assets/media/avatars/blank.png';
      document.getElementById(`responsabilite-${id}`).innerHTML = result[0].PosteAResponsabilite
      if (result[0].statutPoste == 1) {
        document.getElementById(`UniteAdministrative-${id}`).innerHTML = 'Directeur'
      } else if (result[0].statutPoste == 2) {
        document.getElementById(`UniteAdministrative-${id}`).innerHTML = 'Chef'
      } else if (result[0].statutPoste == 3) {

        document.getElementById(`UniteAdministrative-${id}`).innerHTML = 'Agent'

      }
      if (result[0].idUniteAdministrativeNiv2 != null) {
        getUniteAdministrative(result[0].idUniteAdministrativeNiv2, 2, id)
        document.getElementById(`Niveau-${id}`).innerHTML = 'niveau 2'
      } else if (result[0].idUniteAdministrativeNiv3 != null) {
        document.getElementById(`Niveau-${id}`).innerHTML = 'niveau 3'

        getUniteAdministrative(result[0].idUniteAdministrativeNiv3, 3, id)
        document.getElementById(`Niveau-${id}`).innerHTML = getUniteAdministrative(result[0].idUniteAdministrativeNiv3, 3)
      }
    }
    )
}
// setupSearch('searchTacheInput', 'kt_table_tache', [1, 2, 3, 4, 5]); // Appel de la fonction de recherche
// setupSearch('searchInput', 'kt_table_user', [1, 2, 3, 4, 5, 6]); // Appel de la fonction de recherche
// setupSearch('searchSousMenuInput', 'kt_table_sous_menu', [2]); // Appel de la fonction de recherche

function setupSearch(inputId, tableId, columnIndices) {
  const searchInput = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!searchInput || !table) {
    console.error(`Input ou tableau introuvable : ${inputId}, ${tableId}`);
    return;
  }

  searchInput.addEventListener('input', function () {
    const searchValue = this.value.toLowerCase().trim(); // Convertir la valeur en minuscule et supprimer les espaces inutiles
    const rows = table.querySelectorAll('tbody tr'); // Sélectionner toutes les lignes du tableau

    rows.forEach(row => {
      let match = false; // Indicateur pour savoir si une colonne correspond
      columnIndices.forEach(index => {
        const cell = row.querySelector(`td:nth-child(${index})`); // Sélectionner la colonne spécifiée
        if (cell) {
          const cellText = cell.textContent.toLowerCase(); // Récupérer le texte de la cellule en minuscule
          if (cellText.includes(searchValue)) {
            match = true; // Si une colonne correspond, on marque la ligne comme correspondante
          }
        }
      });

      // Afficher ou masquer la ligne en fonction de la correspondance
      row.style.display = match ? '' : 'none';
    });
  });
}
let nomUA

function getUniteAdministrative(idUA, niveauUA, id) {
  fetch("/authentification/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "get_code",
      idUniteAdministrativeNiv: idUA,
      niveauUniteAdministrative: niveauUA
    }).toString()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {

      if (niveauUA == 2) {
        document.getElementById(`Niveau-${id}`).innerHTML = result[0].codeNiv2
        nomUA = result[0].codeNiv2
      } else if (niveauUA == 3) {
        document.getElementById(`Niveau-${id}`).innerHTML = result[0].codeNiv3
        nomUA = result[0].codeNiv3

        console.log(nomUA)

      }
    })
    .catch((error) => {
      console.error('Error:', error); // Afficher les erreurs dans la console
    });
}

function get_detail_compte(id) {
  data = {
    action: "get_one_compte",
    id: id,
  };

  // document.getElementById("photo-profil").src = document.getElementById("photo-",id).src

  // console.log(document.getElementById(`photo-${id}`).src)
  // document.getElementById("photo-profil").src = document.getElementById(`photo-${id}`).src
  let queryString = new URLSearchParams(data).toString();

  id = document.getElementById("id");

  // identifiant = document.getElementById("identifiant");
  // matricule = document.getElementById("matricule");
  // email = document.getElementById("email");
  password = document.getElementById("password");
  // access = document.getElementById("access");
  // id.value = id;

  fetch(`/authentification/api/get_one_compte/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((element) => {
        id.value = element.id;
        // identifiant.value = element.identifiant;
        // matricule.value = element.matricule;
        // email.value = element.email;
        // access.value = element.access;
        // password.value = element.password;
      });
    });
}

function update_compte(event) {
  event.preventDefault(); // Empêcher le rechargement de la page
  // Récupérer les valeurs des champs du formulaire
  const id = document.getElementById("id").value;
  // const identifiant_agent = document.getElementById("identifiant").value;
  // const matricule = document.getElementById("matricule").value;
  // const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // const access = document.getElementById("access").value;

  // Créer un objet data avec les valeurs récupérées
  const data = {
    action: "update_compte", // Spécifie l'action à effectuer dans le backend
    id: id,
    password: password,
  };

  let queryString = new URLSearchParams(data).toString()
  fetch(`/authentification/api/update_compte/${id}/${password}`)
    .then((response) => response.json()) // Traiter la réponse comme JSON
    .then((result) => {
      console.log(result); // Afficher le résultat de la réponse (ex: message de succès)
      if (result.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Modification réussi !",
          showConfirmButton: false,
          timer: 1500
        });
        get_user_compte()

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

//afichage des service
//function get_service (id_agent){
//   fetch(
//     `controller.php?action=get_service`,
//     {
//       method: "GET",
//     }
//   )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     const select_agent = document.getElementById("service");

//     select_agent.innerHTML = ` `
//     let option1 = document.createElement("option");
//         option1.innerHTML = 'Veuillez selectionner un service';
//         select_agent.appendChild(option1);

//       data.forEach((element) => {
//         let option = document.createElement("option");
//         option.innerHTML = element.nom;
//         option.value = element.id_service;
//         select_agent.appendChild(option);
//       });
//       select_agent.addEventListener("change", function () {
//         // get_other_tache(select_agent.value);
//         console.log('Id agent : ',id_agent,' Id service : ',select_agent.value)
//         get_other_tache2(id_agent,select_agent.value);
//         get_tache_user(id_agent,select_agent.value);
//       });
//   })
// }
//alerte suppression
function alerte(id_utilisateur, access) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Etes vous sûr ?",
    text: "Vous allez change l'état du compte!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui !",
    cancelButtonText: "No, Annuler !",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      change_etat(id_utilisateur, access)
      swalWithBootstrapButtons.fire({
        title: "Changement effectué !",
        // text: ".",
        icon: "success"
      });

    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Le changement a été annulé",
        // text: "",
        icon: "error"
      });
    }
  });
}
//Changer l'état du compte
function change_etat(id_utilisateur, access) {
  access = access == 1 ? 0 : 1;
  // alert(`ID Utilisateur: ${id_utilisateur}, Access: ${access}`);
  data = {
    action: "change_etat_compte",
    id_utilisateur: id_utilisateur,
    access: access,
  };

  let queryString = new URLSearchParams(data).toString();

  fetch(
    `/authentification/compte/${id_utilisateur}/etat/${access}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      // alert('Changement réussi !! ')
      // msg = document.getElementById('alert')
      // msg.innerHTML = ``

      // get_user_compte()
      KTDatatablesServerSide.init();

    }
    return response.json(); // Changez pour text() pour inspecter le contenu
  }).then((text) => {
    try {
      const data = JSON.parse(text); // Essayez de parser le texte en JSON
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
    }
  })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

}
var KTDatatablesSousMenu = function () {
  var dt;

  function initDatatable(subject) {
    if (dt) {
      dt.destroy();
      $('#kt_table_sous_menu tbody').empty();
    }

    dt = $("#kt_table_sous_menu").DataTable({
      responsive: true,
      ajax: {
        url: "api/get_all",
        method: 'GET',
        // data: {
        //   action: "get_all",
        //   subject: subject
        // },
        dataSrc: function (response) {
          console.log("Données reçues :", response); // Ajout de console.log
          return response || []; // Assurez-vous que les données sont bien un tableau
        }
      },
      columns: [
        { data: "icon" },
        { data: "nom_s" },
        {
          data: null,
          orderable: false,
          render: function (data) {
            return `
                            <button type="button" class="btn btn-sm btn-primary" 
                                data-bs-toggle="modal" 
                                data-bs-target="#edit_sous_menu" 
                                onclick="get_detail_sous_menu(${data.id})">
                                Modifier
                            </button>`;
          }
        }
      ],
      columnDefs: [
        {
          targets: [1], // Cible la première colonne (index 0)
          searchable: true, // Désactiver la recherche sur cette colonne
        }
      ],
      language: {
        lengthMenu: "Afficher _MENU_",
        zeroRecords: "Aucun service trouvé",
        info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        infoEmpty: "Aucune entrée disponible",
        infoFiltered: "(filtré à partir de _MAX_ entrées totales)",
        search: `<span class="svg-icon svg-icon-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                            <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                                                            <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                                                                        </svg>
                                                                    </span>`,
        searchPlaceholder: "Rechercher...",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Suivant",
          previous: "Précédent"
        }
      },
      paging: true,
      pageLength: 10, // Nombre de lignes par page

      lengthMenu: [5, 10, 20],
      dom: 'ftlip',
    });
  }

  return {
    init: function (subject = '') {
      initDatatable(subject);
    }
  };
}();

// Initialisation
KTDatatablesSousMenu.init();
function get_detail_sous_menu(id) {
  const allIcons = document.querySelectorAll('.icon-item, .dropdown-item'); // Correction : Séparateur correct entre les sélecteurs
  allIcons.forEach(icon => icon.classList.remove('active'));
  data = {
    action: "get_one_sous_menu",
    id: id,
  };

  let queryString = new URLSearchParams(data).toString();

  let id_sous_menu = document.getElementById("id_sous_menu");
  let nom = document.getElementById("nomTacheToEdit");
  let id_icon = document.getElementById("selectedIconIdToEdit");
  let ancienIcon = document.getElementById("ancienIcon")


  id_sous_menu.value = id;

  fetch(`/authentification/api/get_one_sous_menu/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.sous_menu.forEach((element) => {
        nom.value = element.nom;
        id_icon.value = element.idIcon;
        ancienIcon.innerHTML = element.icon
        console.log(element.nom)
      });
    });
}
var KTDatatablesTacheUtilisateur = function () {
  var dt;

  function initDatatable() {
    if (dt) {
      dt.destroy();
      $('#kt_table_tache_utilisateur tbody').empty();
    }

    dt = $("#kt_table_tache_utilisateur").DataTable({
      responsive: true,
      ajax: {
        url: "api/getTacheUtilisateur",
        method: 'GET',
        // data: {
        //   action: "getTacheUtilisateur"
        // },
        dataSrc: function (response) {
          console.log("Tache_Utilisateur :", response); // Ajout de console.log
          // Assurez-vous que les données sont bien un tableau

          return response || [];
        }
      },
      columns: [
        { data: "nomTache", title: "Nom de la tâche" },
        { data: "codeUA", title: "Unité Administrative" },
        { data: "nombreOccurrences", title: "Nombre d'occurrences" },
        {
          data: null,
          orderable: false,
          render: function (data) {
            // Cache le bouton si le nombre d'occurrences est égal à 0
            if (data.nombreOccurrences == 0) {
              return '';
            }
            return `
                            <button type="button" class="btn btn-sm btn-primary" 
                                data-bs-toggle="modal" 
                                data-bs-target="#voirUtilisateur" 
                                onclick="voirUtilisateur(${data.idTache}, '${data.nomTache}')">
                                Voir
                            </button>`;
          }
        }
      ],
      columnDefs: [
        {
          targets: [0, 1], // Colonnes ciblées
          searchable: true, // Activer la recherche sur ces colonnes
        }
      ],
      language: {
        lengthMenu: "Afficher _MENU_",
        zeroRecords: "Aucune tâche trouvée",
        info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        infoEmpty: "Aucune entrée disponible",
        infoFiltered: "(filtré à partir de _MAX_ entrées totales)",
        search: `<span class="svg-icon svg-icon-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                            </svg>
                        </span>`,
        searchPlaceholder: "Rechercher...",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Suivant",
          previous: "Précédent"
        }
      },
      paging: true,
      pageLength: 10, // Nombre de lignes par page
      lengthMenu: [5, 10, 20],
      dom: 'ftlip',
      ordering: true, // Activer le tri
      order: [[0, 'asc']] // Trier par la première colonne par défaut
    });
  }

  return {
    init: function () {
      initDatatable();
    }
  };
}();

// Initialisation
KTDatatablesTacheUtilisateur.init();
//Récupération de la liste des qualifications
function getQualification() {
  let data = {
    action: "getQualification",
  };

  // Convertir l'objet `data` en une chaîne de requête
  let queryString = new URLSearchParams(data).toString();

  fetch("/authentification/api/getQualification")
    .then((response) => response.json())
    .then((data) => {
      const selectPost = document.getElementById('post_tache')
      selectPost.innerHTML = '<option value="">Selectionner un Post</option>'
      data.forEach((post) => {
        let option = document.createElement('option');
        option.textContent = post.qualification
        option.value = post.id
        selectPost.appendChild(option)
      })
    })
}
//Fonction pour récupérer les taches structure pour les affecter à des qualifications
function getTacheQualification() {
  let data = {
    action: "getTacheStructure",
  };

  let queryString = new URLSearchParams(data).toString();

  fetch("/authentification/api/getTacheStructure")
    .then((response) => response.json())
    .then((data) => {
      // Grouper les tâches
      const tachesGroupes = groupTachesByUniteAndSousMenu(data);

      // Initialiser les selects
      initUniteSelect(tachesGroupes);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des tâches :', error);
    });
}

// Fonction de regroupement
function groupTachesByUniteAndSousMenu(taches) {
  const result = {};

  taches.forEach(tache => {
    const uniteKey = tache.codeNiv1 || tache.codeNiv2 || tache.codeNiv3 || 'Sans unité';

    if (!result[uniteKey]) {
      result[uniteKey] = {
        nomUnite: uniteKey,
        sousMenus: {}
      };
    }

    const sousMenuKey = (tache.idSousMenu !== null && tache.idSousMenu !== undefined)
      ? tache.idSousMenu
      : 'sans-sous-menu';

    if (!result[uniteKey].sousMenus[sousMenuKey]) {
      result[uniteKey].sousMenus[sousMenuKey] = {
        idSousMenu: tache.idSousMenu,
        nomSousMenu: tache.nomSousMenu || (tache.idSousMenu !== null ? `Sous-menu ${tache.idSousMenu}` : 'Sans sous-menu'),
        taches: []
      };
    }

    result[uniteKey].sousMenus[sousMenuKey].taches.push({
      id: tache.id,
      nom: tache.nom
    });
  });

  return result;
}

// Initialiser le select des unités
function initUniteSelect(tachesGroupes) {
  const uniteSelect = document.getElementById('unite-select');
  const sousMenuSelect = document.getElementById('sousmenu-select');
  const tacheSelect = document.getElementById('tache_post');

  // Vider les selects
  uniteSelect.innerHTML = '<option value="">Sélectionnez une unité</option>';
  sousMenuSelect.innerHTML = '<option value="">Sélectionnez un sous-menu</option>';
  tacheSelect.innerHTML = '<option value="">Sélectionnez une tâche</option>';

  // Désactiver les selects dépendants
  sousMenuSelect.disabled = true;
  tacheSelect.disabled = true;

  // Remplir le select des unités
  Object.keys(tachesGroupes).forEach(unite => {
    const option = document.createElement('option');
    option.value = unite;
    option.textContent = unite;
    uniteSelect.appendChild(option);
  });

  // Écouteur d'événement pour l'unité
  uniteSelect.addEventListener('change', function () {
    const selectedUnite = this.value;
    sousMenuSelect.innerHTML = '<option value="">Sélectionnez un sous-menu</option>';
    tacheSelect.innerHTML = '<option value="">Sélectionnez une tâche</option>';
    sousMenuSelect.disabled = !selectedUnite;
    tacheSelect.disabled = true;

    if (selectedUnite) {
      updateSousMenus(tachesGroupes, selectedUnite);
    }
  });

  // Écouteur d'événement pour le sous-menu
  sousMenuSelect.addEventListener('change', function () {
    const selectedUnite = uniteSelect.value;
    const selectedSousMenu = this.value;
    tacheSelect.innerHTML = '<option value="">Sélectionnez une tâche</option>';
    tacheSelect.disabled = !selectedSousMenu;

    if (selectedUnite && selectedSousMenu) {
      updateTaches(tachesGroupes, selectedUnite, selectedSousMenu);
    }
  });
}

// Mettre à jour les sous-menus
function updateSousMenus(tachesGroupes, unite) {
  const sousMenuSelect = document.getElementById('sousmenu-select');
  const sousMenus = tachesGroupes[unite].sousMenus;

  Object.keys(sousMenus).forEach(key => {
    const sousMenu = sousMenus[key];
    const option = document.createElement('option');
    option.value = sousMenu.idSousMenu !== null ? sousMenu.idSousMenu : 'null';

    option.textContent = sousMenu.idSousMenu !== null ? sousMenu.nomSousMenu : 'Sans sous-menu';
    sousMenuSelect.appendChild(option);
  });
}

// Mettre à jour les tâches
function updateTaches(tachesGroupes, unite, sousMenuId) {
  const tacheSelect = document.getElementById('tache_post');
  const sousMenus = tachesGroupes[unite].sousMenus;

  // Trouver le bon sous-menu
  let taches = [];
  Object.keys(sousMenus).forEach(key => {
    const sousMenu = sousMenus[key];
    if ((sousMenuId === 'null' && sousMenu.idSousMenu === null) ||
      (sousMenu.idSousMenu !== null && sousMenu.idSousMenu.toString() === sousMenuId)) {
      taches = sousMenu.taches;
    }
  });

  // Remplir le select des tâches
  taches.forEach(tache => {
    const option = document.createElement('option');
    option.value = tache.id;
    option.textContent = tache.nom;
    tacheSelect.appendChild(option);
  });
}
//Insertion dans la table tache_qualification
function addTacheQualification(event) {
  event.preventDefault()
  const addTacheQualificationButtonForm = document.getElementById('addTacheQualificationButtonForm')
  let data = {
    action: "addTacheQualification",
    idTache: document.getElementById('tache_post').value,
    idQualification: document.getElementById('post_tache').value
  };

  addTacheQualificationButtonForm.classList.add('disabled');

  fetch("/authentification/api", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then((response) => response.json())
  .then((data) => {
    addTacheQualificationButtonForm.classList.remove('disabled')
        addTacheQualificaionForm.reset()
        KTDatatablesTacheQualification.init();
      
      console.log(data)
      if (data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.message,
          showConfirmButton: true,
          // timer: 1500
        });
      }
    })
}
function get_detail_tache_qualification(id) {
  data = {
    action: "get_one_tache_qualification",
    id: id,
  };
  let queryString = new URLSearchParams(data).toString();
  id_tache_qualification = document.getElementById("id_tache_qualification");
  id_tache_qualification.value = id;
  fetch(`/authentification/api/get_one_tache_qualification/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.tache_qualification.forEach((element) => {
        id_tache_qualification.value = element.id;
        document.getElementById("tache_post").value = element.idTache;
        document.getElementById("post_tache").value = element.idQualification;
        document.getElementById("sousmenu-select").value = element.idSousMenu;
        document.getElementById("unite-select").value = element.codeNiv2;
        document.getElementById("nomTacheToEdit").value = element.nomTache;
      });
    });
}
function updateTacheQualification(event) {
  event.preventDefault(); // Empêche le rechargement de la page


  const updateButton = document.getElementById('updateTacheQualificationButton');
  updateButton.classList.add('disabled'); // Désactiver le bouton pendant la requête

  // Récupérer les données du formulaire
  const data = {
    action: "updateTacheQualification",
    idTache: document.getElementById('tache_post').value,
    idQualification: document.getElementById('post_tache').value,
    id: document.getElementById('id_tache_qualification').value // ID de la tâche qualification à modifier
  };
  // Convertir l'objet `data` en une chaîne de requête
  const queryString = new URLSearchParams(data).toString();

  fetch("/authentification/controller.php?" + queryString, {
    method: "POST"
  })
    .then((response) => {
      updateButton.classList.remove('disabled'); // Réactiver le bouton
      if (!response.ok) {
        throw new Error("Erreur réseau lors de la modification.");
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      if (result.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Modification réussie !",
          showConfirmButton: false,
          timer: 1500
        });

        // Réinitialiser le formulaire
        document.getElementById('updateTacheQualificationForm').reset();

        // Rafraîchir la liste des tâches qualifications
        KTDatatablesTacheQualification.init();

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("update_tache_qualification_modal"));
        if (modal) {
          modal.hide();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: result.message || "Une erreur est survenue lors de la modification.",
        });
      }
    })
    .catch((error) => {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de modifier la tâche qualification.",
      });
    });
}
//Liste des tacheQualification
var KTDatatablesTacheQualification = function () {
  var dt;

  function initDatatable() {
    if (dt) {
      dt.destroy();
      $('#kt_table_tache_qualification tbody').empty();
    }

    dt = $("#kt_table_tache_qualification").DataTable({
      responsive: true,
      ajax: {
        url: "api/getTacheQualification",
        method: 'GET',
        // data: {
        //   action: "getTacheQualification"
        // },
        dataSrc: function (response) {
          console.log("Données reçues :", response); // Ajout de console.log
          return response || []; // Assurez-vous que les données sont bien un tableau
        }
      },
      columns: [
        { data: "tache", title: "Tâche" },
        { data: "codeUA", title: "Unité Administrative" },
        { data: "qualification", title: "Qualification" },
        {
          data: null,
          orderable: false,
          render: function (data) {
            return `
                    <button type="button" class="btn btn-sm btn-danger" onclick="changeValiditeTacheQualification(${data.id})">
                        supprimer
                    </button>`;
          }
        }
      ],
      columnDefs: [
        {
          targets: [0, 1], // Colonnes ciblées
          searchable: true, // Activer la recherche sur ces colonnes
        }
      ],
      language: {
        lengthMenu: "Afficher _MENU_",
        zeroRecords: "Aucune tâche trouvée",
        info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        infoEmpty: "Aucune entrée disponible",
        infoFiltered: "(filtré à partir de _MAX_ entrées totales)",
        search: `<span class="svg-icon svg-icon-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                            </svg>
                        </span>`,
        searchPlaceholder: "Rechercher...",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Suivant",
          previous: "Précédent"
        }
      },
      paging: true,
      pageLength: 10, // Nombre de lignes par page
      lengthMenu: [5, 10, 20],
      dom: 'ftlip',
      ordering: true, // Activer le tri
      order: [[0, 'asc']] // Trier par la première colonne par défaut
    });
  }

  return {
    init: function () {
      initDatatable();
    }
  };
}();

// Initialisation
KTDatatablesTacheQualification.init();

function changeValiditeTacheQualification(id) {
  Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Vous allez changer la validité de cette tâche qualification.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, continuer",
    cancelButtonText: "Annuler",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/authentification/api/changeValiditeTacheQualification/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "changeValiditeTacheQualification", id: id })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Changement de validité réussi !",
              showConfirmButton: false,
              timer: 1500
            });
            KTDatatablesTacheQualification.init();
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Erreur lors du changement de validité !",
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la modification :", error);
        });
    }
  });
}
function voirUtilisateur(id, nomTache, type) {
  document.getElementById("voirUtilisateurLabel").innerHTML = `Liste des utilisateurs de la tâche <span class="text-primary">${nomTache}</span>`;
  let data = {
    action: "voirUtilisateur",
    idTache: id
  };

  // Convertir l'objet `data` en une chaîne de requête
  let queryString = new URLSearchParams(data).toString();

  fetch(`/authentification/api/voirUtilisateur/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const liste = document.getElementById("utilisateurTache");
      liste.innerHTML = '';
      
      // Création de la barre de recherche
      const searchWrapper = document.createElement("div");
      searchWrapper.className = "mb-3 d-flex justify-content-end";
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "Rechercher un agent...";
      searchInput.className = "form-control w-50";
      searchInput.style.maxWidth = "300px";
      searchWrapper.appendChild(searchInput);
      liste.appendChild(searchWrapper);

      if (type == 'Structure') {
        const table = document.createElement("table");
        table.classList.add('table', 'align-middle', 'table-hover', 'table-bordered', 'table-striped', 'fs-6', 'gy-5', 'mt-2', 'mb-0', 'bg-white', 'shadow-sm', 'rounded');

        const thead = document.createElement("thead");
        thead.classList.add('table-light', 'text-gray-700', 'fs-7', 'fw-bolder', 'text-uppercase');
        const tbody = document.createElement("tbody");

        // Créer les en-têtes de la table
        const headerRow = document.createElement("tr");
        const taskHeader = document.createElement("th");
        taskHeader.textContent = "Agent";
        headerRow.appendChild(taskHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Créer les lignes de la table
        data.forEach((utilisateur) => {
          const row = document.createElement("tr");
          row.classList.add('align-middle');

          // Créer une cellule avec le nom de l'agent et badge d'état
          const taskCell = document.createElement("td");
          let accessClass =
        utilisateur.access == 1
          ? "badge badge-light-success"
          : "badge badge-light-danger";
          let etat = utilisateur.access == 1 ? "actif" : "bloqué";
          let accessCellule = `<span class="${accessClass} ms-2">${etat}</span>`;

          // Ajout d'un avatar pour l'agent (optionnel)
          let avatar = utilisateur.photo
        ? `<img src="${utilisateur.photo}" alt="avatar" class="rounded-circle me-2" style="width:32px;height:32px;object-fit:cover;">`
        : `<span class="symbol symbol-30px symbol-md-40px me-2"><img src="./dist_assets/media/avatars/blank.png" class="rounded-circle" style="width:32px;height:32px;object-fit:cover;"></span>`;

          taskCell.innerHTML = `
        <div class="d-flex align-items-center">
          ${avatar}
          <div>
        <span class="fw-bold">${utilisateur.email}</span>
        ${accessCellule}
          </div>
        </div>
          `;
          row.appendChild(taskCell);
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        liste.appendChild(table);

        // Fonction de recherche
        searchInput.addEventListener("input", function () {
          const searchValue = this.value.toLowerCase().trim();
          Array.from(tbody.querySelectorAll("tr")).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? "" : "none";
          });
        });
      } else if (type == 'Incarnée') {
        const info = document.createElement("div");
        info.className = "alert alert-info mt-3";
        info.textContent = "Seuls les agents du poste ont accès à cette tâche.";
        liste.appendChild(info);
      } else {
        const info = document.createElement("div");
        info.className = "alert alert-success mt-3";
        info.textContent = "Tout le monde a accès à cette tâche.";
        liste.appendChild(info);
      }

      // (Le code pour le bouton submitButton est commenté car il n'est pas utilisé)
    })
}

function changeTacheUtilisateur(id_utilisateur, access) {
  console.log('Id tache : ', id_utilisateur, ' Etat : ' + access == 1 ? 'actif' : 'bloque')
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Etes vous sûr ?",
    text: "Vous allez change l'état du compte!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui !",
    cancelButtonText: "No, Annuler !",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // change_etat(id_utilisateur, access)
      swalWithBootstrapButtons.fire({
        title: "Changement effectué !",
        // text: ".",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Le changement a été annulé",
        // text: "",
        icon: "error"
      });
    }
  });
}
// //Liste des taches
// function get_all_tache() {
//   let data = {
//     action: "get_all_tache",
//   };

//   // Convertir l'objet `data` en une chaîne de requête
//   let queryString = new URLSearchParams(data).toString();

//   fetch("controller.php?" + queryString)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       const tgeneral = document.getElementById("tache");
//       tgeneral.innerHTML = ''
//       // Vérification que 'data.tache' existe et est un tableau
//       if (Array.isArray(data.tache)) {
//         data.tache.forEach((element) => {
//           let row = document.createElement("tr");
//           // // Construction de la cellule d'accès avec condition
//           // let accessClass =
//           //   element.access == 1
//           //     ? "badge badge-light-success"
//           //     : "badge badge-light-danger";
//           // let etat = element.access == 1 ? "valide" : "non valide";
//           // let accessCellule = `<td> <span class="${accessClass}   w-50">${etat}</span></td>`;
//           // let changeAccess;
//           // let alertmsg;
//           // if (element.access == 1) {
//           //   alertmsg = 'bloqué'
//           //   changeAccess = `<input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onchange='alerte(${element.id},${element.access})' checked> `;
//           // } else {
//           //   alertmsg = 'débloqué'
//           //   changeAccess = `<input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onchange='alerte(${element.id},${element.access})'> `;
//           // }
//           row.innerHTML = `
//             <td>${element.nom}</td>
//             <td>${element.type}</td>
// 	              <td>${element.code}</td>

//             <td>${element.autre_ressource}</td>
//             <td>${element.url}</td>
//             <td>
//               <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#edit" onclick='get_detail_tache(${element.id})'>
//                 Edit
//               </button>
//             </td>
//           `;
//           if (row != null) {
//             tgeneral.appendChild(row); // Ajouter la ligne au tbody
//           }
//         });
//       }
//     })
//     .catch((error) =>
//       console.error("Erreur lors de la récupération des tâches :", error)
//     );
// }
//Récupération des attributs d'une tache pour la modification
var KTDatatablesTache = function () {
    var dt;

    function initDatatable(subject) {
        if (dt) {
            dt.destroy();
            $('#kt_table_tache tbody').empty();
        }

        dt = $("#kt_table_tache").DataTable({
            responsive: true,
            ajax: {
                url: "api/get_all_tache",
                method: 'GET',
                // data: { action: "get_all_tache", subject: subject },
                dataSrc: function (response) {
                    console.log("Données reçues :", response);
                    return response.tache || [];
                }
            },
            columns: [
                { data: "nom" },
                { data: "type" },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        if (row.type === "Par défaut") {
                            return "Tout le monde";
                        } else if (row.type === "Incarnée") {
                            return "Agents du post";
                        } else if (row.type === "Structure") {
                            return `<span>
                            ${row.nombre_utilisateurs || 0} 
                            </span>`; // Affiche 0 si la valeur est null/undefined
                        }
                    }
                },
                { data: "code" },
                { data: "commentaire" },
                // { data: "url" },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row, meta) {
                      let urlencoded = btoa(`${row.id_struture}`)
                      let activateBtnText = row.active == 1 ? 'Déactiver' : 'Activer'
                      let activateBtnColor = row.active == 1 ? 'svg-icon-danger' : 'svg-icon-warning'
                        return `
                            <div class="d-flex flex-wrap gap-2 justify-content-center align-items-center ">
                            <span class="svg-icon svg-icon-primary svg-icon-2x" data-bs-toggle="modal" data-bs-target="#voirUtilisateur" onclick="voirUtilisateur(${row.id}, '${row.nom.replace(/'/g, "\\'")}','${row.type}')" style="cursor: pointer;"><!--begin::Svg Icon | path:C:\wamp64HG\themes\metronic\theme\html\demo2\dist/../src/media/svg/icons\Communication\Group.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                              <title>Voir les utilisateurs de la tache.</title>
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                  <polygon points="0 0 24 0 24 24 0 24"/>
                                  <path d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                  <path d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z" fill="#000000" fill-rule="nonzero"/>
                              </g>
                          </svg><!--end::Svg Icon--></span>
                                    <span class="svg-icon svg-icon-warning svg-icon-2x" style="cursor: pointer;" onclick="get_detail_tache(${row.id})"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Design/Edit.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                      <title>Modifier la tache. </title>
                                      <desc>Created with Sketch.</desc>
                                      <defs/>
                                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                          <rect x="0" y="0" width="24" height="24"/>
                                          <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>
                                          <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>
                                      </g>
                                  </svg><!--end::Svg Icon--></span>
                                  <span class="svg-icon ${activateBtnColor} svg-icon-2x" style="cursor: pointer;" onclick="changeEtatTache(${row.id}, ${row.nombre_utilisateurs || 0})"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo2\dist/../src/media/svg/icons\Code\Error-circle.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                  <title>${activateBtnText} la tache.</title>
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"/>
                                        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
                                        <path d="M12.0355339,10.6213203 L14.863961,7.79289322 C15.2544853,7.40236893 15.8876503,7.40236893 16.2781746,7.79289322 C16.6686989,8.18341751 16.6686989,8.81658249 16.2781746,9.20710678 L13.4497475,12.0355339 L16.2781746,14.863961 C16.6686989,15.2544853 16.6686989,15.8876503 16.2781746,16.2781746 C15.8876503,16.6686989 15.2544853,16.6686989 14.863961,16.2781746 L12.0355339,13.4497475 L9.20710678,16.2781746 C8.81658249,16.6686989 8.18341751,16.6686989 7.79289322,16.2781746 C7.40236893,15.8876503 7.40236893,15.2544853 7.79289322,14.863961 L10.6213203,12.0355339 L7.79289322,9.20710678 C7.40236893,8.81658249 7.40236893,8.18341751 7.79289322,7.79289322 C8.18341751,7.40236893 8.81658249,7.40236893 9.20710678,7.79289322 L12.0355339,10.6213203 Z" fill="#000000"/>
                                    </g>
                                </svg><!--end::Svg Icon--></span>
                                
                                <a class="" href='${row.url+ "?id=" + urlencoded}' target="_blank">
                                    <span class="svg-icon svg-icon-info svg-icon-2x" style="cursor: pointer;"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo2\dist/../src/media/svg/icons\Navigation\Sign-out.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                      <title>Aller à la tache.</title>
                                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                          <rect x="0" y="0" width="24" height="24"/>
                                          <path d="M14.0069431,7.00607258 C13.4546584,7.00607258 13.0069431,6.55855153 13.0069431,6.00650634 C13.0069431,5.45446114 13.4546584,5.00694009 14.0069431,5.00694009 L15.0069431,5.00694009 C17.2160821,5.00694009 19.0069431,6.7970243 19.0069431,9.00520507 L19.0069431,15.001735 C19.0069431,17.2099158 17.2160821,19 15.0069431,19 L3.00694311,19 C0.797804106,19 -0.993056895,17.2099158 -0.993056895,15.001735 L-0.993056895,8.99826498 C-0.993056895,6.7900842 0.797804106,5 3.00694311,5 L4.00694793,5 C4.55923268,5 5.00694793,5.44752105 5.00694793,5.99956624 C5.00694793,6.55161144 4.55923268,6.99913249 4.00694793,6.99913249 L3.00694311,6.99913249 C1.90237361,6.99913249 1.00694311,7.89417459 1.00694311,8.99826498 L1.00694311,15.001735 C1.00694311,16.1058254 1.90237361,17.0008675 3.00694311,17.0008675 L15.0069431,17.0008675 C16.1115126,17.0008675 17.0069431,16.1058254 17.0069431,15.001735 L17.0069431,9.00520507 C17.0069431,7.90111468 16.1115126,7.00607258 15.0069431,7.00607258 L14.0069431,7.00607258 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(9.006943, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-9.006943, -12.000000) "/>
                                          <rect fill="#000000" opacity="0.3" transform="translate(14.000000, 12.000000) rotate(-270.000000) translate(-14.000000, -12.000000) " x="13" y="6" width="2" height="12" rx="1"/>
                                          <path d="M21.7928932,9.79289322 C22.1834175,9.40236893 22.8165825,9.40236893 23.2071068,9.79289322 C23.5976311,10.1834175 23.5976311,10.8165825 23.2071068,11.2071068 L20.2071068,14.2071068 C19.8165825,14.5976311 19.1834175,14.5976311 18.7928932,14.2071068 L15.7928932,11.2071068 C15.4023689,10.8165825 15.4023689,10.1834175 15.7928932,9.79289322 C16.1834175,9.40236893 16.8165825,9.40236893 17.2071068,9.79289322 L19.5,12.0857864 L21.7928932,9.79289322 Z" fill="#000000" fill-rule="nonzero" transform="translate(19.500000, 12.000000) rotate(-90.000000) translate(-19.500000, -12.000000) "/>
                                      </g>
                                  </svg><!--end::Svg Icon--></span>
                                </a>

                                
                            </div>
                        `;
                    }
                }
            ],
            drawCallback: function (settings) {
                // Ajoutez ici un code de rafraîchissement si nécessaire après chaque redessin
            },
            columnDefs: [
                {
                    searchable: true,
                    targets: [0, 1, 2, 3, 4]
                }
            ],
            language: {
                lengthMenu: "Afficher _MENU_",
                zeroRecords: "Aucune tâche trouvée",
                info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                infoEmpty: "Aucune entrée disponible",
                infoFiltered: "(filtré à partir de _MAX_ entrées totales)",
                search: `<span class="svg-icon svg-icon-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                            </svg>
                        </span>`,
                searchPlaceholder: "Rechercher...",
                paginate: {
                    first: "Premier",
                    last: "Dernier",
                    next: "Suivant",
                    previous: "Précédent"
                }
            },
            dom: 'ftlip',
            pageLength: 10,
            lengthMenu: [5, 10, 20],
            paging: true,
            searching: true,
            ordering: true,
            order: [[0, 'asc']]
        });
    }

    // Expose la fonction pour l'appel externe
    return {
        init: function (subject) {
            initDatatable(subject);
        }
    };
}();
async function changeEtatTache(id, nombreUtilisateurs) {
  if (nombreUtilisateurs === 0) {
    const confirmation = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous vraiment changer l'état de cette tâche ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      reverseButtons: true
    });
    if (!confirmation.isConfirmed) {
      return;
    }
    try {
      // Envoi des données via POST (application/x-www-form-urlencoded)
      const response = await fetch("/authentification/api", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "changeEtatTache", id }).toString()
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Changement effectué !",
          text: "La tâche a été désactivée avec succès.",
          timer: 1500,
          showConfirmButton: false
        });
        KTDatatablesTache.init();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Impossible de changer l'état de la tâche.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors du changement.",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Impossible de désactiver",
      text: "La tâche ne doit être affectée à aucun agent avant d'être désactivée. .",
    });
  }
}

// Initialisation
KTDatatablesTache.init();

function checkTacheAffecter(id) {
  let data = {
    action: "checkTacheAffecter",
    id_tache: id
  };

  return fetch("/authentification/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails de la tâche.");
      }
      return response.json();
    })
    .then((data) => {
      return data.status;
    })
    .catch(() => false); // En cas d'erreur, considérer comme non affectée
}
function get_detail_tache(id) {
  // Préparer les données pour la requête
  const data = {
    action: "get_one_tache",
    id: id,
  };

  const queryString = new URLSearchParams(data).toString();

  // Récupérer les éléments du formulaire et du modal
  const form = document.getElementById("tacheForm");
  if (!form) {
    console.error("Formulaire introuvable !");
    return;
  }

  const id_tache = form.querySelector('input[name="id"]');
  const nom = form.querySelector('input[name="nom"]');
  const typeTache = form.querySelector('select[name="idTypeTache"]');
  const sousMenu = form.querySelector('select[name="idSousMenu"]');
  const url = form.querySelector('input[name="url"]');
  const autreRessource = form.querySelector('textarea[name="autre_ressource"]');
  const commentaire = form.querySelector('textarea[name="commentaire"]');
  const idIcon = form.querySelector('select[name="idIcon"]');
  const idFonction = form.querySelector('select[name="id_fonction"]');
  const actionInput = form.querySelector('input[name="action"]');
  const niveau_UA = form.querySelector('select[name="nivUA"]');
  const id_UA = form.querySelector('select[name="id_UA"]');
  const idDB = form.querySelector('select[name="idDB"]');
  // Vérifier si tous les éléments nécessaires sont présents
  if (!id_tache || !nom || !typeTache || !sousMenu || !url || !autreRessource || !commentaire || !idIcon || !actionInput) {
    console.error("Certains champs du formulaire sont introuvables !");
    return;
  }

  // Envoyer la requête pour récupérer les détails de la tâche
  fetch(`/authentification/api/get_one_tache/${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails de la tâche.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Détails de la tâche :", tache);
      if (data && data.tache && data.tache[0]) {
        const tache = data.tache[0];

        // Remplir les champs du formulaire avec les données récupérées
        id_tache.value = id;
        nom.value = tache.nom;
        typeTache.value = tache.idTypeTache;
        sousMenu.value = tache.idSousMenu;
        url.value = tache.url || "";
        autreRessource.value = tache.autre_ressource || "";
        commentaire.value = tache.commentaire || "";
        idFonction.value = tache.idFonction
        idDB.value = tache.idDB || "";

        // Appeler la fonction type_tache
        type_tache(tache.idTypeTache);
        // id_qualification.textContent = tache.qualification;

        // 4. Modifier get_UA pour accepter une valeur présélectionnée
        if (tache.idTypeTache == 1 ) {
          // Gérer le niveau UA après un court délai
          const niveau_UA = document.getElementById('nivUA');
          if (tache.idUniteAdministrativeNiv1 !== null) {
            niveau_UA.value = 1;
          } else if (tache.idUniteAdministrativeNiv2 !== null) {
            niveau_UA.value = 2;
          } else if (tache.idUniteAdministrativeNiv3 !== null) {
            niveau_UA.value = 3;
          }
          niveau_UA.dispatchEvent(new Event('change')); // Déclencher l'événement de changement

          setTimeout(() => {

            let idUASelect = document.getElementById('id_UA');
            if (idUASelect) {
              // Déterminer l'ID à présélectionner
              let idToSelect;
              if (tache.idUniteAdministrativeNiv1 !== null) {
                idToSelect = tache.idUniteAdministrativeNiv1;
              } else if (tache.idUniteAdministrativeNiv2 !== null) {
                idToSelect = tache.idUniteAdministrativeNiv2;
              } else if (tache.idUniteAdministrativeNiv3 !== null) {
                idToSelect = tache.idUniteAdministrativeNiv3;
              }

              if (idToSelect) {
                // Modifier get_UA pour accepter un paramètre optionnel
                idUASelect.value = idToSelect; // Mettre à jour la valeur du select
              }
            }
          }, 1000);
        }
        idIcon.value = tache.idIcon;
        console.log("Icon ID:", idIcon);

        // Mettre à jour l'aperçu de l'icône
        document.getElementById('iconPreview').innerHTML = tache.icon || "";

        // Modifier l'attribut "action" du formulaire
        actionInput.value = "edit_tache";

        // Ouvrir le modal avec l'ID "add_tache"
        const modal = new bootstrap.Modal(document.getElementById("add_tache"));
        modal.show();
      } else {
        console.error("Aucune tâche trouvée avec cet ID.");
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de récupérer les détails de la tâche.",
        });
      }
    })
    .catch((error) => {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la récupération des détails de la tâche.",
      });
    });
}
//Suppression d'une tache
function delete_tache(id_tache) {
  data = [];

  alert(id_tache);
  fetch(
    `/authentification/api/delete_tache/tache/${id_tache}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      }
      return response.text(); // Changez pour text() pour inspecter le contenu
    })
    .then((text) => {
      try {
        // const data = JSON.parse(text); // Essayez de parser le texte en JSON
        console.log(text);
        location.reload(); // Manipulez la réponse comme vous le souhaitez
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
//Affichage des taches pour une nouvelle attribution
function get_other_tache(id_utilisateur) {
  data = [];

  var tache;
  fetch(
    `/authentification/api/get_other_tache/agent/${id_utilisateur}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var tache = document.getElementById("tache");
      tache.innerHTML = null;

      // Créez une option par défaut
      let option = document.createElement("option");
      option.innerHTML = "Selectionner un tache";
      tache.appendChild(option);

      // Utilisez un objet pour stocker les optgroups
      let optgroupMap = {};

      data.utilisateur.forEach((element) => {
        // Vérifiez si l'optgroup existe déjà
        if (!optgroupMap[element.nom_service]) {
          let opgroup = document.createElement("optgroup");
          opgroup.label = element.nom_service;
          optgroupMap[element.nom_service] = opgroup;
          tache.appendChild(opgroup);
        }

        // Créez une nouvelle option et ajoutez-la à l'optgroup approprié
        option = document.createElement("option");
        option.innerHTML = element.nom;
        option.value = element.id_tache;
        optgroupMap[element.nom_service].appendChild(option);
      });
    });
}
//Modal affichant les taches d'un utilisateur
function loadTaches(id_utilisateur) {
  data = [];

  fetch(
    `/authentification/api/get_tache_utilisateur/agent/${id_utilisateur}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Tâches de l'agent : ", data.utilisateur.length);
      const modalBody = document.querySelector(``);
      modalBody.innerHTML = ""; // Effacer le contenu précédent

      if (data.utilisateur.length === 0) {
        modalBody.innerHTML = "Aucune tâche trouvée pour cet utilisateur.";
      } else {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        // Créer les en-têtes de la table
        const headerRow = document.createElement("tr");
        const checkboxHeader = document.createElement("th");
        checkboxHeader.textContent = "Sélect";
        const taskHeader = document.createElement("th");
        taskHeader.textContent = "Tâche";

        headerRow.appendChild(checkboxHeader);
        headerRow.appendChild(taskHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Créer les lignes de la table
        data.utilisateur.forEach((tache) => {
          const row = document.createElement("tr");

          // Créer une cellule avec la checkbox
          const checkboxCell = document.createElement("td");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = tache.id_tache_utilisateur; // Utiliser l'ID de la tâche comme valeur de la checkbox
          checkboxCell.appendChild(checkbox);

          // Créer une cellule avec le nom de la tâche
          const taskCell = document.createElement("td");
          taskCell.textContent = tache.nom;

          row.appendChild(checkboxCell);
          row.appendChild(taskCell);
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        modalBody.appendChild(table); // Ajouter la table au corps du modal

        // Ajouter un bouton pour soumettre les sélections
        const submitButton = document.createElement("button");
        submitButton.className = "btn btn-danger";
        submitButton.textContent = "Supprimer";
        modalBody.appendChild(submitButton);

        // Ajouter un gestionnaire d'événements pour le bouton
        submitButton.addEventListener("click", () => {
          const selectedIds = [];
          const checkboxes = modalBody.querySelectorAll(
            "input[type='checkbox']:checked"
          );

          checkboxes.forEach((checkbox) => {
            selectedIds.push(checkbox.value);
          });

          console.log(selectedIds); // Afficher les IDs sélectionnés dans la console
          // Vous pouvez maintenant utiliser le tableau selectedIds comme vous le souhaitez
          for (let i = 0; i < selectedIds.length; i++) {
            updateTacheUtilisateur(selectedIds[i]);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}
//Restriction de tache
function updateTacheUtilisateur(id_tache_utilisateur, id_utilisateur) {
  data = [];

  fetch(
    `/authentification/api/taches-utilisateurs/${id_tache_utilisateur}`,
    {
      method: "GET", // Vous pouvez aussi essayer avec 'DELETE' si approprié
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Tache retirée",
          showConfirmButton: false,
          timer: 1500
        });
      }
      return response.text(); // Changez pour text() pour inspecter le contenu
    })
    .then((text) => {
      try {
        // const data = JSON.parse(text); // Essayez de parser le texte en JSON
        console.log(text);
        const select_agent = document.getElementById("service");

        get_other_tache2(id_utilisateur, select_agent.value);
        get_tache_user(id_utilisateur, select_agent.value);
        // location.reload(); // Manipulez la réponse comme vous le souhaitez
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
      }
    });
}
//Attribution de tache
function add_tache_utilisateur(id_utilisateur, id_tache) {
  let data = {
    action: "add_tache_utilisateur",
    id_tache: id_tache,
    id_utilisateur: id_utilisateur,
  };

  fetch("/authentification/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(data).toString()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tache attribuée",
          showConfirmButton: false,
          timer: 1500
        });
        
      }
      return response.text(); // Changez pour text() pour inspecter le contenu
    })
    .then((text) => {
      try {
        // const data = JSON.parse(text); // Essayez de parser le texte en JSON
        console.log(text);
        const select_agent = document.getElementById("service");

        get_other_tache2(id_utilisateur, select_agent.valuer);
        get_tache_user(id_utilisateur, select_agent.value);
        // location.reload(); // Manipulez la réponse comme vous le souhaitez
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
      }
    });
}
//SIDEBARE

async function fetchItems(id) {
  let icons = [];

  try {
    let response = await fetch(`/authentification/api/personnelTache/${id}`);
    let data = await response.json();

    console.log("Le menu Niv 2: ", data);

    const menu = document.getElementById("menu");
    const contenu = document.querySelector(".contenu");
    menu.innerHTML += ``; // Réinitialiser le contenu du menu
    const serviceMap = {}; // Utilisé pour suivre les services déjà créés
    const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
    const tacheMap = {};

    for (const element of data.utilisateur) {
      const sanitizedSousMenu = sanitizeClassName(element.sousMenu);

      // Créer un nouveau service s'il n'existe pas déjà
      if (!serviceMap[element.service]) {
        serviceMap[element.service] = true;

        // Ajoute le service en tant que section distincte dans le menu
        menu.innerHTML += `
          <div class="menu-item">
            <div class="menu-content pb-2">
              <span class="menu-section text-muted text-uppercase fs-8 ls-1">${element.service}</span>
            </div>
            <div id="service-${sanitizeClassName(element.service)}" class="service-content"></div>
          </div>
        `;
      }

      const serviceElement = document.getElementById(`service-${sanitizeClassName(element.service)}`);

      // Vérifie si le sous-menu pour ce service a déjà été créé
      if (element.idSousMenu != null && !sousMenuMap[element.sousMenu]) {
        sousMenuMap[element.sousMenu] = true; // Marque le sous-menu comme créé

        // Ajoute un sous-menu avec un toggle pour les tâches
        serviceElement.innerHTML += `
          <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
            <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}">
              ${element.icon ? element.icon : ''} <!-- Affiche l'icône s'il existe -->
              <span class="menu-title">${element.sousMenu}</span>
              <span class="menu-arrow"></span>
            </span>
            <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
            </div>
          </div>
        `;
      }

      if (element.idSousMenu != null) {
        const sousMenuElement = serviceElement.querySelector(`.content-${sanitizedSousMenu}`);
        sousMenuElement.innerHTML += `
          <div class="menu-link" id="nav-user-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
          <span class="menu-bullet">
          <span class="bullet bullet-dot"></span>
          </span>
          <span class="menu-title">${element.tache}</span>
          </div>
        `;
      }

      if (element.idSousMenu == null && !tacheMap[element.tache]) {
        tacheMap[element.tache] = true;

        // Récupérer l'icône pour chaque tâche
        const tacheIcon = await get_icon(element.tacheIcon);  // Attendre l'icône
        serviceElement.innerHTML += `
          <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
            <span class="menu-link" data-bs-toggle="tab" data-bs-target="#tache${element.id}" >
              ${tacheIcon ? tacheIcon : ''} <!-- Affiche l'icône récupérée -->
              <span class="menu-title">${element.tache}</span>
            </span>
            <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
            </div>
          </div>
        `;
      }

      contenu.innerHTML += `
        <div class="tab-pane" id="tache${element.id}" role="tabpanel" aria-labelledby="tache${element.id}-tab">
          <div class="max-w-[325px] p-5 rounded-lg bg-gray-100 border-2">
            <h1 class="text-success text-center">${element.tache}</h1>
          </div>
          <div id="dynamic-content-${element.id}">
            <!-- Contenu dynamique sera chargé ici via AJAX ou une autre méthode -->
            Page indisponible
          </div>
        </div>
      `;

      if (element.url.length != 0) {
        fetch(`${element.url}`)
          .then((response) => response.text())
          .then((data) => {
            document.getElementById(`dynamic-content-${element.id}`).innerHTML = data;
          })
          .catch((error) => console.error("Error loading content:", error));
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchItemsForViho(id) {
  try {
    let response = await fetch(`/authentification/api/personnelTache/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    let data = await response.json();

    console.log("Menu data: ", data);

    const mainNav = document.getElementById("mainnav");
    const navMenu = mainNav.querySelector(".nav-menu");

    // Clear existing dynamic menu items (keep static ones like General, Components, etc.)
    const staticItems = Array.from(navMenu.querySelectorAll("li.sidebar-main-title, li.back-btn"));
    navMenu.innerHTML = '';
    staticItems.forEach(item => navMenu.appendChild(item));

    // Group by service
    const services = {};
    data.utilisateur.forEach(item => {
      if (!services[item.service]) {
        services[item.service] = {
          title: item.service,
          items: []
        };
      }
      services[item.service].items.push(item);
    });

    // Create menu sections
    for (const [serviceName, serviceData] of Object.entries(services)) {
      // Add service title
      const titleItem = document.createElement("li");
      titleItem.className = "sidebar-main-title";
      titleItem.innerHTML = `
        <div>
          <h6>${serviceName}</h6>
        </div>
      `;
      navMenu.appendChild(titleItem);

      // Group items by sousMenu
      const subMenus = {};
      serviceData.items.forEach(item => {
        const subMenuKey = item.sousMenu || item.tache;
        if (!subMenus[subMenuKey]) {
          subMenus[subMenuKey] = {
            title: item.sousMenu || item.tache,
            items: []
          };
        }
        subMenus[subMenuKey].items.push(item);
      });

      // Create menu items for each submenu
      for (const [subMenuName, subMenuData] of Object.entries(subMenus)) {
        if (subMenuData.items.length === 1 && !subMenuData.items[0].sousMenu) {
          // Single item without submenu
          const menuItem = document.createElement("li");
          menuItem.className = "dropdown";
          menuItem.innerHTML = `
            <a class="nav-link menu-title link-nav" href="javascript:void(0)" data-target="#tache${subMenuData.items[0].id}">
              ${subMenuData.items[0].icon ? `<i data-feather="${subMenuData.items[0].icon}"></i>` : ''}
              <span>${subMenuName}</span>
            </a>
          `;
          navMenu.appendChild(menuItem);
        } else {
          // Group with submenu
          const menuItem = document.createElement("li");
          menuItem.className = "dropdown";
          menuItem.innerHTML = `
            <a class="nav-link menu-title" href="javascript:void(0)">
              ${subMenuData.items[0].icon ? `<i data-feather="${subMenuData.items[0].icon}"></i>` : ''}
              <span>${subMenuName}</span>
            </a>
            <ul class="nav-submenu menu-content">
              ${subMenuData.items.map(item => `
                <li>
                  <a href="javascript:void(0)" data-target="#tache${item.id}">${item.tache}</a>
                </li>
              `).join('')}
            </ul>
          `;
          navMenu.appendChild(menuItem);
        }
      }
    }

    // Initialize Feather Icons
    if (window.feather) {
      window.feather.replace();
    }

    // Create content panes
    const contenu = document.querySelector(".contenu");
    contenu.innerHTML = data.utilisateur.map(item => `
      <div class="tab-pane fade" id="tache${item.id}" role="tabpanel" aria-labelledby="tache${item.id}-tab">
        <div class="max-w-[325px] p-5 rounded-lg bg-gray-100 border-2">
          <h1 class="text-success text-center">${item.tache}</h1>
        </div>
        <div id="dynamic-content-${item.id}">
          ${item.url ? 'Chargement...' : 'Page indisponible'}
        </div>
      </div>
    `).join('');

    // Load dynamic content for items with URLs
    data.utilisateur.forEach(item => {
      if (item.url) {
        fetch(item.url)
          .then(response => response.text())
          .then(html => {
            document.getElementById(`dynamic-content-${item.id}`).innerHTML = html;
          })
          .catch(error => console.error("Error loading content:", error));
      }
    });

    // Add click handlers for menu items
    document.querySelectorAll('[data-target]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        document.querySelector(target).classList.add('show', 'active');
      });
    });

  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
}

// Helper function to handle click events
function setupMenuInteractions() {
  // Handle submenu toggling
  document.querySelectorAll('.nav-link.menu-title').forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.parentElement.classList.contains('dropdown')) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  setupMenuInteractions();
  // Call fetchItems with appropriate ID
  // fetchItems(userId);
});
//Récupération des unité administrative niveau 3
async function UniteAdministrativeNiv3(id) {
  try {
    let response = await fetch(`/authentification/api/tacheUA3/${id}`);
    let data = await response.json();

    console.log("Le menu Niv 3: ", data);

    const menu = document.getElementById("menu");
    const contenu = document.querySelector(".contenu");
    menu.innerHTML += ``; // Réinitialiser le contenu du menu
    const serviceMap = {}; // Utilisé pour suivre les services déjà créés
    const service2Map = {}; // Utilisé pour suivre les services déjà créés
    const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
    const tacheMap = {};

    for (const element of data) {
      const sanitizedSousMenu = sanitizeClassName(element.sousMenu);

      // Créer un nouveau service s'il n'existe pas déjà
      if (!serviceMap[element.service]) {
        serviceMap[element.service] = true;

        // Ajoute le service en tant que section distincte dans le menu
        menu.innerHTML += `
        <div class="menu-item">
          <div class="menu-content pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">${element.service}</span>
          </div>
          <div id="service-${sanitizeClassName(element.service)}" class="service-content"></div>
        </div>
      `;
      }
      const serviceElement = document.getElementById(`service-${sanitizeClassName(element.service)}`);
      if (!service2Map[element.service2]) {
        service2Map[element.service2] = true
        serviceElement.innerHTML += `
        <div class="menu-item" style="padding-left: 10px;">
          <div class="menu-content pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">${element.service2}</span>
          </div>
          <div id="service-${sanitizeClassName(element.service2)}" class="service-content"></div>
        </div>
      `;
      }

      const service2Element = document.getElementById(`service-${sanitizeClassName(element.service2)}`);

      // Vérifie si le sous-menu pour ce service a déjà été créé
      if (element.idSousMenu != null && !sousMenuMap[element.sousMenu]) {
        sousMenuMap[element.sousMenu] = true; // Marque le sous-menu comme créé

        // Ajoute un sous-menu avec un toggle pour les tâches
        service2Element.innerHTML += `
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
          <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}">
            ${element.icon ? element.icon : ''} <!-- Affiche l'icône s'il existe -->
            <span class="menu-title">${element.sousMenu}</span>
            <span class="menu-arrow"></span>
          </span>
          <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
          </div>
        </div>
      `;
      }

      if (element.idSousMenu != null) {
        const sousMenuElement = service2Element.querySelector(`.content-${sanitizedSousMenu}`);
        sousMenuElement.innerHTML += `
        <div class="menu-link" id="nav-user-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
        <span class="menu-bullet">
        <span class="bullet bullet-dot"></span>
        </span>
        <span class="menu-title">${element.tache}</span>
        </div>
      `;
      }

      if (element.idSousMenu == null && !tacheMap[element.tache]) {
        tacheMap[element.tache] = true;

        // Récupérer l'icône pour chaque tâche
        const tacheIcon = await get_icon(element.tacheIcon);  // Attendre l'icône
        service2Element.innerHTML += `
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
          <span class="menu-link" data-bs-toggle="tab" data-bs-target="#tache${element.id}" >
            ${tacheIcon ? tacheIcon : ''} <!-- Affiche l'icône récupérée -->
            <span class="menu-title">${element.tache}</span>
          </span>
          <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
          </div>
        </div>
      `;
      }

      contenu.innerHTML += `
      <div class="tab-pane" id="tache${element.id}" role="tabpanel" aria-labelledby="tache${element.id}-tab">
        <div class="max-w-[325px] p-5 rounded-lg bg-gray-100 border-2">
          <h1 class="text-success text-center">${element.tache}</h1>
        </div>
        <div id="dynamic-content-${element.id}">
          <!-- Contenu dynamique sera chargé ici via AJAX ou une autre méthode -->
          Page indisponible
        </div>
      </div>
    `;

      if (element.url.length != 0) {
        fetch(`${element.url}`)
          .then((response) => response.text())
          .then((data) => {
            document.getElementById(`dynamic-content-${element.id}`).innerHTML = data;
          })
          .catch((error) => console.error("Error loading content:", error));
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//Liste des taches que l'agent n'a pas
function get_other_tache2(id_utilisateur, id_service) {
  let data = {
    action: 'get_other_tache',
    agent: id_utilisateur,
    service: id_service
  };

  var tache;

  fetch('/authentification/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  }).then((response) => response.json())
    .then((data) => {
      console.log(data);
      var tache = document.getElementById("tache2");
      tache.innerHTML = null;

      // Créez la liste non ordonnée (ul) où vous allez ajouter les éléments cliquables
      let taskList = document.createElement("ul");

      // Utilisez un objet pour stocker les optgroups (sous forme de sections pour les services)
      let optgroupMap = {};

      // Variable pour suivre l'élément actuellement cliqué
      let activeTaskItem = null;

      data.utilisateur.forEach((element) => {
        // Vérifiez si la section (optgroup) pour le service existe déjà
        if (!optgroupMap[element.nom_service]) {
          let serviceSection = document.createElement("li");
          let taskSubList = document.createElement("ul"); // Liste pour les tâches sous ce service
          serviceSection.appendChild(taskSubList);
          optgroupMap[element.nom_service] = taskSubList;
          taskList.appendChild(serviceSection);
        }

        let taskItem = document.createElement("li");
        taskItem.innerHTML = `<span><strong>${element.nom}</strong></span>`;
        taskItem.dataset.id = element.id_tache;

        taskItem.addEventListener("click", function () {
          console.log("ID de la tâche:", this.dataset.id);
          let btn = document.getElementById("btn");
          btn.innerHTML = `
 <i class="bi bi-arrow-left-circle btn btn-outline-success" id="icon" Onclick='add_tache_utilisateur(${id_utilisateur},${this.dataset.id})'></i>
    `;
          // Si un autre élément est déjà sélectionné, retirez-lui la classe active
          if (activeTaskItem) {
            activeTaskItem.classList.remove("active");
          }

          this.classList.add("active");

          // Enregistrez l'élément cliqué comme étant actif
          activeTaskItem = this;
        });

        // Ajoutez l'élément cliquable à la sous-liste correspondante
        optgroupMap[element.nom_service].appendChild(taskItem);
      });

      // Ajoutez la liste principale au DOM (par exemple, dans un élément de conteneur appelé 'tache2')
      document.getElementById("tache2").appendChild(taskList);
    });
}
//Liste des taches que l'agent a
function get_tache_user(id_utilisateur, id_service) {
  let data = {
    action: 'get_tache_utilisateur',
    agent: id_utilisateur,
    service: id_service
  };

  let tache;

  fetch('/authentification/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  }).then((response) => response.json())
    .then((data) => {
      console.log(data);
      var tache = document.getElementById("tache3");
      tache.innerHTML = null;

      let taskList = document.createElement("ul");

      let optgroupMap = {};

      // Variable pour suivre l'élément actuellement cliqué
      let activeTaskItem = null;

      data.utilisateur.forEach((element) => {
        // Vérifiez si la section (optgroup) pour le service existe déjà
        if (!optgroupMap[element.nom_service]) {
          let serviceSection = document.createElement("li");
          // serviceSection.innerHTML = `<h6><strong>${element.nom_service}</strong></h6>`;
          let taskSubList = document.createElement("ul");
          serviceSection.appendChild(taskSubList);
          optgroupMap[element.nom_service] = taskSubList;
          taskList.appendChild(serviceSection);
        }

        // Créez un nouvel élément cliquable (li) et ajoutez-le à la sous-liste correspondante
        let taskItem = document.createElement("li");
        taskItem.innerHTML = `<span><strong>${element.nom}</strong></span>`;
        taskItem.dataset.id = element.id_TU; // Stockez l'ID de la tâche dans un attribut de données

        // Ajoutez un écouteur d'événement pour capturer l'ID lors du clic
        taskItem.addEventListener("click", function () {
          console.log("ID de la tâche:", this.dataset.id);
          let btn = document.getElementById("btn");
          btn.innerHTML = `
 <i class="bi bi-arrow-right-circle btn btn-outline-danger" id="icon" Onclick='updateTacheUtilisateur(${this.dataset.id},${id_utilisateur})'></i>

    `;
          // Si un autre élément est déjà sélectionné, retirez-lui la classe active
          if (activeTaskItem) {
            activeTaskItem.classList.remove("active");
          }

          // Ajoutez la classe active à l'élément cliqué
          this.classList.add("active");

          // Enregistrez l'élément cliqué comme étant actif
          activeTaskItem = this;
        });

        // Ajoutez l'élément cliquable à la sous-liste correspondante
        optgroupMap[element.nom_service].appendChild(taskItem);
      });

      document.getElementById("tache3").appendChild(taskList);
    });
}
//Afficher les icons
// function get_icon() {
//   data = [];

//   var tache;
//   fetch(`controller.php?action=get_icon`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);

//       // Créez la liste non ordonnée (ul) où vous allez ajouter les éléments cliquables
//       let taskList = document.createElement("ul");

//       // Utilisez un objet pour stocker les optgroups (sous forme de sections pour les services)
//       let optgroupMap = {};

//       // Variable pour suivre l'élément actuellement cliqué
//       let activeTaskItem = null;

//       data.icon.forEach((element) => {
//         // Vérifiez si la section (optgroup) pour le service existe déjà
//         let serviceSection = document.createElement("li");
//         serviceSection.innerHTML = `<strong>${element.icon}</strong>`;
//         taskList.appendChild(serviceSection); // Ajoutez la section à la liste principale
//       });

//       // Ajoutez la liste principale au DOM (par exemple, dans un élément de conteneur appelé 'tache2')
//       document.getElementById("icon").appendChild(taskList);
//     });
// }
function selectIcon(iconId, element) {
  // Supprimer la classe "active" de toutes les icônes
  const allIcons = document.querySelectorAll('.icon-item, .dropdown-item'); // Correction : Séparateur correct entre les sélecteurs
  allIcons.forEach(icon => icon.classList.remove('active'));

  // Ajouter la classe "active" à l'icône sélectionnée
  element.classList.add('active');
  console.log("Id icon :", iconId);
  document.getElementById("selectedIconId").value = iconId;
  document.getElementById("selectedIconIdToEdit").value = iconId;
  // // document.getElementById("id_icon").value = iconId;
  // document.getElementById("id_icon_tache").value = iconId;
  // console.log(document.getElementById("id_icon_tache").value);
}

function validateIcon(event) {
  const iconInput = document.getElementById('iconInput').value.trim();
  const iconError = document.getElementById('iconError');

  // Validation pour différents types d'icônes
  const isValidSVG = /^<svg[\s\S]*<\/svg>$/.test(iconInput); // Icône SVG (balise complète)
  const isValidImg = /^<img[\s\S]*>$/.test(iconInput); // Balise <img>
  const isValidI = /^<i[\s\S]*<\/i>$/.test(iconInput); // Balise <i>
  const isValidSpan = /^<span[\s\S]*<\/span>$/.test(iconInput); // Balise <span>

  if (
    !isValidSVG &&
    !isValidImg &&
    !isValidI &&
    !isValidSpan
  ) {
    event.preventDefault(); // Empêche l'envoi du formulaire
    iconError.style.display = 'block'; // Affiche le message d'erreur
    iconError.textContent = 'Veuillez entrer une icône valide (FontAwesome, Bootstrap Icons, Material Icons, SVG, <i>, <img>, ou <span>).';
  } else {
    sendIconData(event); // Appelle la fonction pour envoyer les données
    iconError.style.display = 'none'; // Cache le message d'erreur
  }
}
async function sendIconData(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupérer les éléments du DOM une seule fois
  const form = document.querySelector('#addIconForm');
  const modalElement = document.getElementById('add_icon');
  const modal = modalElement ? bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement) : null;

  try {
    // Afficher un indicateur de chargement
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';
    submitButton.disabled = true;

    // Envoyer les données au backend
    const response = await fetch('/authentification/api', {
      method: 'POST',
      body: new FormData(form)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    submitButton.disabled = false; // Réactiver le bouton après la réponse
    submitButton.innerHTML = originalButtonText; // Réinitialiser le texte du bouton
    const data = await response.json();

    // Gérer la réponse du backend
    if (data.status === 'success') {
      await Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Icône ajoutée avec succès !',
        timer: 2000,
        showConfirmButton: false
      });

      form.reset();
      if (modal) modal.hide();

      // Optionnel: Recharger les données si nécessaire
      // loadIconsData(); 
    } else {
      throw new Error(data.message || 'Erreur inconnue du serveur');
    }
  } catch (error) {
    console.error('Erreur:', error);

    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.message || 'Une erreur est survenue lors de l\'envoi des données.',
      confirmButtonText: 'OK'
    });
  } finally {
    // Réactiver le bouton dans tous les cas
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  }
}
function updateSousMenuOne(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  // Sélectionner tous les boutons de soumission des formulaires
  const submitButton = document.querySelector('.submitEditSousMenuButton');
  submitButton.disabled = true;

  // Optionnel : Ajouter un indicateur de chargement
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> En cours...';

  const url = "api"; // URL de votre backend
  // Récupérer le formulaire
  const form = document.getElementById('editSousMenuFrom');

  if (!form) {
    console.error("Formulaire introuvable !");
    return;
  }

  // Créer un objet FormData à partir du formulaire
  const formData = new FormData(form);

  // Envoyer les données au backend avec fetch
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données.");
      }
      return response.json(); // Supposons que le backend renvoie une réponse JSON
    })
    .then((data) => {
      // Traiter la réponse du backend
      console.log("Réponse du backend :", data);
      submitButton.disabled = false;
      submitButton.innerHTML = originalText; // Réinitialiser le texte du bouton
      // Afficher un message de succès ou d'erreur
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: data.message || "Les données ont été envoyées avec succès.",
        });
        window.location.reload()
        KTDatatablesSousMenu.init(); // Rafraîchir la liste des sous-menus
        // Réinitialiser le formulaire
        form.reset();

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("edit_sous_menu"));
        if (modal) {
          modal.hide();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Une erreur est survenue lors de l'envoi des données.",
          showConfirmButton: true,
        });
      }
    })
    .catch((error) => {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'envoi des données.",
        showConfirmButton: true,
      });
    });
}


