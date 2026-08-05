const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startStr = '// Add Daily Summary Footer Row';
const endStr = 'bodyHTML = footerHTML + bodyHTML;';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + html.substring(endIndex + endStr.length);
    fs.writeFileSync('index.html', html);
    console.log("Footer successfully removed using indices.");
} else {
    console.log("Could not find start or end strings.");
}
