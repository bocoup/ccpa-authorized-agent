# California Consumer Protection Agent

## Development workflow

Dependencies:

- [Docker](https://www.docker.com/) version 19 or later

Run the following command:

    $ docker-compose up

This will create a web server listening on port 5000. You may access it by
visiting http://localhost:5000 in a web browser.

## Environment variables

The application requires the following operating system environment variables
to be set:

- `DEBUG` - controls the verbosity of the application's logging output; refer
  to the documentation for [the open source Node module
  `debug`](https://www.npmjs.com/package/debug) for details on the semantics of
  this value
- `NODE_ENV` - controls the use of various runtime optimizations such as HTML
  template caching; set to `development` to disable all optimization; set to
  `production` to enable all optimizations.
- `PORT` - specifies the TCP port on which the application's HTTP server will
  listen for incoming requests

## Deployment workflow

Dependencies:

- [Docker](https://www.docker.com/) version 19 or later
- [Heroku CLI](https://devcenter.heroku.com/categories/command-line)

1. Create a Heroku app and database

    $ heroku login
    $ heroku apps:create ccpa-authorized-agent
    $ heroku config:set --app ccpa-authorized-agent NODE_ENV=production
    $ heroku addons:create heroku-postgresql:hobby-dev

2. Deploy the application code

    $ heroku container:push web --app ccpa-authorized-agent
    $ heroku container:release web --app ccpa-authorized-agent

## Code of Conduct

This project is governed by [the Bocoup Code of
Conduct](https://bocoup.com/code-of-conduct).

## License

Copyright (c) 2021 Bocoup and Consumer Reports  
Licensed under the MIT Expat license.
