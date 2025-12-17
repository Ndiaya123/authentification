let idCurrentTask
async function init() {
	// Récupérer l'URL courante du navigateur
	const currentUrl = window.location.href;

	// Envoyer l'URL au backend avec l'action 'isUrlAllowed'
	fetch('/authentification/apiPersonnel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			action: 'isUrlAllowed',
			url: currentUrl
		}).toString()
	})
		.then(response => response.json())
		.then(data => {
			console.log('Réponse du backend :', data);
			idCurrentTask = data.idTache
			//   if(data.status == 'error'){
			// 	window.location = '/home'

			// 	}
		})
		.catch(error => {
			console.error('Erreur lors de la requête :', error);
		})
	await allIcons()
	await get_current_user()

	let lastSelectedAgent = null;
	const select_agent = document.getElementById("agentSelectForTask");
	const select_directeur = document.getElementById("listDirecteur");
	if (select_agent) {
		select_agent.addEventListener('change', function () {
			// Récupérer la valeur sélectionnée et la diviser en id et qualification
			let selectedAgent = select_agent.value;
			if (selectedAgent == "") return; // Si aucune sélection, ne rien faire
			let [idAgent, qualification] = selectedAgent.split('|'); // Décompose la valeur en id et qualification
			select_directeur.value = "";
			if (idAgent !== lastSelectedAgent) {
				lastSelectedAgent = idAgent;
				console.log('Id agent : ', idAgent);
				Userqualification = qualification
				UserId = idAgent
				console.log('Qualification : ', Userqualification); // Affiche la qualification pour vérification

				getChefTacheNiv2ToAffect(idUACurrentUser);
				getChefTacheNiv2ToRestrict(idUACurrentUser);
			}
		});
	}
	if (select_directeur) {
		select_directeur.addEventListener('change', function () {
			// Récupérer la valeur sélectionnée et la diviser en id et qualification
			let selectedAgent = select_directeur.value;
			if (selectedAgent == "") return; // Si aucune sélection, ne rien faire
			let [idAgent, qualification] = selectedAgent.split('|'); // Décompose la valeur en id et qualification
			select_agent.value = "";
			if (idAgent !== lastSelectedAgent) {
				lastSelectedAgent = idAgent;
				console.log('Id agent : ', idAgent);
				Userqualification = qualification
				UserId = idAgent
				console.log('Qualification : ', Userqualification); // Affiche la qualification pour vérification

				// // getChefTacheNiv2ToAffect(idUACurrentUser);
				// getChefTacheNiv2ToRestrict(idUACurrentUser);
				// const tachesIncarnee = listTacheIncarnée.filter(tache => !listeTacheToRestrict.includes(tache));
				// displayTaches(tachesIncarnee)
			}
		});
	}
	getDirecteurForSelect()
}
init()
document.addEventListener('popstate', function (event) {
	// Vérifiez si l'utilisateur a cliqué sur le bouton "Précédent"
	if (event.state) {
		// Rechargez la page ou effectuez une action spécifique
		location.reload(); // Recharge la page actuelle
	}
})
let icons = []
let listeService = []
let listeTacheToRestrict = []
let listeTacheToAffect = []
let listTacheIncarnée = []

let listeIdNiv2 = []
let listeIdNiv3 = []
let listeAgent = []
let listeAgentChef = []
let listeAgentSousChef = []
let Userqualification
let UserId = null
let idUACurrentUser
let statutPoste
let niveauUniteAdministrative
let selectedAgent

