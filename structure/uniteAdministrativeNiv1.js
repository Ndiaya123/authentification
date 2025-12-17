
async function init(){
  const menuViho = document.getElementById('menuViho') 
					const menuENT = document.getElementById('menu')
					const menuCollege = document.getElementById('menuCollege')
					if (menuENT) {
						
						document.getElementById('menu').innerHTML += `
						 <div class="menu-item">
										<div class="menu-content pb-2">
											<span class="menu-section text-muted text-uppercase fs-8 ls-1">Dashboard</span>
											<div id="user"></div>
										</div>
									</div>
						<div class="menu-item nav" >
											<div class="menu-link " id="nav-user-tab" data-bs-toggle="tab" data-bs-target="" type="button" role="tab" aria-controls="home" aria-selected="false">
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
	
												<a href="/adminHome" class="menu-title" >Acceuil</a>
												
	
											</div>
										</div>
						`;
					}else if(menuViho){
						menuViho.innerHTML +=`<li class="sidebar-main-title">
                    <div class="menu-content pb-2"><h6 class="text-primary">Dashboard</h6></div>
					</li>

					<li class="dropdown w-100" >
					
					<a href="/adminHome" class="nav-link menu-title link-nav">
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
                        <span>Acceuil</span>
                    </a>
					</li>
                </li>`
					}else if(menuCollege){
						menuCollege.innerHTML+=`
						<p class="text-muted nav-heading mt-4 mb-1">
            <span>Dashbord</span>
          </p>
		  <ul class="navbar-nav flex-fill w-100 mb-2">
		              <li class="nav-item w-100">
              <a href="/adminHome" class="nav-link">
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
                <span class="ml-3 item-text">Acceuil</span>
              </a>
			  </li>
			  </ul>
						`
					}
get_current_user()
  await UniteAdministrativeNiv1(getIDFromURL())
  await UniteAdministrativeNiv2(getIDFromURL())
  await UniteAdministrativeNiv3(getIDFromURL())
  // tache1(getIDFromURL())
  getCodeNiv(getIDFromURL())
  // get_icon(4).then((icons) => {
  //   console.log('Les icons après fetch :', icons);  // Afficher les données une fois résolues
  // })
  // Sélectionner toutes les balises <link> avec l'attribut rel="stylesheet"
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

  stylesheets.forEach(link => {
    // Vérifier si le lien pointe vers l'URL que vous voulez bloquer
    if (link.href === 'https://test.uahb.sn/assets/css/style.css') {
      link.remove();  // Supprimer le lien CSS
      console.log('Feuille de style supprimée : ' + link.href);
    } 
  });
}
init();

async function get_current_user() {
	const data = {
		action: 'current_user',
	};

	const queryString = new URLSearchParams(data).toString();

	try {
		const response = await fetch(`/authentification/api`);
    alert("ndiaya5");
alert(response);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json();
		console.log(result);

		if (result && result.length > 0) {

			if(document.getElementById("username")){

				document.getElementById("username").textContent = result[0].prenom + ' ' + result[0].nom;
			}

			statutPoste = result[0].statutPoste;
			

			
			const usernameElement = document.getElementById("username");
			if (usernameElement) {
				usernameElement.textContent = `${result[0].prenom} ${result[0].nom}`;
			}
			const useremailElement = document.getElementById("usermail");
			if (useremailElement) {
				useremailElement.textContent = result[0].email;
			}
			if (result[0].photo) {
				if(document.getElementById("photo")){

					document.getElementById("photo").src = result[0].photo;
				}
				if (document.getElementById("photo1")) {
					
					document.getElementById("photo1").src = result[0].photo;
				}
			}
			if(document.getElementById('nomAgent')){

				document.getElementById('nomAgent').innerHTML = `${result[0].prenom} ${result[0].nom}`;
			}

			if (document.getElementById("photo1")) {
				document.getElementById("photo1").src = 'dist_assets/media/avatars/blank.png';
			}
			document.getElementById("photo").src = '/dist_assets/media/avatars/blank.png';
		}

	} catch (error) {
		console.error('Error:', error);
	}
	
	
}
// Fonction pour décoder une chaîne en Base64
function decodeBase64(encodedString) {
  return atob(encodedString);
}

// Fonction qui s'exécute en fonction de l'ID
function executeBasedOnID(id) {
  return id
}

