'use strict';
const fs = require('fs');
const {URL} = require('url');

const fetch = require('node-fetch');
const base64 = require('base-64');
const FormData = require('form-data');
const {DateTime} = require('luxon');
// const Mailgun = require('mailgun.js');
const mustache = require('mustache');
const {Op} = require('sequelize');

const NAME = 'email';
/**
 * The number of hours to wait between sending e-mail reminders to any given
 * member.
 */
const EMAIL_CHALLENGE_RETRY_PERIOD = 24;
/**
 * The number of hours following Member creation time to wait before ceasing to
 * send e-mail reminders to any given user.
 */
const EMAIL_CHALLENGE_QUIT_DELAY = 72;

const {member: Member} = require('../models/');

const {
  MAILGUN_API_KEY, MAILGUN_MESSAGING_DOMAIN, MAILGUN_SENDER, MAILGUN_SERVICE_DOMAIN
} = process.env;

// const mg = (new Mailguxn(formData)).client({
//   username: 'api',
//   key: MAILGUN_API_KEY,
//   url: MAILGUN_SERVICE_DOMAIN,
// });

const messageTemplate = fs.readFileSync(
  __dirname + '/../views/member/verify-email.mustache', 'utf-8'
);

const send = async ({ from, to, subject, text }) => {
  console.log({ from, to, subject, text });
  // return mg.messages.create(MAILGUN_MESSAGING_DOMAIN, data);
  const formData = new FormData();
  formData.append('from', from);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('text', text);
  await fetch(
    `${MAILGUN_SERVICE_DOMAIN}/v3/${MAILGUN_MESSAGING_DOMAIN}/messages`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Basic ${base64.encode(`api:${MAILGUN_API_KEY}`)}`
      },
    }
  );
};

exports.name = NAME;

exports.challenge = async (responseUrl, member) => {
  const url = new URL(responseUrl);
  url.searchParams.set('name', NAME);
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

/**
 * Find all Members records which are due to receive a reminder message to
 * verify the associated e-mail address. This includes:
 *
 * - Member records for which a verification e-mail has never been sent
 * - Member records for which the most recent verification e-mail was sent over
 *   a certain number of hours in the past (see `EMAIL_CHALLENGE_RETRY_PERIOD`)
 *   and which were created within a certain time frame (see
 *   `EMAIL_CHALLENGE_QUIT_DELAY`).
 */
exports.findUnverified = async () => {
  const now = DateTime.local();
  const previousChallengeTime = now.minus(
    {hours: EMAIL_CHALLENGE_RETRY_PERIOD}
  ).toISO();
  const challengeQuit = now.minus({hours: EMAIL_CHALLENGE_QUIT_DELAY});

  return Member.findAll({
    where: {
      [Op.and]: [
        {emailVerified: false},
        {
          [Op.or]: [
            {emailChallengeAt: null},
            {
              [Op.and]: [
                {emailChallengeAt: {[Op.lt]: previousChallengeTime}},
                {createdAt: {[Op.gte]: challengeQuit}},
              ]
            }
          ]
        }
      ]
    }
  });
};

exports.verify = async (value) => {
  const member = await Member.findOne({
    where: {
      emailChallenge: value
    }
  });

  if (!member) {
    return false;
  }

  member.emailVerified = true;
  await member.save();

  return true;
};
