const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Use literal strings carefully
let originalFunc = `function renderTimesheetTable() {`;
let newFunc = `function renderTimesheetTable() {
    try {`;

html = html.replace(originalFunc, newFunc);

let originalEnd = `document.getElementById('timesheetStats').innerHTML = statsHTML;
    }`;
let newEnd = `document.getElementById('timesheetStats').innerHTML = statsHTML;
    } catch (e) {
        Swal.fire("Error", e.message + e.stack, "error");
    }
}`;

html = html.replace(originalEnd, newEnd);
fs.writeFileSync('index.html', html);
