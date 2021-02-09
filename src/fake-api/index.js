'use strict';

const http = require('http');

const PORT = process.env.PORT;

let latestEmail;

const sendEmail = async (req, res) => {
  const latestEmail = await new Promise(resolve => {
    let receiving = '';
    req.on('data', chunk => {
      receiving += chunk.toString();
    });
    req.on('end', () => {
      resolve(
        receiving
          .replace(/&#x2F;/g, '/')
          .replace(/&amp;/g, '&')
          .replace(/&#x3D;/g, '=')
      );
    });
  });
  console.error(req.method, req.url, latestEmail);

  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end(JSON.stringify({
    id: '<20151025002517.117282.79817@sandbox-123.mailgun.org>',
    message: 'Queued. Thank you.'
  }));
};

http.createServer((req, res) => {
  console.log(req.method, req.path);
  // if (req.method === 'POST' && req.path === '/v3/fake.org/messages') {
  // }
  return sendEmail(req, res);
}).listen(PORT, () => {
  console.error(`Fake API server listening on port ${PORT}`);
});

module.exports = { 
  getLatestEmail: () => latestEmail,
  verificationSmsSent: () => true,
  verificationSmsApproved: () => true,
};