// Fonction pour obtenir l'ID depuis l'URL
function getIDFromURL() {
  // Exemple : URL = http://exemple.com/?id=encodedID
  const urlParams = new URLSearchParams(window.location.search);
  const encodedID = urlParams.get("id"); // Récupère l'ID encodé

  if (encodedID) {
    const decodedID = decodeBase64(encodedID); // Décoder l'ID
    return executeBasedOnID(decodedID); // Exécuter la fonction en fonction de l'ID
  } else {
    document.getElementById("result").innerHTML = "Aucun ID trouvé dans l'URL.";
  }
}

//Affichage des tache directement liée à l'unite administrative de niveau 1
function tache1(id) {
  fetch(`/authentification/api/tacheUA1/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log("Le menu Niv 1: ", data);
alert("ndiaya6");
alert(data);
      const menu = document.getElementById("menu");
      // const contenu = document.querySelector(".contenu");
      menu.innerHTML += ''; // Réinitialiser le contenu du menu
      const serviceMap = {}; // Utilisé pour suivre les services déjà créés
      const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
      const tacheMap = {};

      data.forEach(element => {
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
          console.log('Tin-tin')

          // Récupérer l'icône pour chaque tâche
          get_icon(element.tacheIcon).then(tacheIcon => {
            serviceElement.innerHTML += `
              <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
                <span class="menu-link" data-bs-toggle="tab" data-bs-target="#tache${element.id}">
                  ${tacheIcon ? tacheIcon : ''} <!-- Affiche l'icône récupérée -->
                  <span class="menu-title">${element.tache}</span>
                </span>
                <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu}" id="nav-tab" role="tablist">
                </div>
              </div>
            `;
          });
        }

        // contenu.innerHTML += `
        //   <div class="tab-pane" id="tache${element.id}" role="tabpanel" aria-labelledby="tache${element.id}-tab">
        //     <div class="max-w-[325px] p-5 rounded-lg bg-gray-100 border-2">
        //       <h1 class="text-success text-center">${element.tache}</h1>
        //     </div>
        //     <div id="dynamic-content-${element.id}">
        //       <!-- Contenu dynamique sera chargé ici via AJAX ou une autre méthode -->
        //       Page indisponible
        //     </div>
        //   </div>
        // `;

        //if (element.url.length != 0) {
        //fetch(`${element.url}`)
        //.then(response => response.text())
        //.then(data => {
        //  document.getElementById(`dynamic-content-${element.id}`).innerHTML = data;
        //})
        //.catch(error => console.error("Error loading content:", error));
        //}
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

function getCodeNiv(idUA) {
  // console.log('Id : ',idUA)
  let data = {
    action: 'get_codeNiv1',
    idUniteAdministrativeNiv: idUA,
  }
  let queryString = new URLSearchParams(data).toString()
  fetch(`/authentification/structure/get_codeNiv1/${idUA}`)
    .then((response) => {
      alert("ndiaya11");
alert(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Traiter la réponse comme JSON
    })
    .then((result) => {
      // console.log(result,' : ',result[0].codeNiv1)
      const structure = document.getElementById('nomStructure')
      // const service = document.getElementById('service')

      if(structure){
      structure.innerHTML = result[0].codeNiv1
      // service.innerHTML = result[0].codeNiv1
	}
    })
    .catch((error) => {
      console.error('Error:', error); // Afficher les erreurs dans la console
    });
}

function sanitizeClassName(name) {
  // Remplace les espaces et autres caractères spéciaux par un tiret
  return name.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

async function fetchItems(data) {
  let icons = [];

  try {
    // let response = await fetch(`/authentification/api/read/${id}`);
    // let data = await response.json();

    console.log("Le menu Niv 2: ", data);

    const menu = document.getElementById("menu");
    // const contenu = document.querySelector(".contenu");
    menu.innerHTML += ``; // Réinitialiser le contenu du menu
    const serviceMap = {}; // Utilisé pour suivre les services déjà créés
    const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
    const tacheMap = {};

    for (const element of data) {
      const sousMenuKey = sanitizeClassName(`${element.service}-${element.sousMenu}`)
      const contentKey = sanitizeClassName(`${element.service}`)
      const sanitizedSousMenu = sanitizeClassName(sousMenuKey);
      const sanitizedContent = sanitizeClassName(contentKey);

      // Créer un nouveau service s'il n'existe pas déjà
      if (!serviceMap[element.service]) {
        serviceMap[element.service] = true;

        // Ajoute le service en tant que section distincte dans le menu
        menu.innerHTML += `
            <div class="menu-item menu-accordion nav" data-kt-menu-trigger="click">
              <div class=" menu-content menu-link align-items-start justify-content-between" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedContent}" >
                <span class="menu-section text-muted text-uppercase fs-8 ls-1" >
                ${element.service}
                </span>
                <span class="menu-arrow"></span>

              </div>
              <div class="service-${sanitizeClassName(element.service)} service-content collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedContent} nav nav-tabs" id="nav-tab" role="tablist"></div>
            </div>
          `;
      }

      const serviceElement = document.querySelector(`.service-${sanitizeClassName(element.service)}`);

      // Vérifie si le sous-menu pour ce service a déjà été créé
      if (element.idSousMenu != null && !sousMenuMap[sousMenuKey]) {
        sousMenuMap[sousMenuKey] = true; // Marque le sous-menu comme créé

        // Ajoute un sous-menu avec un toggle pour les tâches
        serviceElement.innerHTML += `
            <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
              <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}" id="task${element.id}">
                ${element.icon ? element.icon : ''} <!-- Affiche l'icône s'il existe -->
                <span class="menu-title">${element.sousMenu}</span>
                <span class="menu-arrow"></span>
              </span>
              <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu} nav nav-tabs" id="nav-tab" role="tablist" >
              </div>
            </div>
          `;
      }

      if (element.idSousMenu != null) {
        const sousMenuElement = serviceElement.querySelector(`.content-${sanitizedSousMenu}`);
        sousMenuElement.innerHTML += `
            <div class="menu-link nav-link" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}')" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false" >
            <span class="menu-bullet">
            <span class="bullet bullet-dot"></span>
            </span>
            <span class="menu-title"id="task${element.id}" >${element.tache}</span>
            </div>
          `;
      }
      const tacheKey = sanitizeClassName(`${element.service}-${element.tache}`)
      if (element.idSousMenu == null && !tacheMap[tacheKey]) {
        tacheMap[tacheKey] = true;

        // Récupérer l'icône pour chaque tâche
        const tacheIcon = await get_icon(element.tacheIcon);  // Attendre l'icône
        serviceElement.innerHTML += `
            <div data-kt-menu-trigger="click" class="menu-item menu-accordion ${tacheKey}" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
              <span class="menu-link " id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}')">
                ${tacheIcon ? tacheIcon : ''}
                <span class="menu-title">${element.tache}</span>
              </span>
              <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist"></div>
            </div>
          `;
      }


    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function generateAdmissionMenu(data) {
    const menu = document.querySelector('#menuViho');
       const urlParams = new URLSearchParams(window.location.search);
  const encodedID = urlParams.get("id"); // Récupère l'ID encodé
    if (!menu) return;

    // menu.innerHTML = '<li class="back-btn"><div class="mobile-back text-end"><span>Back</span><i class="fa fa-angle-right ps-2" aria-hidden="true"></i></div></li>';
    // let response = await fetch(`/authentification/api/read/${id}`);
    // let data = await response.json();

    console.log("Le menu Niv 2: ", data);

    const serviceMap = {}, sousMenuMap = {}, tacheMap = {};

    for (const element of data) {
        const serviceKey = sanitizeClassName(element.service);
        const sousMenuKey = sanitizeClassName(`${element.service}-${element.sousMenu}`);
        const tacheKey = sanitizeClassName(`${element.service}-${element.tache}-${element.url}`);


        if (!serviceMap[serviceKey]) {
            serviceMap[serviceKey] = document.createElement('li');
            serviceMap[serviceKey].className = 'sidebar-main-title';
            serviceMap[serviceKey].innerHTML = `
                <nav class="menu-item">
                    <div class="menu-content pb-2"><h6 class="text-primary">${element.service}</h6></div>
                    <div class="text-dark service-list menu-item menu-accordion nav tab-pane service-${serviceKey}" role="tablist"></div>
                </nav>
            `;
            menu.appendChild(serviceMap[serviceKey]);
        }

        const serviceList = serviceMap[serviceKey].querySelector(`.service-${serviceKey}`);

        if (element.idSousMenu) {
            if (!sousMenuMap[sousMenuKey]) {
                sousMenuMap[sousMenuKey] = document.createElement('li');
                sousMenuMap[sousMenuKey].className = 'dropdown w-100';
                sousMenuMap[sousMenuKey].innerHTML = `
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion nav-link w-100" style="cursor:pointer;">
                        <span class="menu-content menu-link d-flex justify-content-between align-items-center w-100" data-bs-toggle="collapse" data-bs-target="#sousmenu-${sousMenuKey}">
                            <span class="d-flex align-items-center">${element.icon || ''}<span class="ms-2">${element.sousMenu}</span></span>
                            <span class="menu-arrow ms-auto" id="arrow-${sousMenuKey}"><i class="fa fa-angle-down"></i></span>
                        </span>
                    </div>
                    <ul class="collapse menu-sub menu-sub-accordion menu-active-bg nav nav-tabs" id="sousmenu-${sousMenuKey}" role="tablist"></ul>
                `;
                serviceList.appendChild(sousMenuMap[sousMenuKey]);
            }

            const tacheList = sousMenuMap[sousMenuKey].querySelector(`#sousmenu-${sousMenuKey}`);

            if (!tacheMap[tacheKey]) {
                const tacheLi = document.createElement('li');
                tacheLi.className = 'w-100';
                tacheLi.innerHTML = `<a href="${element.url+"?id="+encodedID}" class="menu-link nav-link" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}')>${element.tache}</a>`;
                tacheList.appendChild(tacheLi);
                tacheMap[tacheKey] = true;
            }
        } else {
            if (!tacheMap[tacheKey]) {
				const tacheIcon = await get_icon(element.tacheIcon);
                const tacheLi = document.createElement('li');
                tacheLi.className = 'w-100';
                tacheLi.innerHTML = `
                    <a href="${element.url+"?id="+encodedID}" class="nav-link menu-title">
                        ${tacheIcon ? tacheIcon : ''}
                        <span>${element.tache}</span>
                    </a>
                `;
                serviceList.appendChild(tacheLi);
                tacheMap[tacheKey] = true;
            }
        }
    }

    // Événements d’interaction
    menu.addEventListener('click', function (e) {
        const menuLink = e.target.closest('[data-bs-toggle="collapse"]');
        if (!menuLink) return;

        e.preventDefault();
        const targetId = menuLink.getAttribute('data-bs-target');
        const collapseEl = document.querySelector(targetId);
        const menuItem = menuLink.closest('.menu-item');
        const arrow = menuLink.querySelector('.menu-arrow i') || menuLink.closest('.menu-item').querySelector('.menu-arrow i');

        if (menuItem.classList.contains('bg-primary')) return;

        deactivateAllMenuItems();

        menuItem.classList.add('bg-primary');
        if (arrow) arrow.classList.replace('fa-angle-down', 'fa-angle-up');
        if (collapseEl) new bootstrap.Collapse(collapseEl, { show: true });
    });

    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}
async function generateCollegeMenu(data, titreSection = null) {
	const menu = document.querySelector("#menuCollege");
   const urlParams = new URLSearchParams(window.location.search);
  const encodedID = urlParams.get("id"); // Récupère l'ID encodé

	// Optionnel : vider le menu
	// menu.innerHTML = "";
    // let response = await fetch(`/authentification/api/read/${id}`);
    // let data = await response.json();



	// Regrouper les tâches par service et sousMenu
	const grouped = {};

	data.forEach(item => {
		const service = item.service || titreSection;
		const sousMenu = item.sousMenu;
		if (!grouped[service]) grouped[service] = {};

		if (item.idSousMenu) {
			if (!grouped[service][sousMenu]) {
				grouped[service][sousMenu] = { icon: item.icon, taches: [] };
			}
			grouped[service][sousMenu].taches.push(item);
		} else {
			if (!grouped[service]['__taches__']) {
				grouped[service]['__taches__'] = [];
			}
			grouped[service]['__taches__'].push(item);
		}
	});

	for (const service in grouped) {
		// Titre de section
		const heading = document.createElement('p');
		heading.className = "text-muted nav-heading mt-4 mb-1";
		heading.innerHTML = `<span>${titreSection || service}</span>`;
		menu.appendChild(heading);

		const ul = document.createElement('ul');
		ul.className = "navbar-nav flex-fill w-100 mb-2";

		// Sous-menus
		for (const sousMenu in grouped[service]) {
			if (sousMenu === '__taches__') continue;

			const { icon, taches } = grouped[service][sousMenu];
			const collapseId = `collapse-${service.replace(/\s+/g, '')}-${sousMenu.replace(/\s+/g, '')}`;

			const li = document.createElement('li');
			li.className = "nav-item dropdown";
			li.innerHTML = `
				<a href="#${collapseId}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle nav-link">
					${icon || ''}
					<span class="ml-3 item-text">${sousMenu}</span>
				</a>
				<ul class="collapse list-unstyled pl-4 w-100" id="${collapseId}"></ul>
			`;

			const ulTaches = li.querySelector('ul');
			taches.forEach(tache => {
				const tacheLi = document.createElement('li');
				tacheLi.className = "nav-item";
				tacheLi.innerHTML = `
					<a class="nav-link pl-3" href="${tache.url+"?id="+encodedID}">
						<span class="ml-1 item-text">${tache.tache}</span>
					</a>
				`;
				ulTaches.appendChild(tacheLi);
			});
			ul.appendChild(li);
		}

		// Tâches sans sous-menu
		if (grouped[service]['__taches__']) {
			grouped[service]['__taches__'].forEach(async tache => {
				const tacheIcon = await get_icon(tache.tacheIcon);

				const li = document.createElement('li');
				li.className = "nav-item w-100";
				li.innerHTML = `
					<a class="nav-link" href="${tache.url+"?id="+encodedID}">
						${tacheIcon || ''}
						<span class="ml-3 item-text">${tache.tache}</span>
					</a>
				`;
				ul.appendChild(li);
			});
		}

		menu.appendChild(ul);
	}
}

function loadContentOnClick(tacheId, url, autreRessource) {
    const urlParams = new URLSearchParams(window.location.search);
  const encodedID = urlParams.get("id"); // Récupère l'ID encodé

 window.location.href = url+"?id="+encodedID

}
async function UniteAdministrativeNiv1(id){
let response = await fetch(`/authentification/api/tacheUA1/${id}`);
alert("ndiaya1");
alert(response);
    let data = await response.json();
    console.log('Unite Administrative Niv 1 : '+data)

    const menuViho = document.getElementById('menuViho') 
					const menuENT = document.getElementById('menu')
					const menuCollege = document.getElementById('menuCollege')
					if (menuENT) {
						
    await fetchItems(data);

					}else if(menuViho){
					
                        await generateAdmissionMenu(data)
					}else if(menuCollege){
		
            await generateCollegeMenu(data, titreSection = null);
					}

}
async function UniteAdministrativeNiv2(id){
let response = await fetch(`/authentification/api/read/${id}`);
alert("ndiaya2");
alert(response);
    let data = await response.json();
    console.log('Unite Administrative Niv 2 : '+data)

    const menuViho = document.getElementById('menuViho') 
					const menuENT = document.getElementById('menu')
					const menuCollege = document.getElementById('menuCollege')
					if (menuENT) {
						
    await fetchItems(data.utilisateur);

					}else if(menuViho){
					
                        await generateAdmissionMenu(data.utilisateur)
					}else if(menuCollege){
		
            await generateCollegeMenu(data.utilisateur, titreSection = null);
					}

}
async function UniteAdministrativeNiv3(id){
let response = await fetch(`/authentification/api/tacheUA3/${id}`);
alert("ndiaya3");
alert(response);
    let data = await response.json();
    console.log('Unite Administrative Niv 3 : '+data)
    const menuViho = document.getElementById('menuViho') 
					const menuENT = document.getElementById('menu')
					const menuCollege = document.getElementById('menuCollege')
					if (menuENT) {
						
    await fetchItems(data);

					}else if(menuViho){
					
                        await generateAdmissionMenu(data)
					}else if(menuCollege){
		
            await generateCollegeMenu(data, titreSection = null);
					}

}



async function get_icon(id) {
  let icon = null;
  try {
    let response = await fetch(`/authentification/api/get_icon`);
    alert("ndiaya4");
alert(response);
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


function showIcon(id) {
  // Vérifier si le tableau `icons` a bien été rempli
  if (tab.length === 0) {
    console.log('Le tableau des icônes est vide ou n’a pas encore été rempli.');
    return;
  }

  console.log('Les icons actuellement disponibles :', icons);  // Afficher les icônes actuelles
  console.log('ID recherché :', id);

  icons.forEach((element) => {
    if (element.id == id) {
      console.log(
        'Tâche iconID :', id,
        'Icon ID :', element.id,
        '<br> Icon :', element.icon
      );
    }
  });
}
