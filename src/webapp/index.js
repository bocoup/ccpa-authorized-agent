'use strict';
const http = require('http');
const debug = require('debug')('index');
const {Visit} = require('./models/');
// PAAS_COUPLING: Heroku provides the `PORT` environment variable.
const {PORT} = process.env;
const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

app.set('views', './views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.static('public'));

app.get('/', async (req, res, next) => {
  try {
    await Visit.create({});
    const count = (await Visit.findAll()).length;
    res.render('index', {count});
  } catch (error) {
    next(error);
  }
});

app.post('/sign-up', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  debug(`Server initialized and listening on port ${PORT}.`);
});
