const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix renderTimesheetTable to show Night Shift Icon
// Use generic whitespace matching
const targetRenderRegex = /let bodyHTML = '';\s*filtered\.forEach\(emp => \{\s*const empData = currentTimesheetData\[emp\.ID\] \|\| \{\};\s*let totalDuty = 0;\s*let rowHTML = `<tr>\s*<td>\$\{emp\.ID\}<\/td>\s*<td style="white-space: nowrap;">\$\{emp\.Name\}<\/td>`;/m;

const replaceRender = `let bodyHTML = '';
          filtered.forEach(emp => {
              const empData = currentTimesheetData[emp.ID] || {};
              let totalDuty = 0;
              
              const isNight = empData.shift === 'Night';
              const shiftIcon = isNight ? '🌙' : '☀️';
              
              let rowHTML = \`<tr>
                  <td>\${emp.ID}</td>
                  <td style="white-space: nowrap;">
                      <span style="cursor:pointer; margin-right: 5px; font-size:16px; user-select:none;" onclick="toggleShift('\${emp.ID}')" title="Toggle Shift">\${shiftIcon}</span>
                      \${emp.Name}
                  </td>\`;`;

if (html.match(targetRenderRegex)) {
    html = html.replace(targetRenderRegex, replaceRender);
    console.log("Night Shift UI applied.");
} else {
    console.log("Failed to find targetRenderRegex!");
}

fs.writeFileSync('index.html', html);
