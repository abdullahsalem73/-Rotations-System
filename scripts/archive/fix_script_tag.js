const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const rawScriptStart = '    // Advanced Drag-to-Scroll for Timesheet';
const tagScriptStart = '<script>\n    // Advanced Drag-to-Scroll for Timesheet';

if (html.includes(rawScriptStart) && !html.includes(tagScriptStart)) {
    html = html.replace(rawScriptStart, tagScriptStart);
    
    const endStr = `        // Add Mouse Wheel support for horizontal scrolling!
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            }
        });
    });`;
    
    const tagEndStr = `        // Add Mouse Wheel support for horizontal scrolling!
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            }
        });
    });
</script>`;

    if (html.includes(endStr)) {
        html = html.replace(endStr, tagEndStr);
        fs.writeFileSync('index.html', html);
        console.log("Script tags added.");
    } else {
        console.log("End string not found");
    }
} else {
    console.log("Raw script start not found or already tagged.");
}
