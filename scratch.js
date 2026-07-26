const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Excel export button
html = html.replace(
    `<button class="btn btn-outline" onclick="autoFillTimesheet()" title="Auto-fill based on planned rotations">⚡ Auto Fill</button>`,
    `<button class="btn btn-outline" style="border-color: #10b981; color: #10b981;" onclick="exportTimesheetToExcel()">📥 Export Excel</button>\n                      <button class="btn btn-outline" onclick="autoFillTimesheet()" title="Auto-fill based on planned rotations">⚡ Auto Fill</button>`
);

// 2. Add Stats Cards Container
html = html.replace(
    `<div class="timesheet-legend">`,
    `<div id="timesheetStats" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;"></div>\n\n            <div class="timesheet-legend">`
);

// 3. Update renderTimesheetTable to add weekend/today styles, stats, and footer
const newRenderFunc = `    function renderTimesheetTable() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        if (!monthVal || typeof employees === 'undefined') return;
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // Find today
        const today = new Date();
        const isCurrentMonth = (today.getFullYear() === parseInt(year) && (today.getMonth() + 1) === parseInt(month));
        const todayDate = today.getDate();
        
        // Render Header
        let headHTML = \`<th>ID NO</th><th>Name</th>\`;
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
            const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
            const isToday = isCurrentMonth && (i === todayDate);
            
            let thStyle = '';
            if (isToday) thStyle += 'border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.1); color: #f9a826;';
            else if (isWeekend) thStyle += 'background: rgba(255, 255, 255, 0.05);';
            
            headHTML += \`<th style="\${thStyle}">\${i}</th>\`;
        }
        headHTML += \`<th>Total Duty Days</th><th>Status</th>\`;
        document.getElementById('timesheetHeaderRow').innerHTML = headHTML;
        
        // Filter Employees
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        
        // Stats
        let totalOnDuty = 0;
        let totalEmergency = 0;
        let totalExtra = 0;
        let dailyCounts = new Array(daysInMonth + 1).fill(0); // index 1 to daysInMonth
        
        // Render Body
        let bodyHTML = '';
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            
            let rowHTML = \`<tr>
                <td>\${emp.ID}</td>
                <td style="white-space: nowrap;">\${emp.Name}</td>\`;
                
            for (let i = 1; i <= daysInMonth; i++) {
                const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
                const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
                const isToday = isCurrentMonth && (i === todayDate);
                
                let extraStyle = '';
                if (isToday) extraStyle += 'border-left: 2px solid #f9a826; border-right: 2px solid #f9a826; background-color: rgba(249, 168, 38, 0.05);';
                else if (isWeekend) extraStyle += 'background-color: rgba(0, 0, 0, 0.15);';
                
                const dayVal = empData[i] || '';
                let cellClass = 'ts-cell-empty';
                
                if (dayVal === '1') { 
                    cellClass = 'ts-cell-1'; 
                    totalDuty++; 
                    totalOnDuty++;
                    dailyCounts[i]++;
                }
                else if (dayVal === 'E') { 
                    cellClass = 'ts-cell-E'; 
                    totalDuty++; 
                    totalEmergency++;
                    dailyCounts[i]++;
                } 
                else if (dayVal === 'X') { 
                    cellClass = 'ts-cell-X'; 
                    totalDuty++; 
                    totalExtra++;
                    dailyCounts[i]++;
                }
                
                rowHTML += \`<td class="ts-cell \${cellClass}" style="\${extraStyle}" onclick="toggleTsCell('\${emp.ID}', \${i}, this)" data-val="\${dayVal}">\${dayVal}</td>\`;
            }
            
            rowHTML += \`<td id="ts_total_\${emp.ID}" style="font-weight:bold; color: var(--primary);">\${totalDuty}</td>\`;
            rowHTML += \`<td style="color: var(--text-muted); font-size: 12px;">Regular</td>\`;
            rowHTML += \`</tr>\`;
            
            bodyHTML += rowHTML;
        });
        
        // Add Daily Summary Footer Row
        let footerHTML = \`<tr>
            <td colspan="2" style="text-align: right; font-weight: bold; background: var(--glass-bg); position: sticky; left: 60px; z-index: 20;">Total On Duty</td>\`;
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
            const isToday = isCurrentMonth && (i === todayDate);
            let ftStyle = 'font-weight:bold; background: rgba(14, 165, 233, 0.1); color: #0ea5e9;';
            if (isToday) ftStyle += ' border: 2px solid #f9a826; border-top: none;';
            
            footerHTML += \`<td style="\${ftStyle}">\${dailyCounts[i] > 0 ? dailyCounts[i] : ''}</td>\`;
        }
        footerHTML += \`<td colspan="2" style="background: var(--glass-bg);"></td></tr>\`;
        
        bodyHTML += footerHTML;
        document.getElementById('timesheetBody').innerHTML = bodyHTML;
        
        // Update Stats Cards
        const statsHTML = \`
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(14, 165, 233, 0.1); border: 1px solid #0ea5e9; border-radius: 8px;">
                <div style="font-size: 12px; color: #0ea5e9;">Total On Duty (1)</div>
                <div style="font-size: 20px; font-weight: bold;">\${totalOnDuty} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px;">
                <div style="font-size: 12px; color: #ef4444;">Total Emergency (E)</div>
                <div style="font-size: 20px; font-weight: bold;">\${totalEmergency} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px;">
                <div style="font-size: 12px; color: #10b981;">Total Extra Days (X)</div>
                <div style="font-size: 20px; font-weight: bold;">\${totalExtra} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
        \`;
        document.getElementById('timesheetStats').innerHTML = statsHTML;
    }`;

