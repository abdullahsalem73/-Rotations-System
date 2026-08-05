(async () => {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('file://D:/Rotations/index.html', {waitUntil: 'networkidle2'});
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
      try {
          if (!window.firebase) {
            console.log("window.firebase not found");
            return;
          }
          const db = window.firebase.firestore();
          const doc = await db.collection("employees").doc("1009").get();
          if (doc.exists) {
              let emp = doc.data();
              console.log("Got employee 1009");
              let rotIndex = emp.Rotations.findIndex(r => r.id === "rot_771");
              if (rotIndex !== -1) {
                  emp.Rotations[rotIndex].start = "2026-08-20";
                  emp.Rotations[rotIndex].end = "2026-09-16";
                  await db.collection("employees").doc("1009").set(emp);
                  console.log("Success updating 1009");
              } else {
                  console.log("rot_771 not found in array");
              }
          } else {
              console.log("Employee 1009 not found");
          }
      } catch(e) {
          console.log("Error: " + e.message);
      }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
