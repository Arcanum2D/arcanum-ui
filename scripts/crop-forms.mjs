import { createRequire } from 'node:module';
const require = createRequire('/Users/yickson/Games/Arcanum2D-RPG/arcanum-client/package.json');
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5199/demo/', { waitUntil: 'networkidle' });
const sections = await page.locator('.demo-section').all();
await sections[4].screenshot({ path: process.argv[2] + '-forms.png' });
await page.locator('.demo-topbar').screenshot({ path: process.argv[2] + '-topbar.png' });
await browser.close();
