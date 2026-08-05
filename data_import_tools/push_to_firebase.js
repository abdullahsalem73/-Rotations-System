const fs = require('fs');
const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",
  authDomain: "hr-blk53.firebaseapp.com",
  projectId: "hr-blk53",
  storageBucket: "hr-blk53.firebasestorage.app",
  messagingSenderId: "734368575001",
  appId: "1:734368575001:web:4709f6a667a129ea338488"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function excelToDateStr(serial) {
    if (!serial || isNaN(serial)) return null;
    const d = new Date((serial - 25569) * 86400 * 1000);
    return d.toISOString().split('T')[0];
}

async function run() {
    const data = JSON.parse(fs.readFileSync('d:/Rotations/new_rotations.json', 'utf-8'));
    
    let count = 0;
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

        const empRef = db.collection("employees").doc(String(row.ID));
        const empDoc = await empRef.get();
        
        if (empDoc.exists) {
            await empRef.update({ Rotations: newRotations });
            console.log(`Updated ID: ${row.ID} (${newRotations.length} records)`);
        } else {
            await empRef.set({
                ID: row.ID,
                Name: row.Name,
                Department: row.Department,
                Status: row.Status || "ON",
                Rotations: newRotations,
                Overrides: []
            });
            console.log(`Created ID: ${row.ID} (${newRotations.length} records)`);
        }
        count++;
    }
    console.log("Successfully pushed all data to Firebase");
    process.exit(0);
}

run().catch(console.error);
