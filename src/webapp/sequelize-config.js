'use strict';

const config = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: 'db',
  port: 5432,
  dialect: 'postgresql',
};

module.exports = {
  development: config,
  production: config,
};
