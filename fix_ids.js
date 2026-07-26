const fs = require('fs');
let js = fs.readFileSync('employees.js', 'utf8');
let idCounter = 1;
js = js.replace(/"id":\s*[0-9.]+/g, () => `"id": "rot_${idCounter++}"`);
fs.writeFileSync('employees.js', js);
console.log('Done replacing IDs');
