const fs = require('fs');
let html = fs.readFileSync('d:/Rotations/import_new.html', 'utf-8');
const jsonData = fs.readFileSync('d:/Rotations/new_rotations.json', 'utf-8');
html = html.replace('const response = await fetch(\'new_rotations.json\');', '');
html = html.replace('if (!response.ok) throw new Error("Could not find new_rotations.json");', '');
html = html.replace('const rows = await response.json();', 'const rows = ' + jsonData + ';');
fs.writeFileSync('d:/Rotations/import_new.html', html);
console.log('Successfully injected JSON into HTML.');
