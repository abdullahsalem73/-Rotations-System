(async () => {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({headless: 'new'});
  const page = await browser.newPage();
  
  // Expose a function to receive the analysis result
  await page.exposeFunction('logAnalysis', (result) => {
    console.log(JSON.stringify(result, null, 2));
  });

  page.on('console', msg => {
    if(!msg.text().includes('PAGE LOG')) {
       // console.log('BROWSER:', msg.text())
    }
  });
  
  await page.goto('file:///D:/Rotations/index.html', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 4000)); // wait for firebase fetch
  
  await page.evaluate(async () => {
      try {
          if (!window.employees) return window.logAnalysis({error: "window.employees not found"});
          
          const d = new Date();
          const todayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
          const todayNum = window.parseDate(todayStr).getTime();
          
          let missingEmployees = [];
          
          window.employees.forEach(e => {
              let currentStatus = 'unknown';
              let lastEndNum = 0;
              let lastEndStr = '';
              
              if (e.Rotations && e.Rotations.length > 0) {
                  // Find the absolute latest date
                  e.Rotations.forEach(r => {
                      const startNum = window.parseDate(r.start).getTime();
                      const endNum = window.parseDate(r.end).getTime();
                      if (endNum > lastEndNum) {
                          lastEndNum = endNum;
                          lastEndStr = r.end;
                      }
                      
                      if (todayNum >= startNum && todayNum <= endNum) {
                          currentStatus = r.type;
                      }
                  });
              } else {
                  lastEndStr = "NO_ROTATIONS_AT_ALL";
              }
              
              if (currentStatus === 'unknown') {
                  missingEmployees.push({
                      id: e.ID,
                      name: e.Name,
                      lastRecordedEndDate: lastEndStr,
                      isExpired: lastEndNum < todayNum,
                      isInFuture: lastEndNum > todayNum // This shouldn't happen usually for unknown unless gap
                  });
              }
          });
          
          window.logAnalysis({
              totalMissing: missingEmployees.length,
              details: missingEmployees
          });
          
      } catch(e) {
          window.logAnalysis({error: e.message});
      }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
