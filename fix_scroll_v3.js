const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Wipe out the old script block
const oldScriptStart = '<script>\n    // Advanced Drag-to-Scroll for Timesheet';
const oldScriptEnd = '    });\n</script>';

let startIndex = html.indexOf(oldScriptStart);
let endIndex = html.indexOf(oldScriptEnd);

if (startIndex !== -1 && endIndex !== -1) {
    let before = html.substring(0, startIndex);
    let after = html.substring(endIndex + oldScriptEnd.length);
    html = before + after;
}

// Ensure the CSS is correct
const cssStart = '.timesheet-wrapper {';
const cssCorrect = `.timesheet-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding-bottom: 10px;
                    cursor: grab;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }`;
if (html.includes(cssCorrect)) {
    // CSS is already correct
} else {
    // If not, replace it
    // Wait, let's just make a very solid script block
}

// Robust JS Drag to scroll
const newScript = `
<script>
    // Robust Drag-to-Scroll & Mouse Wheel Scroll for Timesheet
    (function initDragScroll() {
        const slider = document.querySelector('.timesheet-wrapper');
        if (!slider) {
            // Wait and try again if it doesn't exist yet
            setTimeout(initDragScroll, 100);
            return;
        }

        let isDown = false;
        let startX;
        let scrollLeft;
        let dragged = false;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            dragged = false;
            window.isDraggingTimesheet = false;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', (e) => {
            isDown = false;
            slider.style.cursor = 'grab';
            
            if (dragged) {
                // Prevent click on children if dragged
                window.isDraggingTimesheet = true;
                setTimeout(() => { window.isDraggingTimesheet = false; }, 100);
            }
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2.5; // Scroll speed
            
            if (Math.abs(walk) > 10) {
                dragged = true;
                window.isDraggingTimesheet = true;
            }
            
            slider.scrollLeft = scrollLeft - walk;
        });

        // Horizontal Mouse Wheel Scroll
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    })();
</script>
`;

if (!html.includes('Robust Drag-to-Scroll & Mouse Wheel Scroll for Timesheet')) {
    html = html.replace('</body>', newScript + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log("Robust Drag Scroll Injected.");
