const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove "Grand Total" from the chart
const grandTotalStart = `// Grand Total`;
const grandTotalEnd = `</div>\`;`;
const startIndex = html.indexOf(grandTotalStart);
const endIndex = html.indexOf(grandTotalEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + html.substring(endIndex + grandTotalEnd.length);
    console.log("Grand Total removed from chart.");
}

// 2. Restore Timesheet footer
const insertionPoint = `          document.getElementById('timesheetBody').innerHTML = bodyHTML;`;
const footerCode = `          // Add Daily Summary Footer Row
          let footerHTML = \`<tr>
              <td style="border-bottom: 2px solid #3b82f6;"></td>
<td style="text-align: right; font-weight: bold; background: linear-gradient(90deg, var(--card-bg) 0%, rgba(59, 130, 246, 0.3) 100%); color: #3b82f6; position: sticky; left: 60px; z-index: 20; border-bottom: 2px solid #3b82f6; font-size: 14px; padding: 12px 10px; letter-spacing: 0.5px; text-transform: uppercase;">Total On Duty</td>\`;
          for (let i = 1; i <= daysInMonth; i++) {
              const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
              const isToday = isCurrentMonth && (i === todayDate);
              let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.2); color: #fff; border-bottom: 2px solid #3b82f6; text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); font-size: 14px;';
              if (isToday) ftStyle += ' border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.2); color: #f9a826; text-shadow: none;';
              footerHTML += \`<td style="\${ftStyle}">\${dailyCounts[i] > 0 ? dailyCounts[i] : '-'}</td>\`;
          }
          footerHTML += \`<td style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td><td style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td></tr>\`;
          
          bodyHTML = footerHTML + bodyHTML;

`;

if (html.includes(insertionPoint) && !html.includes("let footerHTML =")) {
    html = html.replace(insertionPoint, footerCode + insertionPoint);
    console.log("Timesheet footer restored.");
}

fs.writeFileSync('index.html', html);
console.log("Done");
