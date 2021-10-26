/* eslint-env jest */
const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

/** @param {number} ms */
const timeout = (ms) => new Promise((cb) => setTimeout(cb, ms));

describe('end-to-end tests', () => {
  it('works from react', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:2000/react.html', {
      waitUntil: 'networkidle2',
    });

    await timeout(3000);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.75,
    });

    await browser.close();
  });

  it('proxys sync test 1 and renders it in the browser', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:2000/1?noLogs=true', {
      waitUntil: 'networkidle2',
    });

    await timeout(5000);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.75,
    });

    await browser.close();
  });

  it('proxys sync test 2 and renders it in the browser', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:2000/2?noLogs=true', {
      waitUntil: 'networkidle2',
    });

    await timeout(5000);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.75,
    });

    await browser.close();
  });

  it('proxys sync test 1 & 2 simulatenously using the new browser API', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:2000/dual-stream', {
      waitUntil: 'networkidle2',
    });

    await timeout(5000);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.75,
    });

    await browser.close();
  });
});

// afterAll(global.teardown);
