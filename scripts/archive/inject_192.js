const fs = require('fs');
const data = require('./debug_192.json');

function excelDateToDateString(serial) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + serial * 86400000);
    return d.toISOString().split('T')[0];
}

const row = data.row192;
const headers = data.headers;

const rotations = [];
let rotId = 496; // Matching employees.js starting id

for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (h && h.includes('DateON')) {
        const onSerial = row[i];
        const offSerial = row[i + 1];
        
        if (typeof onSerial === 'number' && typeof offSerial === 'number') {
            rotations.push({
                id: `rot_${rotId++}`,
                type: "work",
                start: excelDateToDateString(onSerial),
                end: excelDateToDateString(offSerial)
            });
        }
    }
}

// Generate the Leave rotations between work periods
const finalRotations = [];
for (let i = 0; i < rotations.length; i++) {
    finalRotations.push(rotations[i]);
    if (i < rotations.length - 1) {
        const currentEnd = new Date(rotations[i].end);
        const nextStart = new Date(rotations[i+1].start);
        
        // leave starts the day after current rotation ends
        const leaveStart = new Date(currentEnd);
        leaveStart.setDate(leaveStart.getDate() + 1);
        
        // leave ends the day before next rotation starts
        const leaveEnd = new Date(nextStart);
        leaveEnd.setDate(leaveEnd.getDate() - 1);
        
        if (leaveStart <= leaveEnd) {
            finalRotations.push({
                id: `rot_${rotId++}`,
                type: "leave",
                start: leaveStart.toISOString().split('T')[0],
                end: leaveEnd.toISOString().split('T')[0]
            });
        }
    }
}

console.log(JSON.stringify(finalRotations, null, 2));

// Read employees.js
let empJS = fs.readFileSync('employees.js', 'utf8');

// The block starts with "ID": "192" and has "Rotations": [...]
// We can use a regex or string replacement to swap the rotations array
// Actually, it's better to just parse it if we can.
// But employees.js is just setting a global var `const EMPLOYEE_DATA = [...]`

const startIdx = empJS.indexOf('"ID": "192"');
const rotationsStrStart = empJS.indexOf('"Rotations": [', startIdx);

// Let's do this safely by parsing the file
// We'll strip `const EMPLOYEE_DATA = ` and `window.EMPLOYEE_DATA = EMPLOYEE_DATA;`
let jsonString = empJS.replace('const EMPLOYEE_DATA = ', '').replace(/;/g, '').replace('window.EMPLOYEE_DATA = EMPLOYEE_DATA', '').trim();
// Wait, the file ends with:
// `window.EMPLOYEE_DATA = EMPLOYEE_DATA;`
jsonString = jsonString.substring(0, jsonString.lastIndexOf(']')) + ']';

try {
    const employees = JSON.parse(jsonString);
    const emp192 = employees.find(e => String(e.ID) === '192');
    if (emp192) {
        emp192.Rotations = finalRotations;
        const newJS = `const EMPLOYEE_DATA = ${JSON.stringify(employees, null, 2)};\n\nwindow.EMPLOYEE_DATA = EMPLOYEE_DATA;`;
        fs.writeFileSync('employees.js', newJS);
        console.log("Successfully updated employees.js");
    } else {
        console.error("Employee 192 not found in JSON parsing");
    }
} catch (e) {
    console.error("Error parsing employees.js:", e);
}
