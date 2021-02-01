'use strict';
const path = require('path');
const {URL} = require('url');

const {Router} = require('express');

const {PUBLIC_ADDRESS} = process.env;
const schemes = require('./verification-schemes/');
const {member: Member} = require('./models/');
const handleAsync = require('./handle-async');

const router = Router();

router.post('/sign-up', handleAsync(async (req, res) => {
  const member = await Member.create({
    firstName: req.body['first-name'],
    lastName: req.body['last-name'],
    streetAddress: req.body['address-street'],
    city: req.body['address-city'],
    zipcode: req.body['address-zipcode'],
    email: req.body.email,
    phone: req.body.phone,
  });
  const publicUrl = new URL(PUBLIC_ADDRESS);
  publicUrl.pathname = path.join(publicUrl.pathname, 'member/verify');

  for (const scheme of schemes) {
    await scheme.challenge(publicUrl.href, member);
  }

  res.redirect('/?success=1');
}));

router.get('/verify', handleAsync(async (req, res) => {
  const scheme = schemes.find(({name}) => name === req.query.name);

  if (!scheme) {
    throw new Error(`Unrecognized verification scheme: ${req.query.name}`);
  }

  if (!await scheme.verify(req.query.value)) {
    throw new Error('Verification failed.');
  }

  res.redirect('./status?verified=email');
}));

router.get('/status', handleAsync(async (req, res) => {
  const verified = req.query.verified.split(',');
  const statuses = schemes.map(({name}) => {
    return {name, isVerified: verified.indexOf(name) > -1};
  });

  res.render('member/status', {statuses});
}));

module.exports = router;
