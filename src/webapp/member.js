'use strict';
const fs = require('fs');
const path = require('path');
const {URL} = require('url');

const {Router} = require('express');
const phone = require('phone');
const mustache = require('mustache');

const sendEmail = require('./email-service');

const {PUBLIC_ADDRESS, REVOKE_EMAIL_RECIPIENT} = process.env;
const {emailVerification, phoneVerification} = require('./verification-schemes/');
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
    phone: phone(req.body.phone)[0],
  });
  const publicUrl = new URL(PUBLIC_ADDRESS);
  publicUrl.pathname = path.join(publicUrl.pathname, req.baseUrl, 'verify');

  emailVerification.challenge(publicUrl.href, member);

  res.redirect('/?success=1');
}));

router.get('/verify', handleAsync(async (req, res) => {
  const member = await Member.findOne({
    where: {
      emailChallenge: req.query.value
    }
  });

  if (!await emailVerification.verify(req.query.value)) {
    throw new Error('Verification failed.');
  }

  phoneVerification.challenge(member);

  res.render('member/verify');
}));

router.post('/verify-phone-code', handleAsync(async (req, res) => {
  const member = await Member.findOne({
    where: {
      emailChallenge: req.query.emailChallenge
    }
  });

  if (!await phoneVerification.verify(member, req.query.smsCode)) {
    throw new Error('Verification failed.');
  }

  const messageTemplate = fs.readFileSync(
    __dirname + '/views/member/authorization-email.mustache', 'utf-8'
  );
  const message = mustache.render(messageTemplate);
  const firstNewline = message.indexOf('\n');
  const subject = message.substr(0, firstNewline);
  const html = message.substr(firstNewline);
  await sendEmail({ to: member.email, subject, html });

  res.json({ success: true });
}));

router.post('/revoke-authorization', handleAsync(async (req, res) => {
  const member = await Member.findOne({
    where: {
      emailChallenge: req.query.emailChallenge
    }
  });

  const messageTemplate = fs.readFileSync(
    __dirname + '/views/member/revoke-email.mustache', 'utf-8'
  );
  const message = mustache.render(messageTemplate, {
    firstName: member.getDataValue('firstName'),
    lastName: member.getDataValue('lastName')
  });
  const firstNewline = message.indexOf('\n');
  const subject = message.substr(0, firstNewline);
  const html = message.substr(firstNewline);
  await sendEmail({ to: REVOKE_EMAIL_RECIPIENT, subject, html });

  await member.destroy();
  res.json({ success: true });
}));

 
module.exports = router;
