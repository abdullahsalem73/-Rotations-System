const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const replacements = [
    {
        old: "const name = document.getElementById('editEmpName').value.trim();",
        new: "const name = window.SecurityAgent ? window.SecurityAgent.sanitizeHTML(document.getElementById('editEmpName').value.trim()) : document.getElementById('editEmpName').value.trim();"
    },
    {
        old: "const company = document.getElementById('editEmpCompany').value.trim();",
        new: "const company = window.SecurityAgent ? window.SecurityAgent.sanitizeHTML(document.getElementById('editEmpCompany').value.trim()) : document.getElementById('editEmpCompany').value.trim();"
    },
    {
        old: "const dept = document.getElementById('editEmpDept').value.trim();",
        new: "const dept = window.SecurityAgent ? window.SecurityAgent.sanitizeHTML(document.getElementById('editEmpDept').value.trim()) : document.getElementById('editEmpDept').value.trim();"
    },
    {
        old: "const dest = document.getElementById('editEmpDest').value.trim();",
        new: "const dest = window.SecurityAgent ? window.SecurityAgent.sanitizeHTML(document.getElementById('editEmpDest').value.trim()) : document.getElementById('editEmpDest').value.trim();"
    },
    {
        old: "const phone = document.getElementById('editEmpPhone').value.trim();",
        new: "const phone = window.SecurityAgent ? window.SecurityAgent.sanitizeHTML(document.getElementById('editEmpPhone').value.trim()) : document.getElementById('editEmpPhone').value.trim();"
    }
];

let changed = false;
for (const r of replacements) {
    if (html.includes(r.old)) {
        html = html.replace(r.old, r.new);
        console.log('Sanitized:', r.old);
        changed = true;
    }
}

if (changed) {
    fs.writeFileSync(indexFile, html);
    console.log('Variables patched.');
} else {
    console.log('No variables patched. Might be already done.');
}
