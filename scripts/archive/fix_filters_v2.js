const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace populateCompanyAndDestDropdowns entirely
const startStr = 'function populateCompanyAndDestDropdowns() {';
const endStr = 'function handleSelectChange(selectEl, type) {';
const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newPopulateFn = `function populateCompanyAndDestDropdowns() {
        const companies = new Set();
        const destinations = new Set();
        const departments = new Set();

        employees.forEach(e => {
            if (e.Company && e.Company !== 'N/A') companies.add(e.Company);
            if (e.Destination && e.Destination !== 'N/A') destinations.add(e.Destination);
            if (e.Department && e.Department !== 'N/A') departments.add(e.Department);
        });

        // Add predefined companies
        const predefinedCompanies = ["Salsala", "Al-Lord", "Al-Tamimi", "Petroneer", "Bin Hader", "Bahesabi", "Ibn Mubarak", "HCCC"];
        predefinedCompanies.forEach(c => companies.add(c));

        // Predefined Destinations (geographic regions only)
        const predefinedDestinations = ["Seiyoun", "Mukalla", "Al Shihr", "Sah", "Al Radood", "Rawk", "Hikmah", "Ba'alal", "Sharyoof", "Al Gharaf", "Tarim", "Wadi Bin Ali", "Tamran", "Al Qatn", "Shibam", "Tarbah", "Block 14", "Block 10", "Block 51", "Labnah"];
        predefinedDestinations.forEach(d => destinations.add(d));

        // Predefined Departments (job departments only)
        const predefinedDepartments = ["Operations", "IT", "HSE", "Maintenance", "Management", "HR", "Finance", "Logistics", "ESP"];
        predefinedDepartments.forEach(dp => departments.add(dp));

        const sortedCompanies = Array.from(companies).sort();
        const sortedDestinations = Array.from(destinations).sort();
        const sortedDepartments = Array.from(departments).sort();

        const companyOptions = \`<option value="">Select...</option>\` + sortedCompanies.map(c => \`<option value="\${c}">\${c}</option>\`).join('') + \`<option value="ADD_NEW" style="font-weight:bold;color:#f9a826;">+ إضـافـة شـركـة (Add New...)</option>\`;
        const destOptions = \`<option value="">Select...</option>\` + sortedDestinations.map(d => \`<option value="\${d}">\${d}</option>\`).join('') + \`<option value="ADD_NEW" style="font-weight:bold;color:#f9a826;">+ إضـافـة مـوقـع (Add New...)</option>\`;

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

        ['newEmpCompany', 'editEmpCompany'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const currentVal = el.value;
                el.innerHTML = companyOptions;
                if (sortedCompanies.includes(currentVal)) el.value = currentVal;
            }
        });

        ['newEmpDest', 'editEmpDest'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const currentVal = el.value;
                el.innerHTML = destOptions;
                if (sortedDestinations.includes(currentVal)) el.value = currentVal;
            }
        });
    }

    `;
    
    html = html.substring(0, startIndex) + newPopulateFn + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log("Successfully replaced populateCompanyAndDestDropdowns");
} else {
    console.log("Could not find function bounds.");
}
