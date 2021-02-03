'use strict';

const emailVerification = require('./email');
const phoneVerification = require('./phone');

module.exports = { emailVerification, phoneVerification };

module.exports.remindUnverified = async (responseUrl) => {
  const promises = [];

  for (const member of await emailVerification.findUnverified()) {
    promises.push(emailVerification.challenge(responseUrl, member));
    // TODO: add phoneVerification email too
  }

  return Promise.allSettled(promises);
};
