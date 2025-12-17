document.addEventListener(('DOMContentLoaded'), () => {
})
fetchItems()
  const menu = document.getElementById("menu");
menu.innerHTML = `
<div class="menu-item">
                                    <div class="menu-content pb-2">
                                        <span class="menu-section text-muted text-uppercase fs-8 ls-1">Dashboard</span>
                                        <div id="user"></div>
                                    </div>
                                </div>
<a class="menu-item nav" href="/adminHome">
                                <div class="menu-link " id="nav-user-tab" data-bs-toggle="tab" type="button" role="tab" aria-selected="false">
                                    <span class="menu-icon">
                                        <span class="svg-icon svg-icon-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <rect x="2" y="2" width="9" height="9" rx="2" fill="black" />
                                                <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black" />
                                                <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black" />
                                                <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black" />
                                            </svg>
                                        </span>
                                    </span>
                                    <span class="menu-title">Acceuil</span>
                                </div>
                            </a>`; // Réinitialiser le contenu du menu
function sanitizeClassName(name) {
  // Remplace les espaces et autres caractères spéciaux par un tiret
  return name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

async function fetchItems() {
  data = [];

  try {
    let response = await fetch(
      `/authentification/api/get_default`
    );
    let data = await response.json();

    console.log("Le menu : ", data);

    const menu = document.getElementById("menu");
    menu.innerHTML += ``; // Réinitialiser le contenu du menu
    const serviceMap = {}; // Utilisé pour suivre les services déjà créés
    const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
    const tacheMap = {};

    for (const element of data) {
      console.log("Tache : ", element.tache);

      const sanitizedSousMenu = sanitizeClassName(element.sousMenu);



      // Vérifie si le sous-menu pour ce service a déjà été créé
      if (element.idSousMenu != null && !sousMenuMap[element.sousMenu]) {
        sousMenuMap[element.sousMenu] = true; // Marque le sous-menu comme créé

        // Ajoute un sous-menu avec un toggle pour les tâches
        menu.innerHTML += `
            <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav"> 
              <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}">
                ${element.icon ? element.icon : ""
          } <!-- Affiche l'icône s'il existe -->
                <span class="menu-title">${element.sousMenu}</span>
                <span class="menu-arrow"></span>
              </span>
              <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
              </div>
            </div>
          `;
      }

      if (element.idSousMenu != null) {
        const sousMenuElement = menu.querySelector(
          `.content-${sanitizedSousMenu}`
        );
        sousMenuElement.innerHTML += `
            <div class="menu-link nav-link" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}')" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
              <span class="menu-bullet">
                <span class="bullet bullet-dot"></span>
              </span>
              <span class="menu-title" id="task${element.id}">${element.tache}</span>
            </div>
          `;
      }

      if (element.idSousMenu == null && !tacheMap[element.tache]) {
        tacheMap[element.tache] = true;

        // Récupérer l'icône pour chaque tâche
        const tacheIcon = await get_icon(element.tacheIcon); // Attendre l'icône
        menu.innerHTML += `
          <div data-kt-menu-trigger="click" class="menu-item menu-accordion" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
              <span class="menu-link " id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}')">
                ${tacheIcon ? tacheIcon : ''}
                <span class="menu-title">${element.tache}</span>
              </span>
              <div class="collapse menu-sub menu-sub-accordion menu-active-bg nav nav-tabs" id="nav-tab" role="tablist"></div>
            </div>
            `;

      }

      if (element.url && element.url.trim() !== "") {
        fetch(`${element.url}`)
          .then((response) => response.text())
          .then((data) => {
            document.getElementById(`dynamic-content-${element.id}`).innerHTML =
              data;
          })
          .catch((error) => console.error("Error loading content:", error));
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  // Vérifiez si les données POST sont disponibles

}

async function get_icon(id) {
  let icon = null;
  try {
    let response = await fetch(`/authentification/api/get_icon`);
    let data = await response.json();

    data.forEach((element) => {
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

function loadContentOnClick(tacheId, url, autreRessource) {
  window.location.href = url+'?default=true';
}
