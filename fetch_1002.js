(async () => {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('file://D:/Rotations/index.html', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
      try {
          const db = window.firebase.firestore();
          const doc = await db.collection("employees").doc("1002").get();
          if (doc.exists) {
              const emp = doc.data();
              console.log("Got employee 1002");
              console.log(JSON.stringify(emp.Rotations.slice(-5), null, 2));
          } else {
              console.log("Employee 1002 not found");
          }
      } catch(e) {
          console.log("Error: " + e.message);
      }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
