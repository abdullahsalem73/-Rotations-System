const fs = require('fs');

const originalHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Import Rotations Data</title>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff; }
        .box { background: #1e293b; padding: 20px; border-radius: 8px; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
    </style>
</head>
<body>
    <div class="box">
        <h1>Importing Employee Rotations...</h1>
        <p id="status">Loading data from new_rotations.json...</p>
        <ul id="log" style="list-style: none; padding: 0; max-height: 400px; overflow-y: auto;"></ul>
    </div>

    <script>
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

        function log(msg, type='normal') {
            const li = document.createElement('li');
            li.innerText = msg;
            if(type === 'success') li.className = 'success';
            if(type === 'error') li.className = 'error';
            document.getElementById('log').appendChild(li);
        }

        function excelToDateStr(serial) {
            if (!serial || isNaN(serial)) return null;
            const d = new Date((serial - 25569) * 86400 * 1000);
            return d.toISOString().split('T')[0];
        }

        async function runImport() {
            try {
                // INJECT_ROWS_HERE
                
                let count = 0;
                for (const row of rows) {
                    if (!row.ID) continue;

                    let datePairs = [];
                    for (let i = 1; i <= 20; i++) {
                        let onKey = Object.keys(row).find(k => k.match(new RegExp(\`DateON\${i}$\`, 'i')) || k.match(new RegExp(\`DateOn\${i}$\`, 'i')));
                        let offKey = Object.keys(row).find(k => k.match(new RegExp(\`DateOFF\${i}$\`, 'i')) || k.match(new RegExp(\`DateOff\${i}$\`, 'i')));
                        
                        if (row[onKey]) {
                            datePairs.push({
                                on: excelToDateStr(row[onKey]),
                                off: row[offKey] ? excelToDateStr(row[offKey]) : null,
                                daysOffKey: Object.keys(row).find(k => k.match(new RegExp(\`DayOFF\${i}$\`, 'i')) || k.match(new RegExp(\`DayOff\${i}$\`, 'i')))
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
                        log(\`Updated ID: \${row.ID} (\${newRotations.length} records)\`, 'success');
                    } else {
                        await empRef.set({
                            ID: row.ID,
                            Name: row.Name,
                            Department: row.Department,
                            Status: row.Status || "ON",
                            Rotations: newRotations,
                            Overrides: []
                        });
                        log(\`Created ID: \${row.ID} (\${newRotations.length} records)\`, 'success');
                    }
                    count++;
                }

                document.getElementById('status').innerText = \`✅ Import successful! Synchronized \${count} employees.\`;
                document.getElementById('status').className = 'success';
            } catch (err) {
                document.getElementById('status').innerText = \`❌ Error: \${err.message}\`;
                document.getElementById('status').className = 'error';
            }
        }
        
        runImport();
    </script>
</body>
</html>`;

const jsonData = fs.readFileSync('d:/Rotations/new_rotations.json', 'utf-8');
const finalHtml = originalHtml.replace('// INJECT_ROWS_HERE', 'const rows = ' + jsonData + ';');
fs.writeFileSync('d:/Rotations/import_new.html', finalHtml);
console.log('Regenerated import_new.html with the latest JSON');
