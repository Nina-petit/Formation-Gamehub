/*
Dans un script de module on eptu faire 2 choses :
- Déclarer un objet que sera exporté (donc exposé à l'extérieur).
- Déclarer des variables et des fonctions qui seront "protégés", non-exportés (donc non-exposés à l'extérieur). Ces informations qui ne sont pas dans l'objet exporté peuvent être utilisé dans l'objet exporté, mais pas à l'extérieur du script.
Précision pour les aficionados d'autres languages : En JavaScript on ne peut pas dire explicitement qu'une méthode ou une variable est "privé" à la 'intérieur d'un objet.
*/

// Une méthode qui n'est utilisé que dans ce script
// Qui nous sert à determiner la prochaine proposition
const determineProposition = (min, max) => Math.floor((max + min) / 2);

// Un objet qui n'est pas non plus accessible à l'extérieur qui sert de confirguarion inital 
const config = {
    min: 1,
    max: 100
};

// Des variables qui nous permettent de suivre l'évolution de la partie qui ne sont également pas accessible à l'extérieur
let minBoundary = config.min;
let maxBoundary = config.max;
let proposition = null;

// Et enfin un objet à travers duquel on va exposé des méthgodes et/ou des propriétés. Nous ici on a décidé de n'exposé que des méthodes.
const app = {

    init: () => {
        proposition = determineProposition(minBoundary, maxBoundary);
    },

    plus: () => {
        minBoundary = proposition + 1;
        proposition = determineProposition(minBoundary, maxBoundary);
    },

    moins: () => {
        maxBoundary = proposition - 1;
        proposition = determineProposition(minBoundary, maxBoundary);
    },

    reset: () => {
        minBoundary = config.min;
        maxBoundary = config.max;
    },

    // Cette méthode est ce que l'on appelle un getter, il permet de retourner une valeur qui n'est normalement pas possible d'exposé (qui est en dehors de l'objet exporté)
    getProposition: () => {
        return proposition;
    },

    // Cette méthode si est une méthode de simplification alogrithmique (helper), pour simplifier l'utilisation du module de fourchette
    isCheating: () => {
        return proposition === maxBoundary || proposition === minBoundary;
    }
}

// Comme on fait un module à la fin on exporte un objet
// On ne peut exporter qu'UN seul objet
module.exports = app;