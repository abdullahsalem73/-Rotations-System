const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newExportLogic = `async function exportTimesheetToExcel() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        
        if (!monthVal || typeof employees === 'undefined') return;
        
        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading. Please try again in a moment.', 'error');
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'PetroMasila Rotations System';
        const sheet = workbook.addWorksheet('Timesheet', {
            views: [{ state: 'frozen', ySplit: 5, xSplit: 2 }]
        });
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // --- COLUMNS SETUP ---
        const cols = [
            { key: 'id', width: 12 },
            { key: 'name', width: 35 }
        ];
        for (let i = 1; i <= daysInMonth; i++) {
            cols.push({ key: 'd' + i, width: 6 });
        }
        cols.push({ key: 'total', width: 15 });
        sheet.columns = cols;

        // --- ROW 1: MAIN TITLE ---
        sheet.mergeCells(1, 1, 1, daysInMonth + 3);
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'PETROMASILA ROTATIONS SYSTEM - MONTHLY TIMESHEET';
        titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } }; // Dark theme background
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(1).height = 35;

        // --- ROW 2: SUBTITLE / METADATA ---
        sheet.mergeCells(2, 1, 2, daysInMonth + 3);
        const subTitleCell = sheet.getCell('A2');
        subTitleCell.value = \`Month & Year: \${year}-\${month}   |   Department: \${dept}   |   Company: \${company}\`;
        subTitleCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF333333' } };
        subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe2e8f0' } }; // Light gray
        subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(2).height = 25;

        // --- ROW 3: LEGEND ---
        sheet.mergeCells(3, 1, 3, daysInMonth + 3);
        const legendCell = sheet.getCell('A3');
        legendCell.value = 'LEGEND:   [ ON = On Duty (Green) ]     [ E = Emergency (Red) ]     [ X = Extra Days (Green) ]';
        legendCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748b' } };
        legendCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(3).height = 20;

        // --- ROW 4: EMPTY SPACING ---
        sheet.addRow([]);

        // --- ROW 5: TABLE HEADERS ---
        const headerRowData = ['ID NO', 'Name'];
        for (let i = 1; i <= daysInMonth; i++) {
            headerRowData.push(String(i));
        }
        headerRowData.push('Total Days');
        
        const headerRow = sheet.getRow(5);
        headerRow.values = headerRowData;
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e293b' } }; // Slate 800
            cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
        });
        
        // --- TABLE DATA ---
        let filtered = employees;
        if (dept !== "All") filtered = filtered.filter(e => e.Department === dept);
        if (company !== "All") filtered = filtered.filter(e => e.Company === company);
        
        let rowIndex = 6;
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            const rowData = [emp.ID, emp.Name];
            
            for (let i = 1; i <= daysInMonth; i++) {
                let dayVal = empData[i] || '';
                if (dayVal === '1') dayVal = 'ON';
                rowData.push(dayVal);
                if (dayVal === 'ON' || dayVal === 'E' || dayVal === 'X') {
                    totalDuty++;
                }
            }
            rowData.push(totalDuty);
            
            const dataRow = sheet.getRow(rowIndex);
            dataRow.values = rowData;
            dataRow.height = 22;
            
            dataRow.eachCell((cell, colNumber) => {
                cell.border = { top: {style:'thin', color:{argb:'FFcbd5e1'}}, left: {style:'thin', color:{argb:'FFcbd5e1'}}, bottom: {style:'thin', color:{argb:'FFcbd5e1'}}, right: {style:'thin', color:{argb:'FFcbd5e1'}} };
                cell.alignment = { vertical: 'middle', horizontal: (colNumber <= 2) ? 'left' : 'center' };
                cell.font = { name: 'Arial', size: 10 };
                
                const val = cell.value;
                if (val === 'ON' || val === 'X') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10b981' } }; // PetroMasila Green
                    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
                } else if (val === 'E') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFef4444' } }; // Red
                    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
                }
            });
            rowIndex++;
        });
        
        // --- GENERATE FILE ---
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = \`Timesheet_\${monthVal}_\${dept}\${company !== 'All' ? '_' + company : ''}.xlsx\`;
        link.click();
    }`;

// Replace the old function
const functionRegex = /async function exportTimesheetToExcel\(\) \{[\s\S]*?link\.click\(\);\s*\}/;
html = html.replace(functionRegex, newExportLogic);

fs.writeFileSync('index.html', html);
console.log("Excel Export magically upgraded!");
