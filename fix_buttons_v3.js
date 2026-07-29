const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old floating buttons
html = html.replace(/<button class="ts-scroll-btn left".*?<\/button>/g, '');
html = html.replace(/<button class="ts-scroll-btn right".*?<\/button>/g, '');

// 2. Add the buttons to the legend
const legendEnd = '<div style="font-size: 12px; color: var(--text-muted);">Tip: Click a cell to toggle its state (ON -> \r\nE -> X -> empty)</div>\r\n            </div>';
const legendEnd2 = '<div style="font-size: 12px; color: var(--text-muted);">Tip: Click a cell to toggle its state (ON -> \nE -> X -> empty)</div>\n            </div>';

const newButtons = `
<div style="display: flex; gap: 10px; align-items: center; background: rgba(16, 185, 129, 0.1); padding: 5px 15px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
    <strong style="color: #10b981; font-size: 13px; margin-right: 10px;">Scroll:</strong>
    <button class="btn" style="padding: 5px 15px; background: var(--success); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" onclick="scrollTimesheet(-400)">&#9664; Left</button>
    <button class="btn" style="padding: 5px 15px; background: var(--success); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" onclick="scrollTimesheet(400)">Right &#9654;</button>
</div>
<div style="font-size: 12px; color: var(--text-muted);">Tip: Click a cell to toggle its state</div>
</div>`;

// We just replace the Tip div with the buttons + Tip div
html = html.replace(/<div style="font-size: 12px; color: var\(--text-muted\);">Tip: Click a cell to toggle its state[^<]*<\/div>\s*<\/div>/, newButtons);

fs.writeFileSync('index.html', html);
console.log("Buttons moved to legend successfully.");
