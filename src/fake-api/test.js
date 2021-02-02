'use strict';

const {Builder} = require('selenium-webdriver');
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

  setup(() => driver.get(process.env.APP_DOMAIN));

  suiteTeardown(async () => {
    driver && await driver.quit();
  });

  test('provides an appropriate title', async () => {
    const title = await driver.getTitle();

    assert(/california authorized agent/i.test(title));
  });
});
