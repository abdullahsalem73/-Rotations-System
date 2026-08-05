const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                  if (status === 'work' || status === 'standby_cover') {
                      currentTimesheetData[emp.ID][i] = 'ON';
                  } else if (status === 'leave' || status === 'rest' || status === 'missing' || status === 'sick_leave') {
                      currentTimesheetData[emp.ID][i] = '';
                  }`;

const replaceStr = `                  if (status === 'work' || status === 'standby_cover') {
                      currentTimesheetData[emp.ID][i] = 'ON';
                  } else if (status === 'sick_leave' || status === 'emergency') {
                      currentTimesheetData[emp.ID][i] = 'E';
                  } else if (status === 'leave' || status === 'rest' || status === 'missing') {
                      currentTimesheetData[emp.ID][i] = '';
                  }`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replaceStr);
    fs.writeFileSync('index.html', html);
    console.log("Sick leave fixed.");
} else {
    console.log("Could not find the target string.");
}
