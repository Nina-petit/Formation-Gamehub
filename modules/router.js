
const express = require('express');
const router = express.Router();

const fourchette = require('./ettehcruof');

const users = require('../data/users');

const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('index');
});

router.route('/login')
.get((req, res) => {
    res.render('login');
})
.post((req, res) => {
    // ici on va pouvoir vérifier que la personne peut se connecter
    // Mais pour cela il faudrait déjà pouvoir récupérer les informations postés
    console.log(req.body);
    // maintenant on peut aller vérifier que le couple utilisateur/mot de passe existe dans notre json d'utilisateurs
    const user = users.find(currentUser => {
        const isUsernameValid = currentUser.username === req.body.username;
        const isPasswordValid = bcrypt.compareSync(req.body.password, currentUser.password);
        return currentUser.username === req.body.username && bcrypt.compareSync(req.body.password, currentUser.password)
    });

    let message;
    if (user) {
        req.app.locals.user = user;
        // On peut connecter l'utilisateur
        res.redirect('/');
    } else {
        // On envoi un message d'erreur à l'utilisateur
        // On ne fais jamais de message explicite sur ce qui est erroné, on ne donne pas d'aide à celui qui tente de se connecter (cela peut être un pirate) on dit seulement qu'on ne peut pas le connecter
        message = `Désolé nous n'avons pas trouvé de compte associé, veuillez réessayer…`;
    }

    res.render('login', { message });
    });

router.get('/logout', (req, res) => {
    delete req.app.locals.user;
    res.redirect('/');
});

router.get('/game/ettehcruof', (req, res, next) => {
    let message;
    let actionButtons = [
        'moins',
        'bravo',
        'plus'
    ];

    switch(req.query.action) {
        case 'plus':
            fourchette.plus();
            if (fourchette.isCheating()) {
                message = `J'aime pas les tricheurs, ciao !`;
                actionButtons = [];
            } else {
                message = `ok c'est plus, donc je propose ${fourchette.getProposition()}`;
            };
            break;
        case 'moins':
            fourchette.moins();
            if (fourchette.isCheating()) {
                message = `J'aime pas les tricheurs, ciao !`;
                actionButtons = [];
            } else {
                message = `ok c'est moins, donc je propose ${fourchette.getProposition()}`;
            };
            break;
        case 'bravo':
            fourchette.reset();
            message = `Super je suis trop fort !!`;
            actionButtons = ['replay'];
            break;
        default:
            fourchette.init();
            message = `Je propose ${fourchette.getProposition()}, est-ce (/plus, /moins ou /bravo) ?`;
            break;
    };
    res.locals.message = message;
    res.locals.actionButtons = actionButtons;
    next();
});

router.get('/game/:gameName', (req, res, next) => {
    const gameName = req.params.gameName;
    const games = req.app.locals.games;

    const foundGame = games.find(currentGame => gameName === currentGame.name);

    if (foundGame) {
        res.render(gameName, foundGame);
    } else {
        next(); 
    };
});

router.use(function (req, res, next) {
    res.status(404).render('error404');
  });

module.exports = router;













