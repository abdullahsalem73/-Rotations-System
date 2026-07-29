const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove BOTH service worker blocks
const swBlock1 = `<script>
      // 🔄 Auto-clear old caches and service workers on every load
      if ('serviceWorker' in navigator) {
          window.addEventListener('load', async () => {
              // Unregister ALL old service workers
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (let reg of registrations) {
                  await reg.unregister();
              }
              // Delete ALL old caches
              const cacheKeys = await caches.keys();
              for (let key of cacheKeys) {
                  await caches.delete(key);
              }
              // Register fresh SW
              navigator.serviceWorker.register('./sw.js?v=6').catch(err => console.error('SW registration failed:', err));
          });
      }
      window.addEventListener('online',  () => document.getElementById('offlineIndicator').style.display = 'none');
      window.addEventListener('offline', () => document.getElementById('offlineIndicator').style.display = 'block');
      if(!navigator.onLine) document.addEventListener('DOMContentLoaded', () => document.getElementById('offlineIndicator').style.display = 'block');
  </script>`;

const swBlock2 = `<script>
      if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
              navigator.serviceWorker.register('./service-worker.js')
                  .then(registration => {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, err => {
                      console.log('ServiceWorker registration failed: ', err);
                  });
          });
      }
  
      window.addEventListener('online', () => {
          const indicator = document.getElementById('offlineIndicator');
          if (indicator) indicator.style.display = 'none';
      });
      window.addEventListener('offline', () => {
          const indicator = document.getElementById('offlineIndicator');
          if (indicator) indicator.style.display = 'block';
      });
  </script>`;

if (html.includes(swBlock1)) html = html.replace(swBlock1, '');
if (html.includes(swBlock2)) html = html.replace(swBlock2, '');

// 2. Add an aggressive unregister script in <head>
const unregisterScript = `<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
if (window.caches) {
    caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
    });
}
</script>`;

if (!html.includes('registration.unregister()')) {
    html = html.replace('</head>', unregisterScript + '\n</head>');
}

// 3. Robust fix for sick leave and emergency in autoFillTimesheet
// Let's replace the block entirely using a robust regex.
const targetRegex = /\} else if \(status === 'sick_leave' \|\| status === 'emergency'\) \{\s*currentTimesheetData\[emp\.ID\]\[i\] = 'E';\s*\} else if \(status === 'leave' \|\| status === 'rest' \|\| status === 'missing'\) \{\s*currentTimesheetData\[emp\.ID\]\[i\] = '';\s*\}/;

const robustReplacement = `} else if (['sick_leave', 'emergency', 'Emergency', 'SL', 'E'].includes(status)) {
                      currentTimesheetData[emp.ID][i] = 'E';
                  } else if (status === 'leave' || status === 'rest' || status === 'missing') {
                      currentTimesheetData[emp.ID][i] = '';
                  }`;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, robustReplacement);
} else {
    // try the original one just in case the previous fix failed somehow
    const origRegex = /} else if \(status === 'leave' \|\| status === 'rest' \|\| status === 'missing' \|\| status === 'sick_leave'\) \{\s*currentTimesheetData\[emp\.ID\]\[i\] = '';\s*}/;
    if (origRegex.test(html)) {
        html = html.replace(origRegex, robustReplacement);
    }
}

// 4. In getEmployeeCurrentStatusForDate, ensure the string is lowercased if needed or just handle it directly above.

fs.writeFileSync('index.html', html);
console.log("Cache removed and sick leave robustified.");
