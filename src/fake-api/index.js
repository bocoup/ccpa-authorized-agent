'use strict';

const http = require('http');

const PORT = process.env.PORT;

http.createServer((req, res) => {
  console.error(req.method, req.url);

  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end(JSON.stringify({
    id: '<20151025002517.117282.79817@sandbox-123.mailgun.org>',
    message: 'Queued. Thank you.'
  }));
}).listen(PORT, () => {
  console.error(`Fake API server listening on port ${PORT}`);
});
