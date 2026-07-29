const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the CSS for the timesheet table (add table-layout: fixed)
const tableCssStart = `.timesheet-table {`;
const tableCssNew = `.timesheet-table { table-layout: fixed; `;
if (html.includes(tableCssStart) && !html.includes('table-layout: fixed')) {
    html = html.replace(tableCssStart, tableCssNew);
}

// 2. Fix the CSS for td/th to ensure they have fixed widths so it doesn't shake
const cellCssStart = `.ts-cell {`;
const cellCssNew = `.ts-cell { min-width: 35px; max-width: 35px; overflow: hidden; `;
if (html.includes(cellCssStart) && !html.includes('min-width: 35px')) {
    html = html.replace(cellCssStart, cellCssNew);
}

// We also need to add fixed widths to the first two columns (ID NO and Name)
const headHtmlStart = `let headHTML = \`<th>ID NO</th><th>Name</th>\`;`;
const headHtmlNew = `let headHTML = \`<th style="width: 70px; min-width: 70px;">ID NO</th><th style="width: 150px; min-width: 150px;">Name</th>\`;`;
if (html.includes(headHtmlStart)) {
    html = html.replace(headHtmlStart, headHtmlNew);
}

// 3. Fix the "Today" cell border issue by using box-shadow instead of border
const thStyleStart = `let thStyle = '';
              if (isToday) thStyle += 'border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.1); color: #f9a826;';`;
const thStyleNew = `let thStyle = 'width: 35px; min-width: 35px; max-width: 35px;';
              if (isToday) thStyle += 'box-shadow: inset 0 0 0 2px #f9a826; background: rgba(249, 168, 38, 0.1); color: #f9a826;';`;
if (html.includes(thStyleStart)) {
    html = html.replace(thStyleStart, thStyleNew);
}

const extraStyleStart = `let extraStyle = '';
                  if (isToday) extraStyle += 'border-left: 2px solid #f9a826; border-right: 2px solid #f9a826; background-color: rgba(249, 168, 38, 0.05);';`;
const extraStyleNew = `let extraStyle = '';
                  if (isToday) extraStyle += 'box-shadow: inset 2px 0 0 0 #f9a826, inset -2px 0 0 0 #f9a826; background-color: rgba(249, 168, 38, 0.05);';`;
if (html.includes(extraStyleStart)) {
    html = html.replace(extraStyleStart, extraStyleNew);
}

const ftStyleStart = `let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.2); color: #fff; border-bottom: 2px solid #3b82f6; text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); font-size: 14px;';
              if (isToday) ftStyle += ' border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.2); color: #f9a826; text-shadow: none;';`;
const ftStyleNew = `let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.2); color: #fff; border-bottom: 2px solid #3b82f6; text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); font-size: 14px;';
              if (isToday) ftStyle += ' box-shadow: inset 0 0 0 2px #f9a826; background: rgba(249, 168, 38, 0.2); color: #f9a826; text-shadow: none;';`;
if (html.includes(ftStyleStart)) {
    html = html.replace(ftStyleStart, ftStyleNew);
}


// 4. Auto-fill timesheet on load if empty
const loadTimesheetDataStart = `const doc = await db.collection("timesheets").doc(docId).get();
            if (doc.exists) {
                currentTimesheetData = doc.data().records || {};
            } else {
                currentTimesheetData = {};
            }
            renderTimesheetTable();`;
            
const loadTimesheetDataNew = `const doc = await db.collection("timesheets").doc(docId).get();
            if (doc.exists) {
                currentTimesheetData = doc.data().records || {};
                renderTimesheetTable();
            } else {
                currentTimesheetData = {};
                // Immediately auto-fill if the month is empty!
                autoFillTimesheet(true); 
            }`;

if (html.includes(loadTimesheetDataStart)) {
    html = html.replace(loadTimesheetDataStart, loadTimesheetDataNew);
}

// 5. Adjust autoFillTimesheet to handle 'isSilent' param so it doesn't pop up success if auto-loaded
const autoFillStart2 = `function autoFillTimesheet() {`;
const autoFillNew2 = `function autoFillTimesheet(isSilent = false) {`;
if (html.includes(autoFillStart2)) {
    html = html.replace(autoFillStart2, autoFillNew2);
}

const autoFillToastStart = `Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Auto-filled from Rotations', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });`;
const autoFillToastNew = `if (!isSilent) Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Auto-filled from Rotations', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });`;
if (html.includes(autoFillToastStart)) {
    html = html.replace(autoFillToastStart, autoFillToastNew);
}

// Make sure autoFillTimesheet button still calls it without true
// Wait, the button has `<button class="btn btn-outline" onclick="autoFillTimesheet()" title="Auto-fill based on planned rotations">`
// This will pass undefined, so isSilent will be false. Perfect.

fs.writeFileSync('index.html', html);
console.log("Timesheet UI fixes applied.");
