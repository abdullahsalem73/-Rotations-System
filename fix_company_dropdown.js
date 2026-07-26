const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add company dropdown back to UI
const deptDropdownHTML = `<div class="input-group">
                        <label>Department</label>
                        <select id="timesheetDeptFilter" onchange="loadTimesheetData()">`;

const newDeptAndCompanyDropdownHTML = `<div class="input-group">
                        <label>Company</label>
                        <select id="timesheetCompanyFilter" onchange="loadTimesheetData()">
                            <option value="All">All Companies</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Department</label>
                        <select id="timesheetDeptFilter" onchange="loadTimesheetData()">`;

if (html.indexOf('timesheetCompanyFilter') === -1 || !html.includes('<label>Company</label>')) {
    html = html.replace(deptDropdownHTML, newDeptAndCompanyDropdownHTML);
}

// 2. Add timesheetCompanyFilter population logic to populateCompanyAndDestDropdowns
const populatorCode = `['newEmpCompany', 'editEmpCompany'].forEach(id => {`;

const newPopulatorCode = `const tsCompanyFilter = document.getElementById('timesheetCompanyFilter');
        if (tsCompanyFilter) {
            const currentTsVal = tsCompanyFilter.value;
            tsCompanyFilter.innerHTML = '<option value="All">All Companies</option>' + sortedCompanies.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
            if (sortedCompanies.includes(currentTsVal) || currentTsVal === 'All') tsCompanyFilter.value = currentTsVal;
        }

        ['newEmpCompany', 'editEmpCompany'].forEach(id => {`;

if (!html.includes('tsCompanyFilter.innerHTML')) {
    html = html.replace(populatorCode, newPopulatorCode);
}

// 3. Make sure autoFillTimesheet has the company filtering
const autoFillStart = `const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        if (!monthVal) return;`;

const autoFillNew = `const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        if (!monthVal) return;`;

if (!html.includes(`const company = companyEl ? companyEl.value : "All";\n        if (!monthVal) return;`)) {
    html = html.replace(autoFillStart, autoFillNew);
}

const autoFillFilter = `let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }`;

const autoFillFilterNew = `let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }`;

// In autoFillTimesheet we need to ensure the company filter works when they press "Auto Fill"
// Let's replace only the first occurrence after autoFillTimesheet declaration
const afIdx = html.indexOf('function autoFillTimesheet()');
if (afIdx !== -1) {
    const filterIdx = html.indexOf(autoFillFilter, afIdx);
    if (filterIdx !== -1 && filterIdx < html.indexOf('function ', afIdx + 10)) {
        html = html.substring(0, filterIdx) + autoFillFilterNew + html.substring(filterIdx + autoFillFilter.length);
    }
}

fs.writeFileSync('index.html', html);
