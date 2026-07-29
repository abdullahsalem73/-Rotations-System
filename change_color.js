const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace hex codes
html = html.replace(/#3b82f6/gi, '#10b981');
html = html.replace(/#2563eb/gi, '#059669');
// Replace rgba (ignoring spaces just in case)
html = html.replace(/59,\s*130,\s*246/gi, '16, 185, 129');

fs.writeFileSync('index.html', html);
console.log("Colors replaced successfully.");
