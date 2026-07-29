const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace left colspan
const leftColspanStr = `<td colspan="2" style="text-align: right; font-weight: bold; background: linear-gradient(90deg, var(--card-bg) 0%, rgba(59, 130, 246, 0.3) 100%); color: #3b82f6; position: sticky; left: 60px; z-index: 20; border-bottom: 2px solid #3b82f6; font-size: 14px; padding: 12px 10px; letter-spacing: 0.5px; text-transform: uppercase;">Total On Duty</td>`;

const leftReplacement = `<td style="border-bottom: 2px solid #3b82f6;"></td>
<td style="text-align: right; font-weight: bold; background: linear-gradient(90deg, var(--card-bg) 0%, rgba(59, 130, 246, 0.3) 100%); color: #3b82f6; position: sticky; left: 60px; z-index: 20; border-bottom: 2px solid #3b82f6; font-size: 14px; padding: 12px 10px; letter-spacing: 0.5px; text-transform: uppercase;">Total On Duty</td>`;

if (html.includes(leftColspanStr)) {
    html = html.replace(leftColspanStr, leftReplacement);
    console.log("Replaced left colspan");
}

// Replace right colspan
const rightColspanStr = `footerHTML += \`<td colspan="2" style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td></tr>\`;`;

const rightReplacement = `footerHTML += \`<td style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td><td style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td></tr>\`;`;

if (html.includes(rightColspanStr)) {
    html = html.replace(rightColspanStr, rightReplacement);
    console.log("Replaced right colspan");
}

fs.writeFileSync('index.html', html);
console.log("Done");
