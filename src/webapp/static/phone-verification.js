/* globals document, fetch, alert, window */

'use strict';

const form = document.querySelector('#phone-verification-form');
form.addEventListener('submit', event => {
  event.preventDefault();

  const smsCode = document.querySelector('#code').value;

  let emailChallenge;
  
  window.location.search
    .replace('?', '')
    .split('&')
    .forEach(param => {
      const [key, value] = param.split('=');
      if (key === 'value') {
        emailChallenge = value;
      }
    });


  fetch(
    `/member/verify-phone-code?smsCode=${smsCode}&emailChallenge=${emailChallenge}`,
    { method: 'POST' }
  )
    .then(rawResponse => {
      return rawResponse.json();
    })
    .then(response => {
      if (response && response.success === true) {
        alert('Ready to sign form');
      }
    });
});