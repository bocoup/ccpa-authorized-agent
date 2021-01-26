FROM node:14-alpine3.10
RUN mkdir /opt/webapp
ADD ./package.json /opt/webapp
WORKDIR /opt/webapp
RUN npm install --production
CMD node .
