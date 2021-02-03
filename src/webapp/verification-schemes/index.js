'use strict';

const emailVerification = require('./email');
const phoneVerification = require('./phone');

const schemes = [
  emailVerification,
  phoneVerification,
];

module.exports = { emailVerification, phoneVerification };

module.exports.remindUnverified = async (responseUrl) => {
  const promises = [];

  for (const scheme of schemes) {
    for (const member of await scheme.findUnverified()) {
      promises.push(scheme.challenge(responseUrl, member));
    }
  }

  return Promise.allSettled(promises);
};
