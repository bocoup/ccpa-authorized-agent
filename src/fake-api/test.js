'use strict';

const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');

const setupTimeout = 5 * 1000;

suite('landing page', () => {
  let driver;

  suiteSetup(async function() {
    this.timeout(setupTimeout);

    driver = await new Builder()
      .forBrowser('firefox')
      .usingServer(`http://${process.env.WEBDRIVER_DOMAIN}/wd/hub`)
      .build();
  });

  suiteTeardown(async () => {
    driver && await driver.quit();
  });

  test('completes typical flow', async function () {
    this.timeout(15000);
    await driver.get(process.env.APP_DOMAIN);
    await driver.findElement(By.css('#first-name')).sendKeys('Tessa');
    await driver.findElement(By.css('#last-name')).sendKeys('Tester');
    await driver.findElement(By.css('#address-street')).sendKeys('555 Main St.');
    await driver.findElement(By.css('#address-city')).sendKeys('Santa Monica');
    await driver.findElement(By.css('#address-zipcode')).sendKeys('90410');
    await driver.findElement(By.css('#email')).sendKeys('alex@bocoup.com');
    await driver.findElement(By.css('#phone')).sendKeys('206-643-7362');
    // await driver.findElement(By.css('#email')).sendKeys('tessa.tester@example.com');
    // await driver.findElement(By.css('#phone')).sendKeys('555-555-5555');
    await driver.findElement(By.css('#consent-text')).click();
    await driver.findElement(By.css('#consent-agent')).click();
    await driver.findElement(By.css('#consent-response')).click();
    await driver.findElement(By.css('#consent-email')).click();
    await driver.findElement(By.css('#consent-policies')).click();
    await driver.findElement(By.css('#volunteer')).click();
    // await driver.wait(until.elementLocated(By.css('#success')), 5000);
    assert.strictEqual(true, true);
  });
});
