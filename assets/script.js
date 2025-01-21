//////////////////////////////////// Appels à l'API /////////////////////////////////////
// Récupération des travaux de l'API
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

// Récupération des catégories de l'API
const demandeCategories = await fetch("http://localhost:5678/api/categories");
const recupCategories = await demandeCategories.json();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Création des variables ///////////////////////////////////////

// Page principale
const galerie = document.querySelector(".gallery");
const divFiltres = document.querySelector(".filtres");

// En lien avec la modale
const overlay = document.querySelector(".overlay");
const modale = document.querySelector(".modale");
const modaleClose = document.querySelector(".modale_close");
const modaleHeader = document.querySelector(".modale_header");
const titreModale = document.querySelector(".modale_header h3");
const modaleMain = document.querySelector(".modale_main");
const modalePage1 = document.getElementById("modale-page-1");
const modalePageAjoutPhoto = document.getElementById("container-ajout-photos");
const boutonAjoutPhoto = document.getElementById("ajout-photo");
const boutonValider = document.getElementById("valider");

// Formulaire modale
const contenuDepot = document.querySelector(".contenu-depot");
const select = document.getElementById("category");
const inputFile = document.getElementById("image");
let visualisation = document.getElementById("visualisation");
const formulaireAjout = document.querySelector("#container-ajout-photos form");

// Icones modale
const FermerModale = document.querySelector(".fa-xmark");
const fleche = document.querySelector(".fa-arrow-left");

// Alerte
const alerte = document.querySelector(".alert");
const iconeCheck = document.querySelector(".fa-check");
let texteAlerte = document.querySelector(".alert p");
const boutonFermerAlerte = document.querySelector(".fermer");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Apparition des travaux grâce à l'API //////////////////////////////////

function apparaitrePhotosGalerie(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const nomImage = document.createElement("figcaption");

        image.src = travaux[i].imageUrl;
        image.alt = travaux[i].title;
        nomImage.innerText = travaux[i].title;

        galerie.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(nomImage);
    }
}

apparaitrePhotosGalerie(travaux);

////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Apparition des boutons grâce à l'API ////////////////////////////

// fonction pour faire apparaitre les boutons à partir des catégories de l'API
function apparaitreBoutons(recupCategories) {
    const boutonTousFiltre = document.createElement("button");
    boutonTousFiltre.setAttribute("id", "tous");
    boutonTousFiltre.textContent = "Tous";
    divFiltres.appendChild(boutonTousFiltre);
    for (let i = 0; i < recupCategories.length; i++) {
        const bouton = document.createElement("button");
        bouton.textContent = recupCategories[i].name;

        if (i === 0) {
            bouton.setAttribute("id", "objets");
        } else if (i === 1) {
            bouton.setAttribute("id", "appartements");
        } else if (i === 2) {
            bouton.setAttribute("id", "hotels");
        }

        divFiltres.appendChild(bouton);
    }
}

apparaitreBoutons(recupCategories);

// Boutons des filtres
const boutonTous = document.getElementById("tous");
const boutonObjets = document.getElementById("objets");
const boutonAppartements = document.getElementById("appartements");
const boutonHotels = document.getElementById("hotels");

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Gestion des filtres /////////////////////////////////////////////

// fonction pour le changement de couleur des boutons de filtre
function modifCouleurFiltres(boutonSelec, bouton1, bouton2, bouton3) {
    boutonSelec.style.backgroundColor = "#1D6154";
    boutonSelec.style.color = "white";
    bouton1.style.backgroundColor = "white";
    bouton1.style.color = "#1D6154";
    bouton2.style.backgroundColor = "white";
    bouton2.style.color = "#1D6154";
    bouton3.style.backgroundColor = "white";
    bouton3.style.color = "#1D6154";
}

boutonTous.addEventListener("click", () => {
    galerie.innerHTML = "";
    apparaitrePhotosGalerie(travaux);

    modifCouleurFiltres(
        boutonTous,
        boutonObjets,
        boutonAppartements,
        boutonHotels
    );
});

boutonObjets.addEventListener("click", function () {
    const travauxObjets = travaux.filter(function (photo) {
        return photo.category.name === "Objets";
    });
    galerie.innerHTML = "";
    apparaitrePhotosGalerie(travauxObjets);

    modifCouleurFiltres(
        boutonObjets,
        boutonTous,
        boutonAppartements,
        boutonHotels
    );
});

