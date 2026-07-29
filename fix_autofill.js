const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix loadTimesheetData to autoFill if the document is empty (even if it exists in Firebase)
const loadFnStartStr = `async function loadTimesheetData() {`;
const loadFnEndStr = `async function exportTimesheetToExcel() {`;
const loadFnStartIndex = html.indexOf(loadFnStartStr);
const loadFnEndIndex = html.indexOf(loadFnEndStr);

if (loadFnStartIndex !== -1 && loadFnEndIndex !== -1) {
    const newLoadFn = `async function loadTimesheetData() {
        if (!document.getElementById('timesheetMonth')) return;
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        if (!monthVal) return;
        
        const docId = \`\${monthVal}_\${dept.replace(/[^a-zA-Z0-9]/g, '')}\`;
        
        try {
            const doc = await db.collection("timesheets").doc(docId).get();
            if (doc.exists && doc.data().records && Object.keys(doc.data().records).length > 0) {
                currentTimesheetData = doc.data().records;
                renderTimesheetTable();
            } else {
                currentTimesheetData = {};
                // Immediately auto-fill if the month is empty (no saved records yet)!
                autoFillTimesheet(true); 
            }
        } catch (error) {
            console.error("Error loading timesheet:", error);
            Swal.fire('Error', 'Failed to load timesheet data', 'error');
        }
    }

    `;
    html = html.substring(0, loadFnStartIndex) + newLoadFn + html.substring(loadFnEndIndex);
    console.log("loadTimesheetData updated.");
}

// 2. Fix autoFillTimesheet to include Company filter correctly
const autoFnStartStr = `function autoFillTimesheet(isSilent = false) {`;
const autoFnEndStr = `async function saveTimesheet() {`;
const autoFnStartIndex = html.indexOf(autoFnStartStr);
const autoFnEndIndex = html.indexOf(autoFnEndStr);

if (autoFnStartIndex !== -1 && autoFnEndIndex !== -1) {
    const newAutoFn = `function autoFillTimesheet(isSilent = false) {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        if (!monthVal) return;
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        
        filtered.forEach(emp => {
            if (!currentTimesheetData[emp.ID]) currentTimesheetData[emp.ID] = {};
            
            for (let i = 1; i <= daysInMonth; i++) {
                const checkDateStr = \`\${year}-\${month}-\${i < 10 ? '0'+i : i}\`;
                const checkDateNum = parseDate(checkDateStr).getTime();
                
                const status = getEmployeeCurrentStatusForDate(emp, checkDateNum);
                
                if (status === 'work' || status === 'standby_cover') {
                    currentTimesheetData[emp.ID][i] = 'ON';
                } else if (status === 'leave' || status === 'rest' || status === 'missing' || status === 'sick_leave') {
                    currentTimesheetData[emp.ID][i] = '';
                }
            }
        });
        
        renderTimesheetTable();
        if (!isSilent) Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Auto-filled from Rotations', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
    }

    `;
    html = html.substring(0, autoFnStartIndex) + newAutoFn + html.substring(autoFnEndIndex);
    console.log("autoFillTimesheet updated.");
}

fs.writeFileSync('index.html', html);
console.log("Done");
