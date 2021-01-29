'use strict';
const {Router} = require('express');
const cookieSession = require('cookie-session');

const {member: Member} = require('./models/');
const handleAsync = require('./handle-async');
const {ADMIN_PASSWORD, HTTP_SESSION_KEY} = process.env;

const router = Router();

router.use(cookieSession({
  name: 'session',
  secret: HTTP_SESSION_KEY,
}));

router.post('/sign-in', (req, res, next) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    next();
    return;
  }

  req.session.authenticated = true;
  res.redirect('./');
});

router.get('/sign-out', (req, res) => {
  delete req.session.authenticated;
  res.redirect('./');
});

router.use((req, res, next) => {
  if (req.session.authenticated) {
    next();
    return;
  }

  res.status(401);
  res.render('admin/sign-in');
});

router.get('/', handleAsync(async (req, res) => {
  res.render('admin/index', {members: await Member.findAll()});
}));

module.exports = router;
