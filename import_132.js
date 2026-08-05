const firebase = require('firebase');
require('firebase/firestore');
const xlsx = require('xlsx');

const firebaseConfig = {
  apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",
  authDomain: "hr-blk53.firebaseapp.com",
  projectId: "hr-blk53",
  storageBucket: "hr-blk53.firebasestorage.app",
  messagingSenderId: "734368575001",
  appId: "1:734368575001:web:4709f6a667a129ea338488"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function parseExcelDate(serial) {
    const epoch = new Date(1899, 11, 30); // Dec 30, 1899
    return new Date(epoch.getTime() + Math.round(serial * 86400000));
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

async function run() {
    const workbook = xlsx.readFile('EmployeeDashboard-Aug-2026.xlsx');
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const emp132 = data.find(r => String(r.ID) === '132' || String(r['Employee ID']) === '132');
    
    if(!emp132) {
        console.error("Could not find Employee 132");
        process.exit(1);
    }
    
    let records = [];
    let recordIndex = 0;
    
    // Cycle 1 to 10
    for(let i=1; i<=10; i++) {
        let onStartKey = Object.keys(emp132).find(k => k.includes(`DateON${i}`));
        let onEndKey = Object.keys(emp132).find(k => k.includes(`DateOFF${i}`) || k.includes(`DateOff${i}`));
        
        if (emp132[onStartKey] && typeof emp132[onStartKey] === 'number') {
            let start = parseExcelDate(emp132[onStartKey]);
            let end = parseExcelDate(emp132[onEndKey]);
            records.push({
                id: 'rot_' + Date.now() + '_' + recordIndex++,
                type: 'work',
                start: formatDate(start),
                end: formatDate(end)
            });
            
            // Find Leave period duration
            let dayOffKey = Object.keys(emp132).find(k => k.includes(`DayOFF${i}`) || k.includes(`DayOff${i}`));
            let leaveDuration = emp132[dayOffKey];
            if(leaveDuration && leaveDuration > 0) {
                let leaveStart = new Date(end.getTime() + 86400000);
                let leaveEnd = new Date(leaveStart.getTime() + Math.round((leaveDuration-1)*86400000));
                records.push({
                    id: 'rot_' + Date.now() + '_' + recordIndex++,
                    type: 'leave',
                    start: formatDate(leaveStart),
                    end: formatDate(leaveEnd)
                });
            } else if (i === 7) { // Since 7 is the last one with data
                let leaveStart = new Date(end.getTime() + 86400000);
                let leaveEnd = new Date(leaveStart.getTime() + (28-1)*86400000);
                records.push({
                    id: 'rot_' + Date.now() + '_' + recordIndex++,
                    type: 'leave',
                    start: formatDate(leaveStart),
                    end: formatDate(leaveEnd)
                });
            }
        }
    }
    
    console.log("Extracted records:", records);
    
    try {
        await db.collection("employees").doc("132").update({ Rotations: records });
        console.log("Successfully restored rotations to Firebase for Employee 132!");
    } catch(e) {
        console.error("Firebase update failed:", e.message);
    }
    
    process.exit(0);
}

run();
