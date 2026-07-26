(async () => {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('file://D:/Rotations/index.html', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
