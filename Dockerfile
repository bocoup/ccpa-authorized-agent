FROM node:14-alpine3.10
ADD ./src/webapp /opt/webapp
WORKDIR /opt/webapp
RUN npm install --production
CMD node ./wait-for-db.js && ./node_modules/.bin/sequelize db:migrate && node .
