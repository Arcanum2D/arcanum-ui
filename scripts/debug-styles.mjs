import { createRequire } from 'node:module';
const require = createRequire('/Users/yickson/Games/Arcanum2D-RPG/arcanum-client/package.json');
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2] ?? 'http://localhost:5199/demo/', { waitUntil: 'networkidle' });

const report = await page.evaluate(() => {
  const pick = (el, props) => {
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
  };
  const cb = document.querySelector('.arc-checkbox');
  const cbBefore = getComputedStyle(cb, '::before');
  return {
    topbarSelect: pick(document.getElementById('font-picker'), ['appearance', 'background-color', 'color']),
    formSelect: pick(document.getElementById('demo-class'), ['appearance', 'background-color', 'color']),
    checkbox: pick(cb, ['appearance', 'background-color', 'width', 'height', 'display']),
    checkboxBefore: {
      content: cbBefore.content,
      width: cbBefore.width,
      height: cbBefore.height,
      transform: cbBefore.transform,
      background: cbBefore.backgroundColor,
    },
    sliderTrackNote: pick(document.querySelector('.arc-slider'), ['appearance', 'height']),
  };
});
console.log(JSON.stringify(report, null, 2));
await browser.close();
