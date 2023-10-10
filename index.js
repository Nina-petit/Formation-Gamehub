const express = require('express');

const router = require('./modules/router');

const app = express();

const port = 4000;

app.locals.games = require('./data/games');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended: true}));

const logger = require('./modules/logger');
app.use(logger);

app.use(express.static('./public'));

app.use(router);

app.listen(port, () => {
     console.log('Example app listening on port ${port}!')
});