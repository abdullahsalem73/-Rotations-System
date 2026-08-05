const xlsx = require('xlsx');
const workbook = xlsx.readFile('EmployeeDashboard-Aug-2026.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);
console.log("Columns:", Object.keys(data[0]));
const emp112 = data.filter(r => String(r.ID) === '112' || String(r['Employee ID']) === '112' || String(r['id']) === '112');
console.log("Found rows for 112:", emp112.length);
if(emp112.length > 0) {
    console.log("First row:", emp112[0]);
}
