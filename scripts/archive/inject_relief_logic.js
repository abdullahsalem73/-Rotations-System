const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexJS = /\/\/ Ensure today's field is prepopulated/;
const newJS = `
    // --- Notification & Relief Logic ---
    function toggleNotifications() {
        const dropdown = document.getElementById('notifDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        if (dropdown.style.display === 'block') {
            detectConflicts();
        }
    }

    function populateReliefDropdown(selectedReliefId = '') {
        const dropdown = document.getElementById('empRelief');
        dropdown.innerHTML = '<option value="">-- None (No Relief) --</option>';
        employees.forEach(e => {
            const selected = e.ID === selectedReliefId ? 'selected' : '';
            dropdown.innerHTML += \`<option value="\${e.ID}" \${selected}>\${e.Name} (\${e.ID})</option>\`;
        });
    }

    function getEmployeeNameById(id) {
        const emp = employees.find(e => e.ID === id);
        return emp ? emp.Name : 'Unknown';
    }

    function detectConflicts() {
        const notifList = document.getElementById('notifList');
        const notifBadge = document.getElementById('notifBadge');
        notifList.innerHTML = '';
        let conflicts = [];

        // We check next 30 days
        const today = new Date();
        const daysToCheck = 30;

        employees.forEach(empA => {
            if (empA.ReliefID) {
                const empB = employees.find(e => e.ID === empA.ReliefID);
                if (empB) {
                    // Prevent duplicate checks since A->B and B->A is possible
                    if (empA.ID > empB.ID) return;

                    for (let i = 0; i < daysToCheck; i++) {
                        let d = new Date(today);
                        d.setDate(today.getDate() + i);
                        const dNum = d.getTime();
                        
                        const statusA = getEmployeeCurrentStatusForDate(empA, dNum);
                        const statusB = getEmployeeCurrentStatusForDate(empB, dNum);

                        const isWorkA = (statusA === 'work' || statusA === 'standby_cover');
                        const isWorkB = (statusB === 'work' || statusB === 'standby_cover');

                        if (isWorkA && isWorkB) {
                            conflicts.push({
                                dateStr: formatDateRaw(d),
                                type: 'overlap',
                                empA: empA.Name,
                                empB: empB.Name,
                                msg: \`<strong>\${empA.Name}</strong> and <strong>\${empB.Name}</strong> are both scheduled to be <span style="color:#10b981;">ON</span>.\`
                            });
                        } else if (!isWorkA && !isWorkB) {
                            conflicts.push({
                                dateStr: formatDateRaw(d),
                                type: 'gap',
                                empA: empA.Name,
                                empB: empB.Name,
                                msg: \`<strong>\${empA.Name}</strong> and <strong>\${empB.Name}</strong> are both scheduled to be <span style="color:#ef4444;">OFF</span>. Position is unmanned!\`
                            });
                        }
                    }
                }
            }
        });

        if (conflicts.length === 0) {
            notifList.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 14px;">No conflicts detected in the next 30 days. You\\'re all good! 🎉</div>';
            notifBadge.style.display = 'none';
        } else {
            notifBadge.style.display = 'flex';
            notifBadge.innerText = conflicts.length;
            
            // Group by Date or just list them
            conflicts.sort((a,b) => new Date(a.dateStr) - new Date(b.dateStr)).forEach(c => {
                let icon = c.type === 'overlap' ? '⚠️' : '🚨';
                let border = c.type === 'overlap' ? '#f59e0b' : '#ef4444';
                let bg = c.type === 'overlap' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                
                notifList.innerHTML += \`
                    <div style="background: \${bg}; border-left: 4px solid \${border}; padding: 10px; border-radius: 4px; font-size: 13px;">
                        <div style="font-weight: bold; margin-bottom: 5px; color: #fff;">\${icon} \${c.dateStr}</div>
                        <div style="color: rgba(255,255,255,0.8);">\${c.msg}</div>
                    </div>
                \`;
            });
        }
    }

    // Hook into modal open
    const oldOpenModal = openModal;
    window.openModal = function(isEdit = false) {
        if (!isEdit) {
            populateReliefDropdown('');
        }
        oldOpenModal(isEdit);
    };

    // Replace the exact save functionality to capture ReliefID
    const saveEmployeeStr = saveEmployee.toString();
    // Assuming saveEmployee reads from document.getElementById... we need to add ReliefID
    
    // // Ensure today's field is prepopulated`;
    
html = html.replace(regexJS, newJS + '\n\n    // Ensure today\'s field is prepopulated');

// Update showEmployeeDetails
html = html.replace(/document\.getElementById\('profilePhone'\)\.innerText = emp\.Phone \|\| '---';/, 
    `$&
    document.getElementById('profileRelief').innerText = emp.ReliefID ? getEmployeeNameById(emp.ReliefID) : '---';`);

// Update edit modal population
html = html.replace(/document\.getElementById\('empPhone'\)\.value = emp\.Phone \|\| '';/, 
    `$&
    populateReliefDropdown(emp.ReliefID || '');`);

// Update saveEmployee function to include ReliefID
html = html.replace(/Phone: document\.getElementById\('empPhone'\)\.value,/, 
    `$&
    ReliefID: document.getElementById('empRelief').value,`);
html = html.replace(/emp\.Phone = document\.getElementById\('empPhone'\)\.value;/, 
    `$&
    emp.ReliefID = document.getElementById('empRelief').value;`);

fs.writeFileSync('index.html', html);
console.log("Logic Injected");
