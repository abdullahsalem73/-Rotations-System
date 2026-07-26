const xlsx = require('xlsx');
const fs = require('fs');

try {
    const workbook = xlsx.readFile('Employee BLK-53.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse to JSON
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });
    
    // Create a JS file that declares a global variable
    const jsContent = `const EMPLOYEE_DATA = ${JSON.stringify(data, null, 2)};`;
    
    fs.writeFileSync('employees.js', jsContent);
    console.log('Successfully extracted employee data to employees.js');
} catch (error) {
    console.error('Error processing excel file:', error.message);
}
