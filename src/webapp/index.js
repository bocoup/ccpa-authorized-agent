'use strict';
const http = require('http');
const debug = require('debug')('index');
const {member: Member} = require('./models/');
// PAAS_COUPLING: Heroku provides the `PORT` environment variable.
const {PORT, HTTP_SESSION_KEY} = process.env;
const express = require('express');
const mustacheExpress = require('mustache-express');
const helmet = require('helmet');
const handleAsync = require('./handle-async');
const admin = require('./admin');

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

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/sign-up', handleAsync(async (req, res) => {
  await Member.create({
    firstName: req.body['first-name'],
    lastName: req.body['last-name'],
    streetAddress: req.body['address-street'],
    city: req.body['address-city'],
    zipcode: req.body['address-zipcode'],
    email: req.body.email,
    phone: req.body.phone,
  });
  res.redirect('/');
}));

app.listen(PORT, () => {
  debug(`Server initialized and listening on port ${PORT}.`);
});
