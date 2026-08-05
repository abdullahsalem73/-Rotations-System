const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject Checkbox in Edit Employee Modal
const target1 = '<input type="text" id="editEmpName" placeholder="e.g. John Doe">';
const replace1 = `<input type="text" id="editEmpName" placeholder="e.g. John Doe">
            <label style="color: var(--text-muted); font-size: 13px; display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                <input type="checkbox" id="editEmpDayNightShift">
                Day/Night Shift Worker (نوبات نهار وليل)
            </label>`;
if (html.includes(target1) && !html.includes('id="editEmpDayNightShift"')) {
    html = html.replace(target1, replace1);
    console.log('1. Checkbox injected');
}

// 2. Load value into Checkbox
const target2 = `document.getElementById('editEmpName').value = emp.Name;`;
const replace2 = `document.getElementById('editEmpName').value = emp.Name;
        document.getElementById('editEmpDayNightShift').checked = !!emp.DayNightShift;`;
if (html.includes(target2) && !html.includes('editEmpDayNightShift\').checked = !!emp.DayNightShift')) {
    html = html.replace(target2, replace2);
    console.log('2. Load value injected');
}

// 3. Save value from Checkbox (variable extraction)
const target3 = `const name = document.getElementById('editEmpName').value.trim();`;
const replace3 = `const name = document.getElementById('editEmpName').value.trim();
        const dayNight = document.getElementById('editEmpDayNightShift').checked;`;
if (html.includes(target3) && !html.includes('const dayNight = document.getElementById(\'editEmpDayNightShift\').checked;')) {
    html = html.replace(target3, replace3);
    console.log('3. Save variable injected');
}

// 4. Save value to emp object
const target4 = `emp.Name = name;`;
const replace4 = `emp.Name = name;
        emp.DayNightShift = dayNight;`;
if (html.includes(target4) && !html.includes('emp.DayNightShift = dayNight;')) {
    html = html.replace(target4, replace4);
    console.log('4. Save to emp injected');
}

// 5. Add getDisplayName helper function
const target5 = `<script>`;
const replace5 = `<script>
    // Helper to append a mark for Day/Night shift workers
    function getDisplayName(emp) {
        if (!emp) return 'Unknown';
        return emp.Name + (emp.DayNightShift ? ' 🌗' : '');
    }`;
if (html.includes(target5) && !html.includes('function getDisplayName(emp)')) {
    html = html.replace(target5, replace5);
    console.log('5. getDisplayName helper injected');
}

// 6. Update rendering logic where needed
// Main rotations table:
// \`<div style="font-weight: 600; color: white;">\${a.emp.Name}</div>\` => \`<div style="font-weight: 600; color: white;">\${getDisplayName(a.emp)}</div>\`
let replacements = [
    { t: '`<div style="font-weight: 600; color: white;">${a.emp.Name}</div>`', r: '`<div style="font-weight: 600; color: white;">${getDisplayName(a.emp)}</div>`' },
    { t: '`<div style="font-weight: 600; color: white;">${d.emp.Name}</div>`', r: '`<div style="font-weight: 600; color: white;">${getDisplayName(d.emp)}</div>`' },
    { t: '`<h4><span class="name-text">${emp.Name}</span> <span class="ts-id">#${emp.ID}</span></h4>`', r: '`<h4><span class="name-text">${getDisplayName(emp)}</span> <span class="ts-id">#${emp.ID}</span></h4>`' },
    { t: '`<div style="font-weight: bold; color: white;">${emp.Name}</div>`', r: '`<div style="font-weight: bold; color: white;">${getDisplayName(emp)}</div>`' },
    { t: 'document.getElementById(\'pcName\').innerText = emp.Name || \'-\';', r: 'document.getElementById(\'pcName\').innerText = getDisplayName(emp) || \'-\';' },
    { t: 'document.getElementById(\'profileName\').innerText = emp.Name;', r: 'document.getElementById(\'profileName\').innerText = getDisplayName(emp);' }
];

replacements.forEach((rep, i) => {
    // Escape backticks in literal if we need to? No we don't need to if we just do straight replace.
    // Actually the strings might be a bit different in indentation. Let's use regex for safety or just exact match.
    // Wait, regex might be better for whitespace.
    // Let's just try exact replacement, but some might fail due to indentation.
});

// Since exact replacement for UI is tricky, we can replace \`\${emp.Name}\` with \`\${getDisplayName(emp)}\` in specific lines using regex carefully.
// To avoid replacing it everywhere (like in export names), we replace it in HTML templates.
html = html.replace(/<div style="font-weight: 600; color: white;">\$\{a\.emp\.Name\}<\/div>/g, '<div style="font-weight: 600; color: white;">${getDisplayName(a.emp)}</div>');
html = html.replace(/<div style="font-weight: 600; color: white;">\$\{d\.emp\.Name\}<\/div>/g, '<div style="font-weight: 600; color: white;">${getDisplayName(d.emp)}</div>');
html = html.replace(/<div style="font-weight: bold; color: white;">\$\{emp\.Name\}<\/div>/g, '<div style="font-weight: bold; color: white;">${getDisplayName(emp)}</div>');
html = html.replace(/<span class="name-text">\$\{emp\.Name\}<\/span>/g, '<span class="name-text">${getDisplayName(emp)}</span>');
html = html.replace(/document\.getElementById\('pcName'\)\.innerText = emp\.Name \|\| '-';/g, 'document.getElementById(\'pcName\').innerText = getDisplayName(emp) || \'-\';');
html = html.replace(/document\.getElementById\('profileName'\)\.innerText = emp\.Name;/g, 'document.getElementById(\'profileName\').innerText = getDisplayName(emp);');

// Also timesheet render (from apply_night_and_excel_safe.js):
html = html.replace(/<span style="cursor:pointer; margin-right: 5px; font-size:16px; user-select:none;" onclick="toggleShift\('\$\{emp\.ID\}'\)" title="Toggle Shift">\$\{shiftIcon\}<\/span>\s*\$\{emp\.Name\}/g, 
'<span style="cursor:pointer; margin-right: 5px; font-size:16px; user-select:none;" onclick="toggleShift(\'${emp.ID}\')" title="Toggle Shift">${shiftIcon}</span>\n                      ${getDisplayName(emp)}');


fs.writeFileSync('index.html', html);
console.log('Done replacing UI text.');
