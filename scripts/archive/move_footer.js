const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFooter = `let footerHTML = \`<tr>
              <td colspan="2" style="text-align: right; font-weight: bold; background: var(--glass-bg); position: sticky; left: 60px; z-index: 20;">Total On Duty</td>\`;
          for (let i = 1; i <= daysInMonth; i++) {
              const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
              const isToday = isCurrentMonth && (i === todayDate);
              let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.1); color: #3b82f6;';
              if (isToday) ftStyle += ' border: 2px solid #f9a826; border-top: none;';
              
              footerHTML += \`<td style="\${ftStyle}">\${dailyCounts[i] > 0 ? dailyCounts[i] : ''}</td>\`;
          }
          footerHTML += \`<td colspan="2" style="background: var(--glass-bg);"></td></tr>\`;
          
          bodyHTML += footerHTML;`;

const newFooter = `let footerHTML = \`<tr>
              <td colspan="2" style="text-align: right; font-weight: bold; background: linear-gradient(90deg, var(--card-bg) 0%, rgba(59, 130, 246, 0.3) 100%); color: #3b82f6; position: sticky; left: 60px; z-index: 20; border-bottom: 2px solid #3b82f6; font-size: 14px; padding: 12px 10px; letter-spacing: 0.5px; text-transform: uppercase;">📊 Total On Duty</td>\`;
          for (let i = 1; i <= daysInMonth; i++) {
              const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
              const isToday = isCurrentMonth && (i === todayDate);
              let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.2); color: #fff; border-bottom: 2px solid #3b82f6; text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); font-size: 14px;';
              if (isToday) ftStyle += ' border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.2); color: #f9a826; text-shadow: none;';
              
              footerHTML += \`<td style="\${ftStyle}">\${dailyCounts[i] > 0 ? dailyCounts[i] : '-'}</td>\`;
          }
          footerHTML += \`<td colspan="2" style="background: rgba(59, 130, 246, 0.2); border-bottom: 2px solid #3b82f6;"></td></tr>\`;
          
          bodyHTML = footerHTML + bodyHTML;`;

// Handle spaces and newlines mismatch by using a regex replacement if strict replace fails
if (html.includes('let footerHTML = `<tr>')) {
    const startIndex = html.indexOf('let footerHTML = `<tr>');
    const endIndex = html.indexOf('bodyHTML += footerHTML;', startIndex) + 'bodyHTML += footerHTML;'.length;
    html = html.substring(0, startIndex) + newFooter + html.substring(endIndex);
}

fs.writeFileSync('index.html', html);
