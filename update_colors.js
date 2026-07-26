const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update Chart Colors
html = html.replace(
    `backgroundColor: ['#10b981', '#ef4444', '#8b5cf6', '#f59e0b']`,
    `backgroundColor: ['#3b82f6', '#ffffff', '#ef4444', '#f59e0b']` // Work=Blue, Leave=White, Sick=Red, Missing=Orange
);

// 2. Update status dots in renderEmployees()
html = html.replace(
    `background:#10b981; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #10b981;" title="ON (Duty/Cover)"></span>\`;`,
    `background:#3b82f6; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #3b82f6;" title="ON (Duty/Cover)"></span>\`;`
);
html = html.replace(
    `background:#ef4444; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #ef4444;" title="OFF (On Leave)"></span>\`;`,
    `background:#ffffff; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px rgba(255,255,255,0.5);" title="OFF (On Leave)"></span>\`;`
);
html = html.replace(
    `background:#8b5cf6; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #8b5cf6;" title="SL (Sick Leave)"></span>\`;`,
    `background:#ef4444; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #ef4444;" title="SL (Sick Leave)"></span>\`;`
);

// 3. Update Timesheet CSS & Legend
html = html.replace(`.ts-cell-1 { background-color: #0ea5e9 !important; color: white !important; font-weight: bold; }`, `.ts-cell-ON { background-color: #3b82f6 !important; color: white !important; font-weight: bold; }`);
html = html.replace(`.ts-cell-empty { background-color: transparent !important; }`, `.ts-cell-empty { background-color: rgba(255,255,255,0.1) !important; color: white !important; }`);
html = html.replace(`<div class="legend-box ts-cell-1"></div> On Duty (1)`, `<div class="legend-box ts-cell-ON"></div> On Duty (ON)`);
html = html.replace(`Click a cell to toggle its state (1 ->`, `Click a cell to toggle its state (ON ->`);

// 4. Update '1' to 'ON' in autoFillTimesheet
html = html.replace(`currentTimesheetData[emp.ID][i] = '1';`, `currentTimesheetData[emp.ID][i] = 'ON';`);

// 5. Update toggle logic in JS
html = html.replace(
    `function toggleTsCell(empId, day, el) {`,
    `function toggleTsCell(empId, day, el) {\n        // Handled below`
);
html = html.replace(
    `if (currentVal === '') newVal = '1';
        else if (currentVal === '1') newVal = 'E';
        else if (currentVal === 'E') newVal = 'X';
        else newVal = '';`,
    `if (currentVal === '') newVal = 'ON';
        else if (currentVal === '1') newVal = 'ON'; // Migrate old 1s
        else if (currentVal === 'ON') newVal = 'E';
        else if (currentVal === 'E') newVal = 'X';
        else newVal = '';`
);

// 6. Update renderTimesheetTable mapping
html = html.replace(
    `if (dayVal === '1') { 
                    cellClass = 'ts-cell-1';`,
    `if (dayVal === '1' || dayVal === 'ON') { 
                    cellClass = 'ts-cell-ON';`
);

html = html.replace(
    `<div style="font-size: 12px; color: #0ea5e9;">Total On Duty (1)</div>`,
    `<div style="font-size: 12px; color: #3b82f6;">Total On Duty (ON)</div>`
);
html = html.replace(
    `border: 1px solid #0ea5e9; border-radius: 8px;">`,
    `border: 1px solid #3b82f6; border-radius: 8px;">`
); // Note: Make sure it replaces the correct one for On Duty, but it's fine since it only matches the blue one if I use exact string. Wait, earlier it was `#0ea5e9` for the On Duty box. Let's do a safe replace:
html = html.replace(/rgba\(14, 165, 233, 0\.1\)/g, `rgba(59, 130, 246, 0.1)`);
html = html.replace(/#0ea5e9/g, `#3b82f6`);

// 7. Update exportTimesheetToExcel mapping
html = html.replace(
    `if (dayVal === '1' || dayVal === 'E' || dayVal === 'X') {`,
    `if (dayVal === '1' || dayVal === 'ON' || dayVal === 'E' || dayVal === 'X') {`
);
html = html.replace(
    `rowData['d' + i] = dayVal;`,
    `rowData['d' + i] = (dayVal === '1') ? 'ON' : dayVal;` // Migrate old 1 to ON in excel
);

// 8. Update toggle cell class changes
html = html.replace(
    `el.classList.remove('ts-cell-empty', 'ts-cell-1', 'ts-cell-E', 'ts-cell-X');`,
    `el.classList.remove('ts-cell-empty', 'ts-cell-ON', 'ts-cell-1', 'ts-cell-E', 'ts-cell-X');`
);
html = html.replace(
    `if (newVal === '1') el.classList.add('ts-cell-1');`,
    `if (newVal === 'ON') el.classList.add('ts-cell-ON');`
);


// 9. Update display of dayVal in renderTimesheetTable to convert old 1s to ON visually
html = html.replace(
    `rowHTML += \`<td class="ts-cell \${cellClass}" style="\${extraStyle}" onclick="toggleTsCell('\${emp.ID}', \${i}, this)" data-val="\${dayVal}">\${dayVal}</td>\`;`,
    `rowHTML += \`<td class="ts-cell \${cellClass}" style="\${extraStyle}" onclick="toggleTsCell('\${emp.ID}', \${i}, this)" data-val="\${dayVal === '1' ? 'ON' : dayVal}">\${dayVal === '1' ? 'ON' : dayVal}</td>\`;`
);


fs.writeFileSync('index.html', html);
console.log('Colors and ON states updated');
