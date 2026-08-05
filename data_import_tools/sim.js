const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/Rotations/new_rotations.json', 'utf-8'));

function excelToDateStr(serial) {
    if (!serial || isNaN(serial)) return null;
    const d = new Date((serial - 25569) * 86400 * 1000);
    return d.toISOString().split('T')[0];
}

for (const row of data) {
    if (!row.ID) continue;
    let datePairs = [];
    for (let i = 1; i <= 20; i++) {
        let onKey = Object.keys(row).find(k => k.match(new RegExp('DateON' + i + '$', 'i')) || k.match(new RegExp('DateOn' + i + '$', 'i')));
        let offKey = Object.keys(row).find(k => k.match(new RegExp('DateOFF' + i + '$', 'i')) || k.match(new RegExp('DateOff' + i + '$', 'i')));
        
        if (row[onKey]) {
            datePairs.push({
                on: excelToDateStr(row[onKey]),
                off: row[offKey] ? excelToDateStr(row[offKey]) : null,
                daysOffKey: Object.keys(row).find(k => k.match(new RegExp('DayOFF' + i + '$', 'i')) || k.match(new RegExp('DayOff' + i + '$', 'i')))
            });
        }
    }

    let newRotations = [];
    try {
        for (let i = 0; i < datePairs.length; i++) {
            let current = datePairs[i];
            let next = datePairs[i+1];
            
            if (current.on && current.off) {
                let workEnd = new Date(current.off);
                workEnd.setDate(workEnd.getDate() - 1);
                
                newRotations.push({
                    start: current.on,
                    end: workEnd.toISOString().split('T')[0],
                    type: 'work'
                });
                
                let leaveEndStr;
                if (next && next.on) {
                    let leaveEnd = new Date(next.on);
                    leaveEnd.setDate(leaveEnd.getDate() - 1);
                    leaveEndStr = leaveEnd.toISOString().split('T')[0];
                } else {
                    let daysOff = row[current.daysOffKey] || 28;
                    let leaveEnd = new Date(current.off);
                    leaveEnd.setDate(leaveEnd.getDate() + parseInt(daysOff) - 1);
                    leaveEndStr = leaveEnd.toISOString().split('T')[0];
                }
                
                newRotations.push({
                    start: current.off,
                    end: leaveEndStr,
                    type: 'annual_leave'
                });
            }
        }
    } catch (e) {
        console.error('Error at ID', row.ID, e);
        process.exit(1);
    }
}
console.log('All processed without crashing');
