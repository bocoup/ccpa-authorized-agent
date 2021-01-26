'use strict';
const http = require('http');
const debug = require('debug')('index');
const {Visit} = require('./models/');

http.createServer(async (req, res) => {
  try {
    await Visit.create({});
    const count = (await Visit.findAll()).length;

    res.writeHead(200);
    res.end(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <p>Visitor count: ${count}</p>
  </body>
</html>`);
  } catch (error) {
    res.writeHead(500);
    res.end(String(error));
  }
}).listen(5000, () => {
  debug('Server initialized and listening on port 5000.');
});
