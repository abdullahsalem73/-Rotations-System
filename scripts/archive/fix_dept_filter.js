const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add "All" option to Dept Filter if not exists
if (!html.includes('<option value="All">All Departments</option>')) {
    html = html.replace('<select id="timesheetDeptFilter" onchange="loadTimesheetData()">', 
    '<select id="timesheetDeptFilter" onchange="loadTimesheetData()">\n                              <option value="All">All Departments</option>');
}

fs.writeFileSync('index.html', html);
console.log('Added All Departments option.');
