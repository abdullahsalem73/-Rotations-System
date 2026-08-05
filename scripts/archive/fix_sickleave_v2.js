const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace using regex to avoid whitespace issues
const targetRegex = /} else if \(status === 'leave' \|\| status === 'rest' \|\| status === 'missing' \|\| status === 'sick_leave'\) \{\s*currentTimesheetData\[emp\.ID\]\[i\] = '';\s*}/;

const replacement = `} else if (status === 'sick_leave' || status === 'emergency') {
                      currentTimesheetData[emp.ID][i] = 'E';
                  } else if (status === 'leave' || status === 'rest' || status === 'missing') {
                      currentTimesheetData[emp.ID][i] = '';
                  }`;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, replacement);
    fs.writeFileSync('index.html', html);
    console.log("Sick leave fixed.");
} else {
    console.log("Regex not matched.");
}
