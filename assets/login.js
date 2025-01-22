const messageErreurUtilisateur = document.getElementById("erreurUtilisateur");
const messageErreurMDP = document.getElementById("erreurMDP");

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    messageErreurUtilisateur.style.display = "none"; //reset le message si plusieurs tentatives
    messageErreurMDP.style.display = "none";
    // Création de l’objet de l'identifiant
    const identifiant = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(identifiant);
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
    }).then((reponse) => {
        if (reponse.status === 200) {
            reponse.json().then((donnees) => {
                // Stocker le token dans le Local Storage
                localStorage.setItem("token", donnees.token);
                window.location.href = "index.html";
            });
        } else if (reponse.status === 401) {
            messageErreurMDP.style.display = "block";
        } else if (reponse.status === 404) {
            messageErreurUtilisateur.style.display = "block";
        }
    });
});
