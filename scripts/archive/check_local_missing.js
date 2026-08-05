const fs = require('fs');

function parseDate(str) {
    if (!str) return new Date(0);
    if (str.includes('-')) {
        const parts = str.split('-');
        if (parts.length === 3) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
    }
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }
    return new Date(0);
}

const fileContent = fs.readFileSync('d:/Rotations/employees.js', 'utf8');
// It starts with const EMPLOYEE_DATA = [ ... ]
// We need to parse the JSON.
let jsonStr = fileContent.replace('const EMPLOYEE_DATA = ', '').trim();
if (jsonStr.endsWith(';')) {
    jsonStr = jsonStr.slice(0, -1);
}

try {
    const employees = JSON.parse(jsonStr);
    
    const d = new Date();
    // Use the exact today logic
    const todayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const todayNum = parseDate(todayStr).getTime();
    
    let missingCount = 0;
    let genuineMissing = [];
    
    employees.forEach(e => {
        let currentStatus = 'unknown';
        let lastEndNum = 0;
        let lastEndStr = '';
        
        if (e.Rotations && e.Rotations.length > 0) {
            e.Rotations.forEach(r => {
                const startNum = parseDate(r.start).getTime();
                const endNum = parseDate(r.end).getTime();
                
                if (endNum > lastEndNum) {
                    lastEndNum = endNum;
                    lastEndStr = r.end;
                }
                
                if (todayNum >= startNum && todayNum <= endNum) {
                    currentStatus = r.type;
                }
            });
        }
        
        if (currentStatus === 'unknown') {
            missingCount++;
            genuineMissing.push({
                id: e.ID,
                name: e.Name,
                lastEndStr: lastEndStr,
                isExpired: lastEndNum < todayNum
            });
        }
    });
    
    console.log("Total Unknown Statuses:", missingCount);
    console.log("Details of Unknowns:", genuineMissing.slice(0, 10)); // print first 10
} catch(e) {
    console.log("Parse Error:", e.message);
}
