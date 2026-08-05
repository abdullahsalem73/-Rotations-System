const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Match the specific old block of legend buttons using [\s\S]*? to handle newlines
html = html.replace(/<div style="display: flex; gap: 10px; align-items: center; background: rgba\(16, 185, 129, 0\.1\);[\s\S]*?<\/div>\s*<\/div>/, '');

fs.writeFileSync('index.html', html);
console.log("Old legend buttons removed.");
