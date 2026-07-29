const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<select id="timesheetDeptFilter"[^>]*>([\s\S]*?)<\/select>/;
const newSelect = `<select id="timesheetDeptFilter" onchange="loadTimesheetData()">
                              <option value="All" selected>All Departments</option>
                              <option value="Management Department">Management</option>
                              <option value="Seiyun Office">Seiyun Office</option>
                              <option value="MAINT">MAINT</option>
                              <option value="Security">Security</option>
                              <option value="Security Night Shift">Security Night Shift</option>
                          </select>`;

html = html.replace(regex, newSelect);
fs.writeFileSync('index.html', html);
console.log('Fixed dropdown.');
