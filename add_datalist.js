const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add datalist element if not present
if (!html.includes('<datalist id="companyDatalist">')) {
    html = html.replace('</body>', '    <datalist id="companyDatalist"></datalist>\n</body>');
}

// 2. Change newEmpCompany select to input with datalist
const newEmpSelect = '<select id="newEmpCompany" onchange="handleSelectChange(this, \'company\')"></select>';
const newEmpInput = '<input type="text" id="newEmpCompany" list="companyDatalist" placeholder="e.g. PetroMasila" autocomplete="off">';
if (html.includes(newEmpSelect)) {
    html = html.replace(newEmpSelect, newEmpInput);
}

// 3. Change editEmpCompany select to input with datalist
const editEmpSelect = '<select id="editEmpCompany" onchange="handleSelectChange(this, \'company\')"></select>';
const editEmpInput = '<input type="text" id="editEmpCompany" list="companyDatalist" placeholder="e.g. PetroMasila" autocomplete="off">';
if (html.includes(editEmpSelect)) {
    html = html.replace(editEmpSelect, editEmpInput);
}

// 4. Update visitorCompany input to use datalist
const visitorInputStr = 'id="visitorCompany" placeholder="e.g. Subcontractor LLC" style="width:100%"';
if (html.includes(visitorInputStr) && !html.includes('list="companyDatalist"')) {
    html = html.replace(visitorInputStr, visitorInputStr + ' list="companyDatalist" autocomplete="off"');
}

// 5. Update Javascript to populate datalist instead of selects
const oldPopulate = `        ['newEmpCompany', 'editEmpCompany'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const currentVal = el.value;
                el.innerHTML = companyOptions;
                if (sortedCompanies.includes(currentVal)) {
                    el.value = currentVal;
                }
            }
        });`;
        
const newPopulate = `        const dl = document.getElementById('companyDatalist');
        if (dl) {
            dl.innerHTML = sortedCompanies.map(c => \`<option value="\${c}">\`).join('');
        }`;

if (html.includes(oldPopulate)) {
    html = html.replace(oldPopulate, newPopulate);
} else {
    // maybe it has let el instead of const el? Let's use a regex or just replace the inner function
    const oldPopulate2 = `        ['newEmpCompany', 'editEmpCompany'].forEach(id => {
            let el = document.getElementById(id);
            if(el) {
                el.innerHTML = companyOptions;
            }
        });`;
    if (html.includes(oldPopulate2)) {
        html = html.replace(oldPopulate2, newPopulate);
    }
}

fs.writeFileSync('index.html', html);
console.log("Datalist implemented successfully.");
