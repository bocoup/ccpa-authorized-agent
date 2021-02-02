# California Consumer Protection Agent

## Development workflow

Dependencies:

- [Docker](https://www.docker.com/) version 19 or later

Run the following command:

    $ docker-compose up

This will create a web server listening on port 5000. You may access it by
visiting http://localhost:5000 in a web browser.

By default, third-party services are simulated by a local server during
development. Developers who wish to interact with one or more authentic
third-party service may do so by modifying the environment variables documented
below.

## Automated functional tests

To execute the automated functional tests, initialize a development
environment, and run the following command:

    $ docker exec -it ccpaauthorizedagent_fake-api_1 npm test

## Environment variables

The application requires the following operating system environment variables
to be set:

Name                         | Purpose
-----------------------------|--------
`DEBUG`                      | controls the verbosity of the application's logging output; refer to the documentation for [the open source Node module `debug`](https://www.npmjs.com/package/debug) for details on the semantics of this value
`HTTP_SESSION_KEY`           | the encryption key to use for session information stored in HTTP cookies (The application uses HTTP cookies to persist information between requests. This includes a flag describing whether the user has previously been authenticated as an administrator.)
`ADMIN_PASSWORD`             | the password that users must enter to authenticate as administrators and access the Member table
`NODE_ENV`                   | controls the use of various runtime optimizations such as HTML template caching; set to `development` to disable all optimization; set to `production` to enable all optimizations.
`PORT`                       | specifies the TCP port on which the application's HTTP server will listen for incoming requests
`DATABASE_URL`               | the location of the PostgreSQL database; takes the form `postgres://username:password@host:port/database`
`PUBLIC_ADDRESS`             | the URL where the application is publicly-accessible; used to generate links for responses to identity challenges
`MAILGUN_API_KEY`            | access credential provided by [the Mailgun service](https://www.mailgun.com/); used to verify new members' e-mail addresses
`MAILGUN_MESSAGING_DOMAIN`   | access credential provided by [the Mailgun service](https://www.mailgun.com/); used to verufy new members' e-mail addressed
`MAILGUN_SENDER`             | address from which e-mail messages should be sent to members
`MAILGUN_SERVICE_DOMAIN`     | domain to use in contacting [the Mailgun service](https://www.mailgun.com/); varies by region

## Deployment workflow

Dependencies:

- [Docker](https://www.docker.com/) version 19 or later
- [Heroku CLI](https://devcenter.heroku.com/categories/command-line)

1. Create a Heroku app and database

       $ heroku login
       $ heroku apps:create ccpa-authorized-agent
       $ heroku config:set --app ccpa-authorized-agent NODE_ENV=production
       $ heroku config:set --app ccpa-authorized-agent HTTP_SESSION_KEY=some_hard_to_guess_value_f@ds9
       $ heroku config:set --app ccpa-authorized-agent ADMIN_PASSWORD=open_sesame
       $ heroku config:set --app ccpa-authorized-agent PUBLIC_ADDDRESS=https://ccpa-authorized-agent.herokuapp.com/
       $ heroku config:set --app ccpa-authorized-agent MAILGUN_API_KEY=xxx_key_xxx
       $ heroku config:set --app ccpa-authorized-agent MAILGUN_MESSAGING_DOMAIN=xxx_domain_xxx
       $ heroku config:set --app ccpa-authorized-agent MAILGUN_SENDER=robot@example.com
       $ heroku config:set --app ccpa-authorized-agent MAILGUN_SERVICE_DOMAIN=https://api.mailgun.net

       # Heroku-provided PostgreSQL database requires SSL
       $ heroku config:set --app ccpa-authorized-agent PGSSLMODE=require
       # Heroku-provided PostgreSQL uses self-signed certificate
       $ heroku config:set --app ccpa-authorized-agent NODE_TLS_REJECT_UNAUTHORIZED=0

       $ heroku addons:create --app ccpa-authorized-agent heroku-postgresql:hobby-dev

2. Deploy the application code

       $ heroku container:login
       $ heroku container:push web --app ccpa-authorized-agent
       $ heroku container:release web --app ccpa-authorized-agent

## Code of Conduct

This project is governed by [the Bocoup Code of
Conduct](https://bocoup.com/code-of-conduct).

## License

Copyright (c) 2021 Bocoup and Consumer Reports  
Licensed under the MIT Expat license.
