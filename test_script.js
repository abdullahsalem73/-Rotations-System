
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('app-loaded');
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if(splash) splash.remove();
            }, 300);
        }, 600); // Trigger app reveal exactly as explosion finishes
    });



    // ✅ Auto-clear old caches and service workers on every load
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            // Unregister ALL old service workers
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let reg of registrations) {
                await reg.unregister();
            }
            // Delete ALL old caches
            const cacheKeys = await caches.keys();
            for (let key of cacheKeys) {
                await caches.delete(key);
            }
            // Register fresh SW
            navigator.serviceWorker.register('./sw.js?v=6').catch(err => console.error('SW registration failed:', err));
        });
    }
    window.addEventListener('online',  () => document.getElementById('offlineIndicator').style.display = 'none');
    window.addEventListener('offline', () => document.getElementById('offlineIndicator').style.display = 'block');
    if(!navigator.onLine) document.addEventListener('DOMContentLoaded', () => document.getElementById('offlineIndicator').style.display = 'block');



        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'light') {
            document.documentElement.classList.add('light-mode');
            document.addEventListener('DOMContentLoaded', () => document.body.classList.add('light-mode'));
        }

        function toggleTheme() {
            const isLight = document.documentElement.classList.toggle('light-mode');
            document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            const btn = document.getElementById('themeToggleBtn');
            if(btn) btn.innerText = isLight ? '🌙' : '☀️';
            if(typeof initCharts === 'function') initCharts();
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('themeToggleBtn');
            if(btn && document.documentElement.classList.contains('light-mode')) btn.innerText = '🌙';
        });
    


    // ---------------------------------
    // Firebase Setup
    // ---------------------------------
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
    db.enablePersistence().catch(function(err) {
        console.error("Firebase Persistence Error:", err.code);
    });

    // ---------------------------------
    // Audit Logging
    // ---------------------------------
    function logAuditAction(action, details) {
        try {
            db.collection('system_logs').add({
                action: action,
                details: details,
                user: "Local Admin", // Mock user
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch(e) { console.error("Audit log error", e); }
    }
    
    function loadAuditLogs() {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;
        db.collection('system_logs').orderBy('timestamp', 'desc').limit(50).onSnapshot(snapshot => {
            if(snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No logs found</td></tr>';
                return;
            }
            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString('en-GB') : 'Just now';
                html += `<tr>
                    <td style="text-align:center; font-size:12px; color:var(--text-muted);">${date}</td>
                    <td style="text-align:center; font-weight:bold;">${data.user || 'Unknown'}</td>
                    <td style="text-align:left; color:var(--primary); font-weight:bold;">${data.action}</td>
                    <td style="text-align:left;">${data.details}</td>
                </tr>`;
            });
            tbody.innerHTML = html;
        });
    }
    document.addEventListener('DOMContentLoaded', loadAuditLogs);

    // ---------------------------------
    // Tabs Logic
    // ---------------------------------
    function switchTab(tabId) {
        document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        document.getElementById(tabId + '-tab').classList.add('active');
        document.getElementById(tabId + 'TabBtn').classList.add('active');
        
        if (tabId === 'movements' && !document.getElementById('movementsDate').value) {
            const today = new Date();
            if (document.querySelector('#movementsDate')._flatpickr) {
                document.querySelector('#movementsDate')._flatpickr.setDate(today);
            } else {
                document.getElementById('movementsDate').value = today.toISOString().split('T')[0];
            }
            renderMovements();
        }

        if (tabId === 'timesheet') {
            if (typeof loadTimesheetData === 'function') {
                loadTimesheetData();
            }
        }
    }

    // ---------------------------------
    // Rotations Logic
    // ---------------------------------
    let records = [];
    let inlineEditingId = null;
    let selectedEmployeeId = null;

    function loadData() {
        if (selectedEmployeeId) {
            const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
            records = emp && emp.Rotations ? [...emp.Rotations] : [];
            if (emp && emp.Overrides) {
                emp.Overrides.forEach(ov => {
                    records.push({ ...ov, isOverride: true });
                });
            }
        } else {
            db.collection("system").doc("general_rotations").get().then(doc => {
                if (doc.exists) {
                    records = doc.data().records || [];
                    renderTable();
                    updateStats();
                } else {
                    records = [];
                }
            });
        }
    }
    function saveData() { 
        if (records && records.length > 0) {
            records.sort((a, b) => (parseDate(a.start) > parseDate(b.start) ? 1 : -1));
            let merged = [];
            for (let i = 0; i < records.length; i++) {
                if (merged.length === 0) {
                    merged.push(records[i]);
                } else {
                    let last = merged[merged.length - 1];
                    if (last.type === records[i].type) {
                        let lastEnd = parseDate(last.end);
                        let currEnd = parseDate(records[i].end);
                        let lastStart = parseDate(last.start);
                        let currStart = parseDate(records[i].start);
                        
                        let diffDays = Math.floor((currStart - lastEnd) / 86400000);
                        if (diffDays <= 1) {
                            if (currEnd > lastEnd) {
                                last.end = records[i].end;
                            }
                            if (currStart < lastStart) {
                                last.start = records[i].start;
                            }
                            if (records[i].id === inlineEditingId) {
                                last.id = records[i].id;
                            }
                        } else {
                            merged.push(records[i]);
                        }
                    } else {
                        merged.push(records[i]);
                    }
                }
            }
            records = merged;
        }

        if (selectedEmployeeId) {
            const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
            if (emp) {
                emp.Rotations = records;
                db.collection("employees").doc(String(emp.ID)).set(emp).catch(e => console.error("Firebase sync error", e));
            }
        } else {
            db.collection("system").doc("general_rotations").set({ records: records });
        }
    }

    function autoGenerateMissingPeriods() {
        if (!records || records.length === 0) return;
        
        let sorted = [...records].sort((a, b) => (parseDate(a.end) > parseDate(b.end) ? 1 : -1));
        let lastRecord = sorted[sorted.length - 1];
        
        let lastEnd = parseDate(lastRecord.end);
        let today = new Date();
        today.setHours(0,0,0,0);
        
        let added = false;
        while (lastEnd < today) {
            let newType = (lastRecord.type === 'work') ? 'leave' : 'work';
            let newStartStr = addOneDay(lastRecord.end);
            let newStart = parseDate(newStartStr);
            let newEnd = new Date(newStart);
            newEnd.setDate(newEnd.getDate() + 27);
            
            let neYear = newEnd.getFullYear();
            let neMonth = String(newEnd.getMonth() + 1).padStart(2, '0');
            let neDay = String(newEnd.getDate()).padStart(2, '0');
            
            let newRecord = {
                id: Date.now() + Math.random(),
                type: newType,
                start: newStartStr,
                end: `${neYear}-${neMonth}-${neDay}`
            };
            
            records.push(newRecord);
            lastRecord = newRecord;
            lastEnd = parseDate(lastRecord.end);
            added = true;
        }
        
        if (added) {
            saveData();
        }
    }

    function viewEmployeeRotations(id) {
        selectedEmployeeId = String(id);
        const emp = employees.find(e => String(e.ID) === selectedEmployeeId);
        if (emp) {
            document.getElementById('profileName').innerText = emp.Name;
            document.getElementById('profileID').innerText = emp.ID || '-';
            document.getElementById('profileCompany').innerText = emp.Company || '-';
            document.getElementById('profileDept').innerText = emp.Department || '-';
            document.getElementById('profileDest').innerText = emp.Destination || '-';
            document.getElementById('profilePhone').innerText = emp.Phone || '-';

            // Load profile picture
            const picImg = document.getElementById('profilePicImg');
            const picFallback = document.getElementById('profilePicFallback');
            if (emp.profilePic) {
                picImg.src = emp.profilePic;
                picImg.style.display = 'block';
                picFallback.style.display = 'none';
            } else {
                picImg.src = '';
                picImg.style.display = 'none';
                picFallback.style.display = 'block';
            }

            // document.getElementById('rotationsTabBtn').style.display = 'inline-block';
            loadData();
            autoGenerateMissingPeriods();
            renderTable();
            updateStats();
            switchTab('rotations');
        }
    }

    function handleProfilePicUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Img = e.target.result;
            
            // Update UI
            const picImg = document.getElementById('profilePicImg');
            const picFallback = document.getElementById('profilePicFallback');
            picImg.src = base64Img;
            picImg.style.display = 'block';
            picFallback.style.display = 'none';

            // Save to employee data and Firebase
            if (selectedEmployeeId) {
                const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
                if (emp) {
                    emp.profilePic = base64Img;
                    db.collection("employees").doc(String(emp.ID)).set(emp)
                        .then(() => {
                            Swal.fire({
                                title: 'Success',
                                text: 'Profile picture updated successfully!',
                                icon: 'success',
                                background: 'var(--card-bg)',
                                color: 'var(--text-main)',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        })
                        .catch(err => console.error("Firebase sync error", err));
                }
            }
        };
        reader.readAsDataURL(file);
    }

    function addBlankPeriodInline() {
        let dateStr = formatDateRaw(new Date());
        let type = 'work';
        if (records && records.length > 0) {
            const sorted = [...records].sort((a,b) => parseDate(a.end) - parseDate(b.end));
            const lastRecord = sorted[sorted.length - 1];
            dateStr = addOneDay(lastRecord.end);
            type = lastRecord.type === 'work' ? 'leave' : 'work';
        }
        
        let newRecord = {
            id: Date.now(),
            type: type,
            start: dateStr,
            end: dateStr
        };
        inlineEditingId = newRecord.id;
        records.push(newRecord);
        saveData();
        renderTable();
        
        setTimeout(() => {
            const tbody = document.getElementById('recordsBody');
            if (tbody && tbody.lastElementChild) {
                tbody.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    function formatDateRaw(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    function formatDisplayDate(dateStr) {
        if(!dateStr) return '';
        const date = parseDate(dateStr);
        const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const year = date.getFullYear();
        const month = date.getMonth();
        return `${day} ${enMonths[month]} ${year}`;
    }
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
    function addOneDay(str) {
        const d = parseDate(str);
        d.setDate(d.getDate() + 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    function daysBetween(startStr, endStr) {
        const diff = Math.floor((parseDate(endStr) - parseDate(startStr)) / 86400000) + 1;
        return diff> 0 ? diff : 0;
    }

    function savePeriod() {
        const type = document.getElementById('periodType').value;
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        if (!start || !end) return alert('Please select dates.');
        if (parseDate(end) < parseDate(start)) return alert('End date must be after start date.');

        records.push({ id: `rot_${Date.now()}`, type, start, end });
        
        document.querySelector('#startDate')._flatpickr.clear();
        document.querySelector('#endDate')._flatpickr.clear();
        updateLiveDays();
        
        saveData(); renderTable(); updateStats();
    }

    function editRecord(id) {
        inlineEditingId = id;
        renderTable();
    }

    function saveInlineEdit(id) {
        const type = document.getElementById(`inline-type-${id}`).value;
        const start = document.getElementById(`inline-start-${id}`).value;
        const end = document.getElementById(`inline-end-${id}`).value;
        
        if (!start || !end) return Swal.fire('Error', 'Please select dates', 'error');
        if (start > end) return Swal.fire('Error', 'End date must be after start date', 'error');
        
        // Find next chronological record
        const index = records.findIndex(r => String(r.id) === String(id));
        if (index === -1) return;
        const oldRecord = records[index];
        const oldEnd = oldRecord.end;
        
        let nextRecord = null;
        let nextRecordIndex = -1;
        const sorted = records.map((r, i) => ({...r, originalIndex: i})).sort((a,b) => parseDate(a.start) - parseDate(b.start));
        const sortedIndex = sorted.findIndex(r => String(r.id) === String(id));
        if (sortedIndex !== -1 && sortedIndex < sorted.length - 1) {
            nextRecord = sorted[sortedIndex + 1];
            nextRecordIndex = nextRecord.originalIndex;
        }

        let willShiftNext = false;
        if (nextRecord && oldEnd !== end) {
            willShiftNext = true;
        }

        // Smart Conflict Detection (bypass next record if shifting)
        const isOverlap = records.some(r => {
            if (String(r.id) === String(id)) return false;
            if (type && r.type === type) return false;
            if (willShiftNext && String(r.id) === String(nextRecord.id)) return false;
            const rs = parseDate(r.start);
            const re = parseDate(r.end);
            return (parseDate(start) <= re && parseDate(end) >= rs);
        });

        if (isOverlap) {
            return Swal.fire('Overlap Detected! ⚠️', 'These dates overlap with another existing period for this employee.', 'error');
        }

        records[index] = { id, type, start, end };
        
        if (willShiftNext) {
            const nextStart = addOneDay(end);
            records[nextRecordIndex].start = nextStart;
            if (parseDate(nextStart) > parseDate(records[nextRecordIndex].end)) {
                records[nextRecordIndex].end = nextStart;
            }
        }

        saveData();
        updateStats();
        inlineEditingId = null;
        renderTable();
    }

    function cancelInlineEdit() {
        inlineEditingId = null;
        renderTable();
    }
    function deleteRecord(id) {
        Swal.fire({
            title: 'Are you sure?',
            html: 'Do you really want to delete this?<br>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--secondary)',
            confirmButtonText: 'Yes, delete it! ',
            cancelButtonText: 'Cancel ',
            background: 'var(--card-bg)',
            color: 'var(--text-main)',
            backdrop: 'rgba(0,0,0,0.6)'
        }).then((result) => {
            if (result.isConfirmed) {
                records = records.filter(r => String(r.id) !== String(id));
                if(String(inlineEditingId) === String(id)) cancelInlineEdit();
                saveData(); renderTable(); updateStats();
                
                Swal.fire({
                    title: 'Deleted!',
                    html: 'The record has been removed.<br>',
                    icon: 'success',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }
    function clearAllRecords() {
        Swal.fire({
            title: 'Delete All?',
            html: 'Do you really want to delete ALL records?<br>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--secondary)',
            confirmButtonText: 'Yes, delete all! ',
            cancelButtonText: 'Cancel ',
            background: 'var(--card-bg)',
            color: 'var(--text-main)',
            backdrop: 'rgba(0,0,0,0.6)'
        }).then((result) => {
            if (result.isConfirmed) {
                records = []; saveData(); renderTable(); updateStats();
                Swal.fire({
                    title: 'Deleted!',
                    html: 'All records have been removed.<br>',
                    icon: 'success',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    function renderTable() {
        const tbody = document.getElementById('recordsBody');
        const searchTerm = (document.getElementById('rotationSearchInput') ? document.getElementById('rotationSearchInput').value.toLowerCase() : '');
        
        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div>🗑️</div><h3>No records found</h3></div></td></tr>`;
            return;
        }
        records.sort((a, b) => (parseDate(a.start) > parseDate(b.start) ? 1 : -1));
        let html = '';
        let displayedCount = 0;
        
        for (let i = 0; i < records.length; i += 3) {
            const cycleRecords = records.slice(i, i + 3);
            const cycleNum = Math.floor(i / 3) + 1;
            
            const matchedRecords = cycleRecords.filter(r => {
                if (!searchTerm) return true;
                const matchType = r.type && r.type.toLowerCase().includes(searchTerm);
                const matchStart = r.start && r.start.toLowerCase().includes(searchTerm);
                const matchEnd = r.end && r.end.toLowerCase().includes(searchTerm);
                const matchCycle = String(cycleNum).includes(searchTerm);
                return matchType || matchStart || matchEnd || matchCycle;
            });

            matchedRecords.forEach((r, idx) => {
                displayedCount++;
                if (r.id === inlineEditingId) {
                    html += `<tr>
                        <td data-label="Cycle" style="text-align:center;">${idx === 0 ? `<span class="cycle-tag">Cycle ${cycleNum}</span>` : ''}</td>
                        <td data-label="Type" style="text-align:center;">
                            <select id="inline-type-${r.id}" class="inline-input">
                                <option value="work" ${r.type==='work'?'selected':''}>Work</option>
                                <option value="leave" ${r.type==='leave'?'selected':''}>Leave</option>
                                <option value="rest" ${r.type==='rest'?'selected':''}>Rest</option>
                            </select>
                        </td>
                        <td data-label="Start" style="text-align:center;"><input type="text" id="inline-start-${r.id}" class="inline-input" value="${r.start}"></td>
                        <td data-label="End" style="text-align:center;"><input type="text" id="inline-end-${r.id}" class="inline-input" value="${r.end}"></td>
                        <td data-label="Days" style="text-align:center;"><strong><span id="inline-days-${r.id}">${daysBetween(r.start, r.end)}</span></strong> days</td>
                        <td data-label="Actions" style="text-align:center;">
                            <div class="action-btns" style="justify-content:center; gap:8px;">
                                <button class="icon-btn inline-save-btn" onclick="saveInlineEdit('${r.id}')" title="Save">💾</button>
                                <button class="icon-btn delete-btn" onclick="cancelInlineEdit()" title="Cancel">✖</button>
                            </div>
                        </td>
                    </tr>`;
                } else {
                    let badge = r.type === 'work' ? 'badge-work' : (r.type === 'rest' ? 'badge-rest' : 'badge-leave');
                    let label = r.type === 'work' ? 'Work' : (r.type === 'rest' ? 'Rest' : 'Leave');
                    let rowStyle = '';
                    let actionHtml = `<button class="icon-btn edit-btn" onclick="editRecord('${r.id}')">✏️</button>
                            <button class="icon-btn delete-btn" onclick="deleteRecord('${r.id}')">✖</button>`;
                            
                    if (r.isOverride) {
                        rowStyle = 'background-color: rgba(139, 92, 246, 0.1); border-left: 3px solid #8b5cf6;';
                        actionHtml = `<button class="icon-btn delete-btn" onclick="deleteOverride('${r.id}')" title="Remove Override">✖</button>`;
                        if (r.type === 'sick_leave') {
                            badge = '';
                            label = '<span style="background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Sick Leave</span>';
                        } else if (r.type === 'standby_cover') {
                            badge = '';
                            label = '<span style="background: #10b981; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Standby Cover</span>';
                        }
                    }

                    html += `<tr style="${rowStyle}">
                        <td data-label="Cycle" style="text-align:center;">${idx === 0 && !r.isOverride ? `<span class="cycle-tag">Cycle ${cycleNum}</span>` : (r.isOverride ? '⚠️' : '')}</td>
                        <td data-label="Type" style="text-align:center;">${r.isOverride ? label : `<span class="badge ${badge}">${label}</span>`}</td>
                        <td data-label="Start" style="text-align:center;">${formatDisplayDate(r.start)}</td>
                        <td data-label="End" style="text-align:center;">${formatDisplayDate(r.end)}</td>
                        <td data-label="Days" style="text-align:center;"><strong>${daysBetween(r.start, r.end)}</strong> days</td>
                        <td data-label="Actions" style="text-align:center;"><div class="action-btns" style="justify-content:center;">
                            ${actionHtml}
                        </div></td>
                    </tr>`;
                }
            });
            if (i + 3 < records.length && matchedRecords.length > 0) html += `<tr><td colspan="6" style="border-bottom: 2px dashed #cbd5e1; padding:0;"></td></tr>`;
        }
        
        if (displayedCount === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div>🔍</div><h3>No matching records found</h3></div></td></tr>`;
        } else {
            tbody.innerHTML = html;
        }
        
        if (inlineEditingId) {
            const updateInlineDays = () => {
                const s = document.querySelector(`#inline-start-${inlineEditingId}`).value;
                const e = document.querySelector(`#inline-end-${inlineEditingId}`).value;
                if(s && e) {
                    document.getElementById(`inline-days-${inlineEditingId}`).innerText = daysBetween(s, e);
                }
            };
            flatpickr(`#inline-start-${inlineEditingId}`, { altInput: true, altFormat: "d M Y", dateFormat: 'Y-m-d', onChange: updateInlineDays });
            flatpickr(`#inline-end-${inlineEditingId}`, { altInput: true, altFormat: "d M Y", dateFormat: 'Y-m-d', onChange: updateInlineDays });
        }
        
        // 3. Render Timeline
        renderTimeline();
    }
    
    function checkOverlap(start, end, excludeId, type) {
        const s = parseDate(start);
        const e = parseDate(end);
        return records.some(r => {
            if (String(r.id) === String(excludeId)) return false;
            if (type && r.type === type) return false;
            const rs = parseDate(r.start);
            const re = parseDate(r.end);
            return (s <= re && e >= rs); // Overlap condition
        });
    }

    function renderTimeline() {
        const container = document.getElementById('timelineContainer');
        const chart = document.getElementById('timelineChart');
        const labels = document.getElementById('timelineLabels');
        if (records.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';
        chart.innerHTML = '';
        
        // Find min and max dates
        let min = Number.MAX_VALUE;
        let max = 0;
        records.forEach(r => {
            const s = parseDate(r.start).getTime();
            const e = parseDate(r.end).getTime();
            if (s < min) min = s;
            if (e > max) max = e;
        });
        
        const totalDuration = max - min;
        
        // If all same day or error
        if (totalDuration === 0) {
            chart.innerHTML = '<div style="color:white; padding:10px; text-align:center;">Not enough time span</div>';
            return;
        }
        
        // Render bars
        records.forEach(r => {
            const s = parseDate(r.start).getTime();
            const e = parseDate(r.end).getTime();
            const leftPct = ((s - min) / totalDuration) * 100;
            const widthPct = ((e - s) / totalDuration) * 100;
            
            let color = '#3b82f6'; // default leave blue
            if (r.type === 'work') color = '#10b981'; // green
            if (r.type === 'rest') color = '#f59e0b'; // orange
            
            const bar = document.createElement('div');
            bar.style.position = 'absolute';
            bar.style.left = leftPct + '%';
            bar.style.width = widthPct + '%';
            bar.style.height = '100%';
            bar.style.backgroundColor = color;
            bar.style.opacity = '0.8';
            bar.style.borderRight = '2px solid rgba(255,255,255,0.2)';
            bar.style.borderLeft = '2px solid rgba(255,255,255,0.2)';
            bar.title = `${r.type.toUpperCase()}: ${r.start} to ${r.end} (Click for daily view)`;
            bar.style.cursor = 'pointer';
            
            const duration = daysBetween(r.start, r.end);
            if (duration > 0) {
                bar.style.display = 'flex';
                bar.style.alignItems = 'center';
                bar.style.justifyContent = 'center';
                bar.style.color = '#ffffff';
                bar.style.fontSize = '13px';
                bar.style.fontWeight = 'bold';
                bar.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
                bar.style.overflow = 'hidden';
                bar.innerText = duration;
            }
            
            // Hover effect
            bar.onmouseover = () => { bar.style.opacity = '1'; bar.style.boxShadow = '0 0 10px ' + color; };
            bar.onmouseout = () => { bar.style.opacity = '0.8'; bar.style.boxShadow = 'none'; };
            
            bar.onclick = () => showDailyGrid(r);
            
            chart.appendChild(bar);
        });
        
        labels.innerHTML = `<span>${formatDisplayDate(new Date(min).toISOString().split('T')[0])}</span><span>${formatDisplayDate(new Date(max).toISOString().split('T')[0])}</span>`;
    }

    function hideDailyGrid() {
        document.getElementById('dailyGridContainer').style.display = 'none';
        document.getElementById('backToTimelineBtn').style.display = 'none';
        
        document.getElementById('timelineChart').style.display = 'block';
        document.getElementById('timelineLabels').style.display = 'flex';
        document.getElementById('timelineTitle').innerHTML = '📅 Rotations Timeline';
    }

    function showDailyGrid(record) {
        document.getElementById('timelineChart').style.display = 'none';
        document.getElementById('timelineLabels').style.display = 'none';
        
        document.getElementById('dailyGridContainer').style.display = 'block';
        document.getElementById('backToTimelineBtn').style.display = 'inline-block';
        
        const typeTitle = record.type === 'work' ? 'Work' : (record.type === 'leave' ? 'Leave' : 'Rest');
        document.getElementById('timelineTitle').innerHTML = `📅 Daily Attendance: ${typeTitle} (${record.start} to ${record.end})`;
        
        const grid = document.getElementById('dailyGrid');
        grid.innerHTML = '';
        
        let color = '#3b82f6'; // leave
        if (record.type === 'work') color = '#10b981';
        if (record.type === 'rest') color = '#f59e0b';
        
        const start = parseDate(record.start);
        const end = parseDate(record.end);
        let curr = new Date(start);
        
        while (curr <= end) {
            const sq = document.createElement('div');
            sq.style.width = '100%';
            sq.style.aspectRatio = '1 / 1';
            sq.style.backgroundColor = color;
            sq.style.borderRadius = '4px';
            sq.style.opacity = '0.9';
            sq.style.transition = 'all 0.2s ease';
            sq.style.cursor = 'pointer';
            sq.style.display = 'flex';
            sq.style.flexDirection = 'column';
            sq.style.alignItems = 'center';
            sq.style.justifyContent = 'center';
            sq.style.color = '#ffffff';
            sq.style.fontSize = '14px';
            sq.style.fontWeight = 'bold';
            sq.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
            
            // Format current date
            const yyyy = curr.getFullYear();
            const mm = String(curr.getMonth() + 1).padStart(2, '0');
            const dd = String(curr.getDate()).padStart(2, '0');
            
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = days[curr.getDay()];
            
            sq.innerHTML = `<span style="font-size: 10px; opacity: 0.85; font-weight: 500; margin-bottom: 2px;">${dayName}</span>
                            <span>${curr.getDate()}</span>`;
            
            const dateStr = formatDisplayDate(`${yyyy}-${mm}-${dd}`);
            
            sq.title = `${dateStr} - ${typeTitle}`;
            
            sq.onmouseover = () => { sq.style.transform = 'scale(1.2)'; sq.style.opacity = '1'; sq.style.boxShadow = '0 0 8px ' + color; sq.style.zIndex = '10'; sq.style.position = 'relative'; };
            sq.onmouseout = () => { sq.style.transform = 'scale(1)'; sq.style.opacity = '0.9'; sq.style.boxShadow = 'none'; sq.style.zIndex = '1'; sq.style.position = 'static'; };
            
            grid.appendChild(sq);
            
            curr.setDate(curr.getDate() + 1);
        }
    }

    function updateStats() {
        let w=0, l=0;
        records.forEach(r => {
            const d = daysBetween(r.start, r.end);
            if(r.type === 'work') w += d; if(r.type === 'leave') l += d;
        });
        document.getElementById('totalCycles').innerText = Math.ceil(records.length / 3);
        document.getElementById('totalWork').innerText = w;
        document.getElementById('totalLeave').innerText = l;
        document.getElementById('balance').innerText = w - l;
    }
    function exportToCSV() {
        if(!records.length) return alert('لا يوجد بيانات');
        let csv = "Cycle,Type,Start Date,End Date,Days\n";
        records.forEach((r, i) => {
            const label = r.type === 'work' ? 'Work' : (r.type === 'rest' ? 'Rest' : 'Leave');
            csv += `${Math.floor(i/3)+1},${label},${formatDisplayDate(r.start)},${formatDisplayDate(r.end)},${daysBetween(r.start, r.end)}\n`;
        });
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}));
        a.download = 'دورات.csv'; a.click();
    }

    // ---------------------------------
    // Employees Logic
    // ---------------------------------
    let employees = [];
    let initialEmployeesLoad = true;

    db.collection("employees").onSnapshot((snapshot) => {
        if (snapshot.empty && initialEmployeesLoad) {
            initialEmployeesLoad = false;
            let localData = [];
            try {
                const stored = localStorage.getItem('hrEmployeesData');
                if (stored) localData = JSON.parse(stored);
                else if (typeof EMPLOYEE_DATA !== 'undefined') localData = EMPLOYEE_DATA;
            } catch(e) {
                if (typeof EMPLOYEE_DATA !== 'undefined') localData = EMPLOYEE_DATA;
            }
            if (localData.length > 0) {
                employees = localData;
                saveEmployeesData(); 
            }
        } else {
            initialEmployeesLoad = false;
            employees = [];
            snapshot.forEach(doc => employees.push(doc.data()));
            employees.forEach(e => {
                if (!e.Destination && e.Department) e.Destination = e.Department;
            });
            filteredEmployees = [...employees];
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initEmployees();
                initCharts();
                if (typeof filterEmployees === 'function') filterEmployees();
            }
        }
    });

    async function saveEmployeesData() {
        const chunkSize = 450;
        for (let i = 0; i < employees.length; i += chunkSize) {
            const chunk = employees.slice(i, i + chunkSize);
            const batch = db.batch();
            chunk.forEach(emp => {
                const docRef = db.collection("employees").doc(String(emp.ID));
                batch.set(docRef, emp);
            });
            await batch.commit().catch(e => console.error("Firebase sync error on chunk", e));
        }
    }
    
    function populateCompanyAndDestDropdowns() {
        const companies = new Set();
        const destinations = new Set();

        employees.forEach(e => {
            if (e.Company && e.Company !== 'N/A') companies.add(e.Company);
            if (e.Destination && e.Destination !== 'N/A') destinations.add(e.Destination);
        });

        // Add predefined companies
        const predefinedCompanies = ["Salsala", "Al-Lord", "Al-Tamimi", "Petroneer", "Bin Hader", "Bahesabi", "Ibn Mubarak", "HCCC"];
        predefinedCompanies.forEach(c => companies.add(c));

        // Predefined Destinations (geographic regions only)
        const predefinedDestinations = ["Seiyoun", "Mukalla", "Al Shihr", "Sah", "Al Radood", "Rawk", "Hikmah", "Ba'alal", "Sharyoof", "Al Gharaf", "Tarim", "Wadi Bin Ali", "Tamran", "Al Qatn", "Shibam", "Tarbah", "Block 14", "Block 10", "Block 51", "Labnah"];
        predefinedDestinations.forEach(d => destinations.add(d));

        // Predefined Departments (job departments only)
        const predefinedDepartments = ["Operations", "IT", "HSE", "Maintenance", "Management", "HR", "Finance", "Logistics", "ESP"];

        const sortedCompanies = Array.from(companies).sort();
        const sortedDestinations = Array.from(destinations).sort();

        const companyOptions = `<option value="">Select...</option>` + sortedCompanies.map(c => `<option value="${c}">${c}</option>`).join('') + `<option value="ADD_NEW" style="font-weight:bold;color:#f9a826;">+ أضف جديد (Add New...)</option>`;
        const destOptions = `<option value="">Select...</option>` + sortedDestinations.map(d => `<option value="${d}">${d}</option>`).join('') + `<option value="ADD_NEW" style="font-weight:bold;color:#f9a826;">+ أضف جديد (Add New...)</option>`;
        const deptOptions = `<option value="">Select...</option>` + predefinedDepartments.map(d => `<option value="${d}">${d}</option>`).join('') + `<option value="ADD_NEW" style="font-weight:bold;color:#f9a826;">+ أضف جديد (Add New...)</option>`;

        ['newEmpCompany', 'editEmpCompany'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                const currentVal = el.value;
                el.innerHTML = companyOptions;
                if(currentVal && currentVal !== 'ADD_NEW') el.value = currentVal;
            }
        });

        ['newEmpDest', 'editEmpDest', 'visitorDest'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                const currentVal = el.value;
                el.innerHTML = destOptions;
                if(currentVal && currentVal !== 'ADD_NEW') el.value = currentVal;
            }
        });

        ['newEmpDept', 'editEmpDept'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                const currentVal = el.value;
                el.innerHTML = deptOptions;
                if(currentVal && currentVal !== 'ADD_NEW') el.value = currentVal;
            }
        });
    }

    function handleSelectChange(selectEl, type) {
        if (selectEl.value === 'ADD_NEW') {
            Swal.fire({
                title: type === 'company' ? 'أدخل اسم الشركة الجديدة' : 'أدخل اسم القسم الجديد',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'إضافة',
                cancelButtonText: 'إلغاء'
            }).then((result) => {
                if (result.isConfirmed && result.value.trim() !== '') {
                    const newVal = result.value.trim();
                    const opt = document.createElement('option');
                    opt.value = newVal;
                    opt.textContent = newVal;
                    selectEl.insertBefore(opt, selectEl.lastElementChild);
                    selectEl.value = newVal;
                } else {
                    selectEl.value = '';
                }
            });
        }
    }

    let filteredEmployees = [...employees];
    let sortCol = '';
    let sortAsc = true;
    let currentChartFilter = null; // 'work', 'leave', 'missing'

    function initEmployees() {
        // Unique Companies and Departments
        const companies = [...new Set(employees.map(e => e.Company).filter(Boolean))].sort();
        const depts = [...new Set(employees.map(e => e.Destination).filter(Boolean))].sort();

        // Call it to populate Add/Edit modals
        populateCompanyAndDestDropdowns();

        renderEmployees();
    }

    function filterEmployees() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const todayNum = parseDate(formatDateRaw(new Date())).getTime();
        filteredEmployees = employees.filter(e => {
            const matchSearch = (e.Name && e.Name.toLowerCase().includes(search)) || 
                                (e.ID && String(e.ID).toLowerCase().includes(search)) ||
                                (e.Company && e.Company.toLowerCase().includes(search)) ||
                                (e.Destination && e.Destination.toLowerCase().includes(search));
            
            if (!matchSearch) return false;
            
            let baseStatus = 'missing';
            if (e.Rotations && e.Rotations.length > 0) {
                e.Rotations.forEach(r => {
                    const startNum = parseDate(r.start).getTime();
                    const endNum = parseDate(r.end).getTime();
                    if (todayNum >= startNum && todayNum <= endNum) {
                        baseStatus = (r.type === 'rest' || r.type === 'leave') ? 'leave' : r.type;
                    }
                });
            }
            
            let currentStatus = baseStatus;
            
            if (e.Overrides) {
                e.Overrides.forEach(ov => {
                    const oStart = parseDate(ov.start).getTime();
                    const oEnd = parseDate(ov.end).getTime();
                    if (todayNum >= oStart && todayNum <= oEnd) {
                        currentStatus = ov.type;
                    }
                });
            }
            
            if (currentStatus === 'standby_cover') currentStatus = 'work';
            
            if (currentChartFilter && currentStatus !== currentChartFilter) return false;
            
            return true;
        });

        // re-apply sort
        if (sortCol) sortEmployees(sortCol, true);
        else renderEmployees();
    }

    function sortEmployees(col, keepDirection = false) {
        if (!keepDirection) {
            if (sortCol === col) sortAsc = !sortAsc;
            else { sortCol = col; sortAsc = true; }
        }

        filteredEmployees.sort((a, b) => {
            let valA = a[col] || ''; let valB = b[col] || '';
            if (col === 'ID') { valA = parseFloat(valA)||0; valB = parseFloat(valB)||0; }
            else { valA = String(valA).toLowerCase(); valB = String(valB).toLowerCase(); }
            
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA> valB) return sortAsc ? 1 : -1;
            return 0;
        });

        // Update Headers UI
        document.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        document.getElementById('sort-' + col).classList.add(sortAsc ? 'sort-asc' : 'sort-desc');

        renderEmployees();
    }

    function renderEmployees() {
        const tbody = document.getElementById('employeesBody');
        if (filteredEmployees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div>🔍</div><h3>لا توجد نتائج</h3></div></td></tr>`;
            return;
        }

        let html = '';
        const d = new Date();
        const todayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayNum = parseDate(todayStr).getTime();

        filteredEmployees.forEach(e => {
            let totalWork = 0;
            let totalLeave = 0;
            let baseStatus = 'unknown';
            if (e.Rotations) {
                e.Rotations.forEach(r => {
                    const days = daysBetween(r.start, r.end);
                    if (r.type === 'work') totalWork += days;
                    if (r.type === 'leave' || r.type === 'rest') totalLeave += days;

                    const startNum = parseDate(r.start).getTime();
                    const endNum = parseDate(r.end).getTime();
                    
                    if (todayNum >= startNum && todayNum <= endNum) {
                        baseStatus = r.type;
                    }
                });
            }

            let currentStatus = baseStatus;
            
            // Check Overrides
            let activeOverride = null;
            if (e.Overrides) {
                e.Overrides.forEach(ov => {
                    const oStart = parseDate(ov.start).getTime();
                    const oEnd = parseDate(ov.end).getTime();
                    if (todayNum >= oStart && todayNum <= oEnd) {
                        activeOverride = ov;
                    }
                });
            }
            
            if (activeOverride) {
                currentStatus = activeOverride.type;
            }

            let statusDot = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#f59e0b; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #f59e0b;" title="Missing/Expired Rotation"></span>`;
            if (currentStatus === 'work' || currentStatus === 'standby_cover') {
                statusDot = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #10b981;" title="ON (At Work)"></span>`;
            } else if (currentStatus === 'leave' || currentStatus === 'rest') {
                statusDot = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#ffffff; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px rgba(255,255,255,0.5);" title="OFF (On Leave)"></span>`;
            } else if (currentStatus === 'sick_leave') {
                statusDot = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#ef4444; margin-right:8px; vertical-align:middle; box-shadow: 0 0 8px #ef4444;" title="SL (Sick Leave)"></span>`;
            }

            let avatarHtml = '';
            if (e.profilePic) {
                avatarHtml = `<img src="${e.profilePic}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 8px; border: 1px solid var(--glass-border);">`;
            } else {
                let initial = e.Name ? e.Name.charAt(0).toUpperCase() : '?';
                avatarHtml = `<div style="display:inline-flex; width: 28px; height: 28px; border-radius: 50%; background: var(--glass-bg); border: 1px solid var(--glass-border); vertical-align: middle; margin-right: 8px; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: var(--text-muted);">${initial}</div>`;
            }

            html += `<tr>
                <td data-label="ID"><strong>${e.ID || '-'}</strong></td>
                <td data-label="Name" style="display:flex; align-items:center;">${statusDot}${avatarHtml}${e.Name || '-'}</td>
                <td data-label="Company">🏢 ${e.Company || '-'}</td>
                <td data-label="Department">💼 ${e.Department || '-'}</td>
                <td data-label="Destination">📍 ${e.Destination || '-'}</td>
                <td data-label="Actions" class="actions-col" style="text-align:center; white-space: nowrap;">
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 13px; border-color: #f59e0b; color: #f59e0b; margin-right: 5px;" onclick="openEditEmployeeModal('${e.ID}')">Edit</button>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 13px;" onclick="viewEmployeeRotations('${e.ID}')">Rotations </button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    // Init All
    window.onload = function() {
        // Rotations
        if (selectedEmployeeId) loadData();
        renderTable();
        updateStats();
        // Employees
        initEmployees();
        initCharts();
        
        // Initialize Movements Date Picker
        flatpickr('#movementsDate', {
            allowInput: true,
            altInput: true,
            altInputClass: 'custom-date-input',
            altFormat: "d M Y",
            dateFormat: "Y-m-d",
            onChange: function() {
                renderMovements();
            }
        });

        // Initialize Visitor Date Picker
        flatpickr('#visitorDate', {
            allowInput: true,
            altInput: true,
            altInputClass: 'custom-date-input',
            altFormat: "d M Y",
            dateFormat: "Y-m-d"
        });
    };

    // --- 4. ✈️ Daily Movements Logic ---
    function renderMovements() {
        const dateStr = document.getElementById('movementsDate').value;
        if (!dateStr) return;
        
        const targetDate = parseDate(dateStr).getTime();
        
        let arrivals = [];
        let departures = [];
        
        employees.forEach(emp => {
            if (!emp.Rotations) return;
            emp.Rotations.forEach(r => {
                const start = parseDate(r.start).getTime();
                
                if (start === targetDate) {
                    const duration = daysBetween(r.start, r.end);
                    if (r.type === 'work') {
                        arrivals.push({ emp, duration, end: r.end });
                    } else if (r.type === 'leave' || r.type === 'rest') {
                        departures.push({ emp, duration, end: r.end, type: r.type });
                    }
                }
            });
        });

        if (typeof visitorsData !== 'undefined') {
            visitorsData.forEach(v => {
                if (parseDate(v.date).getTime() === targetDate) {
                    if (v.type === 'work') arrivals.push({ emp: v, duration: 'N/A', end: 'N/A', isVisitor: v.isVisitor, isCustom: true });
                    else departures.push({ emp: v, duration: 'N/A', end: 'N/A', type: v.type, isVisitor: v.isVisitor, isCustom: true });
                }
            });
        }

        // Render Arrivals
        document.getElementById('arrivalsCount').innerText = arrivals.length;
        const arrHtml = arrivals.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.5); padding: 20px;">No arrivals found for this date.</td></tr>' : 
            arrivals.map((a, idx) => `
            <tr>
                <td data-label="ID" style="text-align: center; font-weight: bold; color: ${a.isCustom ? '#3b82f6' : '#10b981'};">
                    ${a.isVisitor ? 'VISITOR' : a.emp.ID || a.emp.id}
                    ${a.isCustom ? `<br><button onclick="deleteVisitor('${a.emp.id}')" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:12px;margin-top:5px;">Remove</button>` : ''}
                </td>
                <td data-label="Name">
                    <div style="font-weight: 600; color: white;">${a.emp.Name}</div>
                </td>
                <td data-label="Company">🏢 ${a.emp.Company}</td>
                <td data-label="Destination">📍 ${a.isVisitor ? (a.emp.Destination || 'Unknown') : 'CPF'}</td>
                <td data-label="Remarks">
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7);">
                        🗓️ Work Period: ${a.duration} ${a.duration !== 'N/A' ? 'days' : ''}<br>
                        ${a.end !== 'N/A' ? `<span style="font-size: 11px; opacity: 0.7;">(until ${a.end})</span>` : ''}
                    </div>
                </td>
            </tr>`).join('');
        document.getElementById('arrivalsList').innerHTML = arrHtml;
        
        // Render Departures
        document.getElementById('departuresCount').innerText = departures.length;
        const depHtml = departures.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.5); padding: 20px;">No departures found for this date.</td></tr>' : 
            departures.map((d, idx) => `
            <tr>
                <td data-label="ID" style="text-align: center; font-weight: bold; color: ${d.isCustom ? '#3b82f6' : '#f59e0b'};">
                    ${d.isVisitor ? 'VISITOR' : d.emp.ID || d.emp.id}
                    ${d.isCustom ? `<br><button onclick="deleteVisitor('${d.emp.id}')" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:12px;margin-top:5px;">Remove</button>` : ''}
                </td>
                <td data-label="Name">
                    <div style="font-weight: 600; color: white;">${d.emp.Name}</div>
                </td>
                <td data-label="Company">🏢 ${d.emp.Company}</td>
                <td data-label="Destination">📍 ${d.emp.Destination || 'Unknown'}</td>
                <td data-label="Remarks">
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7);">
                        🗓️ ${d.type === 'leave' ? 'Leave' : 'Rest'}: ${d.duration} ${d.duration !== 'N/A' ? 'days' : ''}<br>
                        ${d.end !== 'N/A' ? `<span style="font-size: 11px; opacity: 0.7;">(until ${d.end})</span>` : ''}
                    </div>
                </td>
            </tr>`).join('');
        document.getElementById('departuresList').innerHTML = depHtml;
    }

    async function exportEmployeesDirectory() {
        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading. Please try again in a moment.', 'error');
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rotations System';
        workbook.lastModifiedBy = 'Rotations System';
        workbook.created = new Date();
        
        const sheet = workbook.addWorksheet('Employees Directory');
        
        sheet.columns = [
            { width: 8 },  // A: #
            { width: 15 }, // B: ID
            { width: 35 }, // C: Name
            { width: 25 }, // D: Company
            { width: 20 }, // E: Destination
            { width: 20 }, // F: Phone
            { width: 20 }, // G: Total Work (Days)
            { width: 20 }  // H: Total Leave (Days)
        ];

        const titleRow = sheet.addRow(['Employees Directory']);
        titleRow.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.mergeCells('A1:H1');
        titleRow.height = 30;

        let rowCounter = 1;
        
        // Add export info
        rowCounter++;
        const infoRow = sheet.getRow(rowCounter);
        infoRow.getCell(1).value = `Generated on: ${new Date().toLocaleDateString()}`;
        infoRow.font = { italic: true, color: { argb: 'FF64748B' } };
        sheet.mergeCells(`A${rowCounter}:H${rowCounter}`);
        
        rowCounter++;
        
        const headers = ['#', 'ID', 'Name', 'Company', 'Destination', 'Phone', 'Total Work (Days)', 'Total Leave (Days)'];
        const headerRow = sheet.getRow(rowCounter);
        headers.forEach((h, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' }
            };
        });
        
        // Filter logic is same as table
        const search = document.getElementById('searchInput').value.toLowerCase();
        const filtered = employees.filter(e => {
            if (!search) return true;
            return (e.Name && e.Name.toLowerCase().includes(search)) || 
                   (e.ID && String(e.ID).toLowerCase().includes(search)) ||
                   (e.Company && e.Company.toLowerCase().includes(search)) ||
                   (e.Destination && e.Destination.toLowerCase().includes(search));
        });
        
        filtered.forEach((e, idx) => {
            rowCounter++;
            const row = sheet.getRow(rowCounter);
            
            let totalWork = 0;
            let totalLeave = 0;
            if (e.Rotations) {
                e.Rotations.forEach(r => {
                    const days = daysBetween(r.start, r.end);
                    if (r.type === 'work') totalWork += days;
                    if (r.type === 'leave' || r.type === 'rest') totalLeave += days;
                });
            }

            const rowData = [
                idx + 1, e.ID, e.Name, e.Company, e.Destination, e.Phone || '-', totalWork, totalLeave
            ];
            
            rowData.forEach((val, i) => {
                const cell = row.getCell(i + 1);
                cell.value = val;
                cell.alignment = { horizontal: i === 2 ? 'left' : 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Employees_Directory_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function exportEmployeeProfile() {
        if (!selectedEmployeeId) return;
        const emp = employees.find(e => String(e.ID) === selectedEmployeeId);
        if (!emp) return;

        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading.', 'error');
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rotations System';
        const sheet = workbook.addWorksheet('Profile & Rotations');

        sheet.columns = [
            { width: 5 }, { width: 15 }, { width: 25 }, { width: 20 }, { width: 20 }
        ];

        // Header section
        sheet.mergeCells('B2:E2');
        const h1 = sheet.getCell('B2');
        h1.value = `Employee Profile: ${emp.Name}`;
        h1.font = { size: 16, bold: true };

        sheet.getCell('B4').value = 'Employee ID:'; sheet.getCell('C4').value = emp.ID;
        sheet.getCell('D4').value = 'Company:'; sheet.getCell('E4').value = emp.Company;

        sheet.getCell('B5').value = 'Destination:'; sheet.getCell('C5').value = emp.Destination;
        sheet.getCell('D5').value = 'Phone:'; sheet.getCell('E5').value = emp.Phone || 'N/A';

        // Stats
        sheet.getCell('B7').value = 'Total Cycles:'; sheet.getCell('C7').value = document.getElementById('totalCycles').innerText;
        sheet.getCell('D7').value = 'Balance:'; sheet.getCell('E7').value = document.getElementById('balance').innerText;

        sheet.getCell('B8').value = 'Total Work:'; sheet.getCell('C8').value = document.getElementById('totalWork').innerText;
        sheet.getCell('D8').value = 'Total Leave:'; sheet.getCell('E8').value = document.getElementById('totalLeave').innerText;

        // Bold labels
        ['B4','D4','B5','D5','B7','D7','B8','D8'].forEach(cell => {
            sheet.getCell(cell).font = { bold: true };
        });

        // Rotations Table
        let rowCounter = 11;
        const headers = ['#', 'Type', 'Start Date', 'End Date', 'Duration (Days)'];
        const headerRow = sheet.getRow(rowCounter);
        headers.forEach((h, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
            cell.alignment = { horizontal: 'center' };
        });

        if (emp.Rotations && emp.Rotations.length > 0) {
            // sort descending
            const sorted = [...emp.Rotations].sort((a,b) => parseDate(b.start) - parseDate(a.start));
            sorted.forEach((r, idx) => {
                rowCounter++;
                const row = sheet.getRow(rowCounter);
                const typeLabel = r.type === 'work' ? 'Work' : (r.type === 'leave' ? 'Leave' : 'Rest');
                const rowData = [idx + 1, typeLabel, r.start, r.end, daysBetween(r.start, r.end)];
                rowData.forEach((val, i) => {
                    const cell = row.getCell(i + 1);
                    cell.value = val;
                    cell.alignment = { horizontal: 'center' };
                });
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Profile_${emp.ID}_${emp.Name}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function exportManifest() {
        const dateStr = document.getElementById('movementsDate').value;
        if (!dateStr) return Swal.fire('Warning', 'Please select a date first.', 'warning');
        
        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading. Please try again in a moment.', 'error');
        }

        const targetDate = parseDate(dateStr).getTime();
        let arrivals = [];
        let departures = [];
        
        employees.forEach(emp => {
            if (!emp.Rotations) return;
            emp.Rotations.forEach(r => {
                if (parseDate(r.start).getTime() === targetDate) {
                    const duration = daysBetween(r.start, r.end);
                    if (r.type === 'work') arrivals.push({ emp, duration, end: r.end });
                    else departures.push({ emp, duration, end: r.end, type: r.type });
                }
            });
        });

        if (typeof visitorsData !== 'undefined') {
            visitorsData.forEach(v => {
                if (parseDate(v.date).getTime() === targetDate) {
                    if (v.type === 'work') arrivals.push({ emp: v, duration: 'N/A', end: 'N/A', isVisitor: true });
                    else departures.push({ emp: v, duration: 'N/A', end: 'N/A', type: v.type, isVisitor: true });
                }
            });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Daily Manifest');

        sheet.columns = [
            { width: 5 },  // A: #
            { width: 12 }, // B: ID
            { width: 35 }, // C: Name
            { width: 25 }, // D: Company
            { width: 20 }, // E: Destination
            { width: 25 }, // F: Duration
            { width: 15 }  // G: End Date
        ];

        let rowCounter = 1;

        // Title
        sheet.mergeCells(`A${rowCounter}:G${rowCounter}`);
        const titleRow = sheet.getRow(rowCounter);
        titleRow.getCell(1).value = 'DAILY MOVEMENTS MANIFEST';
        titleRow.getCell(1).font = { name: 'Arial Black', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleRow.getCell(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FF0F172A' } };
        titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        titleRow.height = 35;
        rowCounter++;

        // Date Subtitle
        sheet.mergeCells(`A${rowCounter}:G${rowCounter}`);
        const dateRow = sheet.getRow(rowCounter);
        dateRow.getCell(1).value = `Date: ${dateStr}`;
        dateRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF1E293B' } };
        dateRow.getCell(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFE2E8F0' } };
        dateRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        dateRow.height = 25;
        rowCounter++;
        
        rowCounter++; // Empty row

        const addTable = (title, titleBg, headerBg, data, isArrival) => {
            sheet.mergeCells(`A${rowCounter}:G${rowCounter}`);
            const secTitle = sheet.getRow(rowCounter);
            secTitle.getCell(1).value = title;
            secTitle.getCell(1).font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
            secTitle.getCell(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb: titleBg } };
            secTitle.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
            secTitle.height = 25;
            rowCounter++;

            const headers = ['#', 'ID', 'Name', 'Company', 'Destination', isArrival ? 'Work Period (Days)' : 'Leave/Rest Duration', 'End Date'];
            const headerRow = sheet.getRow(rowCounter);
            headers.forEach((h, i) => {
                const cell = headerRow.getCell(i + 1);
                cell.value = h;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb: headerBg } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            });
            headerRow.height = 22;
            rowCounter++;

            if (data.length === 0) {
                sheet.mergeCells(`A${rowCounter}:G${rowCounter}`);
                const emptyRow = sheet.getRow(rowCounter);
                emptyRow.getCell(1).value = 'No records found.';
                emptyRow.getCell(1).alignment = { horizontal: 'center' };
                emptyRow.getCell(1).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                rowCounter++;
            } else {
                data.forEach((item, idx) => {
                    const row = sheet.getRow(rowCounter);
                    const dest = isArrival ? (item.isVisitor ? (item.emp.Destination || 'Unknown') : 'CPF') : (item.emp.Destination || 'Unknown');
                    const rowData = [
                        idx + 1, 
                        item.isVisitor ? 'VISITOR' : item.emp.ID || item.emp.id, 
                        item.emp.Name, 
                        item.emp.Company, 
                        dest, 
                        item.duration, 
                        item.end
                    ];
                    
                    rowData.forEach((val, i) => {
                        const cell = row.getCell(i + 1);
                        cell.value = val;
                        cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                        cell.alignment = { vertical: 'middle', horizontal: (i === 2 || i === 3 || i === 4) ? 'left' : 'center' };
                    });
                    rowCounter++;
                });
            }
            rowCounter++; 
        };

        addTable('ًں›¬ 🛬 ARRIVALS (Back to Work)', 'FF10B981', 'FF059669', arrivals, true);
        addTable('ًں›« 🛫 DEPARTURES (Going on Leave)', 'FFF59E0B', 'FFD97706', departures, false);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Daily_Manifest_${dateStr}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // --- 1. Interactive Charts ---
    let statusChartInstance = null;
    let companyChartInstance = null;
    function initCharts() {
        // Work vs Leave vs Missing
        let workCount = 0, leaveCount = 0, missingCount = 0, sickCount = 0;
        let compOnCounts = {};
        let totalOn = 0;
        
        const todayStr = formatDateRaw(new Date());
        const todayNum = parseDate(todayStr).getTime();

        employees.forEach(e => {
            let baseStatus = 'unknown';
            if (e.Rotations && e.Rotations.length > 0) {
                e.Rotations.forEach(r => {
                    const startNum = parseDate(r.start).getTime();
                    const endNum = parseDate(r.end).getTime();
                    if (todayNum >= startNum && todayNum <= endNum) {
                        baseStatus = r.type;
                    }
                });
            }
            
            let currentStatus = baseStatus;
            
            // Check Overrides
            let activeOverride = null;
            if (e.Overrides) {
                e.Overrides.forEach(ov => {
                    const oStart = parseDate(ov.start).getTime();
                    const oEnd = parseDate(ov.end).getTime();
                    if (todayNum >= oStart && todayNum <= oEnd) {
                        activeOverride = ov;
                    }
                });
            }
            
            if (activeOverride) {
                currentStatus = activeOverride.type;
            }

            if (currentStatus === 'work' || currentStatus === 'standby_cover') {
                workCount++;
                if (e.Company) {
                    compOnCounts[e.Company] = (compOnCounts[e.Company] || 0) + 1;
                    totalOn++;
                }
            }
            else if (currentStatus === 'leave' || currentStatus === 'rest') leaveCount++;
            else if (currentStatus === 'sick_leave') sickCount++;
            else missingCount++;
        });
        
        const ctx1 = document.getElementById('statusChart').getContext('2d');
        if(statusChartInstance) statusChartInstance.destroy();
        
        const handleChartClick = (index) => {
            const types = ['work', 'leave', 'sick_leave', 'missing'];
            const clickedType = types[index];
            if (currentChartFilter === clickedType) {
                currentChartFilter = null;
            } else {
                currentChartFilter = clickedType;
            }
            filterEmployees();
            // Scroll to table
            document.getElementById('employeesTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the chart visually (optional, just re-render is enough)
            Swal.fire({ toast:true, position:'top-end', icon:'info', title:`Filtered by ${clickedType.toUpperCase()}`, showConfirmButton:false, timer:2000, background:'var(--card-bg)', color:'var(--text-main)' });
        };

        statusChartInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [`Work (${workCount})`, `Leave (${leaveCount})`, `Sick (${sickCount})`, `Missing (${missingCount})`],
                datasets: [{
                    data: [workCount, leaveCount, sickCount, missingCount],
                    backgroundColor: ['#3b82f6', '#ffffff', '#ef4444', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { 
                        labels: { color: 'white' },
                        onClick: (e, legendItem, legend) => {
                            // Don't toggle visibility, just filter
                            handleChartClick(legendItem.index);
                        }
                    } 
                },
                onClick: (e, elements) => {
                    if (elements.length > 0) {
                        handleChartClick(elements[0].index);
                    }
                },
                cursor: 'pointer'
            }
        });

        // Company Dist (ON-Duty Only - BOB format)
        });

        const summaryContainer = document.getElementById('onDutySummary');
        if (summaryContainer) {
            let html = '<div style="width: 100%; display: flex; flex-direction: column; gap: 12px; padding: 0 10px;">';
            
            // Find max count to calculate bar widths
            const maxCount = Math.max(...Object.values(compOnCounts), 1);
            
            // Sort companies by count descending
            const sortedCompanies = Object.entries(compOnCounts).sort((a,b) => b[1] - a[1]);
            
            for (const [company, count] of sortedCompanies) {
                const widthPercent = (count / maxCount) * 100;
                html += `
                    <div style="display: flex; align-items: center; width: 100%;">
                        <div style="width: 110px; text-align: left; padding-right: 10px; font-size: 13px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${company}">
                            ${company}
                        </div>
                        <div style="flex-grow: 1; background: rgba(255,255,255,0.05); height: 14px; border-radius: 7px; overflow: hidden;">
                            <div style="width: ${widthPercent}%; background: linear-gradient(90deg, #f97316, #fb923c); height: 100%; border-radius: 7px; transition: width 0.5s ease-in-out;"></div>
                        </div>
                        <div style="width: 40px; text-align: right; padding-left: 10px; font-weight: bold; font-size: 15px; color: #f97316;">
                            ${count}
                        </div>
                    </div>`;
            }
            html += '</div>';
            
            // Grand Total
            html += `
                <div style="margin-top: 15px; width: 100%; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 10px;">
                    <span style="font-size: 14px; color: #94a3b8; font-weight: bold;">Grand Total (ON Duty)</span>
                    <span style="font-size: 20px; font-weight: bold; color: #f97316;">${totalOn}</span>
                </div>`;
                
            summaryContainer.innerHTML = html || '<div style="color: #64748b; text-align:center;">No employees currently ON duty</div>';
        }
    }

    // --- 2. CSV Bulk Import ---
    function handleCSVUpload(event) {
        const file = event.target.files[0];
        if(!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                let count = 0;
                results.data.forEach(row => {
                    if(row.Name && row.ID) {
                        // Check if exists
                        if(!employees.find(e => String(e.ID) === String(row.ID))) {
                            employees.push({
                                ID: row.ID,
                                Name: row.Name,
                                Company: row.Company || 'N/A',
                                Destination: row.Destination || row.Department || 'N/A',
                                Rotations: []
                            });
                            count++;
                        }
                    }
                });
                Swal.fire('Success!', `Imported ${count} new employees successfully.`, 'success');
                saveEmployeesData();
                initEmployees();
                initCharts();
            }
        });
    }
    // --- 3. Add Single Employee ---
    function openAddEmployeeModal() {
        document.getElementById('addEmpModal').style.display = 'block';
    }
    
    function closeAddEmployeeModal() {
        document.getElementById('addEmpModal').style.display = 'none';
    }

    function processImageFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve(null);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 150;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    }

    async function saveNewEmployee() {
        const id = document.getElementById('newEmpId').value.trim();
        const name = document.getElementById('newEmpName').value.trim();
        const company = document.getElementById('newEmpCompany').value.trim();
        const dept = document.getElementById('newEmpDept').value.trim();
        const dest = document.getElementById('newEmpDest').value.trim();
        const phone = document.getElementById('newEmpPhone').value.trim();
        
        if (!id || !name) {
            return Swal.fire('Error', 'ID and Name are required.', 'error');
        }
        
        const photoInput = document.getElementById('newEmpPhoto');
        let profilePicData = null;
        if (photoInput && photoInput.files && photoInput.files[0]) {
            try {
                profilePicData = await processImageFile(photoInput.files[0]);
            } catch (err) {
                console.error("Error processing image:", err);
            }
        }
        
        const existingEmp = employees.find(e => String(e.ID) === String(id));
        if (existingEmp) {
            return Swal.fire({
                title: '⚠️ تنبيه: رقم مكرر',
                html: `هذا الرقم الوظيفي مُسجل مسبقاً في النظام باسم:<br><br><strong style="color: #FF7B00; font-size: 1.2em;">${existingEmp.Name}</strong>`,
                icon: 'warning',
                background: '#1E293B',
                color: '#F8FAFC',
                confirmButtonColor: '#FF7B00',
                confirmButtonText: 'حسناً'
            });
        }
        
        const newEmp = {
            ID: id,
            Name: name,
            Company: company || 'N/A',
            Department: dept || 'N/A',
            Destination: dest || 'N/A',
            Phone: phone || '',
            profilePic: profilePicData,
            Rotations: []
        };
        employees.push(newEmp);
        renderEmployees();
        db.collection("employees").doc(String(newEmp.ID)).set(newEmp).catch(e => console.error("Firebase sync error", e));
        
        logAuditAction("Add Employee", `Added new employee ${newEmp.Name} (${newEmp.ID})`);
        
        // Reset form
        document.getElementById('newEmpId').value = '';
        document.getElementById('newEmpName').value = '';
        document.getElementById('newEmpCompany').value = '';
        document.getElementById('newEmpDept').value = '';
        document.getElementById('newEmpDest').value = '';
        document.getElementById('newEmpPhone').value = '';
        document.getElementById('newEmpPhoto').value = '';
        
        closeAddEmployeeModal();
        Swal.fire('Success', 'Employee added successfully!', 'success');
        
        initEmployees();
        initCharts();
    }



    let editEmployeeId = null;

    function openEditEmployeeModal(id) {
        const emp = employees.find(e => String(e.ID) === String(id));
        if (!emp) return;
        
        editEmployeeId = String(id);

        // ✅ ملء القوائم بالخيارات أولاً
        populateCompanyAndDestDropdowns();

        // ✅ ثم تحديد القيم المحفوظة للموظف
        document.getElementById('editEmpId').value = emp.ID;
        document.getElementById('editEmpName').value = emp.Name;
        document.getElementById('editEmpCompany').value = emp.Company === 'N/A' ? '' : (emp.Company || '');
        document.getElementById('editEmpDept').value = emp.Department === 'N/A' ? '' : (emp.Department || '');
        document.getElementById('editEmpDest').value = emp.Destination === 'N/A' ? '' : (emp.Destination || '');
        document.getElementById('editEmpPhone').value = emp.Phone || '';

        
        document.getElementById('editEmpModal').style.display = 'block';
    }

    function closeEditEmployeeModal() {
        document.getElementById('editEmpModal').style.display = 'none';
        editEmployeeId = null;
    }

    async function saveEditEmployee() {
        if (!editEmployeeId) return;
        
        const emp = employees.find(e => String(e.ID) === editEmployeeId);
        if (!emp) return;

        const name = document.getElementById('editEmpName').value.trim();
        const company = document.getElementById('editEmpCompany').value.trim();
        const dept = document.getElementById('editEmpDept').value.trim();
        const dest = document.getElementById('editEmpDest').value.trim();
        const phone = document.getElementById('editEmpPhone').value.trim();
        
        if (!name) {
            return Swal.fire('Error', 'Name is required.', 'error');
        }
        
        emp.Name = name;
        emp.Company = company || 'N/A';
        emp.Department = dept || 'N/A';
        emp.Destination = dest || 'N/A';
        emp.Phone = phone || '';
        
        const photoInput = document.getElementById('editEmpPhoto');
        if (photoInput && photoInput.files && photoInput.files[0]) {
            try {
                const base64Img = await processImageFile(photoInput.files[0]);
                if (base64Img) {
                    emp.profilePic = base64Img;
                }
            } catch (err) {
                console.error("Error processing image:", err);
            }
        }
        
        db.collection("employees").doc(String(emp.ID)).set(emp).catch(e => console.error("Firebase sync error", e));
        
        closeEditEmployeeModal();
        Swal.fire('Success', 'Employee updated successfully!', 'success');
        
        initEmployees();
        initCharts();
        
        // If profile is open for this employee, update it too
        if (document.getElementById('profileModal').style.display === 'block' && typeof selectedEmployeeId !== 'undefined' && selectedEmployeeId === editEmployeeId) {
            document.getElementById('profileName').innerText = emp.Name;
            document.getElementById('profileCompany').innerText = emp.Company || '-';
            document.getElementById('profileDept').innerText = emp.Department || '-';
            document.getElementById('profileDest').innerText = emp.Destination || '-';
            document.getElementById('profilePhone').innerText = emp.Phone || '-';
            
            if (emp.profilePic) {
                const picImg = document.getElementById('profilePicImg');
                const picFallback = document.getElementById('profilePicFallback');
                picImg.src = emp.profilePic;
                picImg.style.display = 'block';
                picFallback.style.display = 'none';
            }
        }
        
        if (typeof renderMovements === 'function') {
            renderMovements();
        }
    }



    function openExceptionModal() {
        if (!selectedEmployeeId) {
            Swal.fire('Error', 'Please select an employee first.', 'error');
            return;
        }
        document.getElementById('excStart').value = '';
        document.getElementById('excEnd').value = '';
        document.getElementById('excReplacementId').value = '';
        document.getElementById('excNotes').value = '';
        document.getElementById('exceptionModal').style.display = 'block';
    }

    function saveException() {
        const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
        if (!emp) return;

        const type = document.getElementById('excType').value;
        const start = document.getElementById('excStart').value;
        const end = document.getElementById('excEnd').value;
        const paidStatus = document.getElementById('excPaidStatus').value;
        const replacementId = document.getElementById('excReplacementId').value.trim();
        const notes = document.getElementById('excNotes').value.trim();

        if (!start || !end) {
            Swal.fire('Error', 'Start and End dates are required.', 'error');
            return;
        }

        if (!emp.Overrides) emp.Overrides = [];
        
        const override = {
            id: 'exc_' + Date.now(),
            type, start, end, paidStatus, replacementId, notes
        };
        
        emp.Overrides.push(override);
        
        // Save to Firebase
        db.collection("employees").doc(String(emp.ID)).set(emp).catch(e => console.error("Firebase sync error", e));

        // Process Replacement
        if (replacementId) {
            const repEmp = employees.find(e => String(e.ID) === String(replacementId));
            if (repEmp) {
                if (!repEmp.Overrides) repEmp.Overrides = [];
                repEmp.Overrides.push({
                    id: 'exc_' + (Date.now() + 1),
                    type: 'standby_cover',
                    start, end, paidStatus: 'full',
                    replacementId: emp.ID,
                    notes: `Covering for ${emp.Name} (${emp.ID})`
                });
                db.collection("employees").doc(String(repEmp.ID)).set(repEmp).catch(e => console.error("Firebase sync error", e));
            }
        }

        document.getElementById('exceptionModal').style.display = 'none';
        Swal.fire('Success', 'Exception saved successfully!', 'success');
        
        initEmployees();
        viewEmployeeRotations(emp.ID); // refresh profile view
    }
    
    function deleteOverride(id) {
        if (!selectedEmployeeId) return;
        Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the exception.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
                if (emp && emp.Overrides) {
                    emp.Overrides = emp.Overrides.filter(ov => ov.id !== id);
                    db.collection("employees").doc(String(emp.ID)).set(emp).catch(e => console.error(e));
                    viewEmployeeRotations(emp.ID);
                    initEmployees();
                    Swal.fire('Deleted!', 'Exception has been removed.', 'success');
                }
            }
        });
    }
    
    // --- POB Archive Logic ---
    function getEmployeeCurrentStatusForDate(e, dateNum) {
        let baseStatus = 'missing';
        if (e.Rotations && e.Rotations.length > 0) {
            e.Rotations.forEach(r => {
                const startNum = parseDate(r.start).getTime();
                const endNum = parseDate(r.end).getTime();
                if (dateNum >= startNum && dateNum <= endNum) {
                    baseStatus = r.type;
                }
            });
        }
        let currentStatus = baseStatus;
        if (e.Overrides) {
            e.Overrides.forEach(ov => {
                const oStart = parseDate(ov.start).getTime();
                const oEnd = parseDate(ov.end).getTime();
                if (dateNum >= oStart && dateNum <= oEnd) {
                    currentStatus = ov.type;
                }
            });
        }
        return currentStatus;
    }

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
                staffList.push({ id: e.ID, name: e.Name, company: comp });
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
            Swal.fire('Success', `Today's POB Snapshot (${todayStr}) locked securely! Total: ${totalOn}`, 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to save snapshot to cloud.', 'error');
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
                Swal.fire('Not Found', `No POB snapshot found for ${dateInput}.`, 'info');
                document.getElementById('pobArchiveResults').style.display = 'none';
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to fetch snapshot.', 'error');
        }
    }
    
    function renderPOBSnapshot(data) {
        document.getElementById('pobArchiveResults').style.display = 'block';
        document.getElementById('pobTotalValue').innerText = data.total;
        document.getElementById('pobDateValue').innerText = formatDisplayDate(data.date);
        
        const compDiv = document.getElementById('pobCompanyBreakdown');
        compDiv.innerHTML = '';
        const sortedComps = Object.keys(data.companies).sort((a,b) => data.companies[b] - data.companies[a]);
        
        sortedComps.forEach(comp => {
            compDiv.innerHTML += `<div style="background: rgba(16,185,129,0.15); padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid rgba(16,185,129,0.3);">
                <strong style="color: #fff;">${comp}</strong>: <span style="color: #10b981; font-weight: bold;">${data.companies[comp]}</span>
            </div>`;
        });
        
        const staffBody = document.getElementById('pobStaffListBody');
        staffBody.innerHTML = '';
        if (data.staff && data.staff.length > 0) {
            data.staff.forEach(s => {
                staffBody.innerHTML += `<tr>
                    <td style="text-align:center;">${s.id || '-'}</td>
                    <td>${s.name || '-'}</td>
                    <td><span class="company-badge">${s.company || '-'}</span></td>
                </tr>`;
            });
        }
    }
    
    // Ensure today's field is prepopulated
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById('pobArchiveDate').value = formatDateRaw(new Date());
    });



    let visitorsData = [];
    
    // Load visitors from system collection
    db.collection("system").doc("visitors_movements").onSnapshot((doc) => {
        if (doc.exists) {
            visitorsData = doc.data().records || [];
        } else {
            visitorsData = [];
        }
        if (document.getElementById('movementsDate').value) {
            renderMovements();
        }
    });

    function autoFillEmployee(val) {
        // format is "ID - Name"
        const match = val.match(/^(\d+)\s*-/);
        const input = document.getElementById('visitorName');
        if (match && match[1]) {
            const empId = match[1];
            const emp = employees.find(e => String(e.ID) === empId);
            if (emp) {
                document.getElementById('visitorCompany').value = emp.Company;
                input.dataset.empId = emp.ID;
                input.value = emp.Name;
                return;
            }
        }
        // If not found or plain text
        delete input.dataset.empId;
    }

    function openVisitorModal() {
        // Populate existing employees datalist
        const datalist = document.getElementById('employeeDatalist');
        datalist.innerHTML = '';
        employees.forEach(emp => {
            datalist.innerHTML += `<option value="${emp.ID} - ${emp.Name}">`;
        });

        const nameInput = document.getElementById('visitorName');
        nameInput.value = '';
        delete nameInput.dataset.empId;
        
        document.getElementById('visitorCompany').value = '';
        document.getElementById('visitorDest').value = '';
        const movementsDate = document.getElementById('movementsDate').value;
        if (document.querySelector('#visitorDate')._flatpickr) {
            document.querySelector('#visitorDate')._flatpickr.setDate(movementsDate || new Date());
        } else {
            document.getElementById('visitorDate').value = movementsDate || '';
        }
        document.getElementById('visitorModal').style.display = 'block';
    }

    function closeVisitorModal() {
        document.getElementById('visitorModal').style.display = 'none';
    }

    function saveVisitor() {
        let name = document.getElementById('visitorName').value.trim();
        let company = document.getElementById('visitorCompany').value.trim();
        let idStr;
        let isVisitorFlag = true;

        const empId = document.getElementById('visitorName').dataset.empId;

        if (empId) {
            const emp = employees.find(e => String(e.ID) === String(empId));
            if (emp) {
                name = emp.Name;
                company = emp.Company;
                idStr = emp.ID;
                isVisitorFlag = false;
            }
        } 
        
        if (isVisitorFlag) {
            idStr = 'vis_' + Date.now();
            if (!name || !company) return Swal.fire('Error', 'Name and Company are required.', 'error');
        }

        const dest = document.getElementById('visitorDest').value.trim();
        const moveType = document.getElementById('visitorType').value;
        const date = document.getElementById('visitorDate').value;
        
        if (!date) return Swal.fire('Error', 'Movement Date is required.', 'error');
        
        const proceedSave = () => {
            const newVisitor = {
                id: idStr,
                Name: name,
                Company: company,
                Destination: dest,
                type: moveType,
                date: date,
                isVisitor: isVisitorFlag
            };
            
            visitorsData.push(newVisitor);
            db.collection("system").doc("visitors_movements").set({ records: visitorsData }).then(() => {
                closeVisitorModal();
                Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Movement added', showConfirmButton:false, timer:2000, background:'var(--card-bg)', color:'var(--text-main)' });
            });
        };

        if (!isVisitorFlag) {
            const emp = employees.find(e => String(e.ID) === String(empId));
            if (emp && emp.Rotations) {
                const targetDate = parseDate(date).getTime();
                const activeRot = emp.Rotations.find(r => {
                    const s = parseDate(r.start).getTime();
                    const e = parseDate(r.end).getTime();
                    return targetDate >= s && targetDate <= e;
                });

                if (activeRot) {
                    Swal.fire({
                        title: 'تحذير ذكي: الموظف في فترة روتيشن!',
                        text: `الموظف ${name} لديه فترة ${activeRot.type === 'work' ? 'عمل' : 'إجازة'} مستمرة حتى ${activeRot.end} في جدوله الرسمي. هل تريد الاستمرار في إضافة هذه الحركة الاستثنائية؟`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: 'var(--primary)',
                        cancelButtonColor: 'var(--danger)',
                        confirmButtonText: 'نعم، أضف الحركة',
                        cancelButtonText: 'إلغاء',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            proceedSave();
                        }
                    });
                    return; // Wait for user confirmation
                }
            }
        }
        
        proceedSave();
    }

    function deleteVisitor(id) {
        Swal.fire({
            title: 'Delete Visitor?',
            text: "Are you sure you want to remove this visitor from the manifest?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            confirmButtonText: 'Yes, delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                visitorsData = visitorsData.filter(v => String(v.id) !== String(id));
                db.collection("system").doc("visitors_movements").set({ records: visitorsData }).then(() => {
                    Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Visitor removed', showConfirmButton:false, timer:2000, background:'var(--card-bg)', color:'var(--text-main)' });
                });
            }
        });
    }



    function openMasterReportModal() {
        const tbody = document.getElementById('masterReportBody');
        let html = '';
        
        filteredEmployees.forEach((e, idx) => {
            let totalWork = 0;
            let totalLeave = 0;
            if (e.Rotations) {
                e.Rotations.forEach(r => {
                    const days = daysBetween(r.start, r.end);
                    if (r.type === 'work') totalWork += days;
                    if (r.type === 'leave' || r.type === 'rest') totalLeave += days;
                });
            }
            html += `<tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;"><strong>${e.ID || '-'}</strong></td>
                <td style="text-align: left;">${e.Name || '-'}</td>
                <td style="text-align: center;">${e.Company || '-'}</td>
                <td style="text-align: center;">${e.Destination || '-'}</td>
                <td style="text-align: center;">${e.Phone || '-'}</td>
                <td style="text-align: center; color: #10b981; font-weight: bold;">${totalWork}</td>
                <td style="text-align: center; color: #3b82f6; font-weight: bold;">${totalLeave}</td>
            </tr>`;
        });
        
        tbody.innerHTML = html;
        document.getElementById('masterReportModal').style.display = 'block';
        document.getElementById('systemTaskbar').style.bottom = '-60px'; // hide taskbar if open
        document.getElementById('systemTaskbar').innerHTML = ''; // clear taskbar
        // Animate in
        setTimeout(() => {
            document.getElementById('masterReportModal').style.opacity = '1';
            document.getElementById('masterReportContent').style.transform = 'scale(1) translateY(0)';
        }, 10);
    }

    function closeMasterReportModal() {
        document.getElementById('masterReportModal').style.opacity = '0';
        document.getElementById('masterReportContent').style.transform = 'scale(0.98)';
        setTimeout(() => {
            document.getElementById('masterReportModal').style.display = 'none';
            document.getElementById('systemTaskbar').style.bottom = '-60px';
            document.getElementById('systemTaskbar').innerHTML = '';
        }, 300);
    }

    function minimizeMasterReportModal() {
        document.getElementById('masterReportModal').style.opacity = '0';
        document.getElementById('masterReportContent').style.transform = 'translateY(100px)';
        
        setTimeout(() => {
            document.getElementById('masterReportModal').style.display = 'none';
            // Show taskbar
            const taskbar = document.getElementById('systemTaskbar');
            taskbar.style.bottom = '0';
            taskbar.innerHTML = `
                <button class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); color: white; display: flex; align-items: center; gap: 8px; padding: 5px 15px; font-size: 14px;" onclick="restoreMasterReportModal()">
                    ًں“ٹ Master Report
                </button>
            `;
        }, 300);
    }

    function restoreMasterReportModal() {
        document.getElementById('systemTaskbar').style.bottom = '-60px';
        setTimeout(() => {
            document.getElementById('systemTaskbar').innerHTML = '';
            document.getElementById('masterReportModal').style.display = 'block';
            setTimeout(() => {
                document.getElementById('masterReportModal').style.opacity = '1';
                document.getElementById('masterReportContent').style.transform = 'scale(1) translateY(0)';
            }, 10);
        }, 300);
    }

    function printMasterReport() {
        const printContent = document.getElementById('masterReportPrintArea').innerHTML;
        const printWindow = window.open('', '', 'width=1000,height=700');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Master Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #000; background: #fff; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                        th:nth-child(3), td:nth-child(3) { text-align: left; }
                        th { background-color: #f1f5f9; -webkit-print-color-adjust: exact; font-weight: bold; }
                        h2 { text-align: center; color: #000; margin-bottom: 5px; }
                        .date-info { text-align: center; font-style: italic; color: #666; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <h2>👥 Employees Directory Master Report</h2>
                    <div class="date-info">Generated on: ${new Date().toLocaleDateString()}</div>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    // ---------------------------------
    // Magnetic / Smart Card Reader Logic
    // ---------------------------------
    let cardSwipeBuffer = '';
    let cardSwipeTimeout;

    document.addEventListener('keydown', function(e) {
        // If user is focused on an input or textarea, we might still want to capture it,
        // but typically readers type very fast so we just measure speed.
        
        if (e.key === 'Enter') {
            if (cardSwipeBuffer.length >= 3) {
                // Potential swipe detected
                handleSmartCardSwipe(cardSwipeBuffer);
            }
            cardSwipeBuffer = '';
            return;
        }
        
        if (e.key.length > 1) return; // Ignore Shift, Ctrl, etc.
        
        cardSwipeBuffer += e.key;
        
        clearTimeout(cardSwipeTimeout);
        cardSwipeTimeout = setTimeout(() => {
            cardSwipeBuffer = ''; 
        }, 50); // 50ms keystroke limit confirms it's a machine
    });

    function handleSmartCardSwipe(cardData) {
        const emp = employees.find(e => String(e.ID) === cardData);
        if (!emp) {
            Swal.fire({ toast:true, position:'top-end', icon:'error', title:'❌ البطاقة غير مسجلة: ' + cardData, showConfirmButton:false, timer:3000, background:'var(--card-bg)', color:'var(--text-main)' });
            return;
        }
        
        // Determine movement type
        let moveType = 'work'; // Arrival
        const currentStatus = emp.Status || 'missing';
        if (currentStatus === 'work') moveType = 'leave'; // Departure
        
        const todayDateStr = formatDateRaw(new Date());
        
        // Add movement to visitorsData
        const newMovement = {
            id: 'mov_' + Date.now(),
            date: todayDateStr,
            name: emp.Name,
            company: emp.Company,
            dest: emp.Dest || '',
            type: moveType,
            isVisitor: false,
            empId: emp.ID
        };
        
        visitorsData.push(newMovement);
        
        if(moveType === 'work') {
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'✅ تم تسجيل وصول: ' + emp.Name, showConfirmButton:false, timer:3000, background:'var(--card-bg)', color:'var(--text-main)' });
        } else {
            Swal.fire({ toast:true, position:'top-end', icon:'info', title:'🛫 تم تسجيل مغادرة: ' + emp.Name, showConfirmButton:false, timer:3000, background:'var(--card-bg)', color:'var(--text-main)' });
        }
        
        // Update Firebase
        db.collection("system").doc("visitors_movements").set({ records: visitorsData }).catch(console.error);
        
        // Also update UI if movements tab is open
        if(document.getElementById('movementsDate').value === todayDateStr) {
            renderMovements(todayDateStr);
        }
        
        // Log action
        if(typeof logAuditAction === 'function') {
            logAuditAction("Smart Card Swipe", `Automated ${moveType === 'work'? 'Arrival' : 'Departure'} for ${emp.Name} (${emp.ID})`);
        }
    }



    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    window.addEventListener('online', () => {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) indicator.style.display = 'none';
    });
    window.addEventListener('offline', () => {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) indicator.style.display = 'block';
    });
    
    // Check initial state
    if (!navigator.onLine) {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) indicator.style.display = 'block';
    }



    // --- Timesheet Logic ---
    let currentTimesheetData = {}; 
    
    function initTimesheetDefaults() {
        const dateInput = document.getElementById('timesheetMonth');
        if (dateInput && !dateInput.value) {
            const now = new Date();
            const yyyy = now.getFullYear();
            let mm = now.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            dateInput.value = `${yyyy}-${mm}`;
        }
    }
    
    document.addEventListener("DOMContentLoaded", initTimesheetDefaults);

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    async function loadTimesheetData() {
        if (!document.getElementById('timesheetMonth')) return;
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        if (!monthVal) return;
        
        const docId = `${monthVal}_${dept.replace(/[^a-zA-Z0-9]/g, '')}`;
        
        try {
            const doc = await db.collection("timesheets").doc(docId).get();
            if (doc.exists) {
                currentTimesheetData = doc.data().records || {};
            } else {
                currentTimesheetData = {};
            }
            renderTimesheetTable();
        } catch(e) {
            console.error("Error loading timesheet:", e);
        }
    }

        

    async function exportTimesheetToExcel() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        
        if (!monthVal || typeof employees === 'undefined') return;
        
        if (typeof ExcelJS === 'undefined') {
            return Swal.fire('Error', 'Excel library is still loading. Please try again in a moment.', 'error');
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rotations System';
        const sheet = workbook.addWorksheet('Timesheet');
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // Define Columns
        const columns = [
            { header: 'ID NO', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 }
        ];
        
        for (let i = 1; i <= daysInMonth; i++) {
            columns.push({ header: String(i), key: 'd' + i, width: 5 });
        }
        columns.push({ header: 'Total Duty Days', key: 'total', width: 15 });
        columns.push({ header: 'Status', key: 'status', width: 15 });
        
        sheet.columns = columns;
        
        // Filter Employees
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        
        // Add Data
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            const rowData = { id: emp.ID, name: emp.Name, status: 'Regular' };
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dayVal = empData[i] || '';
                rowData['d' + i] = (dayVal === '1') ? 'ON' : dayVal;
                if (dayVal === '1' || dayVal === 'ON' || dayVal === 'E' || dayVal === 'X') {
                    totalDuty++;
                }
            }
            rowData.total = totalDuty;
            sheet.addRow(rowData);
        });
        
        // Style Header
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).alignment = { horizontal: 'center' };
        
        // Generate File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Timesheet_${monthVal}_${dept}${company !== 'All' ? '_' + company : ''}.xlsx`;
        link.click();
    }

    function renderTimesheetTable() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        const companyEl = document.getElementById('timesheetCompanyFilter');
        const company = companyEl ? companyEl.value : "All";
        if (!monthVal || typeof employees === 'undefined') return;
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // Find today
        const today = new Date();
        const isCurrentMonth = (today.getFullYear() === parseInt(year) && (today.getMonth() + 1) === parseInt(month));
        const todayDate = today.getDate();
        
        // Render Header
        let headHTML = `<th>ID NO</th><th>Name</th>`;
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
            const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
            const isToday = isCurrentMonth && (i === todayDate);
            
            let thStyle = '';
            if (isToday) thStyle += 'border: 2px solid #f9a826; background: rgba(249, 168, 38, 0.1); color: #f9a826;';
            else if (isWeekend) thStyle += 'background: rgba(255, 255, 255, 0.05);';
            
            headHTML += `<th style="${thStyle}">${i}</th>`;
        }
        headHTML += `<th>Total Duty Days</th><th>Status</th>`;
        document.getElementById('timesheetHeaderRow').innerHTML = headHTML;
        
        // Filter Employees
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        
        // Stats
        let totalOnDuty = 0;
        let totalEmergency = 0;
        let totalExtra = 0;
        let dailyCounts = new Array(daysInMonth + 1).fill(0); // index 1 to daysInMonth
        
        // Render Body
        let bodyHTML = '';
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            
            let rowHTML = `<tr>
                <td>${emp.ID}</td>
                <td style="white-space: nowrap;">${emp.Name}</td>`;
                
            for (let i = 1; i <= daysInMonth; i++) {
                const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
                const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
                const isToday = isCurrentMonth && (i === todayDate);
                
                let extraStyle = '';
                if (isToday) extraStyle += 'border-left: 2px solid #f9a826; border-right: 2px solid #f9a826; background-color: rgba(249, 168, 38, 0.05);';
                else if (isWeekend) extraStyle += 'background-color: rgba(0, 0, 0, 0.15);';
                
                const dayVal = empData[i] || '';
                let cellClass = 'ts-cell-empty';
                
                if (dayVal === '1' || dayVal === 'ON') { 
                    cellClass = 'ts-cell-ON'; 
                    totalDuty++; 
                    totalOnDuty++;
                    dailyCounts[i]++;
                }
                else if (dayVal === 'E') { 
                    cellClass = 'ts-cell-E'; 
                    totalDuty++; 
                    totalEmergency++;
                    dailyCounts[i]++;
                } 
                else if (dayVal === 'X') { 
                    cellClass = 'ts-cell-X'; 
                    totalDuty++; 
                    totalExtra++;
                    dailyCounts[i]++;
                }
                
                rowHTML += `<td class="ts-cell ${cellClass}" style="${extraStyle}" onclick="toggleTsCell('${emp.ID}', ${i}, this)" data-val="${dayVal === '1' ? 'ON' : dayVal}">${dayVal === '1' ? 'ON' : dayVal}</td>`;
            }
            
            rowHTML += `<td id="ts_total_${emp.ID}" style="font-weight:bold; color: var(--primary);">${totalDuty}</td>`;
            rowHTML += `<td style="color: var(--text-muted); font-size: 12px;">Regular</td>`;
            rowHTML += `</tr>`;
            
            bodyHTML += rowHTML;
        });
        
        // Add Daily Summary Footer Row
        let footerHTML = `<tr>
            <td colspan="2" style="text-align: right; font-weight: bold; background: var(--glass-bg); position: sticky; left: 60px; z-index: 20;">Total On Duty</td>`;
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
            const isToday = isCurrentMonth && (i === todayDate);
            let ftStyle = 'font-weight:bold; background: rgba(59, 130, 246, 0.1); color: #3b82f6;';
            if (isToday) ftStyle += ' border: 2px solid #f9a826; border-top: none;';
            
            footerHTML += `<td style="${ftStyle}">${dailyCounts[i] > 0 ? dailyCounts[i] : ''}</td>`;
        }
        footerHTML += `<td colspan="2" style="background: var(--glass-bg);"></td></tr>`;
        
        bodyHTML += footerHTML;
        document.getElementById('timesheetBody').innerHTML = bodyHTML;
        
        // Update Stats Cards
        const statsHTML = `
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px;">
                <div style="font-size: 12px; color: #3b82f6;">Total On Duty (ON)</div>
                <div style="font-size: 20px; font-weight: bold;">${totalOnDuty} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px;">
                <div style="font-size: 12px; color: #ef4444;">Total Emergency (E)</div>
                <div style="font-size: 20px; font-weight: bold;">${totalEmergency} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
            <div class="stat-card" style="padding: 10px 15px; flex: 1; min-width: 150px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px;">
                <div style="font-size: 12px; color: #10b981;">Total Extra Days (X)</div>
                <div style="font-size: 20px; font-weight: bold;">${totalExtra} <span style="font-size: 12px; font-weight:normal;">days</span></div>
            </div>
        `;
        document.getElementById('timesheetStats').innerHTML = statsHTML;
    }

    function toggleTsCell(empId, day, cellElement) {
        let currentVal = cellElement.getAttribute('data-val') || '';
        let newVal = '';
        let newClass = 'ts-cell-empty';
        
        if (currentVal === '') {
            newVal = '1'; newClass = 'ts-cell-1';
        } else if (currentVal === '1') {
            newVal = 'E'; newClass = 'ts-cell-E';
        } else if (currentVal === 'E') {
            newVal = 'X'; newClass = 'ts-cell-X';
        } else if (currentVal === 'X') {
            newVal = ''; newClass = 'ts-cell-empty';
        }
        
        cellElement.setAttribute('data-val', newVal);
        cellElement.innerText = newVal;
        cellElement.className = `ts-cell ${newClass}`;
        
        if (!currentTimesheetData[empId]) currentTimesheetData[empId] = {};
        currentTimesheetData[empId][day] = newVal;
        
        recalcTsRowTotal(empId);
    }
    
    function recalcTsRowTotal(empId) {
        if (!currentTimesheetData[empId]) return;
        let total = 0;
        for (let i = 1; i <= 31; i++) {
            const v = currentTimesheetData[empId][i];
            if (v === '1' || v === 'X' || v === 'E') total++; 
        }
        const el = document.getElementById(`ts_total_${empId}`);
        if(el) el.innerText = total;
    }

    function autoFillTimesheet() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        if (!monthVal) return;
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        let filtered = employees;
        if (dept !== "All") {
            filtered = employees.filter(e => e.Department === dept);
        }
        
        filtered.forEach(emp => {
            if (!currentTimesheetData[emp.ID]) currentTimesheetData[emp.ID] = {};
            
            for (let i = 1; i <= daysInMonth; i++) {
                const checkDateStr = `${year}-${month}-${i < 10 ? '0'+i : i}`;
                const checkDateNum = parseDate(checkDateStr).getTime();
                
                const status = getEmployeeCurrentStatusForDate(emp, checkDateNum);
                
                if (status === 'work' || status === 'standby_cover') {
                    currentTimesheetData[emp.ID][i] = 'ON';
                } else if (status === 'leave' || status === 'rest' || status === 'missing' || status === 'sick_leave') {
                    currentTimesheetData[emp.ID][i] = '';
                }
            }
        });
        
        renderTimesheetTable();
        Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Auto-filled from Rotations', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
    }

    async function saveTimesheet() {
        const monthVal = document.getElementById('timesheetMonth').value;
        const dept = document.getElementById('timesheetDeptFilter').value;
        if (!monthVal) return;
        
        const docId = `${monthVal}_${dept.replace(/[^a-zA-Z0-9]/g, '')}`;
        
        const payload = {
            month: monthVal,
            department: dept,
            updatedAt: new Date().toISOString(),
            records: currentTimesheetData
        };
        
        try {
            await db.collection("timesheets").doc(docId).set(payload);
            Swal.fire({
                title: 'Saved',
                text: `Timesheet for ${monthVal} saved successfully.`,
                icon: 'success',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)'
            });
        } catch(e) {
            console.error(e);
            Swal.fire('Error', 'Failed to save timesheet', 'error');
        }
    }
