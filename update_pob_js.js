const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /async function savePOBSnapshot\(\) \{[\s\S]*?\/\/ Ensure today's field is prepopulated/;

const newJS = `let pobCurrentData = [];
    let isPobCompareMode = false;

    async function savePOBSnapshot() {
        if (!employees || employees.length === 0) return Swal.fire('Wait', 'Data is still loading...', 'warning');
        
        const todayStr = formatDateRaw(new Date());
        const todayNum = parseDate(todayStr).getTime();
        
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
            Swal.fire('Saved!', \`Today's POB Snapshot (\${todayStr}) locked successfully.\`, 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to save snapshot.', 'error');
        }
    }

    async function loadPOBSnapshot() {
        const dateInput = document.getElementById('pobArchiveDate').value;
        if (!dateInput) return Swal.fire('Error', 'Please select a date to load.', 'error');
        
        try {
            const doc = await db.collection('pob_archive').doc(dateInput).get();
            if (doc.exists) {
                renderPOBSnapshot(doc.data());
            } else {
                Swal.fire('Not Found', \`No POB snapshot found for \${dateInput}.\`, 'info');
                document.getElementById('pobArchiveResults').style.display = 'none';
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to fetch snapshot.', 'error');
        }
    }
    
    function renderPOBSnapshot(data, isCompare = false) {
        document.getElementById('pobArchiveResults').style.display = 'block';
        
        if (!isCompare) {
            document.getElementById('pobStatTitle1').innerText = 'Total POB';
            document.getElementById('pobStatTitle2').innerText = 'Snapshot Date';
            document.getElementById('pobTotalValue').innerText = data.total;
            document.getElementById('pobDateValue').innerText = formatDisplayDate(data.date);
            document.getElementById('pobTableTitle').innerHTML = '📋 Staff List';
            
            pobCurrentData = data.staff || [];
            
            const compDiv = document.getElementById('pobCompanyBreakdown');
            compDiv.innerHTML = '';
            document.getElementById('pobBreakdownCard').style.display = 'block';
            
            const sortedComps = Object.keys(data.companies || {}).sort((a,b) => data.companies[b] - data.companies[a]);
            sortedComps.forEach(comp => {
                compDiv.innerHTML += \`<div style="background: rgba(16,185,129,0.15); padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid rgba(16,185,129,0.3);">
                    <strong style="color: #fff;">\${comp}</strong>: <span style="color: #10b981; font-weight: bold;">\${data.companies[comp]}</span>
                </div>\`;
            });
        }
        
        // Populate Departments Filter
        const deptFilter = document.getElementById('pobDeptFilter');
        deptFilter.innerHTML = '<option value="All">All Departments</option>';
        const depts = new Set();
        (isCompare ? pobCurrentData : data.staff || []).forEach(s => {
            if (s.dept) depts.add(s.dept);
        });
        Array.from(depts).sort().forEach(d => {
            deptFilter.innerHTML += \`<option value="\${d}">\${d}</option>\`;
        });
        
        renderPobStaffTable(isCompare ? pobCurrentData : data.staff);
    }
    
    function renderPobStaffTable(staffArray) {
        const staffBody = document.getElementById('pobStaffListBody');
        staffBody.innerHTML = '';
        if (staffArray && staffArray.length > 0) {
            staffArray.forEach(s => {
                let rowStyle = '';
                if (s.isArrival) rowStyle = 'background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981;';
                if (s.isDeparture) rowStyle = 'background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444;';
                
                let actionBadge = '';
                if (s.isArrival) actionBadge = ' <span class="badge" style="background: rgba(16,185,129,0.2); color:#10b981; border:none; padding:2px 8px;">➕ Arrived</span>';
                if (s.isDeparture) actionBadge = ' <span class="badge" style="background: rgba(239,68,68,0.2); color:#ef4444; border:none; padding:2px 8px;">➖ Departed</span>';
                
                staffBody.innerHTML += \`<tr style="\${rowStyle}">
                    <td style="text-align:center;">\${s.id || '-'}</td>
                    <td>\${s.name || '-'}\${actionBadge}</td>
                    <td><span class="company-badge">\${s.company || '-'}</span></td>
                    <td>\${s.dept || '-'}</td>
                </tr>\`;
            });
        } else {
            staffBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color: #94a3b8;">No records found.</td></tr>';
        }
    }

    function togglePobCompareMode() {
        isPobCompareMode = !isPobCompareMode;
        document.getElementById('pobStandardMode').style.display = isPobCompareMode ? 'none' : 'flex';
        document.getElementById('pobCompareMode').style.display = isPobCompareMode ? 'flex' : 'none';
        document.getElementById('compareModeText').innerText = isPobCompareMode ? '⬅️ Back to Standard Mode' : '⚖️ Enable Compare Mode';
        document.getElementById('pobArchiveResults').style.display = 'none';
    }

    async function runPobCompare() {
        const dateA = document.getElementById('pobCompareDateA').value;
        const dateB = document.getElementById('pobCompareDateB').value;
        
        if (!dateA || !dateB) return Swal.fire('Error', 'Please select both Date A and Date B.', 'error');
        
        try {
            const docA = await db.collection('pob_archive').doc(dateA).get();
            const docB = await db.collection('pob_archive').doc(dateB).get();
            
            if (!docA.exists || !docB.exists) {
                return Swal.fire('Not Found', 'One or both selected dates do not have an archived snapshot.', 'error');
            }
            
            const dataA = docA.data().staff || [];
            const dataB = docB.data().staff || [];
            
            const mapA = {}; dataA.forEach(s => mapA[s.id] = s);
            const mapB = {}; dataB.forEach(s => mapB[s.id] = s);
            
            const results = [];
            let arrivals = 0, departures = 0;
            
            // Find Arrivals (in B but not in A)
            dataB.forEach(s => {
                if (!mapA[s.id]) {
                    results.push({ ...s, isArrival: true });
                    arrivals++;
                }
            });
            
            // Find Departures (in A but not in B)
            dataA.forEach(s => {
                if (!mapB[s.id]) {
                    results.push({ ...s, isDeparture: true });
                    departures++;
                }
            });
            
            // Find Unchanged (Optional: could show, but usually delta is only changes. We will just show changes to keep it clean)
            // Wait, let's show all, but highlight arrivals/departures, or just show the delta.
            // Let's just show the Delta.
            
            pobCurrentData = results.sort((a,b) => (b.isArrival ? 1 : 0) - (a.isArrival ? 1 : 0));
            
            document.getElementById('pobArchiveResults').style.display = 'block';
            document.getElementById('pobStatTitle1').innerText = 'Delta POB';
            document.getElementById('pobStatTitle2').innerText = 'Comparison Period';
            document.getElementById('pobTotalValue').innerHTML = \`<span style="color:#10b981;">+\${arrivals}</span> / <span style="color:#ef4444;">-\${departures}</span>\`;
            document.getElementById('pobDateValue').innerHTML = \`<span style="font-size:16px;">\${formatDisplayDate(dateA)}<br>vs<br>\${formatDisplayDate(dateB)}</span>\`;
            document.getElementById('pobTableTitle').innerHTML = '⚖️ POB Changes (Delta)';
            document.getElementById('pobBreakdownCard').style.display = 'none';
            
            renderPOBSnapshot({ staff: pobCurrentData }, true);
            
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to run comparison.', 'error');
        }
    }

    function filterPobTable() {
        const term = document.getElementById('pobSearchInput').value.toLowerCase();
        const dept = document.getElementById('pobDeptFilter').value;
        
        const filtered = pobCurrentData.filter(s => {
            const matchName = (s.name || '').toLowerCase().includes(term) || String(s.id).includes(term);
            const matchDept = dept === 'All' || s.dept === dept;
            return matchName && matchDept;
        });
        
        renderPobStaffTable(filtered);
    }
    
    function exportPobExcel() {
        const term = document.getElementById('pobSearchInput').value.toLowerCase();
        const dept = document.getElementById('pobDeptFilter').value;
        
        const filtered = pobCurrentData.filter(s => {
            const matchName = (s.name || '').toLowerCase().includes(term) || String(s.id).includes(term);
            const matchDept = dept === 'All' || s.dept === dept;
            return matchName && matchDept;
        });
        
        let csvContent = "data:text/csv;charset=utf-8,ID,Name,Company,Department,Status\\n";
        filtered.forEach(s => {
            let status = 'ON';
            if (s.isArrival) status = 'ARRIVED';
            if (s.isDeparture) status = 'DEPARTED';
            csvContent += \`\${s.id},\${s.name},\${s.company || '-'},\${s.dept || '-'},\${status}\\n\`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", \`POB_Archive_Export.csv\`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function printPobReport() {
        let printContents = document.getElementById('pobTable').outerHTML;
        let printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(\`
            <html>
            <head>
                <title>POB Archive Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #000; background: #fff; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f1f5f9; font-weight: bold; }
                    h2 { text-align: center; color: #000; margin-bottom: 5px; }
                    .date-info { text-align: center; font-style: italic; color: #666; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h2>POB Archive Report</h2>
                <div class="date-info">Generated on: \${new Date().toLocaleDateString()}</div>
                \${printContents}
            </body>
            </html>
        \`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    // Ensure today's field is prepopulated`;

if (html.match(regex)) {
    html = html.replace(regex, newJS);
    fs.writeFileSync('index.html', html);
    console.log('POB JS replaced successfully.');
} else {
    console.log('JS Regex did not match.');
}
