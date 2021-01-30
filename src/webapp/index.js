'use strict';
const debug = require('debug')('index');
const express = require('express');
const mustacheExpress = require('mustache-express');
const helmet = require('helmet');

// PAAS_COUPLING: Heroku provides the `PORT` environment variable.
const {PORT} = process.env;
const admin = require('./admin');
const member = require('./member');

const app = express();

app.set('views', './views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(helmet({
  // HSTS must be disabled until the production environment is served over
  // HTTPS.
  hsts: false,
}));
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use('/admin', admin);
app.use('/member', member);

app.get('/', (req, res) => {
  res.render('index', {
    success: !!req.query.success
  });
});

app.listen(PORT, () => {
  debug(`Server initialized and listening on port ${PORT}.`);
});
