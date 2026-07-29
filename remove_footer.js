const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Regex to remove the entire footerHTML logic
const footerRegex = /\/\/ Add Daily Summary Footer Row[\s\S]*?bodyHTML = footerHTML \+ bodyHTML;/;
html = html.replace(footerRegex, '');

fs.writeFileSync('index.html', html);
console.log('Removed footer');
