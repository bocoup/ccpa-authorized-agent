'use strict';

const http = require('http');

const PORT = process.env.PORT;

let latestEmail;
let isVerificationSmsSent = false;
let isVerificationSmsApproved = true;

const sendEmail = async (req, res) => {
  latestEmail = await new Promise(resolve => {
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
  console.log(req.method, req.url);
  if (req.method === 'POST' && req.url === '/v3/fake.org/messages') {
    return sendEmail(req, res);
  }
  if (req.method === 'POST' && req.url.includes('/Verifications')) {
    isVerificationSmsSent = true;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
  }
  if (req.method === 'POST' && req.url.includes('/VerificationCheck')) {
    isVerificationSmsApproved = true;
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify({ status: 'approved' }));
  }

  // For inspecting state while integration testing
  if (req.method === 'GET' && req.url === '/get-latest-email') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(latestEmail);
  }
  if (req.method === 'GET' && req.url === '/verification-sms-sent') {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(isVerificationSmsSent.toString());
  }
  if (req.method === 'GET' && req.url === '/verification-sms-approved') {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(isVerificationSmsApproved.toString());
  }
  if (req.method === 'GET' && req.url === '/clear-state') {
    latestEmail = undefined;
    isVerificationSmsSent = false;
    isVerificationSmsApproved = true;
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end('');
  }
}).listen(PORT, () => {
  console.error(`Fake API server listening on port ${PORT}`);
});
