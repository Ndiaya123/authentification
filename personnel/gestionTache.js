document.addEventListener('DOMContentLoaded', async () => {

let lastSelectedAgent = null;
		const select_agent = document.getElementById("agentSelectForTask");
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

			getChefTacheNiv2ToAffect(idUACurrentUser);
			getChefTacheNiv2ToRestrict(idUACurrentUser);
		}
	});
	getAgent()
})

let icons = []
let listeService = []
let listeTacheToRestrict = []
let listeTacheToAffect = []

let listeIdNiv2 = []
let listeIdNiv3 = []
let listeAgent = []
let listeAgentChef = []
let listeAgentSousChef = []
let Userqualification
let UserId
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

	try {
		const response = await fetch(`/authentification/personnel/personnelController.php?${queryString}`);
		const responseData = await response.json();
		const agents = responseData.utilisateur;
		console.table(agents);

		let lastSelectedAgent = null;
		const agentDetailsList = [];

		for (const agent of agents) {
			const agentDetails = await processAgent(agent);
			if (agentDetails) {
				agentDetailsList.push(agentDetails);
			}
		}

		// Ajoute les options au select

		// agentDetailsList.forEach(agent => addOptionToSelect(agent, select_agent, agentDetailsList));
		listeAgentChef = agentDetailsList
		refreshAgents()



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
		const response = await fetch(`/authentification/personnel/personnelController.php?${queryString}`);
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

			getChefTacheNiv2ToAffect(idUACurrentUser);
			getChefTacheNiv2ToRestrict(idUACurrentUser);
		}
	});
}

// Fonction pour ajouter une option au select et mettre à jour la liste correspondante
function addOptionToSelect(agent, selectElement, agentList) {
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

function getChefTacheNiv2ToRestrict(idUniteAdministrative) {
	selectedTachesIds = [];

	const data = {
		action: 'getChefTacheNiv2ToRestrict',
		// idUniteAdministrative: idUniteAdministrative,
		idUtilisateur: UserId
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Traiter la réponse comme JSON
		})
		.then(result => {
			console.log('L\'ensemble des tâches : ', result);
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

			console.log(listeTacheToRestrict);
			// Afficher toutes les tâches par défaut
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
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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



//Affichage de toute des informations de tout les utilisateurs inscript
function getInfosAgent(matricule) {
	const data = {
		action: 'getInfos',
		matricule: matricule
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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


//Récupération des id de toute l'unité administrative de niveau 2
function getAllIdUniteAdministrativeNiv2() {
	const data = {
		action: 'getAllIdUniteAdministrativeNiv2',
		idUniteAdministrative: idUACurrentUser
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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
		idUniteAdministrative: idUACurrentUser
	};

	// Création de la query string à partir de l'objet data
	const queryString = new URLSearchParams(data).toString();

	// Requête Fetch vers le serveur
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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

		} else {
			getChefTacheNiv2ToAffect(idUACurrentUser)
			getChefTacheNiv2ToRestrict(idUACurrentUser)
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

	let queryString = new URLSearchParams(data).toString();
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			} else {

			}
			return response.text(); // Changez pour text() pour inspecter le contenu
		})
		.then((reponse) => {
			try {
				// const data = JSON.parse(text); // Essayez de parser le texte en JSON
				console.log(reponse);
				Swal.fire({
					position: "center",
					icon: "success",
					title: reponse,
					showConfirmButton: true,
					// timer: 1500
				});
				const select_agent = document.getElementById("service");

				// get_other_tache2(id_utilisateur,select_agent.valuer);
				getChefTacheNiv2ToAffect(idUACurrentUser)
				getChefTacheNiv2ToRestrict(idUACurrentUser)
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
			}else if (!attribution.classList.contains('disabled')) {
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
			
			getChefTacheNiv2ToAffect(idUACurrentUser)
			getChefTacheNiv2ToRestrict(idUACurrentUser)
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

	let queryString = new URLSearchParams(data).toString();
	fetch(`/authentification/personnel/personnelController.php?${queryString}`)
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

				// get_other_tache2(id_utilisateur,select_agent.valuer);
				getChefTacheNiv2ToAffect(idUACurrentUser)
				getChefTacheNiv2ToRestrict(idUACurrentUser)

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
		const response = await fetch(`/authentification/personnel/personnelController.php?${queryString}`);

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
		const response = await fetch(`/authentification/personnel/personnelController.php?${queryString}`);

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
