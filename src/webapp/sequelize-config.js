'use strict';

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'db',
    port: 5432,
    dialect: 'postgresql',
  },
  production: {
    // PAAS_COUPLING: Heroku provides the `DATABASE_URL` environment variable.
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
  }
};
