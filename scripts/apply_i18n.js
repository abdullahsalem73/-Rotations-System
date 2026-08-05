const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const replacements = [
    {
        old: '<span style="font-weight: bold; font-size: 15px;">Total Staff</span>',
        new: '<span data-i18n="lbl_total_staff" style="font-weight: bold; font-size: 15px;">Total Staff</span>'
    },
    {
        old: 'placeholder="Search employees by name, ID, or company..."',
        new: 'data-i18n="search_placeholder" placeholder="Search employees by name, ID, or company..."'
    },
    {
        old: 'Work vs Leave Status',
        new: '<span data-i18n="lbl_work_leave">Work vs Leave Status</span>'
    },
    {
        old: 'ON-Duty by Company',
        new: '<span data-i18n="lbl_on_duty">ON-Duty by Company</span>'
    }
];

let changed = false;
for (const r of replacements) {
    if (html.includes(r.old)) {
        html = html.replace(r.old, r.new);
        console.log('Injected data-i18n for:', r.old);
        changed = true;
    }
}

if (changed) {
    fs.writeFileSync(indexFile, html);
    console.log('HTML patched with i18n attributes.');
} else {
    console.log('No elements found or already patched.');
}
