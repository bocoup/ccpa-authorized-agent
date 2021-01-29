'use strict';

/**
 * Create an Express.js route handler from an asynchronous function by ensuring
 * that rejections are forwarded to the framework.
 */
module.exports = function handleAsync(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};
