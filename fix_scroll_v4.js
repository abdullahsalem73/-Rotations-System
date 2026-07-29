const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Wipe out the old drag script
const oldScriptStart = '<script>\n    // Robust Drag-to-Scroll & Mouse Wheel Scroll for Timesheet';
const oldScriptEnd = '    })();\n</script>';

let startIndex = html.indexOf(oldScriptStart);
let endIndex = html.indexOf(oldScriptEnd);

if (startIndex !== -1 && endIndex !== -1) {
    let before = html.substring(0, startIndex);
    let after = html.substring(endIndex + oldScriptEnd.length);
    html = before + after;
}

// 2. We will wrap the timesheet-wrapper with a new container that has the floating buttons
const targetTableWrapStart = '<div class="timesheet-wrapper">';
if (html.includes(targetTableWrapStart) && !html.includes('class="ts-scroll-container"')) {
    const replacement = `
<div class="ts-scroll-container" style="position: relative; width: 100%;">
    <button class="ts-scroll-btn left" onclick="scrollTimesheet(-300)" title="Scroll Left">◀</button>
    <button class="ts-scroll-btn right" onclick="scrollTimesheet(300)" title="Scroll Right">▶</button>
    <div class="timesheet-wrapper" id="tsWrapper">`;
    html = html.replace(targetTableWrapStart, replacement);
    
    // add closing div for ts-scroll-container right after timesheet-wrapper closes
    // Find the end of timesheet-wrapper
    // It's just before `</div>\n\n            <!-- POB Archive Tab -->`
    const wrapperEndStr = `</table>\n              </div>\n\n              <!-- POB Archive Tab -->`;
    if (html.includes(wrapperEndStr)) {
        html = html.replace(wrapperEndStr, `</table>\n              </div>\n</div>\n\n              <!-- POB Archive Tab -->`);
    } else {
         const altWrapperEndStr = `</table>\n              </div>`;
         // replacing only the first occurrence after ts-scroll-container
         let startIdx2 = html.indexOf('class="ts-scroll-container"');
         let endIdx2 = html.indexOf('</table>\n              </div>', startIdx2);
         if(endIdx2 !== -1) {
             let part1 = html.substring(0, endIdx2 + '</table>\n              </div>'.length);
             let part2 = html.substring(endIdx2 + '</table>\n              </div>'.length);
             html = part1 + '\n</div>' + part2;
         }
    }
}

// 3. Add the CSS for the floating buttons and hide the scrollbar
const cssStart = '.timesheet-wrapper {';
const newCss = `
    .ts-scroll-container:hover .ts-scroll-btn {
        opacity: 1;
    }
    .ts-scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ts-scroll-btn:hover {
        background: #059669;
        transform: translateY(-50%) scale(1.1);
    }
    .ts-scroll-btn.left { left: 15px; }
    .ts-scroll-btn.right { right: 15px; }

    .timesheet-wrapper {
        overflow-x: auto;
        max-width: 100%;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        padding-bottom: 10px;
        scroll-behavior: smooth;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .timesheet-wrapper::-webkit-scrollbar {
        display: none;
    }
`;

// Replace the old timesheet-wrapper css block (which might be the robust one or the old one)
const cssPattern = /\.timesheet-wrapper\s*\{[^}]*\}/;
html = html.replace(cssPattern, '');
html = html.replace(/\.timesheet-wrapper::-webkit-scrollbar\s*\{[^}]*\}/, '');
html = html.replace(/\.timesheet-wrapper:active\s*\{[^}]*\}/, '');

html = html.replace('</style>', newCss + '\n</style>');

// 4. Add the scroll logic script
const scrollLogic = `
<script>
    function scrollTimesheet(amount) {
        const wrapper = document.getElementById('tsWrapper') || document.querySelector('.timesheet-wrapper');
        if (wrapper) {
            wrapper.scrollBy({ left: amount, behavior: 'smooth' });
        }
    }
</script>
`;
if (!html.includes('function scrollTimesheet(')) {
    html = html.replace('</body>', scrollLogic + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log("Floating arrows added successfully.");
