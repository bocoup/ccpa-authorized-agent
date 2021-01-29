'use strict';
const http = require('http');
const debug = require('debug')('index');
const {member: Member} = require('./models/');
// PAAS_COUPLING: Heroku provides the `PORT` environment variable.
const {PORT} = process.env;
const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

app.set('views', './views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

function handleAsync(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', handleAsync(async (req, res) => {
  res.render('admin', {members: await Member.findAll()});
}));

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
