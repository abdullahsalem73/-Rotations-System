const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Blue with Green in the Chart
html = html.replace(/backgroundColor: \['#3b82f6', '#ffffff', '#ef4444', '#f59e0b'\]/, "backgroundColor: ['#10b981', '#ffffff', '#ef4444', '#f59e0b']");

// If there are other places where they want blue replaced with green:
// e.g., the 'Load Snapshot' button
html = html.replace(/border-color: #3b82f6; color: #3b82f6;" onclick="loadPOBSnapshot\(\)">🔍 Load Snapshot/g, 'border-color: #00B4D8; color: #00B4D8;" onclick="loadPOBSnapshot()">🔍 Load Snapshot');

// 'Add Custom Movement' button
html = html.replace(/border-color: #3b82f6; color: #3b82f6;" onclick="openVisitorModal\(\)">✈️ Add Custom Movement/g, 'border-color: #FF7B00; color: #FF7B00;" onclick="openVisitorModal()">✈️ Add Custom Movement');

// Add Movement Button gradient
html = html.replace(/background: linear-gradient\(90deg, #3b82f6, #2563eb\);/g, 'background: linear-gradient(90deg, #10b981, #059669);');

// Export Excel Master Report button
html = html.replace(/border-color: #3b82f6; color: #3b82f6; padding: 5px 10px;" onclick="exportEmployeesDirectory\(\)">📊 Export Excel/g, 'border-color: #10b981; color: #10b981; padding: 5px 10px;" onclick="exportEmployeesDirectory()">📊 Export Excel');

// Leave total color in Master Report
html = html.replace(/color: #3b82f6; font-weight: bold;">\$\{totalLeave\}/g, 'color: #ffffff; font-weight: bold;">${totalLeave}');

// Notification Refresh button
html = html.replace(/color: #3b82f6; cursor: pointer;" onclick="detectConflicts\(\)">🔄 Refresh/g, 'color: #10b981; cursor: pointer;" onclick="detectConflicts()">🔄 Refresh');

fs.writeFileSync('index.html', html);
console.log("Colors Updated");
