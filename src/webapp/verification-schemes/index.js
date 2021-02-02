'use strict';

const schemes = module.exports = [
  require('./email'),
];

module.exports.remindUnverified = async (responseUrl) => {
  const promises = [];

  for (const scheme of schemes) {
    for (const member of await scheme.findUnverified()) {
      promises.push(scheme.challenge(responseUrl, member));
    }
  }

  return Promise.allSettled(promises);
};
