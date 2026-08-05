const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const regex = /const saveEmployeeStr = saveEmployee\.toString\(\);/;

if (regex.test(html)) {
    html = html.replace(regex, `let saveEmployeeStr = "";
    if (typeof saveEmployee !== 'undefined') {
        saveEmployeeStr = saveEmployee.toString();
    }`);
    fs.writeFileSync(indexFile, html);
    console.log('Fixed ReferenceError for saveEmployee!');
} else {
    console.log('Target not found.');
}