boutonAppartements.addEventListener("click", function () {
    const travauxAppartements = travaux.filter(function (photo) {
        return photo.category.name === "Appartements";
    });
    galerie.innerHTML = "";
    apparaitrePhotosGalerie(travauxAppartements);

    modifCouleurFiltres(
        boutonAppartements,
        boutonTous,
        boutonObjets,
        boutonHotels
    );
});

boutonHotels.addEventListener("click", function () {
    const travauxHotels = travaux.filter(function (photo) {
        return photo.category.name === "Hotels & restaurants";
    });
    galerie.innerHTML = "";
    apparaitrePhotosGalerie(travauxHotels);

    modifCouleurFiltres(
        boutonHotels,
        boutonTous,
        boutonObjets,
        boutonAppartements
    );
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// Modifications si l'utilisateur est connecté ///////////////////////////////////

const lienLogin = document.getElementById("lienLogin");
const boutonModifier = document.querySelector(".modifier");
const titreGalerie = document.querySelector(".titre_galerie");
const token = localStorage.getItem("token");
if (token) {
    lienLogin.textContent = "logout";
    divFiltres.style.display = "none";
    boutonModifier.style.display = "flex";
    titreGalerie.style.marginBottom = "90px";
    lienLogin.addEventListener("click", function () {
        localStorage.removeItem("token");
        lienLogin.textContent = "login";
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Fonctionnement Modale /////////////////////////////////

// Ouverture modale au clic sur le bouton "modifier"
boutonModifier.addEventListener("click", () => {
    modale.style.display = "block";
    overlay.style.display = "block";
});
// Fermeture de la modale au clic sur la croix
FermerModale.addEventListener("click", function () {
    modale.style.display = "none";
    overlay.style.display = "none";
});
// Fermeture de la modale si clic en dehors de celle-ci
overlay.addEventListener("click", function () {
    modale.style.display = "none";
    overlay.style.display = "none";
});

// fonction pour faire apparaitre les images sur la modale et gérer leur suppression au clic
function apparaitrePhotosModale(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const imageModale = document.createElement("img");
        const corbeille = document.createElement("i");

        imageModale.src = travaux[i].imageUrl;
        corbeille.classList.add("fa-solid");
        corbeille.classList.add("fa-trash-can");

        const container = document.createElement("div");
        container.classList.add("container-modale");

        container.appendChild(imageModale);
        container.appendChild(corbeille);

        modalePage1.appendChild(container);

        corbeille.addEventListener("click", function () {
            supprimerPhoto(travaux[i].id);
        });
    }
}

apparaitrePhotosModale(travaux);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Navigation modale //////////////////////////////////////////////////

// passage à la seconde modale
boutonAjoutPhoto.addEventListener("click", function () {
    fleche.style.display = "inline";
    modaleClose.style.justifyContent = "space-between";
    modaleHeader.style.marginBottom = "20px";
    titreModale.innerText = "Ajout photo";
    modalePage1.style.display = "none";
    modalePageAjoutPhoto.style.display = "block";
    boutonAjoutPhoto.style.display = "none";
    boutonValider.style.display = "inline";
    visualisation.style.height = "0%";
    visualisationImage(inputFile, visualisation);
});

// Retour à la première modale
fleche.addEventListener("click", function () {
    fleche.style.display = "none";
    modaleHeader.style.marginBottom = "30px";
    titreModale.innerText = "Galerie photo";
    modalePageAjoutPhoto.style.display = "none";
    modalePage1.style.display = "grid";
    modaleClose.style.justifyContent = "flex-end";
    boutonAjoutPhoto.style.display = "inline";
    boutonValider.style.display = "none";
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// Gestion de l'alerte /////////////////////////////////////////

// Fermer l'alerte si clic sur le bouton "fermer"
boutonFermerAlerte.addEventListener("click", function () {
    alerte.style.display = "none";
});

// fonction pour faire disparaitre la modale d'alerte au bout de 4 secondes
function disparitionAlerte() {
    setTimeout(() => {
        alerte.style.display = "none";
    }, 4000);
}

// fonction pour indiquer les changements de la modale d'alerte en cas de réussite de l'ajout ou de la suppression
function validationAlerte(conteneur, element) {
    conteneur.style.backgroundColor = "#96d7a0";
    conteneur.style.border = "1px solid #8ec897";
    element.style.display = "block";
}

function erreurAlerte(conteneur, element) {
    conteneur.style.backgroundColor = "#f8d7da";
    conteneur.style.border = "1px solid #f5c6cb";
    element.style.display = "none";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Formulaire de la modale ///////////////////////////////////

// fonction pour ajouter les catégories de l'API aux options du select du formulaire
function categorieFormulaire(recupCategories) {
    for (let i = 0; i < recupCategories.length; i++) {
        const option = document.createElement("option");
        option.textContent = recupCategories[i].name;
        option.value = recupCategories[i].id;

        select.appendChild(option);
    }
}

categorieFormulaire(recupCategories);

boutonValider.addEventListener("click", function () {
    recupFormulaire();
});

// fonction qui récupère les valeurs saisies dans le formulaire
function recupFormulaire() {
    const baliseImage = document.getElementById("image");
    const baliseTitre = document.getElementById("title");
    const baliseCategorie = document.getElementById("category");
    const urlImage = baliseImage.value;
    const titreImage = baliseTitre.value;
    const categorieImage = baliseCategorie.value;

    testCompletionFormulaire(urlImage, titreImage, categorieImage);
}

// fonction pour tester si le formulaire est correctement rempli
function testCompletionFormulaire(url, titre, categorie) {
    erreurAlerte(alerte, iconeCheck);
    if (url.trim() === "") {
        // trim() car vérifie si le champ n'est pas qu'un espace
        alerte.style.display = "block";
        texteAlerte.textContent = "Merci d'ajouter une image";
        disparitionAlerte();
        return; // pour éviter de provoquer plusieurs alertes (le return met fin à la fonction)
    }
    if (titre.trim() === "") {
        // trim() car vérifie si le champ n'est pas qu'un espace
        alerte.style.display = "block";
        texteAlerte.textContent = "Merci de renseigner un titre";
        disparitionAlerte();
        return; // pour éviter de provoquer plusieurs alertes (le return met fin à la fonction)
    }
    if (categorie === "-") {
        alerte.style.display = "block";
        texteAlerte.textContent = "Merci de sélectionner une catégorie";
        disparitionAlerte();
        return;
    } else {
        envoyerNouveauTravail(formulaireAjout);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// Gérer la prévisualisation de l'image ////////////////////////////////////

// fonction pour afficher l'image après qu'elle ait été chargée sur l'input file
function visualisationImage(input, image) {
    // se déclenche lorsque l'utilisateur sélectionne un fichier
    input.addEventListener("change", () => {
        // Vérifiez si un fichier a été sélectionné
        if (input.files.length > 0) {
            let reader = new FileReader(); // FileReader permet de lire le contenu des fichiers.
            reader.readAsDataURL(input.files[0]); // on recupere le premier fichier dans la liste des fichiers sélectionnés
            // se déclenche lorsque la lecture du fichier est terminée
            reader.addEventListener("load", () => {
                image.src = reader.result;
                image.style.height = "100%";
                contenuDepot.style.display = "none";
            });
        } else {
            effacerImage(visualisation, contenuDepot);
        }
    });
}

// fonction qui arrête la visualisation de l'image présente dans l'input file
function effacerImage(image, element) {
    image.src = "";
    image.style.height = "0%";
    element.style.display = "flex";
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Suppression image ////////////////////////////////////////////////////

// fonction pour supprimer l'image de l'API et afficher une confirmation ou l'erreur
function supprimerPhoto(identifiant) {
    fetch("http://localhost:5678/api/works/" + identifiant, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: null,
    }).then((reponse) => {
        if (reponse.status === 204) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Photo supprimée avec succès";
            validationAlerte(alerte, iconeCheck);
            disparitionAlerte();
            nouvelAppel();
        } else if (reponse.status === 401) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Utilisateur non autorisé";
            disparitionAlerte();
        } else if (reponse.status === 500) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Erreur inattendue";
            disparitionAlerte();
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Ajout travaux ///////////////////////////////////////////
async function nouvelAppel() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const resultat = await reponse.json();
    galerie.innerHTML = "";
    modalePage1.innerHTML = "";
    apparaitrePhotosGalerie(resultat);
    apparaitrePhotosModale(resultat);
}

// fonction pour l'ajout d'un work dans l'API et traiter la réponse
function envoyerNouveauTravail(formulaire) {
    let formData = new FormData(formulaire);
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    }).then((reponse) => {
        if (reponse.status === 201) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Ajout réussi";
            validationAlerte(alerte, iconeCheck);
            disparitionAlerte();
            formulaire.reset(); //vider le formulaire après validation
            effacerImage(visualisation, contenuDepot);
            nouvelAppel();
        } else if (reponse.status === 400) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Mauvaise requête";
            disparitionAlerte();
        } else if (reponse.status === 401) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Utilisateur non autorisé";
            disparitionAlerte();
        } else if (reponse.status === 500) {
            alerte.style.display = "block";
            texteAlerte.textContent = "Erreur inattendue";
            disparitionAlerte();
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
