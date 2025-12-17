 getQualification() 
//Fonction pour récupérer les taches structure pour les affecter à des qualifications
getTacheQualification() 
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
        window.location.reload()
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