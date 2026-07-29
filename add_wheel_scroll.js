const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `            slider.scrollLeft = scrollLeft - walk;
        });`;

const insertion = `            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Add Mouse Wheel support for horizontal scrolling!
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            }
        });`;

if (html.includes(targetStr) && !html.includes("slider.addEventListener('wheel'")) {
    html = html.replace(targetStr, insertion);
    fs.writeFileSync('index.html', html);
    console.log("Wheel scroll added.");
} else {
    console.log("Target string not found or already added.");
}
