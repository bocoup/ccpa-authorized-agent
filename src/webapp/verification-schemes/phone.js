'use strict';

const fetch = require('node-fetch');
const base64 = require('base64');
const FormData = require('form-data');
const {DateTime} = require('luxon');
const {Op} = require('sequelize');
const {member: Member} = require('../models/');

/**
 * The number of hours to wait between sending e-mail reminders to any given
 * member.
 */
const PHONE_CHALLENGE_RETRY_PERIOD = 24;

/**
 * The number of hours following Member creation time to wait before ceasing to
 * send e-mail reminders to any given user.
 */
const PHONE_CHALLENGE_QUIT_DELAY = 72;

const {TWILIO_SERVICE_ID, TWILIO_SID, TWILIO_AUTH_TOKEN} = process.env;

module.exports = {
  name: 'phone',
  
  challenge: async member => {
    let formData = new FormData();
    formData.append('To', member.phone);
    formData.append('Channel', 'sms');

    await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_SERVICE_ID}/Verifications`,
      { 
        method: 'POST', 
        body: formData, 
        headers: {
          Authorization: `Basic ${base64.encode(`${TWILIO_SID}:${TWILIO_AUTH_TOKEN}`)}`
        }
      },
    );
  },

  verify: async (member, smsCode) => {
    let formData = new FormData();
    formData.append('To', member.phone);
    formData.append('Code', smsCode);

    const rawResponse = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_SERVICE_ID}/VerificationCheck`,
      { 
        method: 'POST', 
        body: formData, 
        headers: {
          Authorization: `Basic ${base64.encode(`${TWILIO_SID}:${TWILIO_AUTH_TOKEN}`)}`
        }
      },
    );
    const response = await rawResponse.json();

    return response && response.status === 'approved';
  },

  findUnverified: async () => {
    const now = DateTime.local();
    const previousChallengeTime = now.minus(
      {hours: PHONE_CHALLENGE_RETRY_PERIOD}
    ).toISO();
    const challengeQuit = now.minus({hours: PHONE_CHALLENGE_QUIT_DELAY});
  
    return Member.findAll({
      where: {
        [Op.and]: [
          {phoneVerified: false},
          {
            [Op.or]: [
              {phoneChallengeAt: null},
              {
                [Op.and]: [
                  {phoneChallengeAt: {[Op.lt]: previousChallengeTime}},
                  {createdAt: {[Op.gte]: challengeQuit}},
                ]
              }
            ]
          }
        ]
      }
    });
  },
};