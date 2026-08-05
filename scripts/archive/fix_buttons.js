const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix Button Icons
html = html.replace(/<button class="ts-scroll-btn left".*?<\/button>/, '<button class="ts-scroll-btn left" onclick="scrollTimesheet(-300)" title="Scroll Left">&#9664;</button>');
html = html.replace(/<button class="ts-scroll-btn right".*?<\/button>/, '<button class="ts-scroll-btn right" onclick="scrollTimesheet(300)" title="Scroll Right">&#9654;</button>');

// Make them always visible and super high z-index
html = html.replace('opacity: 0;', 'opacity: 1; z-index: 999; box-shadow: 0 4px 15px rgba(0,0,0,0.8);');

// Maybe the hover rule is now redundant, but it won't hurt.
// Let's also make sure they have a nice border
html = html.replace('border: none;', 'border: 2px solid white;');

fs.writeFileSync('index.html', html);
console.log("Buttons fixed.");
