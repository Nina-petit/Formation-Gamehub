const app = {
    // C'est valeur n'ont pas vocation à bouger durant
    // mon programme, ce sont des "règles" globale
    // on les appelles des constantes et on les notes en majuscule
    NB_ROW: 4,
    NB_CELL: 6,
    player: {
        x: 0,
        y: 0,
        direction: 'east',
        directionIndex: 1
    },
    targetCell: {
        x: 5,
        y: 3
    },
    direction: [
        'north',
        'east',
        'south',
        'west'
    ],
    moves: {
        north: {
            x: 0,
            y: -1
        },
        east: {
            x: 1,
            y: 0
        },
        south: {
            x: 0,
            y: 1
        },
        west: {
            x: -1,
            y: 0
        },
    },
    gameOver: false,
    moveCounter: 0,
    // Il ne faut pas hésiter à "factoriser" nos variable qui seront
    // utile dans plusieurs fonctions
    boardNode: document.getElementById('board'),
    init: function () {
        console.log('init !');
        app.drawBoard();

        app.listenKeyboardEvents();
    },
    // Syntaxe ES Next :
    // Pour déclare une méthode dans un objet on peut utiliser
    // une syntaxe un peu plus courete (sans function et sans les :)
    drawBoard() {
        // Syntaxe ES Next : let
        // Pour déclarer une variable on va préférer let OU const

        // let permettra de refaire une affectation sur la même etiquette
        // Si ma variable v est déclarer avec let
        // j'aurais le droit d'écirer plusieurs fois v = ...
        for (let rowIndex = 0; rowIndex < app.NB_ROW; rowIndex++) {

            // const ne permettra pas de réaffection (dans le même block)
            // (c'est celui qu'on utilisera le plus souvent)
            const rowNode = document.createElement('div');
            rowNode.classList.add('row');
            app.boardNode.appendChild(rowNode);
            for (let cellIndex = 0; cellIndex < app.NB_CELL; cellIndex++) {
                const cellNode = document.createElement('div');
                cellNode.classList.add('cell');
                rowNode.appendChild(cellNode);

                if (rowIndex === app.player.y && cellIndex === app.player.x) {
                    const playerNode = document.createElement('div');
                    playerNode.classList.add('player');

                    // Maintenant que je calcule correctement la direction
                    // je l'indique sur mon Node pour pouvoir appliquer un sélecteur
                    // CSS
                    playerNode.setAttribute('data-direction', app.player.direction);
                    // J'utilise un attribut mais je peux aussi utiliser une classe :
                    // playerNode.classList.add('player--turn-' + app.player.direction);

                    cellNode.appendChild(playerNode);
                }

                if (rowIndex === app.targetCell.y && cellIndex === app.targetCell.x) {
                    cellNode.classList.add('target-cell')
                }
            }
        }

        app.checkGameOver();
    },
    clearBoard() {
        // Pour supprimer tt les enfants d'un noeuds je peux utiliser la technique
        // suivante (piqué sur StackOverflow)

        // Tant qu'il y a un enfant dans le noeud
        while (app.boardNode.firstChild) {
            // je supprime un enfant
            app.boardNode.removeChild(app.boardNode.lastChild);
        }
    },
    redrawBoard() {
        app.clearBoard();
        app.drawBoard();
        app.moveCounter++;
    },
    turnLeft() {
        // On veut faire tourner la fleche dans le sens horaire
        // Donc "monter" dans le tableau app.direction
        app.turn(-1);
    },
    turnRight() {
        // On veut faire tourner la fleche dans le sens anti horaire
        // Donc "descendre" dans le tableau app.direction
        app.turn(1);
    },
    turn(factor) {

        if (app.gameOver) {
            // On est dans un cas particulier ou si un test vaut vrai
            // la fonction ne doit absolument rien faire
            // (on doit imédiatement sortir de la fonction)
            // on utilisera le mot clé return directement sans valeur
            // pour forcer la sortie de la fonction
            return;
        }

        console.log('Anciennce direction :', app.player.direction);
        console.log('Ancien index :', app.player.directionIndex);

        // Pour changer la direction je modifie l'index correspondant dans le tableau
        app.player.directionIndex += factor;

        // Si mon index dépasse le nombre de case dans le tableau
        // je le remet à 0 (au début)
        if (app.player.directionIndex >= app.direction.length) {
            app.player.directionIndex = 0;
        } else if (app.player.directionIndex < 0) {
            // Si l'index se retrouve négatif je le place à la fin de mon tableau
            app.player.directionIndex = app.direction.length - 1 ;
        }

        console.log('Nouvel index', app.player.directionIndex);

        app.player.direction = app.direction[app.player.directionIndex];
        console.log('Nouvelle direction :', app.player.direction);

        app.redrawBoard();
    },
    moveForward() {

        if (app.gameOver) {
            // On est dans un cas particulier ou si un test vaut vrai
            // la fonction ne doit absolument rien faire
            // (on doit imédiatement sortir de la fonction)
            // on utilisera le mot clé return directement sans valeur
            // pour forcer la sortie de la fonction
            return;
        }

        // Je récupère mes informations
        const playerDirection = app.player.direction;
        const playerMove = app.moves[playerDirection];

        // j'applique mes déplacements
        app.player.x += playerMove.x;
        app.player.y += playerMove.y;

        // Je m'assure que x et y sont bien dans les borne autorisé
        app.player.x = app.cap(app.player.x, 0, app.NB_CELL);
        app.player.y = app.cap(app.player.y, 0, app.NB_ROW);

        app.redrawBoard();

    },
    cap(value, min, max) {
        // 0 < player.x < 6
        // 0 < player.y < 4
        // Dire que x doit être inférieur à 6
        // revient à systématiquement prendre la plus petite valeur
        // entre x et 6-1
        /*
            x ne doit pas être supérieur à 5
            peut s'écrire comme ceci
            if (app.player.x > 6) {
                app.player.x = 5;
            }
            ou comme cela
            if (app.player.x < 6) {
                app.player.x = app.player.x
            } else {
                app.player.x = 5
            }
            le code au dessus correspond à
            app.player.x = Math.min(app.player.x, 5);
        */

        // Du coup pour être sur que value est entre min max
        // je peux utiliser les fonction Math.min et Math.max
        value = Math.min(value, max - 1);
        value = Math.max(value, min);
        return value;
    },
    listenKeyboardEvents() {
        // Une fonction anonyme en "fonction fléché"
        document.addEventListener('keyup', (event) => {
            const input = event.code;

            if (input === 'ArrowUp') {
                app.moveForward();
            } else if (input === 'ArrowLeft') {
                app.turnLeft();
            } else if (input === 'ArrowRight') {
                app.turnRight();
            }
        });
    },
    checkGameOver() {
        app.gameOver =  app.player.x === app.targetCell.x &&
                           app.player.y === app.targetCell.y;
        if (app.gameOver) {
            alert(`Bravo !!!
Vous avez terminé la partie en ${app.moveCounter} coups !`);
        }
    }
};

document.addEventListener('DOMContentLoaded', app.init);