function sanitizeClassName(name) {
	// Remplace les espaces et autres caractères spéciaux par un tiret
	return name.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

async function getAgent() {
	const data = { action: "get_agent" };
	const queryString = new URLSearchParams(data).toString();
	const select_agent = document.getElementById("agentSelectForTask");
	// const loadingMessage = document.getElementById("loadingMessage");
	// let refresh = document.getElementById('refreshAgent')

	// Vérifier si les données sont déjà dans le localStorage
	const storedAgents = localStorage.getItem('listeAgentChef');
	if (storedAgents) {
		try {
			listeAgentChef = JSON.parse(storedAgents);
			refreshAgents();
			console.log('Agents récupérés depuis le localStorage : ', listeAgentChef);
			return;
		} catch (e) {
			console.error("Erreur lors du parsing du localStorage, récupération depuis l'API.", e);
			// Si parsing échoue, on continue pour récupérer depuis l'API
		}
	}
	// Afficher le message de chargement
	// loadingMessage.style.display = "block";
	// refresh.style.display = "none"

	try {
		const response = await fetch(`/authentification/apiPersonnel/get_agent`);
		const responseData = await response.json();
		const agents = responseData.utilisateur;
		console.table(agents);

		listeAgentChef = agents;
		// Stocker la liste des agents dans le localStorage
		localStorage.setItem('listeAgentChef', JSON.stringify(listeAgentChef));
		refreshAgents();


		console.log('Agents : ', listeAgentChef);

	} catch (error) {
		console.error("Erreur lors de la récupération des agents : ", error);
	}
}

// Fonction pour traiter chaque agent et renvoyer les détails à ajouter au select
async function processAgent(agent) {
	const data = {
		action: 'getInfos',
		matricule: agent.matricule
	};

	const queryString = new URLSearchParams(data).toString();

	try {
		const response = await fetch(`/authentification/apiPersonnel/getInfos/user/${agent.matricule}`);
		if (!response.ok) throw new Error('Network response was not ok');

		const result = await response.json();
		console.log(listeAgentChef);

		// Condition sur le statut du poste
		if (statutPoste === 1) {
			if (result[0].idUniteAdministrativeNiv2 != null &&
				(listeIdNiv2.includes(result[0].idUniteAdministrativeNiv2) || listeIdNiv3.includes(result[0].idUniteAdministrativeNiv2))) {
				return formatAgentData(result[0], agent); // Formate et retourne les données de l'agent
			} else if (result[0].idUniteAdministrativeNiv3 != null &&
				(listeIdNiv2.includes(result[0].idUniteAdministrativeNiv3) || listeIdNiv3.includes(result[0].idUniteAdministrativeNiv3))) {
				return formatAgentData(result[0], agent);
			}
		} else if (statutPoste === 2) {
			let tache = document.getElementById('responsabilite');
			tache.innerHTML = '';
		}
		console.log(listeAgentChef);

		// console.log(listeAgentSousChef);

	} catch (error) {
		console.error("Erreur lors de la récupération des informations de l'agent : ", error);
	}
}

// Fonction pour formater les données de l'agent avant de les ajouter au select
function formatAgentData(agentData, element) {
	return {
		nom: agentData.nom,
		prenom: agentData.prenom,
		qualification: agentData.qualification,
		id: element.id,
		idUniteAdministrative: agentData.idUniteAdministrative
	};
}
function refreshAgents() {
	const select_agent = document.getElementById("agentSelectForTask");
	const loadingMessage = document.getElementById("loadingMessage");
	// select_agent.innerHTML = ` `;
	// let refresh = document.getElementById('refreshAgent')
	// if (loadingMessage.style.display == "none") {
	//   refresh.style.display = "block"
	// }else if (refresh.style.display == "block") {
	//   refresh.style.display = "none"

	// }
	let lastSelectedAgent = null;

	listeAgentChef.forEach(agent => addOptionToSelect(agent, select_agent, listeAgentChef));
	console.log(listeAgentChef)
	//loadingMessage.style.display == "none"
	select_agent.addEventListener('change', function () {
		// Récupérer la valeur sélectionnée et la diviser en id et qualification
		let selectedAgent = select_agent.value;
		let [idAgent, qualification] = selectedAgent.split('|'); // Décompose la valeur en id et qualification

		if (idAgent !== lastSelectedAgent) {
			lastSelectedAgent = idAgent;
			console.log('Id agent : ', idAgent);
			Userqualification = qualification
			UserId = idAgent
			console.log('Qualification : ', Userqualification); // Affiche la qualification pour vérification

			const listDirecteur = document.getElementById("listDirecteur")
			getChefTacheNiv2ToRestrict(idUACurrentUser)
			if (listDirecteur.value == "") {
				getChefTacheNiv2ToAffect(idUACurrentUser)
			} else {
				setTimeout(() => {
					const tachesIncarnee = listTacheIncarnée.filter(tache =>
						!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
					);
					displayTaches(tachesIncarnee)
				}, 1000)
			}
		}
	});
}

// Fonction pour ajouter une option au select et mettre à jour la liste correspondante
function addOptionToSelect(agent, selectElement) {
	// const select_agent = document.getElementById("agent");
	console.log(selectElement.textContent)
	console.log(agent.prenom, ' ', agent.nom);
	let option = document.createElement("option");
	option.innerHTML = `${agent.prenom} ${agent.nom}`;
	option.value = `${agent.id}|${agent.qualification}`;
	selectElement.appendChild(option);
	console.log('La valeur du select : ', option.value);
	console.log('La taille du select : ', selectElement.length)
	// agentList.push(agent);
}

//Modification de mot de pass
function update_compte(event) {
	event.preventDefault(); // Empêcher le rechargement de la page
	const id = document.getElementById("id").value;
	const password = document.getElementById("password").value;
	const confirm = document.getElementById("confirmPassword").value;

	if (password != confirm) {
		Swal.fire({
			position: "center",
			icon: "error",
			title: "Ressaisisez votre mot de pass",
			showConfirmButton: true,
			// timer: 3000
		});
	} else {
		Swal.fire({
			position: "center",
			icon: "success",
			title: "Mot de pass correct",
			showConfirmButton: false,
			timer: 3000,
		});
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
					window.location.reload()
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
	// Créer un objet data avec les valeurs récupérées

}

function getChefTacheNiv2ToRestrict(idUniteAdministrative) {
	selectedTachesIds = [];

	const data = {
		action: 'getChefTacheNiv2ToRestrict',
		// idUniteAdministrative: idUniteAdministrative,
		id: UserId
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getChefTacheNiv2ToRestrict/${UserId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then(result => {
			// console.log('L\'ensemble des tâches : ', result);
			const taches = document.getElementById('tache3');
			const divService = document.getElementById('services');
			if (!taches || !divService) {
				console.error('Élément avec l\'ID "tache3" ou "services" non trouvé');
				return;
			}

			// Réinitialiser les listes
			taches.innerHTML = '';
			//divService.innerHTML = '';
			listeTacheToRestrict = [];
			// listeService = [];

			// Générer les boutons de filtres par service (sousMenu)
			for (const tache of result) {
				// if (!listeService.includes(tache.sousMenu)) {
				//   console.log('Les filtres : ', tache.sousMenu);
				//   // Création des boutons de filtre de service
				//   const btnService = document.createElement('span');
				//   btnService.classList.add('btn', 'btn-outline-primary', 'm-2');
				//   btnService.textContent = tache.idSousMenu == null ? '...' : tache.sousMenu;

				//   // Ajouter un événement de clic pour filtrer les tâches
				//   btnService.addEventListener('click', () => filterService(tache.sousMenu, btnService));

				//   divService.appendChild(btnService);
				//   listeService.push(tache.sousMenu);
				// }
				listeTacheToRestrict.push(tache);
			}

			displayTaches2(listeTacheToRestrict);
		})
		.catch(error => {
			console.error('Erreur lors de la récupération des tâches :', error);
		});
}
function getChefTacheNiv2ToAffect(idUniteAdministrative) {
	selectedTachesIds = [];

	const data = {
		action: 'getChefTacheNiv2ToAffect',
		idUniteAdministrative: idUniteAdministrative,
		idUtilisateur: UserId
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getChefTacheNiv2ToAffect/gestionTache/${idUniteAdministrative}/${UserId}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then((result) => {
			console.log('L\'ensemble des tâches 2: ', result);
			const taches = document.getElementById('tache2');
			const divService = document.getElementById('services');
			if (!taches || !divService) {
				console.error('Élément avec l\'ID "tache3" ou "services" non trouvé');
				return;
			}

			// Réinitialiser les listes
			taches.innerHTML = '';
			//divService.innerHTML = '';
			listeTacheToAffect = [];

			// Générer les boutons de filtres par service (sousMenu)
			for (const tache of result) {
				// if (!listeService.includes(tache.sousMenu)) {
				//   console.log('Les filtres : ', tache.sousMenu);
				//   // Création des boutons de filtre de service
				//   const btnService = document.createElement('span');
				//   btnService.classList.add('btn', 'btn-outline-primary', 'm-2');
				//   if (tache.idSousMenu == null) {
				//     btnService.textContent = '...';
				//   } else {
				//     btnService.textContent = tache.sousMenu;
				//   }
				//   // Ajouter un événement de clic pour filtrer les tâches
				//   btnService.addEventListener('click', () => filterService(tache.sousMenu, btnService));

				//   divService.appendChild(btnService);
				//   listeService.push(tache.sousMenu);
				// }
				listeTacheToAffect.push(tache);
			}

			console.log(listeTacheToAffect);
			// Afficher toutes les tâches par défaut
			displayTaches(listeTacheToAffect);
		})
		.catch((error) => {
			console.error('Erreur lors de la récupération des tâches :', error);
		});
}

async function allIcons() {
	try {
		let response = await fetch(`/authentification/apiPersonnel/get_icon`);
		let data = await response.json();
		icons = data
	} catch (error) {
		console.error('Erreur lors de la récupération de l\'icône :', error);
	}
}
//Récupération d'icon
async function get_icon(id) {
	let icon = null;
	icons.forEach((element) => {
		if (id == element.id_icon) {
			icon = element.icon;
		}
	});
	return icon;
}



//Affichage de toute des informations de tout les utilisateurs inscript
function getInfosAgent(matricule) {
	const data = {
		action: 'getInfos',
		matricule: matricule
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getInfos/user/${matricule}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then((result) => {
			if (result[0].id) {

			}
			if (result[0].idUniteAdministrativeNiv1 != null) {

				console.log('Agent de l\'Unité Administrative de niveau 1 ', result[0].idUniteAdministrativeNiv1)
				console.log(result[0].nom)

			} else if (result[0].idUniteAdministrativeNiv2 != null) {
				if (listeIdNiv2.includes(result[0].idUniteAdministrativeNiv2)) {
					console.log(result[0].nom);

				}

				console.log('Agent de l\'Unité Administrative de niveau 2 ', result[0].idUniteAdministrativeNiv2)

			} else if (result[0].idUniteAdministrativeNiv3 != null) {
				if (listeIdNiv2.includes(result[0].idUniteAdministrativeNiv2)) {
					console.log(result[0].nom);

				}

				console.log('Agent de l\'Unité Administrative de niveau 3 ', result[0].idUniteAdministrativeNiv3)
				console.log(result[0].nom)
			}

			let newObject = {
				nom: result[0].nom,
				prenom: result[0].prenom,
				id: result[0].id,

			}
			return newObject
		})
	console.table(listeAgent, ['nom'])
}

//Récupération des information de l'utilisateur connecté
async function get_current_user() {
	const data = {
		action: 'current_user',
	};

	const queryString = new URLSearchParams(data).toString();

	try {
		const response = await fetch(`/authentification/apiPersonnel/current_user`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json();
		console.log(result);

		if (result && result.length > 0) {
			if (result[0].PosteAResponsabilite === 'OUI') {
				if (result[0].grade === 1 && result[0].sans === 1) {
					const menuViho = document.getElementById('menuViho')
					const menuENT = document.getElementById('#kt_aside_menu')
					const menuCollege = document.getElementById('menuCollege')
					if (menuENT) {

						document.getElementById('#kt_aside_menu').innerHTML += `
						 <div class="menu-item">
										<div class="menu-content pb-2">
											<span class="menu-section text-muted text-uppercase fs-8 ls-1">Dashboard</span>
											<div id="user"></div>
										</div>
									</div>
						<div class="menu-item nav" >
											<div class="menu-link currentTask" id="nav-user-tab" data-bs-toggle="tab" data-bs-target="" type="button" role="tab" aria-controls="home" aria-selected="false">
												<span class="menu-icon">
													<span class="svg-icon svg-icon-2">
														<!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo2\dist/../src/media/svg/icons\Code\Git3.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect x="0" y="0" width="24" height="24"/>
        <path d="M7,11 L15,11 C16.1045695,11 17,10.1045695 17,9 L17,8 L19,8 L19,9 C19,11.209139 17.209139,13 15,13 L7,13 L7,15 C7,15.5522847 6.55228475,16 6,16 C5.44771525,16 5,15.5522847 5,15 L5,9 C5,8.44771525 5.44771525,8 6,8 C6.55228475,8 7,8.44771525 7,9 L7,11 Z" fill="#000000" opacity="0.3"/>
        <path d="M6,21 C7.1045695,21 8,20.1045695 8,19 C8,17.8954305 7.1045695,17 6,17 C4.8954305,17 4,17.8954305 4,19 C4,20.1045695 4.8954305,21 6,21 Z M6,23 C3.790861,23 2,21.209139 2,19 C2,16.790861 3.790861,15 6,15 C8.209139,15 10,16.790861 10,19 C10,21.209139 8.209139,23 6,23 Z" fill="#000000" fill-rule="nonzero"/>
        <path d="M18,7 C19.1045695,7 20,6.1045695 20,5 C20,3.8954305 19.1045695,3 18,3 C16.8954305,3 16,3.8954305 16,5 C16,6.1045695 16.8954305,7 18,7 Z M18,9 C15.790861,9 14,7.209139 14,5 C14,2.790861 15.790861,1 18,1 C20.209139,1 22,2.790861 22,5 C22,7.209139 20.209139,9 18,9 Z" fill="#000000" fill-rule="nonzero"/>
        <path d="M6,7 C7.1045695,7 8,6.1045695 8,5 C8,3.8954305 7.1045695,3 6,3 C4.8954305,3 4,3.8954305 4,5 C4,6.1045695 4.8954305,7 6,7 Z M6,9 C3.790861,9 2,7.209139 2,5 C2,2.790861 3.790861,1 6,1 C8.209139,1 10,2.790861 10,5 C10,7.209139 8.209139,9 6,9 Z" fill="#000000" fill-rule="nonzero"/>
    </g>
</svg><!--end::Svg Icon-->
													</span>
												</span>
	
												<a href="/gestion-taches" class="menu-title" >Gestion des taches</a>
												
	
											</div>
										</div>
						`;
					} else if (menuViho) {
						menuViho.innerHTML += `<li class="sidebar-main-title">
                    <div class="menu-content pb-2"><h6 class="text-primary">Dashboard</h6></div>
					</li>

					<li class="dropdown w-100" >
					
					<a href="/gestion-taches" class="nav-link menu-title link-nav currentTask">
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
                        <span>Gestion des taches</span>
                    </a>
					</li>
                </li>`
					} else if (menuCollege) {
						menuCollege.innerHTML += `
						<p class="text-muted nav-heading mt-4 mb-1">
            <span>Dashbord</span>
          </p>
		  <ul class="navbar-nav flex-fill w-100 mb-2">
		              <li class="nav-item w-100 currentTask">
              <a href="/gestion-taches" class="nav-link">
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
                <span class="ml-3 item-text">Gestion des taches</span>
              </a>
			  </li>
			  </ul>
						`
					}
					// Vérifie si on est bien sur la page gestion-taches
					if (window.location.href === '/gestion-taches') {
						document.getElementById('#kt_aside_menu').querySelectorAll('.menu-link').forEach(link => {
							link.classList.remove('active');
						});
						// Active le lien "Gestion des taches"
						const gestionTachesLink = document.querySelector('.currentTask');
						if (gestionTachesLink) {
							gestionTachesLink.classList.add('active');
						}
					}
				}
				if (result[0].statutPoste === 1) {
					// Vérifie si on est bien sur la page gestionTache.php
					if (window.location.pathname.endsWith('gestion-taches')) {
						await getAgent();
					}
				}
			}
			statutPoste = result[0].statutPoste;
			await getAllIdUniteAdministrativeNiv2();
			await getAllIdUniteAdministrativeNiv3();
			if (result[0].idUniteAdministrativeNiv1 != null) {
				niveauUniteAdministrative = 1;
				idUACurrentUser = result[0].idUniteAdministrativeNiv1;
				await fetchItems(result[0].idUniteAdministrativeNiv1, result[0].PosteAResponsabilite, 1);
				console.log('Unité Administrative de niveau 1 ', result[0].idUniteAdministrativeNiv1);
			} else if (result[0].idUniteAdministrativeNiv2 != null) {
				niveauUniteAdministrative = 2;
				idUACurrentUser = result[0].idUniteAdministrativeNiv2;
				const vihoTemple = document.querySelector('.main-navbar');
				const tinydashMasterTemple = document.querySelector('.vertnav')

				if (vihoTemple) {

					fetchItemsForViho(result[0].idUniteAdministrativeNiv2, result[0].PosteAResponsabilite, 2)
				} else if (tinydashMasterTemple) {
					fetchItemsForTinydashMaster(result[0].idUniteAdministrativeNiv2, result[0].PosteAResponsabilite, 2)
				} else {
					await fetchItems(result[0].idUniteAdministrativeNiv2, result[0].PosteAResponsabilite, 2);
				} console.log('Unité Administrative de niveau 2 ', result[0].idUniteAdministrativeNiv2);
			} else if (result[0].idUniteAdministrativeNiv3 != null) {
				niveauUniteAdministrative = 3;
				idUACurrentUser = result[0].idUniteAdministrativeNiv3;
				const vihoTemple = document.querySelector('.main-navbar');
				const tinydashMasterTemple = document.querySelector('.vertnav')

				if (vihoTemple) {

					fetchItemsForViho(result[0].idUniteAdministrativeNiv3, result[0].PosteAResponsabilite, 3)
				} else if (tinydashMasterTemple) {
					fetchItemsForTinydashMaster(result[0].idUniteAdministrativeNiv2, result[0].PosteAResponsabilite, 3)
				} else {
					await fetchItems(result[0].idUniteAdministrativeNiv3, result[0].PosteAResponsabilite, 3);
				} console.log('Unité Administrative de niveau 3 ', result[0].idUniteAdministrativeNiv3);
			}


			const usernameElement = document.getElementById("username");
			if (usernameElement) {
				usernameElement.textContent = `${result[0].prenom} ${result[0].nom}`;
			}
			const useremailElement = document.getElementById("usermail");
			if (useremailElement) {
				useremailElement.textContent = result[0].email;
			}
			const kt_header_user_menu_toggle = document.getElementById('kt_header_user_menu_toggle')
			if (kt_header_user_menu_toggle) {
				kt_header_user_menu_toggle.querySelector('img').src = result[0].photo;
				const logoutInput = kt_header_user_menu_toggle.querySelector('#kt_user_menu_dark_mode_toggle');
				kt_header_user_menu_toggle.querySelector('a').src = '/logout'
				if (logoutInput) {
					logoutInput.setAttribute('data-kt-url', `/logout?id=${result[0].id}`);
				}
			}
			if (document.getElementById("photo")) {

				document.getElementById("photo").src = result[0].photo || 'dist_assets/media/avatars/blank.png';
			}
			if (document.getElementById("photo1")) {

				document.getElementById("photo1").src = result[0].photo || 'dist_assets/media/avatars/blank.png';
			}

			document.getElementById('userName').innerHTML = `${result[0].prenom} ${result[0].nom}`;
			await getAllIdUniteAdministrativeNiv2();
			await getAllIdUniteAdministrativeNiv3();
		} else {
			if (result[0].idUniteAdministrativeNiv1 != null) {
				niveauUniteAdministrative = 1;

			} else if (result[0].idUniteAdministrativeNiv2 != null) {
				niveauUniteAdministrative = 2;
			} else if (result[0].idUniteAdministrativeNiv3 != null) {
				niveauUniteAdministrative = 3;
			}
			document.getElementById("photo1").src = 'dist_assets/media/avatars/blank.png';
			document.getElementById("photo").src = 'dist_assets/media/avatars/blank.png';
		}
	} catch (error) {
		console.error('Error:', error);
	}

	if (statutPoste === 1) {
	}
	const vihoTemple = document.querySelector('.main-navbar');
	const tinydashMasterTemple = document.querySelector('.vertnav')
	getCode()
	if (vihoTemple) {
		// alert('Viho Temple !!!');
		await getTacheStructureForViho();
		await getDefaulTasksForViho()
	} else if (tinydashMasterTemple) {
		// alert('tinydashMasterTemple !!')
		await getTacheStructureFortinydashMaster()
		await getDefaulTasksForTinydashMaster()
	} else {
		await getTacheStructure();
		await getDefaulTasks();

	}

	console.log('La liste des agents du chef : ', listeAgentChef);
	console.log('La liste des agents du sous-chef : ', listeAgentSousChef);
}

//Récupération des id de toute l'unité administrative de niveau 2
function getAllIdUniteAdministrativeNiv2() {
	const data = {
		action: 'getAllIdUniteAdministrativeNiv2',
		idUniteAdministrative: idUACurrentUser
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getAllIdUniteAdministrativeNiv2/${idUACurrentUser}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then((result) => {
			// console.log('Les id du niveau 2',result)
			for (let i = 0; i < result.length; i++) {
				listeIdNiv2.push(result[i].id)
			}

			// console.log('Le tableau de id du niveau 2',listeIdNiv2)
		})
}
//Récupération des id de toute l'unité administrative de niveau 3
function getAllIdUniteAdministrativeNiv3() {
	const data = {
		action: 'getAllIdUniteAdministrativeNiv3',
		id: idUACurrentUser
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getAllIdUniteAdministrativeNiv3/${idUACurrentUser}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then((result) => {
			// console.log(result)

			for (let i = 0; i < result.length; i++) {
				listeIdNiv3.push(result[i].id)
			}

			// console.log('Le tableau de id du niveau 3',listeIdNiv3)
		})
}

//Affichage des taches du service
function getAllTacheNivService(idUniteAdministrative, niveauUniteAdministrative) {
	selectedTachesIds = []

	const data = {
		action: 'getTacheSousChef',
		idUniteAdministrative: idUniteAdministrative,
		niveauUniteAdministrative: niveauUniteAdministrative
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/apiPersonnel/getTacheSousChef/taches/${idUniteAdministrative}/${niveauUniteAdministrative}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then((result) => {
			console.log('L\'ensemble des taches : ', result)
			let taches = document.getElementById('tache2')
			taches.innerHTML = ``
			for (const tache of result) {
				if (!listeService.includes(tache.service)) {
					console.log(tache.service)
					listeService.push(tache.service)
				}
				taches.innerHTML += `
  <div class="tache-${tache.id} d-flex align-items-center bg-light-warning rounded p-5 mb-3 w-400px ">
  <div type="button" class="flex-grow-1 me-2" onclick="selectTache(${tache.id})">
  <span class="fw-bolder text-gray-800 text-hover-primary fs-6">${tache.tache} </span>
  </div>
  </div>
  `

			}

		})
}
let selectedTachesIds = [];
function selectTache(id, action) {
	console.log(id)
	let oneTache = document.querySelector(`.tache-${id}`)
	// Tableau pour stocker les ID des éléments cliqués

	const tacheId = id;
	console.log("ID de la tâche sélectionnée :", tacheId);

	// Basculer entre les classes CSS

	if (oneTache.classList.contains('bg-light-warning')) {
		oneTache.classList.remove('bg-light-warning')
		oneTache.classList.add('bg-primary')
	} else if (oneTache.classList.contains('bg-primary')) {
		oneTache.classList.remove('bg-primary')
		oneTache.classList.add('bg-light-warning')
	}
	// oneTache.classList.toggle('bg-light-warning');
	// oneTache.classList.toggle('bg-primary');

	// Vérifier si la tâche est active (c'est-à-dire si elle a la classe 'bg-primary')
	if (oneTache.classList.contains('bg-primary')) {
		// Ajouter l'ID au tableau si l'élément est activé
		if (!selectedTachesIds.includes(tacheId)) {
			selectedTachesIds.push(tacheId);
		}
	} else {
		// Retirer l'ID du tableau si l'élément est désactivé
		selectedTachesIds = selectedTachesIds.filter(id => id !== tacheId);
	}
	let actionDiv = document.querySelector(`.${action}`)
	if (selectedTachesIds.length >= 1) {
		actionDiv.setAttribute('disabled', true);
		actionDiv.classList.remove('btn-warning')
		actionDiv.classList.add('disabled', 'btn-secondary')
		if (action == 'restriction') {
			document.querySelector(`.attribution`).classList.remove('disabled', 'btn-secondary')
			document.querySelector(`.attribution`).classList.add('btn-outline-success')
		} else if (action == 'attribution') {
			document.querySelector(`.restriction`).classList.remove('disabled', 'btn-secondary')
			document.querySelector(`.restriction`).classList.add('btn-outline-warning')
		}
	} else if (selectedTachesIds.length == 0) {
		document.querySelector(`.attribution`).classList.add('disabled', 'btn-secondary')
		document.querySelector(`.restriction`).classList.add('disabled', 'btn-secondary')

		// actionDiv.classList.remove('disabled', 'btn-secondary')
		// if (action == 'restriction') {
		// 	actionDiv.classList.add('btn-outline-warning')

		// } else if (action == 'attribution') {
		// 	actionDiv.classList.add('btn-outline-success')

		// }
	}

	// Afficher les IDs des tâches sélectionnées
	console.log("IDs des tâches sélectionnées :", selectedTachesIds);

}

function octroiementTache() {
	let attribution = document.querySelector('.attribution')
	restriction = document.querySelector('.restriction')

	//restriction.classList.remove('disabled', 'btn-secondary')
	//restriction.classList.add('btn-outline-warning')
	Swal.fire({
		title: "Êtes-vous sûr ?",
		text: "Voulez-vous vraiment attribuée les tâches ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		cancelButtonText: "NON !",
		confirmButtonText: "OUI !",
		didClose: () => {
			if (!attribution.classList.contains('disabled')) {
				attribution.classList.remove('btn-outline-success')
				attribution.classList.add('disabled', 'btn-secondary')
			} else if (!restriction.classList.contains('disabled')) {
				restriction.classList.remove('btn-outline-warning')
				restriction.classList.add('disabled', 'btn-secondary')
			}
		}
	}).then((result) => {
		if (result.isConfirmed) {
			for (let i = 0; i < selectedTachesIds.length; i++) {

				add_tache_utilisateur(selectedTachesIds[i])
			}
			if (!attribution.classList.contains('disabled')) {
				attribution.classList.remove('btn-outline-success')
				attribution.classList.add('disabled', 'btn-secondary')
			} else if (!restriction.classList.contains('disabled')) {
				restriction.classList.remove('btn-outline-warning')
				restriction.classList.add('disabled', 'btn-secondary')
			}
		} else {
			const listDirecteur = document.getElementById("listDirecteur")
			getChefTacheNiv2ToRestrict(idUACurrentUser)
			if (listDirecteur.value == "") {
				getChefTacheNiv2ToAffect(idUACurrentUser)
			} else {
				setTimeout(() => {
					const tachesIncarnee = listTacheIncarnée.filter(tache =>
						!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
					);
					displayTaches(tachesIncarnee)
				}, 1000)
			}
		}
	});
}
//Attribution de tache
function add_tache_utilisateur(idTache) {

	let data = {
		action: "add_tache_utilisateur",
		id_tache: idTache,
		id_utilisateur: UserId,
		qualification: Userqualification
	};

	fetch(`/authentification/apiPersonnel`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			} else {

			}
			return response.json(); // Changez pour text() pour inspecter le contenu
		})
		.then((reponse) => {
			try {
				// const data = JSON.parse(text); // Essayez de parser le texte en JSON
				console.log('Statuts reponse : ' + reponse.status);
				if (reponse.status == 'error') {
					// Manipulez la réponse comme vous le souhaitez
					Swal.fire({
						position: "center",
						icon: 'info',
						title: reponse.message,
						showConfirmButton: true,
					});
				} else {
					Swal.fire({
						position: "center",
						icon: "success",
						title: "Tâche affectée avec succée",
						showConfirmButton: false,
						timer: 1500
					});
				}
				const select_agent = document.getElementById("service");

				// get_other_tache2(id_utilisateur,select_agent.valuer);
				const listDirecteur = document.getElementById("listDirecteur")
				getChefTacheNiv2ToRestrict(idUACurrentUser)
				if (listDirecteur.value == "") {
					getChefTacheNiv2ToAffect(idUACurrentUser)
				} else {
					setTimeout(() => {
						const tachesIncarnee = listTacheIncarnée.filter(tache =>
							!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
						);
						displayTaches(tachesIncarnee)
					}, 1000)
				}
				// location.reload(); // Manipulez la réponse comme vous le souhaitez
			} catch (error) {
				console.error("Error parsing JSON:", error);
				console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
			}
		});
}

function restrictionTache() {

	// attribution.classList.remove('disabled', 'btn-secondary')
	// attribution.classList.add('btn-outline-success')
	Swal.fire({
		title: "Êtes-vous sûr ?",
		text: "Voulez-vous vraiment retirée les tâches ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		cancelButtonText: "NON !",
		confirmButtonText: "OUI !",
		didClose: () => {
			let restriction = document.querySelector('.restriction')
			let attribution = document.querySelector('.attribution')
			if (!restriction.classList.contains('disabled')) {
				restriction.classList.remove('btn-outline-warning')
				restriction.classList.add('disabled', 'btn-secondary')
			} else if (!attribution.classList.contains('disabled')) {
				attribution.classList.remove('btn-outline-success')
				attribution.classList.add('disabled', 'btn-secondary')
			}
		}
	}).then((result) => {
		if (result.isConfirmed) {
			for (let i = 0; i < selectedTachesIds.length; i++) {
				console.log('Agent ID : ', selectedAgent)
				console.log('Tache : ', selectedTachesIds[i])
				restrict_tache_utilisateur(selectedTachesIds[i], selectedAgent)
			}

		} else {

			const listDirecteur = document.getElementById("listDirecteur")
			getChefTacheNiv2ToRestrict(idUACurrentUser)
			if (listDirecteur.value == "") {
				getChefTacheNiv2ToAffect(idUACurrentUser)
			} else {
				setTimeout(() => {
					const tachesIncarnee = listTacheIncarnée.filter(tache =>
						!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
					);
					displayTaches(tachesIncarnee)
				}, 1000)
			}
		}
	});
}
//Attribution de tache
function restrict_tache_utilisateur(idTache, idUtilisateur) {
	let data = {
		action: "restricteTache",
		idTache: idTache,
		idUtilisateur: UserId,
	};

	fetch(`/authentification/apiPersonnel`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			// else{
			//   Swal.fire({
			//     position: "center",
			//     icon: "success",
			//     title: "Tache attribuée",
			//     showConfirmButton: true,
			//     // timer: 1500
			//   });
			// }
			return response.text(); // Changez pour text() pour inspecter le contenu
		}).then((reponse) => {
			console.log(reponse);
			if (reponse.status == 'success') {
				Swal.fire({
					position: "center",
					icon: "success",
					title: reponse.message,
					showConfirmButton: true,
					// timer: 1500
				});
			}
			try {
				const select_agent = document.getElementById("service");
				const listDirecteur = document.getElementById("listDirecteur")
				getChefTacheNiv2ToRestrict(idUACurrentUser)
				if (listDirecteur.value == "") {
					getChefTacheNiv2ToAffect(idUACurrentUser)
				} else {
					setTimeout(() => {
						const tachesIncarnee = listTacheIncarnée.filter(tache =>
							!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
						);
						displayTaches(tachesIncarnee)
					}, 1000)

				}
				// get_other_tache2(id_utilisateur,select_agent.valuer);

				// const data = JSON.parse(text); // Essayez de parser le texte en JSON
				// location.reload(); // Manipulez la réponse comme vous le souhaitez
			} catch (error) {
				console.error("Error parsing JSON:", error);
				console.log("Response text:", text); // Affichez le texte de la réponse pour inspection
			}
		});
}
function refreshTache2() {
	const divService = document.getElementById('services');
	divService.innerHTML = '<i class="bi bi-arrow-clockwise btn text-primary w-50px" style="font-size: 1.5rem" onclick="refreshTache2()"></i>'
	let restriction = document.querySelector('.restriction')

	restriction.classList.remove('disabled', 'btn-secondary')
	restriction.classList.add('btn-outline-warning')
	if (statutPoste == 1) {

		getChefTacheNiv2ToAffect(idUACurrentUser, selectedAgent)
	} else if (statutPoste == 2) {
		getAllTacheNivService(idUACurrentUser, niveauUniteAdministrative)

	}
}

let currentActiveService = null; // Variable pour suivre le service actuellement actif

// Affichage des tâches de la structure
async function getAllTacheNiv(idUniteAdministrative, niveauUniteAdministrative) {

	selectedTachesIds = [];

	const data = {
		action: 'getTacheChef',
		idUniteAdministrative: idUniteAdministrative,
		niveauUniteAdministrative: niveauUniteAdministrative

	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	try {
		// Requête Fetch vers le serveur
		const response = await fetch(`/authentification/apiPersonnel/getTacheChef/taches/${idUniteAdministrative}/${niveauUniteAdministrative}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json(); // Traiter la réponse comme JSON
		console.log('L\'ensemble des tâches : ', result);

		const taches = document.getElementById('tache2');
		const divService = document.getElementById('services');

		if (!taches || !divService) {
			console.error('Élément avec l\'ID "tache2" ou "services" non trouvé');
			return;
		}

		// Réinitialiser les listes
		taches.innerHTML = '';
		divService.innerHTML += '';
		listeTache = result;
		listeService = [];

		// Générer les boutons de filtres par service (sousMenu)
		for (const tache of result) {
			if (!listeService.includes(tache.sousMenu)) {
				console.log('Les filtres : ', tache.sousMenu)
				// Création des boutons de filtre de service
				const btnService = document.createElement('span');
				btnService.classList.add('btn', 'btn-outline-primary', 'm-2');

				btnService.textContent = tache.sousMenu;
				// Ajouter un événement de clic pour filtrer les tâches
				btnService.addEventListener('click', () => filterService(tache.sousMenu, btnService));

				divService.appendChild(btnService);
				listeService.push(tache.sousMenu);
			}
		}

		// Afficher toutes les tâches par défaut
		displayTaches(result);

	} catch (error) {
		console.error('Erreur lors de la récupération des tâches :', error);
	}
	// getAllTacheNiv2(idUniteAdministrative,niveauUniteAdministrative)
}
async function getAllTacheNiv2(idUniteAdministrative, niveauUniteAdministrative) {
	selectedTachesIds = [];

	const data = {
		action: 'getTacheChef2',
		idUniteAdministrative: idUniteAdministrative,
		niveauUniteAdministrative: niveauUniteAdministrative

	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	try {
		// Requête Fetch vers le serveur
		const response = await fetch(`/authentification/apiPersonnel/getTacheChef2/taches/${idUniteAdministrative}/${niveauUniteAdministrative}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json(); // Traiter la réponse comme JSON
		console.log('L\'ensemble des tâches : ', result);
		const taches = document.getElementById('tache2');
		const divService = document.getElementById('services');
		if (!taches || !divService) {
			console.error('Élément avec l\'ID "tache2" ou "services" non trouvé');
			return;
		}

		// Réinitialiser les listes
		taches.innerHTML += '';
		divService.innerHTML += '';
		// listeTache += result;
		// listeService = [];

		// Générer les boutons de filtres par service (sousMenu)
		for (const tache of result) {
			if (!listeService.includes(tache.sousMenu)) {
				console.log('Les filtres : ', tache.sousMenu)
				// Création des boutons de filtre de service
				const btnService = document.createElement('span');
				btnService.classList.add('btn', 'btn-outline-primary', 'm-2');
				if (tache.idSousMenu == null) {

					btnService.textContent = '...';
				} else {

					btnService.textContent = tache.sousMenu;
				}
				// Ajouter un événement de clic pour filtrer les tâches
				btnService.addEventListener('click', () => filterService(tache.sousMenu, btnService));

				divService.appendChild(btnService);
				listeService.push(tache.sousMenu);
			}
			listeTache.push(tache)
		}

		console.log(listeTache)
		// Afficher toutes les tâches par défaut
		displayTaches(listeTache);

	} catch (error) {
		console.error('Erreur lors de la récupération des tâches :', error);
	}
}

// Fonction pour afficher les tâches (réutilisée pour afficher toutes les tâches ou filtrées)

// Fonction pour afficher les tâches (réutilisée pour afficher toutes les tâches ou filtrées)
function displayTaches(tachesToDisplay) {
	console.log(tachesToDisplay)
	const taches = document.getElementById("tache2");
	taches.innerHTML = ""; // Effacer les anciennes tâches
	const divService = document.getElementById("services");
	divService.innerHTML = ""; // Effacer les anciennes service
	// Fragment pour les boutons de service et les tâches
	const fragmentServices = document.createDocumentFragment();
	const fragmentTaches = document.createDocumentFragment();

	// Set pour éviter les doublons dans les boutons de service
	const listeService = new Set();

	if (tachesToDisplay.length === 0) {
		taches.innerHTML += `
	<div class="tache-null d-flex align-items-center bg-light-warning rounded p-5 mb-3 w-400px">
	  <div type="button" class="flex-grow-1 me-2">
		<span class="fw-bolder text-gray-800 text-hover-primary fs-6">Aucune Tache</span>
		</div>
		</div>
		`;
	} else {
		// Itération sur les tâches
		for (const tache of listeTacheToAffect) {
			// Création des boutons de filtre de service uniquement si le service n'a pas encore été ajouté
			if (!listeService.has(tache.sousMenu)) {
				console.log("Les filtres : ", tache.sousMenu);

				const btnService = document.createElement("span");
				btnService.classList.add("btn", "btn-outline-primary");
				btnService.style.fontSize = "12px";  // Change la taille de la police
				btnService.textContent = tache.idSousMenu === null ? "..." : tache.sousMenu;

				// Ajouter un événement de clic pour filtrer les tâches
				btnService.addEventListener("click", () => filterService(tache.sousMenu, btnService));

				// Ajouter le bouton au fragment
				fragmentServices.appendChild(btnService);

				// Ajouter le service à l'ensemble pour éviter les doublons
				listeService.add(tache.sousMenu);
			}
		}
		for (const tache of tachesToDisplay) {

			// Création de la tâche à afficher
			const divTache = document.createElement("div");
			divTache.classList.add("tache-" + tache.id, "d-flex", "align-items-center", "bg-light-warning", "rounded", "p-5", "mb-3", "w-400px");
			divTache.setAttribute("onclick", `selectTache(${tache.id},'restriction')`);

			const divContent = document.createElement("div");
			divContent.classList.add("flex-grow-1", "me-2");
			const spanTache = document.createElement("span");
			spanTache.classList.add("fw-bolder", "text-gray-800", "text-hover-primary", "fs-6");
			spanTache.textContent = tache.tache;
			divContent.appendChild(spanTache);
			divTache.appendChild(divContent);

			// Ajouter la tâche au fragment
			fragmentTaches.appendChild(divTache);
		}

		// Ajouter les éléments générés au DOM en une seule opération
		divService.appendChild(fragmentServices);
		taches.appendChild(fragmentTaches);
	}
}

// Fonction pour filtrer les tâches par service (sousMenu) avec un seul service actif à la fois
function filterService(sousMenu, btnService) {
	console.log("Filtrer par service :", sousMenu);

	// Désactiver l'ancien service actif
	const allButtons = document.querySelectorAll("#services .btn"); // Sélectionner tous les boutons
	allButtons.forEach((button) => {
		button.classList.remove("btn-primary"); // Supprimer la classe active de tous les boutons
		button.classList.add("btn-outline-primary"); // Restaurer la classe btn-outline-primary pour tous
	});

	// Activer le bouton de service sélectionné
	btnService.classList.remove("btn-outline-primary"); // Retirer la classe btn-outline-primary du bouton cliqué
	btnService.classList.add("btn-primary"); // Ajouter la classe active au bouton cliqué
	currentActiveService = btnService; // Mettre à jour le service actif

	// Filtrer les tâches correspondant au service sélectionné
	const filteredTaches = listeTacheToAffect.filter(
		(tache) => tache.sousMenu === sousMenu
	);
	console.log(filteredTaches)

	// Afficher uniquement les tâches correspondant au service filtré
	displayTaches(filteredTaches);
}

function displayTaches2(tachesToDisplay) {
	const taches = document.getElementById("tache3");
	taches.innerHTML = ""; // Effacer les anciennes tâches

	if (tachesToDisplay.length == 0) {
		taches.innerHTML += `
	<div class="tache-null d-flex align-items-center bg-light-warning rounded p-5 mb-3 w-400px ">
	<div type="button" class="flex-grow-1 me-2">
	<span class="fw-bolder text-gray-800 text-hover-primary fs-6">Aucune Tache</span>
	</div>
	</div>
	`;
	} else {
		for (const tache of tachesToDisplay) {
			taches.innerHTML += `
	<div class="tache-${tache.id} d-flex align-items-center bg-light-warning rounded p-5 mb-3 w-400px "  onclick="selectTache(${tache.id},'attribution')">
	<div type="button" class="flex-grow-1 me-2">
	<span class="fw-bolder text-gray-800 text-hover-primary fs-6">${tache.tache}</span>
	</div>
	</div>
	`;
			// console.log(tache.sousMenu)
		}
	}
}

async function getCode() {
	let data = {
		action: 'get_code',
	};

	let queryString = new URLSearchParams(data).toString();

	try {
		const response = await fetch(`/authentification/apiPersonnel/get_code`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json(); // Traiter la réponse comme JSON
		console.log(result);
		const kt_toolbar_container = document.getElementById('kt_toolbar_container')
		const structure = document.getElementById('structure');
		const service = document.getElementById('service');
		console.log('Le niveau de l\'unité administrative : ', niveauUniteAdministrative)
		if (niveauUniteAdministrative == 2) {
			// structure.innerHTML = result[0].codeNiv1;
			// service.innerHTML = result[0].codeNiv2;
			kt_toolbar_container.innerHTML = `<div data-kt-swapper="true" data-kt-swapper-mode="prepend" data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}" class="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
                                <h1 class="d-flex align-items-center text-dark fw-bolder fs-3 my-1">${result[0].codeNiv1}
                                </h1>
                                <span class="h-20px border-gray-200 border-start mx-4"></span>
                                <ul class="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
                                    <a href="javascript:void(0)" class="text-dark text-hover-primary">${result[0].codeNiv2}</a>
                                    <span class="h-20px border-gray-200 border-start mx-4"></span>

                                    
                                </ul>
                            </div>`
		} else if (niveauUniteAdministrative == 3) {
			// structure.innerHTML = result[0].codeNiv2;
			// service.innerHTML = result[0].codeNiv3;
			kt_toolbar_container.innerHTML = `<div data-kt-swapper="true" data-kt-swapper-mode="prepend" data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}" class="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
                                <h1 class="d-flex align-items-center text-dark fw-bolder fs-3 my-1">${result[0].codeNiv2}
                                </h1>
                                <span class="h-20px border-gray-200 border-start mx-4"></span>
                                <ul class="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
                                    <a href="javascript:void(0)" class="text-dark text-hover-primary">${result[0].codeNiv3}</a>
                                    <span class="h-20px border-gray-200 border-start mx-4"></span>

                                    
                                </ul>
                            </div>`
		}
	} catch (error) {
		console.error('Error:', error); // Afficher les erreurs dans la console
	}
}
async function getDefaulTasks() {
	let data = {
		action: 'getDefaultTasks',
	}
	let queryString = new URLSearchParams(data).toString();
	try {
		let response = await fetch(`/authentification/apiPersonnel/getDefaultTasks`);
		let data = await response.json();

		console.log("Le menu Niv 2: ", data);

		const menu = document.getElementById("#kt_aside_menu");
		// const contenu = document.querySelector(".contenu");
		menu.innerHTML += ``; // Réinitialiser le contenu du menu
		const serviceMap = {}; // Utilisé pour suivre les services déjà créés
		const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
		const tacheMap = {};

		for (const element of data) {
			const contentKey = sanitizeClassName(`${element.service}`);
			const sanitizedContent = sanitizeClassName(contentKey);
			const sousMenuKey = sanitizeClassName(`${element.service}-${element.sousMenu}`);
			const tacheKey = sanitizeClassName(`${element.service}-${element.tache}`);
			const sanitizedSousMenu = sanitizeClassName(sousMenuKey);

			if (!serviceMap['default'] && element.idTypeTache == 3) {
				serviceMap['default'] = true;

				menu.innerHTML += `
	  <div class="menu-item">
		<div class="menu-content pb-2">
		  <span class="menu-section text-muted text-uppercase fs-8 ls-1">Default</span>
		  </div>
		  <div id="service-${sanitizeClassName('default')}" class="service-content  content-${sanitizedContent} menu-item menu-accordion nav"  data-kt-menu-trigger="click" id="nav-tab" role="tablist"></div>
		  </div>
		  `;
			}

			const defaultService = document.getElementById(`service-${sanitizeClassName('default')}`);

			if (element.idSousMenu != null && !sousMenuMap[sousMenuKey]) {
				sousMenuMap[sousMenuKey] = true;
				defaultService.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
	  <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-defaultSousMenu">
		${element.icon ? element.icon : ''}
	<span class="menu-title">${element.sousMenu}</span>
	<span class="menu-arrow"></span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-defaultSousMenu nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;

			}

			if (element.idSousMenu != null) {
				const defaultSousMenu = defaultService.querySelector(`.content-defaultSousMenu`);
				defaultSousMenu.innerHTML += `
	<div class="menu-link nav-link ${tacheKey}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-bullet">
		<span class="bullet bullet-dot"></span>
		</span>
		<span class="menu-title" id="task${element.id}">${element.tache}</span>
		</div>
		`;

			}

			if (element.idSousMenu == null && !tacheMap[tacheKey]) {
				tacheMap[tacheKey] = true;
				const tacheIcon = await get_icon(element.tacheIcon);
				defaultService.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion ${tacheKey}" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-link" id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})">
		${tacheIcon ? tacheIcon : ''}
	<span class="menu-title">${element.tache}</span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;
			}
		}

		// Activation de la tâche courante dans le menu
		if (typeof idCurrentTask !== "undefined" && idCurrentTask) {
			const activeLink = menu.querySelector(`[onclick^="loadContentOnClick(${idCurrentTask},"]`);
			if (activeLink) {
				activeLink.classList.add('active');
				// Ouvre les parents (collapse) si besoin
				let parentCollapse = activeLink.closest('.collapse.menu-sub');
				if (parentCollapse && parentCollapse.classList.contains('collapse')) {
					parentCollapse.classList.add('show');
					const parentMenuItem = parentCollapse.closest('.menu-item');
					if (parentMenuItem) {
						//parentMenuItem.classList.add('bg-primary');
						const arrow = parentMenuItem.querySelector('.menu-arrow');
						if (arrow) arrow.classList.add('open');
					}
				}
			}
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}
	// Vérifiez si les données POST sont disponibles
	if (postData && postData.tacheId) {
		const { tacheId, url, autreRessource } = postData;
		console.log(postData)
		const tache = document.getElementById(`task${tacheId}`)
		tache.classList.add('active')
		// Activer la tâche correspondante
		const currentContent = document.getElementById(`tache${tacheId}`);
		if (currentContent) {
			const contenuBodies = document.querySelectorAll('.tab-pane');
			contenuBodies.forEach(contenuBody => contenuBody.classList.remove('active')); // Désactiver les autres
			currentContent.classList.add('active'); // Activer le contenu de la tâche
		}

		// Charger le contenu de l'URL
		if (url) {
			const contentElement = document.getElementById(`dynamic-content-${tacheId}`);
			if (contentElement) {
				fetch(`${url}?_=${new Date().getTime()}`)
					.then(response => response.text())
					.then(data => {
						contentElement.innerHTML = data;

						// Charger le script supplémentaire s'il existe
						if (autreRessource) {
							if (autreRessource.includes(';')) {
								// Diviser les autreRessource par point-virgule et les parcourir
								autreRessource.split(';').forEach(function (src) {
									if (src.trim() !== '') { // Vérifier que la source n'est pas vide
										if (!document.querySelector(`script[src="${src.trim()}"]`)) {

											var script = document.createElement('script');
											script.src = src.trim(); // Supprimer les espaces superflus
											script.type = 'text/javascript';
											script.async = true; // Peut être ajusté selon le besoin
											document.body.appendChild(script);

										}
									}
								});
							} else {
								// Si une seule source est fournie, vérifier et l'ajouter directement
								if (!document.querySelector(`script[src="${autreRessource.trim()}"]`)) {
									var script = document.createElement('script');
									script.src = autreRessource.trim();
									script.type = 'text/javascript';
									script.async = true; // Peut être ajusté selon le besoin
									document.body.appendChild(script);
								}
							}
						}
					})
					.catch(error => console.error("Erreur lors du chargement du contenu :", error));
			}
		}
	}
}
//Affichage des element du sidebar
async function fetchItems(idUA, responsabilite, niveauUA) {
	let data = {
		action: 'getTache',
		idUniteAdministrativeNiv: idUA,
		responsabilite: responsabilite,
		niveauUniteAdministrative: niveauUA
	};

	let queryString = new URLSearchParams(data).toString();
	try {
		let response = await fetch(`/authentification/apiPersonnel/getTache/sidebar/${idUA}/${responsabilite}/${niveauUA}`);
		let items = await response.json();

		// Mettre la tâche nommée "Acceuil" ou "Accueil" en premier si elle existe
		const idx = items.findIndex(el => el.tache && ['acceuil', 'accueil'].includes(el.tache.toLowerCase()));
		if (idx > -1) {
			const [acceuilItem] = items.splice(idx, 1);
			items.unshift(acceuilItem);
		}

		listTacheIncarnée = items;
		console.log("Le menu Niv 2: ", items);
		const menu = document.getElementById("#kt_aside_menu");
		// const contenu = document.querySelector(".contenu");
		menu.innerHTML += ``; // Réinitialiser le contenu du menu
		const serviceMap = {}; // Utilisé pour suivre les services déjà créés
		const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
		const tacheMap = {};

		let acceuilUrl = null;

		for (const element of items) {
			const contentKey = sanitizeClassName(`${element.service}`);
			const sanitizedContent = sanitizeClassName(contentKey);
			const sousMenuKey = sanitizeClassName(`${element.service}-${element.sousMenu}`);
			const tacheKey = sanitizeClassName(`${element.service}-${element.tache}`);
			const sanitizedSousMenu = sanitizeClassName(sousMenuKey);

			// Capture l'URL de la tâche 'acceuil'
			if (element.tache && ['acceuil','accueil'].includes(element.tache.toLowerCase()) && element.url) {
				acceuilUrl = element.url;
			}

			if (!serviceMap['default'] && element.idTypeTache == 3) {
				serviceMap['default'] = true;

				menu.innerHTML += `
	  <div class="menu-item">
		<div class="menu-content pb-2">
		  <span class="menu-section text-muted text-uppercase fs-8 ls-1">Default</span>
		  </div>
		  <div id="service-${sanitizeClassName('default')}" class="service-content  content-${sanitizedContent} menu-item menu-accordion nav"  data-kt-menu-trigger="click" id="nav-tab" role="tablist"></div>
		  </div>
		  `;
			} else if (!serviceMap[element.service] && element.idTypeTache == 2) {
				serviceMap[element.service] = true;

				menu.innerHTML += `
	  <nav class="menu-item">
		<div class="menu-content pb-2">
		  <span class="menu-section text-muted text-uppercase fs-8 ls-1">${element.service}</span>
		  </div>
		  <div id="service-${sanitizeClassName(element.service)}" class="service-content tab-pane content-${sanitizedContent} menu-item menu-accordion nav"  data-kt-menu-trigger="click" id="nav-tab" role="tablist"></div>
		  </nav>
		  `;
			}

			const serviceElement = document.getElementById(`service-${sanitizeClassName(element.service)}`);
			const defaultService = document.getElementById(`service-${sanitizeClassName('default')}`);

			if (element.idSousMenu != null && !sousMenuMap[sousMenuKey]) {
				sousMenuMap[sousMenuKey] = true;
				if (element.idTypeTache == 3) {
					defaultService.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
	  <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-defaultSousMenu">
		${element.icon ? element.icon : ''}
	<span class="menu-title">${element.sousMenu}</span>
	<span class="menu-arrow"></span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-defaultSousMenu nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;
				} else {
					serviceElement.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav-link">
	  <span class="menu-content menu-link align-items-start justify-content-between" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}" id="task${element.id}">
		${element.icon ? element.icon : ''}
	<span class="menu-title">${element.sousMenu}</span>
	<span class="menu-arrow"></span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu} nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;
				}
			}

			if (element.idSousMenu != null) {
				if (element.idTypeTache == 3) {
					const defaultSousMenu = defaultService.querySelector(`.content-defaultSousMenu`);
					defaultSousMenu.innerHTML += `
	<div class="menu-link nav-link ${tacheKey}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-bullet">
		<span class="bullet bullet-dot"></span>
		</span>
		<span class="menu-title" id="task${element.id}">${element.tache}</span>
		</div>
		`;
				} else {
					const sousMenuElement = serviceElement.querySelector(`.content-${sanitizedSousMenu}`);
					sousMenuElement.innerHTML += `
	<div class="menu-link nav-link ${tacheKey}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-bullet">
		<span class="bullet bullet-dot"></span>
		</span>
		<span class="menu-title" id="task${element.id}">${element.tache}</span>
		</div>
		`;
				}
			}

			if (element.idSousMenu == null && !tacheMap[tacheKey]) {
				tacheMap[tacheKey] = true;
				const tacheIcon = await get_icon(element.tacheIcon);
				if (element.idTypeTache == 3) {
					defaultService.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion ${tacheKey}" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-link" id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})">
		${tacheIcon ? tacheIcon : ''}
	<span class="menu-title">${element.tache}</span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;
				} else if (element.idTypeTache == 2) {
					serviceElement.innerHTML += `
	<div data-kt-menu-trigger="click" class="menu-item menu-accordion ${tacheKey}" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
	  <span class="menu-link " id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})">
		${tacheIcon ? tacheIcon : ''}
	<span class="menu-title">${element.tache}</span>
	</span>
	<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist"></div>
	</div>
	`;
				}
			}
		}

		// Activation de la tâche courante dans le menu
		if (typeof idCurrentTask !== "undefined" && idCurrentTask) {
			const activeLink = menu.querySelector(`[onclick^="loadContentOnClick(${idCurrentTask},"]`);
			if (activeLink) {
				activeLink.classList.add('active');
				// Ouvre les parents (collapse) si besoin
				let parentCollapse = activeLink.closest('.collapse.menu-sub');
				if (parentCollapse && parentCollapse.classList.contains('collapse')) {
					parentCollapse.classList.add('show');
					const parentMenuItem = parentCollapse.closest('.menu-item');
					if (parentMenuItem) {
						//parentMenuItem.classList.add('bg-primary');
						const arrow = parentMenuItem.querySelector('.menu-arrow');
						if (arrow) arrow.classList.add('open');
					}
				}
			}
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}

}

async function fetchItemsForViho(idUA, responsabilite, niveauUA) {
	const url = `/authentification/apiPersonnel/getTache/sidebar/${idUA}/${responsabilite}/${niveauUA}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log("fetchItemsForViho:", data);
		generateVihoTempleteMenu(data, 'service', data[0].service);
	} catch (error) {
		console.error("Erreur lors du chargement des tâches :", error);
	}
}

async function getTacheStructureForViho() {
	try {
		const response = await fetch(`/authentification/apiPersonnel/getTacheForAgent`);
		const data = await response.json();
		console.log("Le menu de l'agent :", data);
		generateVihoTempleteMenu(data, 'structure', 'Mes tâches');
	} catch (error) {
		console.error("Erreur lors du chargement des tâches structure :", error);
	}
}

async function getDefaulTasksForViho() {
	try {
		const response = await fetch(`/authentification/apiPersonnel/getDefaultTasks`);
		const data = await response.json();
		console.log("Par défaut :", data);
		generateVihoTempleteMenu(data, 'default', 'Default');
	} catch (error) {
		console.error("Erreur lors du chargement des tâches par défaut :", error);
	}
}

// Fonction utilitaire commune
async function generateVihoTempleteMenu(data, type, service) {
	const menu = document.querySelector('#menuViho');
	if (!menu) return;

	// menu.innerHTML = '<li class="back-btn"><div class="mobile-back text-end"><span>Back</span><i class="fa fa-angle-right ps-2" aria-hidden="true"></i></div></li>';

	const serviceMap = {}, sousMenuMap = {}, tacheMap = {};

	for (const element of data) {
		const serviceKey = sanitizeClassName(type);
		const sousMenuKey = sanitizeClassName(`${type}-${element.sousMenu}`);
		const tacheKey = sanitizeClassName(`${type}-${element.tache}-${element.url}`);

		if (!serviceMap[serviceKey]) {
			serviceMap[serviceKey] = document.createElement('li');
			serviceMap[serviceKey].className = 'sidebar-main-title';
			serviceMap[serviceKey].innerHTML = `
				<nav class="menu-item">
					<div class="menu-content pb-2"><h6 class="text-primary">${service}</h6></div>
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
				tacheLi.innerHTML = `<a class="menu-link nav-link" href="${element.url}" data-tache-id="${element.id}">${element.tache}</a>`;
				tacheList.appendChild(tacheLi);
				tacheMap[tacheKey] = true;
			}
		} else {
			if (!tacheMap[tacheKey]) {
				const tacheIcon = await get_icon(element.tacheIcon);
				const tacheLi = document.createElement('li');
				tacheLi.className = 'w-100';
				tacheLi.innerHTML = `
					<a href="${element.url}" class="nav-link menu-title" data-tache-id="${element.id}">
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

	// Activation automatique de la tâche courante
	if (typeof idCurrentTask !== "undefined" && idCurrentTask) {
		// Cherche le lien de la tâche courante
		const activeLink = menu.querySelector(`[data-tache-id="${idCurrentTask}"]`);
		if (activeLink) {
			// Ouvre les parents (collapse) si besoin
			let parent = activeLink.closest('.collapse.menu-sub');
			if (parent && parent.classList.contains('collapse')) {
				new bootstrap.Collapse(parent, { show: true });
				// Active le parent menu-item
				const parentMenuItem = parent.closest('.menu-item');
				if (parentMenuItem) {
					parentMenuItem.classList.add('bg-primary');
					// Change l'icône de flèche
					const arrow = parentMenuItem.querySelector('.menu-arrow i');
					if (arrow) arrow.classList.replace('fa-angle-down', 'fa-angle-up');
				}
			}
			// Met en surbrillance le lien actif
			activeLink.classList.add('active');
		}
	}

	if (typeof feather !== 'undefined') {
		feather.replace();
	}
}
// 🔤 Nettoyage des classes
function sanitizeClassName(str) {
	return str ? str.toLowerCase().replace(/\s+/g, '-') : 'unknown';
}

// 🔄 Réinitialisation visuelle des menus
function deactivateAllMenuItems() {
	document.querySelectorAll('.menu-item.bg-primary').forEach(item => {
		item.classList.remove('bg-primary');
		const arrow = item.querySelector('.menu-arrow i');
		if (arrow) arrow.classList.replace('fa-angle-up', 'fa-angle-down');
	});
}
// 1. Tâches par structure
async function fetchItemsForTinydashMaster(idUA, responsabilite, niveauUA) {
	try {
		const url = `/authentification/apiPersonnel/getTache/sidebar/${idUA}/${responsabilite}/${niveauUA}`;
		const response = await fetch(url);
		const data = await response.json();

		console.log("Tâches structure :", data);
		generateMoustaphaTempleteMenu(data);
	} catch (error) {
		console.error("Erreur lors du chargement des tâches :", error);
	}
}

// 2. Tâches de l'agent connecté
async function getTacheStructureFortinydashMaster() {
	try {
		const response = await fetch(`/authentification/apiPersonnel/getTacheForAgent`);
		const data = await response.json();

		console.log("Tâches de l'agent :", data);
		generateMoustaphaTempleteMenu(data, "Mes tâches");
	} catch (error) {
		console.error("Erreur lors de la récupération des tâches agent :", error);
	}
}

// 3. Tâches par défaut
async function getDefaulTasksForTinydashMaster() {
	try {
		const response = await fetch(`/authentification/apiPersonnel/getDefaultTasks`);
		const data = await response.json();

		console.log("Tâches par défaut :", data);
		generateMoustaphaTempleteMenu(data, 'Default');
	} catch (error) {
		console.error("Erreur lors de la récupération des tâches par défaut :", error);
	}
}
// Fonction générique pour construire le menu latéral
async function generateMoustaphaTempleteMenu(data, titreSection = null) {
	const menu = document.querySelector("#menuCollege");

	// Optionnel : vider le menu
	// menu.innerHTML = "";

	// Regrouper les tâches par service et sousMenu
	const grouped = {};

	data.forEach(item => {
		const service = item.service || titreSection;
		const sousMenu = item.sousMenu;
		if (!grouped[service]) grouped[service] = {};

		if (!item.idSousMenu) {
			if (!grouped[service]['__taches__']) {
				grouped[service]['__taches__'] = [];
			}
			grouped[service]['__taches__'].push(item);
		} else {
			if (!grouped[service][sousMenu]) {
				grouped[service][sousMenu] = { icon: item.icon, taches: [] };
			}
			grouped[service][sousMenu].taches.push(item);
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

		// Afficher d'abord les tâches sans sous-menu (tout en haut)
		if (grouped[service]['__taches__']) {
			// Utiliser Promise.all pour attendre les icônes si besoin
			const tachesSansSousMenu = grouped[service]['__taches__'];
			for (const tache of tachesSansSousMenu) {
				const tacheIcon = await get_icon(tache.tacheIcon);

				const li = document.createElement('li');
				li.className = "nav-item w-100";
				li.setAttribute('data-tache-id', tache.id);
				li.innerHTML = `
					<a class="nav-link" href="${encodeURI(tache.url)}">
						${tacheIcon || ''}
						<span class="ml-3 item-text">${tache.tache}</span>
					</a>
				`;
				ul.appendChild(li);
			}
		}

		// Ensuite les sous-menus
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
					<a class="nav-link pl-3" href="${encodeURI(tache.url)}" data-tache-id="${tache.id}">
						<span class="ml-1 item-text">${tache.tache}</span>
					</a>
				`;
				ulTaches.appendChild(tacheLi);
			});
			ul.appendChild(li);
		}

		menu.appendChild(ul);
	}

	// Activation de la tâche courante
	if (typeof idCurrentTask !== "undefined" && idCurrentTask) {
		const activeLink = menu.querySelector(`[data-tache-id="${idCurrentTask}"]`);
		if (activeLink) {
			activeLink.classList.add('active');
			// Si la tâche est dans un sous-menu, ouvrir le collapse parent
			const collapseUl = activeLink.closest('.collapse');
			if (collapseUl && collapseUl.classList.contains('collapse')) {
				collapseUl.classList.add('show');
				const parentDropdown = collapseUl.closest('.nav-item.dropdown');
				if (parentDropdown) {
					const dropdownLink = parentDropdown.querySelector('.dropdown-toggle');
					if (dropdownLink) dropdownLink.classList.add('active');
				}
			}
		}
	}
	if (typeof feather !== 'undefined') {
		feather.replace();
	}
}

function loadContentOnClick(tacheId, url, autreRessource, idTypeTache) {
	legitimateCheck(tacheId, idTypeTache, url);

}

//Affichage des element du sidebar
async function getTacheStructure() {
	let data = {
		action: 'getTacheForAgent',
	}
	let queryString = new URLSearchParams(data).toString()
	try {
		let response = await fetch(`/authentification/apiPersonnel/getTacheForAgent`);
		let data = await response.json();


		console.log("Le menu de l'agent : ", data);

		const menu = document.getElementById("#kt_aside_menu");
		// const contenu = document.querySelector(".contenu");
		menu.innerHTML += ``; // Réinitialiser le contenu du menu
		const serviceMap = {}; // Utilisé pour suivre les services déjà créés
		const sousMenuMap = {}; // Utilisé pour suivre les sous-menus déjà créés
		const tacheMap = {};

		for (const element of data) {

			const contentKey = sanitizeClassName(`${element.service}`)
			const sanitizedContent = sanitizeClassName(contentKey);
			const sousMenuKey = sanitizeClassName(`${element.service}-${element.sousMenu}`)
			const tacheKey = sanitizeClassName(`${element.service}-${element.tache}`)
			const sanitizedSousMenu = sanitizeClassName(sousMenuKey);
			// Créer un nouveau service s'il n'existe pas déjà
			if (!serviceMap['default'] && element.idTypeTache == 3) {
				serviceMap['default'] = true;


				// Ajoute le service en tant que section distincte dans le menu
				menu.innerHTML += `
			<div class="menu-item">
			  <div class="menu-content pb-2">
				<span class="menu-section text-muted text-uppercase fs-8 ls-1">Default</span>
				</div>
				<div id="service-${sanitizeClassName('default')}" class="service-content collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedContent} menu-item menu-accordion nav"  data-kt-menu-trigger="click" id="nav-tab" role="tablist"></div>
				</div>
				`;

			} else if (!serviceMap[element.service] && element.idTypeTache != 3) {
				serviceMap[element.service] = true;

				// Ajoute le service en tant que section distincte dans le menu
				menu.innerHTML += `
			<div class="menu-item">
			  <div class="menu-content pb-2">
				<span class="menu-section text-muted text-uppercase fs-8 ls-1">Mes Tâches</span>
				</div>
				<div id="service-structure" class="service-content tab-pane content-${sanitizedContent}  menu-item menu-accordion nav"  data-kt-menu-trigger="click" id="nav-tab" role="tablist"></div>
				</div>
				`;

			}

			const serviceElement = document.getElementById(`service-structure`);
			const defaultService = document.getElementById(`service-${sanitizeClassName('default')}`);
			// Vérifie si le sous-menu pour ce service a déjà été créé
			if (element.idSousMenu != null && !sousMenuMap[sousMenuKey]) {
				sousMenuMap[sousMenuKey] = true; // Marque le sous-menu comme créé
				if (element.idTypeTache == 3) {

					// Ajoute un sous-menu avec un toggle pour les tâches
					defaultService.innerHTML += `
			<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
			  <span class="menu-link" data-bs-toggle="collapse" data-bs-target=".content-defaultSousMenu" id="task${element.id}">
				${element.icon ? element.icon : ''}
			<span class="menu-title">${element.sousMenu}</span>
			<span class="menu-arrow"></span>
			</span>
			<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-defaultSousMenu nav nav-tabs" id="nav-tab" role="tablist"></div>
			</div>
			`;
				} else {
					// Ajoute un sous-menu avec un toggle pour les tâches
					serviceElement.innerHTML += `
			<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav">
			  <span class="menu-link" id="task${element.id}" data-bs-toggle="collapse" data-bs-target=".content-${sanitizedSousMenu}">
				${element.icon ? element.icon : ''} <!-- Affiche l'icône s'il existe -->
				  <span class="menu-title">${element.sousMenu}</span>
				  <span class="menu-arrow"></span>
				  </span>
				  <div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${sanitizedSousMenu} nav nav-tabs" id="nav-tab" role="tablist" >
					</div>
				  </div>
				  `;
				}
			}

			if (element.idSousMenu != null) {
				if (element.idTypeTache == 3) {
					const defaultSousMenu = defaultService.querySelector(`.content-defaultSousMenu`);

					defaultSousMenu.innerHTML += `
			<div class="menu-link nav-link ${tacheKey}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
			  <span class="menu-bullet">
				<span class="bullet bullet-dot"></span>
				</span>
				<span class="menu-title" id="task${element.id}">${element.tache}</span>
				</div>
				`;
				} else {
					const sousMenuElement = serviceElement.querySelector(`.content-${sanitizedSousMenu}`);
					sousMenuElement.innerHTML += `
			<div class="menu-link nav-link ${tacheKey}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})" id="nav-${element.id}-tab" data-bs-toggle="tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
			  <span class="menu-bullet">
				<span class="bullet bullet-dot"></span>
				</span>
				<span class="menu-title" id="task${element.id}">${element.tache}</span>
				</div>
				`;
				}
			}

			if (element.idSousMenu == null && !tacheMap[tacheKey]) {
				tacheMap[tacheKey] = true;
				// Récupérer l'icône pour chaque tâche
				let tacheIcon
				icons.forEach((elementIcon) => {
					if (element.tacheIcon == elementIcon.id_icon) {
						tacheIcon = elementIcon.icon;
					}
				});
				if (element.idTypeTache == 3) {

					defaultService.innerHTML += `
			<div data-kt-menu-trigger="click" class="menu-item menu-accordion nav" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}">
			  <span class="menu-link" id="task${element.id}" data-bs-toggle="collapse" data-bs-target=".content-${tacheKey}">
				${tacheIcon ? tacheIcon : ''} <!-- Affiche l'icône récupérée -->
				<span class="menu-title">${element.tache}</span>
				</span>
				<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist" >
				  </div>
				</div>
				`;
				} else {
					serviceElement.innerHTML += `
			<div data-kt-menu-trigger="click" class="menu-item menu-accordion ${tacheKey}" data-bs-toggle="tab" id="nav-${element.id}-tab" data-bs-target="#tache${element.id}" type="button" role="tab" aria-controls="tache${element.id}" aria-selected="false">
			  <span class="menu-link " id="task${element.id}" onclick="loadContentOnClick(${element.id}, '${element.url}', '${element.autre_ressource}',${element.idTypeTache})">
				${tacheIcon ? tacheIcon : ''}
			<span class="menu-title">${element.tache}</span>
			</span>
			<div class="collapse menu-sub menu-sub-accordion menu-active-bg content-${tacheKey} nav nav-tabs" id="nav-tab" role="tablist"></div>
			</div>
			`;
				}
			}

			// 	contenu.innerHTML += `
			// <div class="tab-pane" id="tache${element.id}" role="tabpanel" aria-labelledby="tache${element.id}-tab">

			//   <div id="dynamic-content-${element.id}">
			// 	<!-- Contenu dynamique sera chargé ici via AJAX ou une autre méthode -->
			// 	  Page indisponible
			// 	  </div>
			// 	  </div>
			// 	  `;


		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}

}
function ajouterScript(sources) {
	console.log(sources)
	// Vérifier s'il y a un point-virgule pour déterminer s'il y a plusieurs liens
	if (sources.includes(';')) {
		// Diviser les sources par point-virgule et les parcourir
		sources.split(';').forEach(function (src) {
			if (src.trim() !== '') { // Vérifier que la source n'est pas vide
				if (!document.querySelector(`script[src="${autreRessource.trim()}"]`)) {
					var script = document.createElement('script');
					script.src = src.trim(); // Supprimer les espaces superflus
					script.type = 'text/javascript';
					script.async = true; // Peut être ajusté selon le besoin
					document.body.appendChild(script);
				}
			}
		});
	} else {
		// Si une seule source est fournie, l'ajouter directement
		if (!document.querySelector(`script[src="${autreRessource.trim()}"]`)) {
			var script = document.createElement('script');
			script.src = sources.trim();
			script.type = 'text/javascript';
			script.async = true; // Peut être ajusté selon le besoin
			document.body.appendChild(script);
		}
	}
}

if (document.getElementById('formPassword')) {
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

			update_compte(event)
			//reset le formulaire
			document.getElementById('formPassword').reset();
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
function legitimateCheck(idTache, idTypeTache, url) {
	const formData = new FormData();
	formData.append('action', 'legitimateCheck');
	formData.append('idTache', idTache);
	formData.append('idTypeTache', idTypeTache);

	fetch(`/authentification/apiPersonnel`, {
		method: 'POST',
		body: formData // Pas besoin de headers 'Content-Type', FormData le gère automatiquement
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (data.status === 'success') {
				window.location.href = url
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Erreur',
					text: data.message,
					timer: 3000,
					showConfirmButton: false,
					didClose: () => {
						window.location.reload();
					}
				});
			}
		})
		.catch(error => console.error('Erreur:', error));
}

function getDirecteurForSelect() {
	try {
		fetch(`/authentification/apiPersonnel/getAllDirecteurs`)
			.then(response => response.json())
			.then(data => {
				const select = document.getElementById('listDirecteur');
				data.directeurs.forEach(directeur => addOptionToSelect(directeur[0], select));
				select.addEventListener('change', function () {
					// Récupérer la valeur sélectionnée et la diviser en id et qualification
					let selectedAgent = select.value;
					let [idAgent, qualification] = selectedAgent.split('|'); // Décompose la valeur en id et qualification						
					Userqualification = qualification
					UserId = idAgent
					// getChefTacheNiv2ToAffect(idUACurrentUser);
					getChefTacheNiv2ToRestrict(idUACurrentUser);
					setTimeout(() => {
						const tachesIncarnee = listTacheIncarnée.filter(tache =>
							!listeTacheToRestrict.some(restrictedTache => restrictedTache.id === tache.id)
						);
						displayTaches(tachesIncarnee)
					}, 1000)
				});
			})
			.catch(error => console.error('Erreur:', error));
	} catch (error) {
		console.error('Erreur:', error);
	}
}
function getTacheToAffecteDirecteurs() {
	try {
		fetch('/authentification/apiPersonnel/getTacheToAffecteDirecteurs')
			.then(response => response.json())
			.then(data => {
				console.log(data)
			})
	} catch (error) {

	}
}