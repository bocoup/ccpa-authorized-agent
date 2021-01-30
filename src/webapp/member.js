'use strict';
const path = require('path');
const {URL} = require('url');

const {Router} = require('express');

const {PUBLIC_ADDRESS} = process.env;
const challengeEmail = require('./challenges/email');
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

  await challengeEmail(publicUrl.href, member);

  res.redirect('/?success=1');
}));

router.get('/verify', handleAsync(async (req, res) => {
  const member = await Member.findOne({
    where: {
      emailChallenge: req.query.value
    }
  });

  if (!member) {
    throw new Error('Unrecognized verification code.');
  }

  member.emailVerified = true;
  await member.save();
  res.redirect('./status?verified=email');
}));

router.get('/status', handleAsync(async (req, res) => {
  const verified = req.query.verified.split(',').reduce((memo, next) => {
    memo[next] = true;
    return memo;
  }, {});

  res.render('member/status', {verified});
}));

module.exports = router;
