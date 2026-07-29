const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Just hide it in CSS directly so it takes zero space
const oldStatsDiv = '<div id="timesheetStats" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;"></div>';
const hiddenStatsDiv = '<div id="timesheetStats" style="display: none !important;"></div>';

if (html.includes(oldStatsDiv)) {
    html = html.replace(oldStatsDiv, hiddenStatsDiv);
} else {
    // If it was already modified or slightly different, replace via regex
    html = html.replace(/<div id="timesheetStats".*?<\/div>/, hiddenStatsDiv);
}

fs.writeFileSync('index.html', html);
console.log("Timesheet stats removed.");
