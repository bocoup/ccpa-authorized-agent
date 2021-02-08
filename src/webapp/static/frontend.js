/* globals document, fetch, window */

'use strict';

const showPageWithId = id => {
  const pages = document.querySelector('#pages');
  Array.from(pages.children).forEach(page => {
    if (page.id !== id) {
      page.style.display = 'none';
    } else {
      page.style.display = 'block';
    }
  });
};

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
        showPageWithId('part-2');
      }
    });

  document.querySelector('#status-link').addEventListener('click', event => {
    event.preventDefault();
    showPageWithId('status-page');
  });

  document.querySelector('#revoke-authorization').addEventListener('click', event => {
    event.preventDefault();
    fetch(
      `/member/revoke-authorization?emailChallenge=${emailChallenge}`,
      { method: 'POST' }
    )
      .then(rawResponse => {
        return rawResponse.json();
      })
      .then(response => {
        if (response && response.success === true) {
          showPageWithId('authorization-revoked-page');
        }
      });
  });
});
