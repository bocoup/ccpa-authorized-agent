const fetch = require('node-fetch');
const base64 = require('base-64');
const FormData = require('form-data');

const {
  MAILGUN_API_KEY, MAILGUN_MESSAGING_DOMAIN, MAILGUN_SENDER, MAILGUN_SERVICE_DOMAIN
} = process.env;

const sendEmail = async ({ to, subject, html }) => {
  console.log('Sent email', { to, subject, html });
  // return mg.messages.create(MAILGUN_MESSAGING_DOMAIN, data);
  const formData = new FormData();
  formData.append('from', MAILGUN_SENDER);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('html', html);
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

module.exports = sendEmail;