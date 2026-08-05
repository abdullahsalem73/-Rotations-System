const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const regex = /const oldOpenModal = openModal;[\s\S]*?oldOpenModal\(isEdit\);\s*\};/;

if (regex.test(html)) {
    html = html.replace(regex, `if (typeof openModal !== 'undefined') {
        const oldOpenModal = openModal;
        window.openModal = function(isEdit = false) {
            if (!isEdit) {
                populateReliefDropdown('');
            }
            oldOpenModal(isEdit);
        };
    }`);
    fs.writeFileSync(indexFile, html);
    console.log('Fixed ReferenceError for openModal via regex!');
} else {
    console.log('Target not found via regex.');
}
