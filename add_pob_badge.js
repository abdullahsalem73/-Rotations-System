const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add ID and flex layout to the title tag
const oldTitleStr = `<h3 class="gradient-text" style="margin-top:0;">💼 ON-Duty by Company (POB)</h3>`;
const newTitleStr = `<h3 class="gradient-text" style="margin-top:0; display:flex; align-items:center; gap:10px; justify-content:center;" id="pobChartTitle">💼 ON-Duty by Company (POB)</h3>`;

if (html.includes(oldTitleStr)) {
    html = html.replace(oldTitleStr, newTitleStr);
}

// 2. Add logic to update the title
const insertionTarget = `const summaryContainer = document.getElementById('onDutySummary');`;
const insertionLogic = `const titleEl = document.getElementById('pobChartTitle');
          if (titleEl) {
              titleEl.innerHTML = \`💼 ON-Duty by Company (POB) <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 15px; margin-left: 10px; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 800; text-shadow: none;">Total: \${totalOn}</span>\`;
          }
          
          const summaryContainer = document.getElementById('onDutySummary');`;

if (html.includes(insertionTarget)) {
    html = html.replace(insertionTarget, insertionLogic);
}

fs.writeFileSync('index.html', html);
console.log("Done");
