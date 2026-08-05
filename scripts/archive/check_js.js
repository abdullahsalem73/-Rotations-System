const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let scripts = [];
let regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    if (match[1].trim()) {
        scripts.push(match[1]);
    }
}
fs.writeFileSync('temp.js', scripts.join('\n\n'));
console.log("JavaScript extracted to temp.js");
