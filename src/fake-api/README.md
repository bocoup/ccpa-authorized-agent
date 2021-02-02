# fake-api

This container is maintained to facilitate local testing. It defines an HTTP
server which provides approximations of the third-party services upon which the
application relies. By configuring the application to direct its requests to
this server, developers can exercise the relevant functionality without
incurring usage charges, modifying state, or accessing the Internet.
