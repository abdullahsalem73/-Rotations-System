const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old legend buttons completely
html = html.replace(/<div style="display: flex; gap: 10px; align-items: center; background: rgba\(16, 185, 129, 0\.1\).*?<\/div>/g, '');
html = html.replace(/<div style="font-size: 12px; color: var\(--text-muted\);">Tip: Click a cell to toggle its state<\/div>/g, '');

// Put back the original Tip text
html = html.replace('<div style="flex:1;"></div>\r\n            </div>', '<div style="flex:1;"></div>\r\n<div style="font-size: 12px; color: var(--text-muted);">Tip: Click a cell to toggle its state (ON -> E -> X -> empty)</div>\r\n            </div>');
html = html.replace('<div style="flex:1;"></div>\n            </div>', '<div style="flex:1;"></div>\n<div style="font-size: 12px; color: var(--text-muted);">Tip: Click a cell to toggle its state (ON -> E -> X -> empty)</div>\n            </div>');


// 2. Inject the fixed floating buttons right inside timesheet-tab
const tabStart = '<div id="timesheet-tab" class="tab-pane">';
const floatingButtons = `
    <!-- Floating Transparent Scroll Buttons -->
    <div class="fixed-ts-scroll left" onclick="scrollTimesheet(-500)" title="Scroll Left">&#9664;</div>
    <div class="fixed-ts-scroll right" onclick="scrollTimesheet(500)" title="Scroll Right">&#9654;</div>
`;
if (html.includes(tabStart) && !html.includes('fixed-ts-scroll')) {
    html = html.replace(tabStart, tabStart + '\n' + floatingButtons);
}

// 3. Add the CSS for fixed-ts-scroll
const newCss = `
<style>
.fixed-ts-scroll {
    position: fixed;
    top: 50vh;
    transform: translateY(-50%);
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    width: 40px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    z-index: 9999;
    transition: all 0.3s ease;
    border: 1px solid rgba(16, 185, 129, 0.4);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
.fixed-ts-scroll:hover {
    background: rgba(16, 185, 129, 0.9);
    color: white;
    width: 60px;
    font-size: 28px;
    box-shadow: 0 0 20px rgba(16,185,129,0.6);
}
.fixed-ts-scroll.left {
    left: 0;
    border-radius: 0 15px 15px 0;
    border-left: none;
}
.fixed-ts-scroll.right {
    right: 0;
    border-radius: 15px 0 0 15px;
    border-right: none;
}
</style>
</head>`;

if (!html.includes('.fixed-ts-scroll')) {
    html = html.replace('</head>', newCss);
}

fs.writeFileSync('index.html', html);
console.log("Transparent floating buttons added.");
