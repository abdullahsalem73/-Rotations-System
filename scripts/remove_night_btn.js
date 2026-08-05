const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove the Night Shift Only filter button (button element only, not the option in selects)
html = html.replace(/\s*<button onclick="toggleNightShiftFilter\(\)"[^>]*>\s*🌙 Night Shift Only\s*<\/button>/g, '');

fs.writeFileSync('index.html', html);
console.log('Done! Remaining occurrences:');
const remaining = (html.match(/Night Shift Only/g) || []).length;
console.log(remaining, '(should be 1 - the select option only)');
