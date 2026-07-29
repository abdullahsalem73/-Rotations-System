const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Stats Cards
const statsHtmlRegex = /<div id="timesheetStats" style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">\s*<\/div>/g;
html = html.replace(statsHtmlRegex, '');

// Also remove the JS that populates it
const statsJsRegex = /\/\/ Update Stats Cards\s+const statsHTML = `[\s\S]*?`;\s+document\.getElementById\('timesheetStats'\)\.innerHTML = statsHTML;/g;
html = html.replace(statsJsRegex, '');

// 2. Add Scroll Buttons inside timesheet-tab
if (!html.includes('<!-- Floating Transparent Scroll Buttons -->')) {
    html = html.replace('<div id="timesheet-tab" class="tab-pane">', `<div id="timesheet-tab" class="tab-pane">
    <!-- Floating Transparent Scroll Buttons -->
    <div class="fixed-ts-scroll left" onclick="scrollTimesheet(-500)" title="Scroll Left">&#9664;</div>
    <div class="fixed-ts-scroll right" onclick="scrollTimesheet(500)" title="Scroll Right">&#9654;</div>`);
}

// 3. Add scrollTimesheet function
if (!html.includes('function scrollTimesheet(amount)')) {
    html = html.replace('function switchTab(tabId) {', `function scrollTimesheet(amount) {
        const container = document.querySelector('#timesheet-tab .table-container');
        if (container) {
            container.scrollBy({ left: amount, behavior: 'smooth' });
        }
    }
    
    function switchTab(tabId) {`);
}

// 4. Add the CSS for scroll buttons
if (!html.includes('.fixed-ts-scroll')) {
    html = html.replace('</style>', `
    .fixed-ts-scroll {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 60px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        border-radius: 8px;
        font-size: 24px;
        transition: all 0.3s ease;
        opacity: 0.3;
    }
    .fixed-ts-scroll:hover {
        opacity: 1;
        background: rgba(59, 130, 246, 0.8);
    }
    .fixed-ts-scroll.left { left: 10px; }
    .fixed-ts-scroll.right { right: 10px; }
    </style>`);
}

fs.writeFileSync('index.html', html);
console.log('Restored scroll buttons and removed stats cards.');
