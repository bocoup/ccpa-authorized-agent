'use strict';
require('dotenv').config();

const {Client} = require('pg');
// PAAS_COUPLING: Heroku provides the `DATABASE_URL` environment variable.
const {DATABASE_URL} = process.env;

(async () => {
  let client;

  while (!client) {
    client = new Client({
      connectionString: DATABASE_URL,
    });

    console.error('Attempting to connect to database...');

    try {
      await client.connect();
      console.error('...connection succeeded. Proceeding.');
    } catch (error) {
      console.error('...connection failed. Sleeping.');
      client = null;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  await client.end();
})();
