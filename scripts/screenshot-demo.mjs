// Visual check of the kitchen-sink demo. Reuses arcanum-client's Playwright.
// Usage: node scripts/screenshot-demo.mjs <demo-url> <out-prefix>
import { createRequire } from 'node:module';

const require = createRequire('/Users/yickson/Games/Arcanum2D-RPG/arcanum-client/package.json');
const { chromium } = require('playwright');

const url = process.argv[2] ?? 'http://localhost:5199/demo/';
const out = process.argv[3] ?? 'demo';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

for (const font of ['jersey', 'arcade', 'clean']) {
  await page.evaluate((f) => document.documentElement.setAttribute('data-arc-font', f), font);
  await page.waitForTimeout(400); // font swap settle
  await page.screenshot({ path: `${out}-${font}.png`, fullPage: true });
}

// interaction smoke test: modal + toast
await page.evaluate(() => document.documentElement.setAttribute('data-arc-font', 'jersey'));
await page.click('#toast-ok');
await page.click('#open-modal');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}-modal-toast.png` });
const modalVisible = await page.isVisible('#demo-overlay');
const toastCount = await page.locator('.arc-toast').count();
await page.click('#demo-modal-cancel');
await page.waitForTimeout(300);
const modalClosed = !(await page.isVisible('.arc-modal'));

console.log(JSON.stringify({ modalVisible, toastCount, modalClosed }));
await browser.close();
