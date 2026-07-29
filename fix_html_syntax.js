const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the broken injected scripts from inside the printMasterReport function
const brokenBlockRegex = /<script>\s*function scrollTimesheet\(amount\) {[\s\S]*?\/\/ DRAG TO SCROLL \(World-class UX\)[\s\S]*?<\/script>\s*/;
html = html.replace(brokenBlockRegex, '');

// Clean up any other nested scripts that were injected by replace()
html = html.replace(/<script>\s*window\.toggleShift = function\(empId\)[\s\S]*?<\/script>\s*/g, '');
html = html.replace(/<script>\s*window\.scrollTimesheet = function\(amount\)[\s\S]*?<\/script>\s*/g, '');
html = html.replace(/<script>\s*function scrollTimesheet\(amount\) {[\s\S]*?<\/script>\s*/g, '');

// Clean up any rogue </body> and </html> inside the template literal except the correct one
// Wait, the template literal originally just had:
// </body>
// </html>
// `);
html = html.replace(/<\/body>\s*<\/body>\s*<\/html>\s*<\/html>/g, '</body>\n</html>');

// To be extremely safe with the template literal, let's fix it if it's duplicated:
html = html.replace(/<\/body>[\s\S]*?<\/body>\s*<\/html>\s*<\/html>\s*`\);/g, '</body>\n</html>\n`);');

// 2. Append the corrected global scripts at the REAL end of the document
const globalScripts = `
<script>
    window.toggleShift = function(empId) {
        if (!currentTimesheetData[empId]) currentTimesheetData[empId] = {};
        const current = currentTimesheetData[empId].shift;
        currentTimesheetData[empId].shift = (current === 'Night') ? 'Day' : 'Night';
        renderTimesheetTable();
    };

    window.scrollTimesheet = function(amount) {
        const wrapper = document.getElementById('tsWrapper') || document.querySelector('.timesheet-wrapper');
        if (wrapper) {
            wrapper.scrollBy({ left: amount, behavior: 'auto' });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('tsWrapper');
        if(!slider) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'default';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'default';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });
</script>
`;

// Insert it right before the final </body>
if (!html.includes('window.toggleShift = function(empId)')) {
    html = html.replace(/<\/body>\s*<\/html>\s*$/, globalScripts + '\n</body>\n</html>');
}

fs.writeFileSync('index.html', html);
console.log("Syntax fixed!");
