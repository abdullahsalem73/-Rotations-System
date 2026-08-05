const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the HTML UI for Company and Department dropdowns
const deptUIPattern = /<div class="input-group">\s*<label>Department<\/label>\s*<select id="timesheetDeptFilter" onchange="loadTimesheetData\(\)">[\s\S]*?<\/select>\s*<\/div>/;

const newUI = `<div class="input-group">
                          <label>Company</label>
                          <select id="timesheetCompanyFilter" onchange="loadTimesheetData()">
                              <option value="All">All Companies</option>
                          </select>
                      </div>
                      <div class="input-group">
                          <label>Department</label>
                          <select id="timesheetDeptFilter" onchange="loadTimesheetData()">
                              <option value="All">All Departments</option>
                          </select>
                      </div>`;

html = html.replace(deptUIPattern, newUI);


// 2. Fix populateCompanyAndDestDropdowns to populate them dynamically
const populateTarget = `function populateCompanyAndDestDropdowns() {
        const companies = new Set();
        const destinations = new Set();`;
        
const populateTargetNew = `function populateCompanyAndDestDropdowns() {
        const companies = new Set();
        const destinations = new Set();
        const departments = new Set();`;

html = html.replace(populateTarget, populateTargetNew);

const populateLoopTarget = `if (e.Destination && e.Destination !== 'N/A') destinations.add(e.Destination);`;
const populateLoopTargetNew = `if (e.Destination && e.Destination !== 'N/A') destinations.add(e.Destination);
            if (e.Department && e.Department !== 'N/A') departments.add(e.Department);`;

html = html.replace(populateLoopTarget, populateLoopTargetNew);


const populateEndTarget = `['newEmpCompany', 'editEmpCompany'].forEach(id => {`;
const populateEndTargetNew = `const sortedDepartments = Array.from(departments).sort();
        
        // Populate Timesheet Company Filter
        const tsCompanyFilter = document.getElementById('timesheetCompanyFilter');
        if (tsCompanyFilter) {
            const currentTsVal = tsCompanyFilter.value;
            tsCompanyFilter.innerHTML = '<option value="All">All Companies</option>' + sortedCompanies.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
            if (sortedCompanies.includes(currentTsVal) || currentTsVal === 'All') tsCompanyFilter.value = currentTsVal;
        }
        
        // Populate Timesheet Department Filter
        const tsDeptFilter = document.getElementById('timesheetDeptFilter');
        if (tsDeptFilter) {
            const currentTsVal = tsDeptFilter.value;
            tsDeptFilter.innerHTML = '<option value="All">All Departments</option>' + sortedDepartments.map(d => \`<option value="\${d}">\${d}</option>\`).join('');
            if (sortedDepartments.includes(currentTsVal) || currentTsVal === 'All') tsDeptFilter.value = currentTsVal;
        }

        ['newEmpCompany', 'editEmpCompany'].forEach(id => {`;

if(!html.includes('tsCompanyFilter.innerHTML')){
    html = html.replace(populateEndTarget, populateEndTargetNew);
}


// 3. Make sure autoFillTimesheet filters by Company
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
            filtered = employees.filter(e => e.Department === dept);
        }`;

const autoFillFilterNew = `let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }`;

html = html.replace(autoFillFilter, autoFillFilterNew);


fs.writeFileSync('index.html', html);
console.log("Filters fixed.");
