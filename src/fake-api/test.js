'use strict';

const {Builder, By} = require('selenium-webdriver');
const assert = require('assert');
const fetch = require('node-fetch');

const clearFakeApiState = async () => {
  await fetch(`http://localhost:${process.env.PORT}/clear-state`);
};

const getLatestEmail = async () => {
  const rawResponse = await fetch(`http://localhost:${process.env.PORT}/get-latest-email`);
  const text = await rawResponse.text();
  return text.toString();
};

const verificationSmsSent = async () => {
  const rawResponse = await fetch(`http://localhost:${process.env.PORT}/verification-sms-sent`);
  const rawJson = await rawResponse.json();
  return JSON.parse(rawJson);
};

const verificationSmsApproved = async () => {
  const rawResponse = await fetch(`http://localhost:${process.env.PORT}/verification-sms-approved`);
  const rawJson = await rawResponse.json();
  return JSON.parse(rawJson);
};

const setupTimeout = 90000;

suite('integration', () => {
  let driver;

  suiteSetup(async function() {
    this.timeout(setupTimeout);

    driver = await new Builder()
      .forBrowser('firefox')
      .usingServer(`http://${process.env.WEBDRIVER_DOMAIN}/wd/hub`)
      .build();
  });

  suiteTeardown(async function () {
    this.timeout(6000);
    await clearFakeApiState();
    driver && await driver.quit();
  });

  test('completes signup flow', async function () {
    this.timeout(90000);

    // Complete form
    await driver.get(process.env.APP_DOMAIN);
    await driver.findElement(By.css('#first-name')).sendKeys('Tessa');
    await driver.findElement(By.css('#last-name')).sendKeys('Tester');
    await driver.findElement(By.css('#address-street')).sendKeys('555 Main St.');
    await driver.findElement(By.css('#address-city')).sendKeys('Santa Monica');
    await driver.findElement(By.css('#address-zipcode')).sendKeys('90410');
    await driver.findElement(By.css('#email')).sendKeys('tessa.tester@example.com');
    await driver.findElement(By.css('#phone')).sendKeys('206-643-7362');
    // await driver.findElement(By.css('#phone')).sendKeys('555-555-5555');
    await driver.findElement(By.css('#consent-text')).click();
    await driver.findElement(By.css('#consent-agent')).click();
    await driver.findElement(By.css('#consent-response')).click();
    await driver.findElement(By.css('#consent-email')).click();
    await driver.findElement(By.css('#consent-policies')).click();
    await driver.findElement(By.css('#volunteer')).click();
    const successText = await driver.findElement(By.css('#success h2')).getText();
    assert.strictEqual(successText, 'Thanks for signing up! You have a few more steps to enroll');
    
    // Click link to verify email
    let email = await getLatestEmail();
    const emailLink = email.match(/To confirm your email, click <a href="([^"]+)">/)[1];
    
    // Enter code to verify phone
    await driver.get(emailLink);
    assert.strictEqual(await verificationSmsSent(), true);
    await driver.findElement(By.css('#code')).sendKeys('99999');
    await driver.findElement(By.css('#verify-code')).click();
    
    // // Receive link to authorization form
    await driver.wait(driver.findElement(By.css('#part-2 h1')).isDisplayed());
    assert.strictEqual(await verificationSmsApproved(), true);
    email = await getLatestEmail();
    assert.match(email, /Thank you for enrolling in the Consumer Reports Authorized Agent study/);
    assert.match(email, /<a href="https:\/\/na4\.docusign\.net\/Member\/PowerFormSigning\.aspx/);
  });
});
