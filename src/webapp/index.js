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

app.use((err, req, res, next) => {
  console.log('res.headersSent:', res.headersSent);
  if (res.headersSent) {
    return next(err);
  }

  debug(err.stack);

  res.status(500);
  res.render('error', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

app.listen(PORT, () => {
  debug(`Server initialized and listening on port ${PORT}.`);
});
