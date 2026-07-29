const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update CSS
const oldCss = `.timesheet-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding-bottom: 10px;
                }`;
const newCss = `.timesheet-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding-bottom: 10px;
                    cursor: grab;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .timesheet-wrapper::-webkit-scrollbar {
                    display: none;
                }
                .timesheet-wrapper:active {
                    cursor: grabbing;
                }`;

if (html.includes(oldCss)) {
    html = html.replace(oldCss, newCss);
}

// 2. Update toggleTsCell to ignore clicks if dragging
const oldToggle = `    function toggleTsCell(empId, day, cellElement) {
        let currentVal = cellElement.getAttribute('data-val') || '';`;
const newToggle = `    function toggleTsCell(empId, day, cellElement) {
        if (window.isDraggingTimesheet) return;
        let currentVal = cellElement.getAttribute('data-val') || '';`;

if (html.includes(oldToggle)) {
    html = html.replace(oldToggle, newToggle);
}

// 3. Inject Drag-to-Scroll JS logic at the end of scripts
const dragScript = `
    // Advanced Drag-to-Scroll for Timesheet
    document.addEventListener("DOMContentLoaded", () => {
        const slider = document.querySelector('.timesheet-wrapper');
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            window.isDraggingTimesheet = false; // Reset drag flag
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            // Give a tiny delay before allowing clicks to ensure cell toggle doesn't fire immediately on mouseup after drag
            setTimeout(() => { window.isDraggingTimesheet = false; }, 50);
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            
            if (Math.abs(walk) > 5) {
                window.isDraggingTimesheet = true; // We are actively dragging
            }
            
            slider.scrollLeft = scrollLeft - walk;
        });
    });
`;

if (!html.includes('Advanced Drag-to-Scroll')) {
    html = html.replace('</body>', dragScript + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log("Drag-to-scroll injected successfully.");
