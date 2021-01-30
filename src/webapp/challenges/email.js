'use strict';
const fs = require('fs');
const {URL} = require('url');

const {DateTime} = require('luxon');
const mailgun = require('mailgun-js');
const mustache = require('mustache');

const {MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_SENDER} = process.env;
const mg = mailgun({apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN});
const messageTemplate = fs.readFileSync(
  __dirname + '/../views/member/verify-email.mustache', 'utf-8'
);

const send = (data) => {
  return new Promise((resolve, reject) => {
    mg.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(body);
    });
  });
};

module.exports = async (responseUrl, member) => {
  const url = new URL(responseUrl);
  url.searchParams.set('name', 'email');
  url.searchParams.set('value', member.emailChallenge);
  const message = mustache.render(messageTemplate, {url: url.href});
  const firstNewline = message.indexOf('\n');
  const subject = message.substr(0, firstNewline);
  const text = message.substr(firstNewline);

  await send({
    from: MAILGUN_SENDER,
    to: member.email,
    subject,
    text,
  });

  member.emailChallengeAt = DateTime.local().toISO();
  await member.save();
};