// Replace the renderTimesheetTable function
const startRegex = /function renderTimesheetTable\(\) \{/;
let startIdx = html.search(startRegex);
if (startIdx !== -1) {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let endIdx = -1;
    
    for (let i = startIdx; i < html.length; i++) {
        const char = html[i];
        if (inString) {
            if (char === stringChar && html[i-1] !== '\\\\') inString = false;
        } else {
            if (char === "'" || char === '"' || char === '\`') {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIdx = i;
                    break;
                }
            }
        }
    }
    
    if (endIdx !== -1) {
        html = html.substring(0, startIdx) + newRenderFunc + html.substring(endIdx + 1);
    }
}

// 4. Add exportTimesheetToExcel function
const exportFunc = `

    async function exportTimesheetToExcel() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        
        if (!monthVal || typeof employees === 'undefined') return;
        
        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading. Please try again in a moment.', 'error');
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rotations System';
        const sheet = workbook.addWorksheet('Timesheet');
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // Define Columns
        const columns = [
            { header: 'ID NO', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 }
        ];
        
        for (let i = 1; i <= daysInMonth; i++) {
            columns.push({ header: String(i), key: 'd' + i, width: 5 });
        }
        columns.push({ header: 'Total Duty Days', key: 'total', width: 15 });
        columns.push({ header: 'Status', key: 'status', width: 15 });
        
        sheet.columns = columns;
        
        // Filter Employees
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        
        // Add Data
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            const rowData = { id: emp.ID, name: emp.Name, status: 'Regular' };
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dayVal = empData[i] || '';
                rowData['d' + i] = dayVal;
                if (dayVal === '1' || dayVal === 'E' || dayVal === 'X') {
                    totalDuty++;
                }
            }
            rowData.total = totalDuty;
            sheet.addRow(rowData);
        });
        
        // Style Header
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).alignment = { horizontal: 'center' };
        
        // Generate File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = \`Timesheet_\${monthVal}_\${dept}\${company !== 'All' ? '_' + company : ''}.xlsx\`;
        link.click();
    }
`;

html = html.replace('function renderTimesheetTable', exportFunc + '\n    function renderTimesheetTable');

fs.writeFileSync('index.html', html);
console.log('Update successful');
