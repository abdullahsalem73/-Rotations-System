const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldSaveFuncRegex = /async function savePOBSnapshot\(\) \{[\s\S]*?\}\s*async function loadPOBSnapshot\(\)/;

const newSaveFunc = `async function savePOBSnapshot() {
        if (!employees || employees.length === 0) return Swal.fire('Wait', 'Data is still loading...', 'warning');
        
        const todayStr = formatDateRaw(new Date());
        const selectedDateStr = document.getElementById('pobArchiveDate').value;
        
        // Anti-Fraud Check: Ensure they are not trying to lock a past date
        if (selectedDateStr !== todayStr) {
            return Swal.fire({
                icon: 'error',
                title: 'Security Alert 🔒',
                text: \`You cannot take a snapshot for a past date (\${selectedDateStr}). Snapshots can only be taken for TODAY (\${todayStr}) to ensure data integrity and prevent retrospective modifications.\`
            });
        }
        
        const todayNum = parseDate(todayStr).getTime();
        
        // Confirmation before locking
        const confirm = await Swal.fire({
            title: 'Lock POB Snapshot?',
            text: \`Are you sure you want to lock the Personnel On Board snapshot for \${todayStr}? This action will record the current state of all employees.\`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Lock it!'
        });
        
        if (!confirm.isConfirmed) return;

        let compCounts = {};
        let totalOn = 0;
        let staffList = [];
        
        employees.forEach(e => {
            const status = getEmployeeCurrentStatusForDate(e, todayNum);
            if (status === 'work' || status === 'standby_cover') {
                totalOn++;
                const comp = e.Company || 'Unknown';
                compCounts[comp] = (compCounts[comp] || 0) + 1;
                staffList.push({ id: e.ID, name: e.Name, company: comp, dept: e.Department || 'Unknown' });
            }
        });
        
        const snapshot = {
            date: todayStr,
            timestamp: new Date().toISOString(),
            total: totalOn,
            companies: compCounts,
            staff: staffList
        };
        
        try {
            await db.collection('pob_archive').doc(todayStr).set(snapshot);
            Swal.fire('Saved & Locked! 🔒', \`Today's POB Snapshot (\${todayStr}) has been securely archived.\`, 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to save snapshot.', 'error');
        }
    }

    async function loadPOBSnapshot()`;

if(html.match(oldSaveFuncRegex)) {
    html = html.replace(oldSaveFuncRegex, newSaveFunc);
    fs.writeFileSync('index.html', html);
    console.log("Anti-fraud logic added to savePOBSnapshot.");
} else {
    console.log("Regex didn't match.");
}
