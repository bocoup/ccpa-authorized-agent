'use strict';
const path = require('path');

const debug = require('debug')('index');
const express = require('express');
const mustacheExpress = require('mustache-express');
const helmet = require('helmet');

// PAAS_COUPLING: Heroku provides the `PORT` environment variable.
const {PORT, PUBLIC_ADDRESS} = process.env;
const admin = require('./admin');
const member = require('./member');
const {remindUnverified} = require('./verification-schemes/');
const memberMountPoint = '/member';

const challengeResponseUrl = (() => {
  const url = new URL(PUBLIC_ADDRESS);
  url.pathname = path.join(url.pathname, memberMountPoint, 'verify');
  return url.href;
})();
/**
 * Number of milliseconds to wait between attempts to send pending verification
 * reminders. This is distinct from the period at which any given verification
 * reminder will be issued.
 */
const VERIFICATION_REMINDER_CHECK_PERIOD = 1000 * 60 * 10; // ten minutes
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
app.use(memberMountPoint, member);

app.get('/', (req, res) => {
  let currentStep
  // TODO: add cookie or similar and load member
  if (!member) {
    currentStep = 'signUp'
  } else if (!member.verifiedPhone) {
    currentStep = 'verifyPhone'
  } else if (!member.verifiedEmail) {
    currentStep = 'verifyEmail'
  } else if (!member.generatedForm) {
    currentStep = 'generateForm'
  } else {
    currentStep = 'success'
  }

  // TODO: add DocuSign here

  res.render('index', {
    signUp: currentStep === 'signUp',
    verifyPhone: currentStep === 'verifyPhone',
    verifyEmail: currentStep === 'verifyEmail',
    success: currentStep === 'success'
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

(async function remind() {
  const results = await remindUnverified(challengeResponseUrl);

  for (const result of results) {
    if (result.status === 'rejected') {
      debug(result.reason);
    }
  }

  setTimeout(remind, VERIFICATION_REMINDER_CHECK_PERIOD);
}());
