# fake-api

This container is maintained to facilitate local testing. It defines an HTTP
server which provides approximations of the third-party services upon which the
application relies. By configuring the application to direct its requests to
this server, developers can exercise the relevant functionality without
incurring usage charges, modifying state, or accessing the Internet.

The project's automated acceptance tests are also hosted here. Sharing a single
container for these two responsibilities (i.e. third-party service simulation
automated testing) allows individual tests to control the simulated behavior of
the services. In this way, the tests can validate the application's response to
exceptional circumstances.
