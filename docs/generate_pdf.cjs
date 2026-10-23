const { chromium } = require('../client/node_modules/@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = path.resolve(__dirname, 'slides.html');
  await page.goto('file:///' + filePath.replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  const pdfPath = path.resolve(__dirname, 'SpendNest_Revenue_Intelligence_Slides.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  await browser.close();
  console.log(`PDF slides successfully generated at: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
})();
