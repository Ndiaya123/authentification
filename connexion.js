// Fonction pour vérifier l'état de la session
function checkSession() {
    fetch('/authentification/check_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau lors de la vérification de la session');
        }
        return response.json();
    })
    .then(data => {
        if (data.session_active) {
            // Si la session est active, redirigez l'utilisateur
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        } else {
            console.log('Aucune session active');
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'appel à check_session.php :', error);
    });
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
	localStorage.clear();

});
    //Connexion
     function connexion(){
	        const connexionButton = document.getElementById('connexionButton')
      connexionButton.disabled = true;
      connexionButton.innerHTML = 'veuillez patienter...'

        let mail = document.getElementById('email');
        let pass = document.getElementById('password');
        let data = {
          action : 'connexion',
          email : mail.value,
          password : pass.value
        }
        let queryString = new URLSearchParams(data).toString()
        alert(queryString);
        fetch(`/authentification/connexion.php?${queryString}`,{
          method : "GET"
        })
          .then((response) => { if (!response.ok) {

            
            alert("ndiaya");
            alert(response);
Swal.fire({
              position: "center",
              icon: 'error',
              title: 'Mot de pass ou email incorrect !',
              showConfirmButton: false,
              timer: 3000
              }); 
            throw new Error("Network response was not ok");
          }else{
            // alert('Changement réussi !! ')
            console.log(response);
            if (response.redirected) {
                
                location.href = response.url;  // Redirige vers index.php
            }
        }
        return response.json();
    }).then(data => {

      alert("sadiobu");
      alert(data);
        console.log(data);  // Affiche la réponse du backend dans la console
        if (data.status === 'success') {
            // Redirection vers index.php si la connexion est réussie
            window.location.href = data.url;
        }else if (data.status === 'invalid' || data.status === 'defaultPass'){
	  	  connexionButton.disabled = false;
      connexionButton.innerHTML = "se connecter"
          Swal.fire({
            position: "center",
            icon: 'info',
            title: data.message,
            showConfirmButton: true,
          }); 
        }else {
		  	  connexionButton.disabled = false;
      connexionButton.innerHTML = "se connecter"

          Swal.fire({
            position: "center",
            icon: data.status,
            title: data.message,
            showConfirmButton: false,
            timer: 3000
          });            
        }
      })
      .catch(error => {
        alert("erreur");
        alert(error);
        console.error('Erreur :', error);  // Affiche une erreur en cas d'échec de la requête
      });
      }