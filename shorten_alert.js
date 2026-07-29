const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the long text with a shorter one
const oldText = "`You cannot take a snapshot for a past date (${selectedDateStr}). Snapshots can only be taken for TODAY (${todayStr}) to ensure data integrity and prevent retrospective modifications.`";
const newText = "`Access Denied! You can only lock the POB snapshot for today (${todayStr}).`";

html = html.replace(oldText, newText);

// Also let's change the title to just 'Action Denied'
html = html.replace("title: 'Security Alert 🔒',", "title: 'Action Denied ⛔',");

fs.writeFileSync('index.html', html);
console.log("Alert message shortened.");
