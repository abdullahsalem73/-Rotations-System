const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix renderTimesheetTable to show Night Shift Icon
const renderRegex = /let rowHTML = `<tr>\s*<td>\$\{emp\.ID\}<\/td>\s*<td style="white-space: nowrap;">\$\{emp\.Name\}<\/td>`;/;
const renderReplace = `const isNight = empData.shift === 'Night';
            const shiftIcon = isNight ? '🌙' : '☀️';
            let rowHTML = \`<tr>
                <td>\${emp.ID}</td>
                <td style="white-space: nowrap;">
                    <span style="cursor:pointer; margin-right: 5px; font-size:16px; user-select:none;" onclick="toggleShift('\${emp.ID}')" title="Toggle Shift">\${shiftIcon}</span>
                    \${emp.Name}
                </td>\`;`;

if (html.match(renderRegex)) {
    html = html.replace(renderRegex, renderReplace);
    console.log("Night Shift icon applied to UI.");
} else {
    console.log("Night Shift icon regex NOT matched.");
}

// 2. Fix exportTimesheetToExcel function
const exportRegex = /const cols = \[\s*\{ key: 'id', width: 12 \},\s*\{ key: 'name', width: 35 \}\s*\];[\s\S]*?rowIndex\+\+;\s*\}\);/m;
const exportReplace = `const cols = [
            { key: 'id', width: 15 },
            { key: 'shift', width: 5 },
            { key: 'name', width: 35 }
        ];
        for (let i = 1; i <= daysInMonth; i++) {
            cols.push({ key: 'd' + i, width: 6 });
        }
        cols.push({ key: 'total', width: 15 });
        cols.push({ key: 'status', width: 12 });
        sheet.columns = cols;

        // --- ROW 1: MAIN TITLE ---
        sheet.mergeCells(1, 1, 1, daysInMonth + 5);
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'PETROMASILA ROTATIONS SYSTEM - MONTHLY TIMESHEET';
        titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(1).height = 40;

        // --- ROW 2: SUBTITLE / METADATA ---
        sheet.mergeCells(2, 1, 2, daysInMonth + 5);
        const subTitleCell = sheet.getCell('A2');
        subTitleCell.value = \`Month & Year: \${year}-\${month}   |   Department: \${dept}   |   Company: \${company}\`;
        subTitleCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF333333' } };
        subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } }; 
        subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(2).height = 30;

        // --- ROW 3: LEGEND ---
        sheet.mergeCells(3, 1, 3, daysInMonth + 5);
        const legendCell = sheet.getCell('A3');
        legendCell.value = 'LEGEND:   [ ON = On Duty (Green) ]     [ E = Emergency (Red) ]     [ X = Extra Days (Green) ]     [ 🌙 = Night Shift ]     [ ☀️ = Day Shift ]';
        legendCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748b' } };
        legendCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(3).height = 25;

        // --- ROW 4: EMPTY SPACING ---
        sheet.addRow([]);

        // --- ROW 5: TABLE HEADERS ---
        const headerRowData = ['ID NO', 'S', 'Name'];
        for (let i = 1; i <= daysInMonth; i++) {
            headerRowData.push(String(i));
        }
        headerRowData.push('Total Days');
        headerRowData.push('Status');
        
        const headerRow = sheet.getRow(5);
        headerRow.values = headerRowData;
        headerRow.height = 35;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e293b' } };
            cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: {style:'medium', color: {argb:'FFcbd5e1'}}, left: {style:'medium', color: {argb:'FFcbd5e1'}}, bottom: {style:'medium', color: {argb:'FFcbd5e1'}}, right: {style:'medium', color: {argb:'FFcbd5e1'}} };
        });
        
        // --- TABLE DATA ---
        let filtered = employees;
        if (dept !== "All") filtered = filtered.filter(e => e.Department === dept);
        if (company !== "All") filtered = filtered.filter(e => e.Company === company);
        
        let rowIndex = 6;
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            const shiftIcon = empData.shift === "Night" ? "🌙" : "☀️";
            const rowData = [emp.ID, shiftIcon, emp.Name];
            
            for (let i = 1; i <= daysInMonth; i++) {
                let dayVal = empData[i] || '';
                if (dayVal === '1') dayVal = 'ON';
                rowData.push(dayVal);
                if (dayVal === 'ON' || dayVal === 'E' || dayVal === 'X') {
                    totalDuty++;
                }
            }
            rowData.push(totalDuty);
            rowData.push("Regular");
            
            const dataRow = sheet.getRow(rowIndex);
            dataRow.values = rowData;
            dataRow.height = 25;
            
            // Style Data Row
            dataRow.eachCell((cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = { top: {style:'thin', color:{argb:'FFe2e8f0'}}, left: {style:'thin', color:{argb:'FFe2e8f0'}}, bottom: {style:'thin', color:{argb:'FFe2e8f0'}}, right: {style:'thin', color:{argb:'FFe2e8f0'}} };
                
                if (colNumber === 3) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left' };
                }
                
                if (cell.value === 'ON' || cell.value === 'X') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10b981' } };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                } else if (cell.value === 'E') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFef4444' } };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                } else if (colNumber > 3 && colNumber < (daysInMonth + 4) && !cell.value) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf1f5f9' } };
                }
            });
            
            rowIndex++;
        });`;

if (html.match(exportRegex)) {
    html = html.replace(exportRegex, exportReplace);
    console.log("Excel Export design improved.");
} else {
    console.log("Excel Export regex NOT matched.");
}

fs.writeFileSync('index.html', html);
