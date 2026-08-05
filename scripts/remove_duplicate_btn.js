const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const regex = /<button id="themeToggleBtn" class="btn" style="background: var\(--glass-bg\)[^>]*>\s*🌙\s*<\/button>/;

if (regex.test(html)) {
    html = html.replace(regex, '');
    fs.writeFileSync(indexFile, html);
    console.log('Removed duplicate theme toggle button!');
} else {
    console.log('Duplicate button not found.');
}
