FROM node:14-alpine3.10
ADD ./src/webapp /opt/webapp
WORKDIR /opt/webapp
RUN npm install --production
CMD ./wait-for-migration.sh && node .
