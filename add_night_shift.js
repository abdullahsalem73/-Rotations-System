const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add toggleShift global function
const toggleScript = `
<script>
    window.toggleShift = function(empId) {
        if (!currentTimesheetData[empId]) currentTimesheetData[empId] = {};
        const current = currentTimesheetData[empId].shift;
        currentTimesheetData[empId].shift = (current === 'Night') ? 'Day' : 'Night';
        renderTimesheetTable();
        // We do not auto-save to DB here, they must press 'Save Timesheet'
        // or we could auto-save, but it's better they see the change and save it.
    };
</script>
`;
if (!html.includes('window.toggleShift')) {
    html = html.replace('</body>', toggleScript + '\n</body>');
}

// 2. Modify the rowHTML in renderTimesheetTable
const oldRowHtml = `let rowHTML = \\\`<tr>
                  <td>\${emp.ID}</td>
                  <td style="white-space: nowrap;">\${emp.Name}</td>\\\`;`;

const newRowHtml = `
              const isNight = empData.shift === 'Night';
              const nameBg = isNight ? 'background: linear-gradient(90deg, rgba(30,58,138,0.4), transparent);' : '';
              
              let rowHTML = \\\`<tr class="\${isNight ? 'night-shift-row' : ''}">
                  <td>\${emp.ID}</td>
                  <td style="white-space: nowrap; display: flex; align-items: center; justify-content: space-between; \${nameBg}">
                      <span>\${emp.Name}</span>
                      <button class="btn btn-sm" onclick="toggleShift('\${emp.ID}')" style="margin-left:15px; padding:2px 6px; font-size:11px; background: \${isNight ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'}; border: 1px solid \${isNight ? '#3b82f6' : 'var(--glass-border)'}; border-radius: 12px; color: \${isNight ? '#60a5fa' : 'var(--text-muted)'}; cursor: pointer;">
                          \${isNight ? '🌙 Night' : '☀️ Day'}
                      </button>
                  </td>\\\`;
`;

// Note: Because Javascript regex can be tricky with backticks and newlines, we do string replacement
html = html.replace(
    'let rowHTML = `<tr>\n                  <td>${emp.ID}</td>\n                  <td style="white-space: nowrap;">${emp.Name}</td>`;', 
    newRowHtml
);

// 3. Update Excel export
html = html.replace(
    'const rowData = [emp.ID, emp.Name];',
    'const rowData = [emp.ID, empData.shift === "Night" ? emp.Name + " (Night Shift)" : emp.Name];'
);

fs.writeFileSync('index.html', html);
console.log("Night shift toggle added.");
