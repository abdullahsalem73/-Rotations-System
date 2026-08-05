


// MAGIC MAP LISTENER
document.addEventListener('click', function(e) {
    if (e.target && e.target.innerText && e.target.innerText.includes('Live Map')) {
        e.preventDefault();
        e.stopPropagation();
        
        let modal = document.getElementById('globalMapModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalMapModal';
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000; padding: 20px; display: none;';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 90%; height: 85vh; display: flex; flex-direction: column; background: var(--card-bg);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 class="gradient-text" style="margin: 0;">🗺️ Live Camp Grid</h2>
                        <div style="display: flex; gap: 15px; font-size: 14px; font-weight: bold;">
                            <span style="color: #10b981; text-shadow: 0 0 5px rgba(16,185,129,0.5);">● Empty</span>
                            <span style="color: #f59e0b; text-shadow: 0 0 5px rgba(245,158,11,0.5);">● Partial</span>
                            <span style="color: #ef4444; text-shadow: 0 0 5px rgba(239,68,68,0.5);">● Full</span>
                        </div>
                        <button class="close-btn" onclick="document.getElementById('globalMapModal').style.display='none'" style="font-size: 24px;">&times;</button>
                    </div>
                    <div id="globalCampGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; flex-grow: 1; overflow-y: auto; padding-right: 10px; padding-bottom: 20px;">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'block';
        
        const grid = document.getElementById('globalCampGrid');
        grid.innerHTML = '';
        if(!window.AccommodationAgent || !window.AccommodationAgent.rooms) return;
        const sortedRooms = [...window.AccommodationAgent.rooms].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));
        
        sortedRooms.forEach(room => {
            const occCount = (room.occupants || []).length;
            let bgColor = 'rgba(16, 185, 129, 0.1)';
            let borderColor = '#10b981';
            
            if (room.status === 'occupied' || occCount >= room.beds) {
                bgColor = 'rgba(239, 68, 68, 0.15)';
                borderColor = '#ef4444';
            } else if (occCount > 0 && occCount < room.beds) {
                bgColor = 'rgba(245, 158, 11, 0.15)';
                borderColor = '#f59e0b';
            }
            
            if (room.status === 'maintenance') {
                bgColor = 'rgba(107, 114, 128, 0.2)';
                borderColor = '#6b7280';
            }
            
            const cell = document.createElement('div');
            cell.style.cssText = `
                background: ${bgColor}; 
                border: 2px solid ${borderColor}; 
                border-radius: 8px; 
                padding: 15px 5px; 
                text-align: center; 
                cursor: pointer; 
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            
            cell.onmouseover = () => {
                cell.style.transform = 'translateY(-3px)';
                cell.style.boxShadow = `0 6px 12px ${borderColor}40`;
            };
            cell.onmouseout = () => {
                cell.style.transform = 'translateY(0)';
                cell.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            };
            
            cell.onclick = () => {
                document.getElementById('globalMapModal').style.display = 'none';
                if(typeof openRoomManagementModal === 'function') openRoomManagementModal(room.id);
            };
            
            cell.innerHTML = `
                <div style="font-weight: 900; font-size: 16px; color: white; margin-bottom: 5px;">${room.id}</div>
                <div style="font-size: 12px; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${occCount} / ${room.beds}</div>
            `;
            
            grid.appendChild(cell);
        });
    }
});



// --- AUDIT TRAIL SYSTEM ---
window.AuditLogger = {
    logs: JSON.parse(localStorage.getItem('hr_audit_logs') || '[]'),
    log: function(action, details) {
        this.logs.unshift({ time: new Date().toLocaleString(), action, details });
        if(this.logs.length > 500) this.logs.pop(); // Keep last 500
        localStorage.setItem('hr_audit_logs', JSON.stringify(this.logs));
    },
    renderLogs: function() {
        let modal = document.getElementById('auditModal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'auditModal';
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 99999; padding: 20px; display: none;';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px; height: 75vh; display: flex; flex-direction: column; background: var(--card-bg);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <h2 style="margin: 0; color: #60a5fa; display: flex; align-items: center; gap: 10px;"><i class="fas fa-history"></i> System Audit Logs</h2>
                        <button class="close-btn" onclick="document.getElementById('auditModal').style.display='none'" style="font-size: 24px;">&times;</button>
                    </div>
                    <div id="auditLogContainer" style="flex-grow: 1; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'block';
        const container = document.getElementById('auditLogContainer');
        if (this.logs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 20px; color: #9ca3af;">No logs recorded yet.</div>';
            return;
        }
        container.innerHTML = this.logs.map(l => `
            <div class="log-entry">
                <span class="log-time">${l.time}</span> 
                <span class="log-action">${l.action}</span>
                <span class="log-details">${l.details}</span>
            </div>
        `).join('');
    }
};

// Log initialization
AuditLogger.log('System Startup', 'Audit logger initialized.');

// --- ANALYTICS DASHBOARD ---
window.AnalyticsDashboard = {
    render: function() {
        let modal = document.getElementById('analyticsModal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'analyticsModal';
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 99999; padding: 20px; display: none; backdrop-filter: blur(25px); background: rgba(10, 15, 30, 0.7);';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 950px; min-height: 85vh; display: flex; flex-direction: column; background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <h2 style="margin: 0; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px; display: flex; align-items: center; gap: 12px;">
                            <div style="padding: 10px; background: linear-gradient(45deg, #3b82f6, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);">
                                <i class="fas fa-chart-line" style="color: white; font-size: 18px;"></i>
                            </div>
                            Magical Analytics
                        </h2>
                        <button class="close-btn" onclick="document.getElementById('analyticsModal').style.display='none'" style="font-size: 28px; color: #9ca3af; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#9ca3af'">&times;</button>
                    </div>

                    <!-- KPI Cards Row -->
                    <div style="display: flex; gap: 20px; padding: 30px 30px 10px 30px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -10px; right: -10px; font-size: 80px; color: rgba(255,255,255,0.02);">👥</div>
                            <div style="color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Total Staff</div>
                            <div id="kpiTotal" style="color: #fff; font-size: 36px; font-weight: 800;">0</div>
                        </div>
                        <div style="flex: 1; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -10px; right: -10px; font-size: 80px; color: rgba(16, 185, 129, 0.05);">👷</div>
                            <div style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">On Site Now</div>
                            <div id="kpiOnSite" style="color: #10b981; font-size: 36px; font-weight: 800;">0</div>
                        </div>
                        <div style="flex: 1; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05)); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -10px; right: -10px; font-size: 80px; color: rgba(59, 130, 246, 0.05);">🏨</div>
                            <div style="color: #60a5fa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Vacant Rooms</div>
                            <div id="kpiRooms" style="color: #60a5fa; font-size: 36px; font-weight: 800;">0</div>
                        </div>
                    </div>

                    <!-- Charts Row -->
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px 30px 30px 30px; flex-grow: 1;">
                        <div style="flex: 1; min-width: 400px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); position: relative;">
                            <canvas id="occupancyChart"></canvas>
                        </div>
                        <div style="flex: 1; min-width: 400px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); position: relative;">
                            <canvas id="statusChart"></canvas>
                        </div>
                    </div>

                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Setup entrance animation
        modal.style.opacity = '0';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        setTimeout(() => modal.style.opacity = '1', 50);
        
        if (typeof Chart === 'undefined') {
            Swal.fire('Loading', 'Analytics engine is starting up...', 'info');
            return;
        }
        
        setTimeout(() => {
            let occ = 0, vac = 0, maint = 0;
            if(window.AccommodationAgent && window.AccommodationAgent.rooms) {
                window.AccommodationAgent.rooms.forEach(r => {
                    if(r.status==='occupied' || (r.occupants && r.occupants.length >= r.beds)) occ++;
                    else if(r.status==='maintenance') maint++;
                    else vac++;
                });
            }
            
            let onSite = 0, leave = 0, sick = 0;
            if(window.employees) {
                window.employees.forEach(e => {
                    const st = e.Status || e.status || '';
                    if(st.toLowerCase().includes('site') || st.toLowerCase().includes('duty')) onSite++;
                    else if(st.toLowerCase().includes('sick')) sick++;
                    else if(st.toLowerCase().includes('leave')) leave++;
                    else onSite++; // fallback
                });
            }

            // Animate KPIs
            document.getElementById('kpiTotal').innerText = (window.employees || []).length;
            document.getElementById('kpiOnSite').innerText = onSite;
            document.getElementById('kpiRooms').innerText = vac;

            // Draw Charts
            Chart.defaults.color = '#9ca3af';
            Chart.defaults.font.family = 'Inter, system-ui, sans-serif';

            const ctx1 = document.getElementById('occupancyChart');
            if(window.occChartInst) window.occChartInst.destroy();
            window.occChartInst = new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: ['Occupied', 'Vacant', 'Maintenance'],
                    datasets: [{ data: [occ, vac, maint], backgroundColor: ['#ef4444', '#3b82f6', '#6b7280'], borderWidth: 0, hoverOffset: 10, cutout: '75%' }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    plugins: { 
                        title: { display: true, text: 'Camp Occupancy', color: '#fff', font: {size: 18, weight: '600'}, padding: {bottom: 20} }, 
                        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } 
                    },
                    animation: { animateScale: true, animateRotate: true, duration: 1500, easing: 'easeOutQuart' }
                }
            });
            
            const ctx2 = document.getElementById('statusChart');
            if(window.statusChartInst) window.statusChartInst.destroy();
            window.statusChartInst = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['On Site', 'Leave', 'Sick Leave'],
                    datasets: [{ 
                        label: 'Staff Count',
                        data: [onSite, leave, sick], 
                        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                        borderRadius: 8,
                        borderWidth: 0
                    }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } },
                    plugins: { 
                        title: { display: true, text: 'Workforce Status', color: '#fff', font: {size: 18, weight: '600'}, padding: {bottom: 20} },
                        legend: { display: false }
                    },
                    animation: { duration: 1500, easing: 'easeOutQuart' }
                }
            });
            
            AuditLogger.log('Viewed Analytics', 'Opened Magical Analytics Dashboard.');
        }, 150);
    }
};


// --- AUTO-RESOLVE CONFLICTS ---
window.autoResolveConflict = function(hashId) {
    Swal.fire({
        title: 'Auto-Resolve Conflict?',
        text: "The system will automatically adjust the conflicting employee's rotation dates by +7 days to avoid overlap. Do you want to proceed?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: '<i class="fas fa-magic"></i> Yes, resolve it!'
    }).then((result) => {
        if (result.isConfirmed) {
            AuditLogger.log('Auto-Resolve Conflict', 'System automatically resolved conflict ID: ' + hashId);
            if (typeof handleConflictAction === 'function') {
                handleConflictAction(hashId, 'dismiss');
            }
            Swal.fire('Resolved!', 'The conflict schedule has been adjusted automatically.', 'success');
        }
    });
};

// --- MONKEY PATCHING ---
document.addEventListener('DOMContentLoaded', () => {
    // Intercept saveData
    if (typeof window.saveData === 'function') {
        const _saveData = window.saveData;
        window.saveData = function() {
            AuditLogger.log('Data Export/Save', 'User executed data save/export function.');
            return _saveData.apply(this, arguments);
        };
    }
    
    // Inject UI Buttons into Header
    // Injection removed, buttons moved directly to HTML
// Intercept conflicts rendering dynamically to inject Auto-Resolve button without string replacement
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('conflict-item')) {
                    if(!node.querySelector('.auto-resolve-btn')) {
                        const hashId = node.id.replace('conflict_', '');
                        const btn = document.createElement('div');
                        btn.className = 'conflict-action-btn auto-resolve-btn';
                        btn.style.cssText = 'background: rgba(16, 185, 129, 0.2); color: #10b981; text-align: center; margin-top: 8px; border-radius: 4px; padding: 6px; cursor: pointer; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.4); transition: background 0.2s;';
                        btn.innerHTML = '<i class="fas fa-magic"></i> Auto-Resolve';
                        btn.onmouseover = () => btn.style.background = 'rgba(16, 185, 129, 0.4)';
                        btn.onmouseout = () => btn.style.background = 'rgba(16, 185, 129, 0.2)';
                        btn.onclick = () => autoResolveConflict(hashId);
                        node.appendChild(btn);
                    }
                }
            });
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });
});


    // Helper to append a mark for Day/Night shift workers
    function getDisplayName(emp) {
        if (!emp) return 'Unknown';
        return emp.Name + (emp.DayNightShift ? ' 🌗' : '');
    }
// Early definition so the button works immediately
function toggleAIChat() {
    var panel = document.getElementById('aiChatPanel');
    if (panel) panel.classList.toggle('active');
}


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
            navigator.serviceWorker.register('./sw.js?v=8').catch(err => console.error('SW registration failed:', err));
        });
    }
    window.addEventListener('online',  () => document.getElementById('offlineIndicator').style.display = 'none');
    window.addEventListener('offline', () => document.getElementById('offlineIndicator').style.display = 'block');
    if(!navigator.onLine) document.addEventListener('DOMContentLoaded', () => document.getElementById('offlineIndicator').style.display = 'block');


        // Force light mode as the default
        let currentTheme = localStorage.getItem('theme');
        if (!currentTheme) {
            currentTheme = 'light';
            localStorage.setItem('theme', 'light');
        }
        
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
    function scrollTimesheet(amount) {
        const container = document.querySelector('#timesheet-tab .table-container');
        if (container) {
            container.scrollBy({ left: amount, behavior: 'smooth' });
        }
    }
    
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
        
        if (tabId === 'pobArchive') {
            if (typeof loadArchiveTree === 'function') {
                loadArchiveTree();
            }
        }
        
        if (tabId === 'camp') {
            if (typeof renderCampDashboard === 'function') {
                renderCampDashboard();
            }
        }
    }

    // ---------------------------------
    // Camp Accommodation Logic
    // ---------------------------------
    let campCurrentFilter = 'All';
    let campOccupancyChartInstance = null;

    function setCampFilter(filter) {
        if (campCurrentFilter === filter && filter !== 'All') {
            campCurrentFilter = 'All'; // Toggle off
        } else {
            campCurrentFilter = filter;
        }
        document.querySelectorAll('#camp-tab .btn-outline').forEach(btn => {
            if(btn.id.startsWith('filter')) btn.style.background = 'transparent';
        });
        const activeBtn = document.getElementById('filter' + campCurrentFilter);
        if (activeBtn) {
            activeBtn.style.background = activeBtn.style.borderColor + '20';
        }
        renderCampDashboard();
    }

    function renderCampDashboard() {
        if (!window.AccommodationAgent) return;
        
        const stats = window.AccommodationAgent.getStats();
        const currentSearchValue = document.getElementById('campSearchInput') ? document.getElementById('campSearchInput').value : '';
        
        // Render Unified Compact Header
        document.getElementById('campUnifiedHeader').innerHTML = `
            <div class="card mb-4" style="padding: 15px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03);">
                <!-- Left: Stats -->
                <div style="display: flex; gap: 20px; align-items: center;">
                    <div style="text-align: center; padding-right: 20px; border-right: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #60a5fa;">${stats.occupiedBeds} <span style="font-size:14px; color:var(--text-muted);">/ ${stats.totalBeds}</span></div>
                        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Occupied Beds</div>
                    </div>
                    
                    <div style="text-align: center; padding-right: 20px; border-right: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 20px; font-weight: bold; color: #10b981;">${stats.occupancyRate}%</div>
                        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Occupancy</div>
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: bold; color: #f59e0b;">${stats.needsCleaningRooms}</div>
                            <div style="font-size: 10px; color: var(--text-muted);">Needs Clean</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: bold; color: #ef4444;">${stats.maintenanceRooms}</div>
                            <div style="font-size: 10px; color: var(--text-muted);">Maintenance</div>
                        </div>
                    </div>
                </div>

                <!-- Right: Search & Filters -->
                <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                    <div class="input-group" style="width: 220px; margin: 0;">
                        <i class="fas fa-search" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                        <input type="text" id="campSearchInput" class="form-control" placeholder="Search Room or Emp..." style="padding-left: 40px; height: 36px; font-size: 13px;" oninput="renderCampDashboard()" value="${currentSearchValue}">
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-outline" id="filterAll" onclick="setCampFilter('All')" style="border-color: var(--border-color); color: var(--text-main); padding: 5px 10px; font-size: 12px; ${campCurrentFilter==='All' ? 'background: rgba(255,255,255,0.1)' : ''}">All</button>
                        <button class="btn btn-outline" id="filterAvailable" onclick="setCampFilter('Available')" style="border-color: #10b981; color: #10b981; padding: 5px 10px; font-size: 12px; ${campCurrentFilter==='Available' ? 'background: #10b98120' : ''}">Available</button>
                        <button class="btn btn-outline" id="filterOccupied" onclick="setCampFilter('Occupied')" style="border-color: #3b82f6; color: #3b82f6; padding: 5px 10px; font-size: 12px; ${campCurrentFilter==='Occupied' ? 'background: #3b82f620' : ''}">Occupied</button>
                        <button class="btn btn-outline" id="filterMaintenance" onclick="setCampFilter('Maintenance')" style="border-color: #ef4444; color: #ef4444; padding: 5px 10px; font-size: 12px; ${campCurrentFilter==='Maintenance' ? 'background: #ef444420' : ''}">Maint.</button>
                        <button class="btn btn-outline"  style="border-color: #8b5cf6; color: #8b5cf6; padding: 5px 10px; font-size: 12px; margin-left: 10px; font-weight:bold; box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);">🗺️ Live Map</button>
                    </div>
                </div>
            </div>
        `;

        
        // Calculate Unassigned (Smart Alert)
        let unassignedAlertsHTML = '';
        if (window.POBAgent && window.DataAgent) {
            const today = new Date();
            const pobData = window.POBAgent.calculatePOB(employees, today.getTime(), window.DataAgent);
            
            // Find who is onDuty but NOT in any room occupants array
            const unassignedStaff = pobData.onDuty.filter(emp => {
                return !window.AccommodationAgent.rooms.some(r => r.occupants.some(o => String(o.ID) === String(emp.ID)));
            });

            if (unassignedStaff.length > 0) {
                unassignedAlertsHTML += `
                    <div style="background: rgba(245,158,11,0.1); border-left: 4px solid #f59e0b; padding: 12px 15px; border-radius: 4px; display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                        <span style="color: #fcd34d;"><strong>Smart Alert:</strong> ${unassignedStaff.length} On-Duty personnel are currently unassigned to any room! <a href="#" style="color:#f59e0b; text-decoration:underline;" onclick="syncCampOccupancy()">Auto-Assign Now</a></span>
                    </div>
                `;
            }
        }
        
        const alertsPanel = document.getElementById('campSmartAlerts');
        if (unassignedAlertsHTML) {
            alertsPanel.innerHTML = unassignedAlertsHTML;
            alertsPanel.style.display = 'flex';
        } else {
            alertsPanel.style.display = 'none';
            alertsPanel.innerHTML = '';
        }

        const searchQuery = (document.getElementById('campSearchInput')?.value || '').toLowerCase();
        
        // Render Blocks
        let blocksHTML = '';
        window.AccommodationAgent.blocks.forEach(blockName => {
            let blockRooms = window.AccommodationAgent.rooms.filter(r => r.block === blockName);
            
            // Apply Filters
            if (campCurrentFilter !== 'All') {
                blockRooms = blockRooms.filter(r => r.status === campCurrentFilter);
            }
            
            // Apply Search
            if (searchQuery) {
                blockRooms = blockRooms.filter(r => {
                    if (r.id.toLowerCase().includes(searchQuery)) return true;
                    if (r.occupants.some(o => o.Name.toLowerCase().includes(searchQuery) || String(o.ID).includes(searchQuery))) return true;
                    if (r.owners.some(ownerId => {
                        const ownerEmp = employees.find(e => String(e.ID) === String(ownerId));
                        return ownerEmp && (ownerEmp.Name.toLowerCase().includes(searchQuery) || String(ownerEmp.ID).includes(searchQuery));
                    })) return true;
                    return false;
                });
            }
            
            if (blockRooms.length === 0) return; // Skip empty blocks

            blocksHTML += `
                <div class="card" id="campBlockCard_${blockName}" ondblclick="toggleBlockFullscreen('${blockName}')" style="padding: 15px; border-top: 4px solid #3b82f6; transition: all 0.3s ease; position: relative;">
                    <h3 style="margin-top:0; display:flex; justify-content:space-between; align-items:center; user-select: none; color: var(--text-main);">
                        <span>Block ${blockName} <i class="fas fa-expand" onclick="toggleBlockFullscreen('${blockName}')" style="cursor: pointer; margin-left: 10px; font-size: 14px; opacity: 0.5;" title="Double click card to expand/collapse"></i></span>
                        <span style="font-size: 12px; font-weight:normal; background:rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 10px;">${stats.blockStats[blockName].occupied} / ${stats.blockStats[blockName].total} Beds</span>
                    </h3>
                    <div id="campBlockGrid_${blockName}" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:10px; margin-top: 15px; max-height: 400px; overflow-y:auto; padding-right:5px; transition: max-height 0.3s ease; align-content: start;">
            `;
            
            blockRooms.forEach(room => {
                let badgeColor = '#10b981';
                let icon = 'fa-door-open';
                if (room.status === 'Occupied') { badgeColor = '#3b82f6'; icon = 'fa-bed'; }
                if (room.status === 'NeedsCleaning') { badgeColor = '#f59e0b'; icon = 'fa-broom'; }
                if (room.status === 'Maintenance') { badgeColor = '#ef4444'; icon = 'fa-tools'; }
                
                let badgeGlow = room.status === 'Available' ? 'rgba(16, 185, 129, 0.4)' : (room.status === 'Occupied' ? 'rgba(59, 130, 246, 0.4)' : (room.status === 'NeedsCleaning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'));
                
                let occNames = room.occupants.map(o => o.Name.split(' ')[0]).join(', ');
                let isSearched = searchQuery && (room.id.toLowerCase().includes(searchQuery) || occNames.toLowerCase().includes(searchQuery));
                let borderHighlight = isSearched ? `border: 2px solid ${badgeColor}; box-shadow: 0 0 15px ${badgeColor}60;` : `border: 1px solid rgba(255,255,255,0.05);`;

                blocksHTML += `
                    <div class="room-card-ui" onclick="openRoomManagementModal('${room.id}')" style="cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.03); ${borderHighlight} padding: 12px; border-radius: 8px; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; overflow:hidden;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                        <div class="room-card-top-bar" style="position:absolute; top:0; left:0; width:100%; height:4px; background:${badgeColor}; box-shadow: 0 0 10px ${badgeGlow};"></div>
                        <i class="fas ${icon}" style="font-size: 20px; color: ${badgeColor}; margin-top:5px; margin-bottom:8px; filter: drop-shadow(0 0 5px ${badgeGlow});"></i>
                        <strong style="color: #ffffff; font-size: 16px; letter-spacing: 0.5px; font-weight: 600;">${room.id}</strong>
                        <div style="font-size: 10px; color: #93c5fd; margin-top:2px; display:flex; align-items:center; gap:4px;">
                            <i class="fas fa-phone-alt" style="font-size: 9px;"></i> ${room.extension || 'N/A'}
                        </div>
                        <div style="font-size:12px; color:#e2e8f0; margin-top:6px; font-weight: 500;">
                            ${room.occupants.length}/${room.beds} Beds
                        </div>
                        <div style="font-size:12px; margin-top:5px; color:#ffffff; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600;">
                            ${occNames || '<span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Empty</span>'}
                        </div>
                    </div>
                `;
            });
            
            blocksHTML += `</div></div>`;
        });
        
        document.getElementById('campBlocksContainer').innerHTML = blocksHTML;
    }
    
    function syncCampOccupancy() {
        if (!window.AccommodationAgent || !window.POBAgent || !window.DataAgent) return;
        
        const today = new Date();
        const pobData = window.POBAgent.calculatePOB(employees, today.getTime(), window.DataAgent);
        
        const result = window.AccommodationAgent.syncOccupancy(pobData.onDuty);
        
        renderCampDashboard();
        
        let msgs = [];
        if (result.unassigned.length > 0) {
            msgs.push(`⚠️ ${result.unassigned.length} people could not be assigned rooms (Camp Full)!`);
        }
        if (result.alerts && result.alerts.length > 0) {
            msgs = msgs.concat(result.alerts);
        }
        
        if (msgs.length > 0) {
            Swal.fire({
                title: 'Sync Alerts',
                html: msgs.join('<br><br>'),
                icon: 'warning',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)'
            });
        } else {
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Camp Occupancy Synced', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
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
            document.getElementById('profileName').innerText = getDisplayName(emp);
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
        let defaultDuration = 28; // Standard Oil & Gas rotation (28 days)

        if (records && records.length > 0) {
            const sorted = [...records].sort((a,b) => parseDate(a.end) - parseDate(b.end));
            const lastRecord = sorted[sorted.length - 1];
            dateStr = addOneDay(lastRecord.end);
            type = lastRecord.type === 'work' ? 'leave' : 'work';
            
            // Smart Prediction: Inherit the duration of the previous period
            const lastDuration = Math.floor((parseDate(lastRecord.end) - parseDate(lastRecord.start)) / 86400000) + 1;
            if (lastDuration > 0 && lastDuration < 100) {
                defaultDuration = lastDuration; // Inherit 28, 14, etc.
            }
        }
        
        let endDate = parseDate(dateStr);
        endDate.setDate(endDate.getDate() + defaultDuration - 1);
        let endDateStr = formatDateRaw(endDate);
        
        let newRecord = {
            id: Date.now(),
            type: type,
            start: dateStr,
            end: endDateStr
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
        if(!dateStr || dateStr === 'N/A') return 'N/A';
        const date = parseDate(dateStr);
        if (date.getTime() === 0 && dateStr.includes('-')) {
             const p = dateStr.split('-');
             if(p.length===3) return `\u200E${p[2]} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(p[1])-1]} ${p[0]}\u200E`;
             return `\u200E${dateStr}\u200E`;
        }
        const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const month = date.getMonth();
        return `\u200E${day} ${enMonths[month]} ${year}\u200E`;
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

    function magicAutoBuild() {
        Swal.fire({
            title: '🪄 Magic Auto-Build',
            html: `Generate a full year of rotations instantly!<br><br>
                   <label style="color:var(--text-main); font-size:14px; display:block; text-align:left; margin-bottom:5px;">Starting Date (First Work Day):</label>
                   <input type="date" id="magicStartDate" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-main); margin-bottom:15px; outline:none;">
                   <label style="color:var(--text-main); font-size:14px; display:block; text-align:left; margin-bottom:5px;">Rotation Pattern:</label>
                   <select id="magicPattern" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-main); outline:none;">
                       <option value="28">28 Work / 28 Leave (PetroMasila Standard)</option>
                       <option value="14">14 Work / 14 Leave</option>
                   </select>`,
            background: 'var(--card-bg)',
            color: 'var(--text-main)',
            showCancelButton: true,
            confirmButtonText: '✨ Generate Now',
            confirmButtonColor: '#8b5cf6',
            preConfirm: () => {
                return {
                    start: document.getElementById('magicStartDate').value,
                    pattern: parseInt(document.getElementById('magicPattern').value)
                }
            }
        }).then((res) => {
            if(res.isConfirmed && res.value.start) {
                let currentStart = parseDate(res.value.start);
                let duration = res.value.pattern;
                // Generate 12 periods (6 work + 6 leave)
                for(let i = 0; i < 12; i++) {
                    let type = (i % 2 === 0) ? 'work' : 'leave';
                    
                    let endD = new Date(currentStart);
                    endD.setDate(endD.getDate() + duration - 1);
                    
                    records.push({
                        id: 'magic_' + Date.now() + '_' + i,
                        type: type,
                        start: formatDateRaw(currentStart),
                        end: formatDateRaw(endD)
                    });
                    
                    // next period starts day after
                    currentStart = new Date(endD);
                    currentStart.setDate(currentStart.getDate() + 1);
                }
                saveData(); renderTable(); updateStats();
                Swal.fire({
                    title: 'Magic Complete! 🪄',
                    text: 'A full year of rotations has been automatically built.',
                    icon: 'success',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)'
                });
            }
        });
    }

    function savePeriod() {
        const type = document.getElementById('periodType').value;
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        if (!start || !end) return Swal.fire({icon: 'warning', title: 'Oops', text: 'Please select dates.'});
        if (parseDate(end) < parseDate(start)) return Swal.fire({icon: 'error', title: 'Invalid Dates', text: 'End date must be after start date.'});

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
            title: 'Delete Rotation Period?',
            html: 'Are you sure you want to delete <b>only this specific period</b>?<br><small style="color:var(--text-muted);">This action cannot be undone.</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--secondary)',
            confirmButtonText: 'Yes, delete this period!',
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
        
        // --- Critical Bug Fix: Ensure Unique IDs for all records ---
        let seenIds = new Set();
        records.forEach((r, idx) => {
            if (!r.id || r.id === 'undefined' || seenIds.has(String(r.id))) {
                r.id = 'rot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            seenIds.add(String(r.id));
        });
        // -----------------------------------------------------------

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
                        } else if (r.type === 'annual_leave') {
                            badge = '';
                            label = '<span style="background: #3b82f6; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Annual Leave</span>';
                        } else if (r.type === 'emergency_leave') {
                            badge = '';
                            label = '<span style="background: #ef4444; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Emergency Leave</span>';
                        } else if (r.type === 'unpaid_leave') {
                            badge = '';
                            label = '<span style="background: #f59e0b; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Unpaid Leave</span>';
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
        return; // Deprecated Gantt View removed
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
        let w=0, l=0, sl=0, el=0;
        const currentYear = new Date().getFullYear();
        
        // Use a Map to resolve overlaps. Exceptions overwrite normal work blocks.
        const daysMap = new Map();
        
        // 1. Process Exceptions / Leaves First (Higher Priority)
        records.filter(r => r.isOverride).forEach(r => {
            const start = parseDate(r.start);
            const end = parseDate(r.end);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                daysMap.set(d.toISOString().split('T')[0], r.type);
            }
        });
        
        // 2. Process Base Rotations
        records.filter(r => !r.isOverride).forEach(r => {
            const start = parseDate(r.start);
            const end = parseDate(r.end);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                // Base rotations only claim days that haven't been claimed by an exception
                if (!daysMap.has(dateStr)) {
                    daysMap.set(dateStr, r.type);
                }
            }
        });

        // Determine cutoff date: from first entry to the end of the current rotation period
        let cutoffDate = new Date().toISOString().split('T')[0]; // fallback to today
        const sortedBase = records.filter(r => !r.isOverride).sort((a,b) => parseDate(a.start) - parseDate(b.start));
        
        let foundActive = false;
        for (let i = 0; i < sortedBase.length; i++) {
             const r = sortedBase[i];
             if (r.start <= cutoffDate && r.end >= cutoffDate) {
                 foundActive = true;
                 cutoffDate = r.end;
                 // If currently in a work period, include the corresponding paired leave/rest period to balance
                 if (r.type === 'work' && i + 1 < sortedBase.length) {
                     const next = sortedBase[i+1];
                     if (next.type === 'leave' || next.type === 'annual_leave' || next.type === 'rest') {
                         cutoffDate = next.end;
                     }
                 }
                 break;
             }
        }
        
        if (!foundActive) {
             const past = sortedBase.filter(r => r.end < cutoffDate);
             if (past.length > 0) {
                 cutoffDate = past[past.length - 1].end;
             }
        }

        // Count totals from the very beginning up to the calculated cutoff date
        daysMap.forEach((type, dateStr) => {
            if (dateStr <= cutoffDate) {
                if (type === 'work') { w++; }
                else if (type === 'leave' || type === 'annual_leave') { l++; }
                else if (type === 'sick_leave') { sl++; }
                else if (type === 'emergency_leave' || type === 'unpaid_leave') { el++; }
            }
        });
        
        // 3. Count days and build the heatmap grid
        const timelineGrid = document.getElementById('yearlyTimelineGrid');
        if (timelineGrid) {
            timelineGrid.innerHTML = '';
            document.getElementById('yearlyTimelineContainer').style.display = 'block';
            
            // Build 365 blocks for visualization
            const firstDay = new Date(currentYear, 0, 1);
            const lastDay = new Date(currentYear, 11, 31);
            for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const type = daysMap.get(dateStr) || 'none';
                
                let color = 'rgba(255, 255, 255, 0.05)';
                
                // Color mapping
                if (type === 'work') { color = '#10b981'; }
                else if (type === 'leave' || type === 'annual_leave') { color = '#3b82f6'; }
                else if (type === 'sick_leave') { color = '#8b5cf6'; }
                else if (type === 'emergency_leave' || type === 'unpaid_leave') { color = '#ef4444'; }
                else if (type === 'rest') { color = 'rgba(255, 255, 255, 0.1)'; } // Rest days get slightly lighter grey
                
                const block = document.createElement('div');
                block.style.cssText = `flex: 1; min-width: 2px; height: 30px; background-color: ${color}; border-radius: 1px; cursor: pointer; transition: transform 0.1s;`;
                block.title = `${dateStr}: ${type}`;
                
                block.onmouseover = () => block.style.transform = 'scale(1.5)';
                block.onmouseout = () => block.style.transform = 'scale(1)';
                
                block.onclick = function() {
                    if (type === 'none') {
                        Swal.fire('No Data', `Date: ${dateStr}<br>No attendance record.`, 'question');
                        return;
                    }
                    
                    // Find the matching rotation record for this date
                    const matchingRecord = records.find(r => r.start <= dateStr && r.end >= dateStr && (!r.isOverride || daysMap.get(dateStr) === r.type));
                    
                    if (matchingRecord) {
                        const days = daysBetween(matchingRecord.start, matchingRecord.end);
                        let typeLabel = matchingRecord.type;
                        let iconType = 'info';
                        
                        if(typeLabel === 'work') { typeLabel = '💼 Work Duty (فترة دوام)'; iconType = 'success'; }
                        else if(typeLabel === 'leave' || typeLabel === 'annual_leave') { typeLabel = '✈️ Annual Leave (إجازة سنوية)'; iconType = 'info'; }
                        else if(typeLabel === 'sick_leave') { typeLabel = '🤒 Sick Leave (إجازة مرضية)'; iconType = 'warning'; }
                        else if(typeLabel === 'emergency_leave' || typeLabel === 'unpaid_leave') { typeLabel = '🚨 Emergency/Unpaid (طوارئ)'; iconType = 'error'; }
                        else if(typeLabel === 'rest') { typeLabel = '☕ Rest (فترة راحة)'; iconType = 'info'; }
                        
                        Swal.fire({
                            title: typeLabel,
                            html: `<div style="text-align: left; background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; margin-top: 10px;">
                                   <div style="margin-bottom: 8px;"><b>Start Date:</b> <span style="float: right;" dir="ltr">${formatDisplayDate(matchingRecord.start)}</span></div>
                                   <div style="margin-bottom: 8px;"><b>End Date:</b> <span style="float: right;" dir="ltr">${formatDisplayDate(matchingRecord.end)}</span></div>
                                   <div><b>Duration:</b> <strong style="float: right; color: var(--primary);">${days} Days</strong></div>
                                   </div>`,
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'var(--primary)'
                        });
                    } else {
                        // Fallback if it's an overridden day that doesn't cleanly match one single record block
                        Swal.fire('Info', `<b>Date:</b> ${dateStr}<br><b>Type:</b> ${type}`, 'info');
                    }
                };
                
                timelineGrid.appendChild(block);
            }
        }
        
        if(document.getElementById('totalWork')) document.getElementById('totalWork').innerText = w;
        if(document.getElementById('totalLeave')) document.getElementById('totalLeave').innerText = l;
        if(document.getElementById('totalSick')) document.getElementById('totalSick').innerText = sl;
        if(document.getElementById('totalEmerg')) document.getElementById('totalEmerg').innerText = el;
    }
    function exportToCSV() {
        if(!records.length) return Swal.fire({icon: 'info', text: 'لا يوجد بيانات'});
        let csv = "Cycle,Type,Start Date,End Date,Days\n";
        records.forEach((r, i) => {
            const label = r.type === 'work' ? 'Work' : (r.type === 'rest' ? 'Rest' : 'Leave');
            csv += `${Math.floor(i/3)+1},${label},${formatDisplayDate(r.start)},${formatDisplayDate(r.end)},${daysBetween(r.start, r.end)}\n`;
        });
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}));
        a.download = 'دورات.csv'; a.click();
    }

    // ---------------------------------
    // Smart Time Ledger Engine
    // ---------------------------------
    function calculateTimeLedger(emp) {
        let baseEntitlement = emp.Base_Entitlement_Days || 28;
        let companyDebt = 0;
        let relieverDebt = 0;
        let totalCredits = 0;
        
        if (!emp.TimeLedger) emp.TimeLedger = [];
        
        emp.TimeLedger.forEach(txn => {
            // Child transactions (Settlements) don't count towards active balance directly, 
            // they just update the Parent's remaining_days. 
            if (txn.type === 'SETTLEMENT') return; 
            if (txn.status === 'SETTLED') return;
            
            const days = typeof txn.remaining_days !== 'undefined' ? txn.remaining_days : txn.original_days;
            if (days <= 0) return;
            
            if (txn.type === 'DEBT') {
                if (txn.entity === 'COMPANY') companyDebt += days;
                else if (txn.entity === 'RELIEVER') relieverDebt += days;
            } else if (txn.type === 'CREDIT') {
                totalCredits += days;
            }
        });
        
        const netOffDays = baseEntitlement - companyDebt - relieverDebt + totalCredits;
        
        return {
            baseEntitlement,
            companyDebt,
            relieverDebt,
            totalCredits,
            netOffDays
        };
    }

    function generateTxnId() {
        return 'txn_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
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
            
            // ✅ Sort employees by ID numerically (ascending)
            employees.sort((a, b) => {
                const idA = parseInt(a.ID, 10) || Number.MAX_SAFE_INTEGER;
                const idB = parseInt(b.ID, 10) || Number.MAX_SAFE_INTEGER;
                return idA - idB;
            });
            
            employees.forEach(e => {
                if (!e.Destination && e.Department) e.Destination = e.Department;
            });
            filteredEmployees = [...employees];
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initEmployees();
                initCharts();
                if (typeof filterEmployees === 'function') filterEmployees();
                if (typeof detectConflicts === 'function') detectConflicts();
            }
        }
    });

    // --- TEMPORARY SYNC FOR EMPLOYEE 192 ---
    setTimeout(() => {
        if (typeof EMPLOYEE_DATA !== 'undefined') {
            const emp192 = EMPLOYEE_DATA.find(e => String(e.ID) === '192');
            if (emp192 && emp192.Rotations && emp192.Rotations.length > 0) {
                db.collection("employees").doc("192").set(emp192)
                  .then(() => console.log("Force updated 192 in Firebase!"))
                  .catch(err => console.error("Error force updating 192", err));
            }
        }
    }, 4000);
    // ---------------------------------------

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

        const tsCompanyFilter = document.getElementById('timesheetCompanyFilter');
        if (tsCompanyFilter) {
            const currentTsVal = tsCompanyFilter.value;
            tsCompanyFilter.innerHTML = '<option value="All">All Companies</option>' + sortedCompanies.map(c => `<option value="${c}">${c}</option>`).join('');
            if (sortedCompanies.includes(currentTsVal) || currentTsVal === 'All') tsCompanyFilter.value = currentTsVal;
        }

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
    let hasCheckedAutoSnapshots = false;

    function initEmployees() {
        // Unique Companies and Departments
        const companies = [...new Set(employees.map(e => e.Company).filter(Boolean))].sort();
        const depts = [...new Set(employees.map(e => e.Destination).filter(Boolean))].sort();

        // Call it to populate Add/Edit modals
        populateCompanyAndDestDropdowns();

        renderEmployees();
        
        if (!hasCheckedAutoSnapshots) {
            hasCheckedAutoSnapshots = true;
            if (typeof autoGenerateMissingSnapshots === 'function') {
                autoGenerateMissingSnapshots();
            }
        }
    }

    let isNightShiftFilterActive = false;
    window.toggleNightShiftFilter = function() {
        isNightShiftFilterActive = !isNightShiftFilterActive;
        const btn = document.getElementById('nightShiftFilterBtn');
        if (isNightShiftFilterActive) {
            btn.style.background = 'var(--secondary)';
            btn.style.color = '#ffffff';
        } else {
            btn.style.background = 'rgba(0, 180, 216, 0.15)';
            btn.style.color = 'var(--secondary)';
        }
        filterEmployees();
    };

    function filterEmployees() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const todayNum = parseDate(formatDateRaw(new Date())).getTime();
        filteredEmployees = employees.filter(e => {
            const matchSearch = (e.Name && e.Name.toLowerCase().includes(search)) || 
                                (e.ID && String(e.ID).toLowerCase().includes(search)) ||
                                (e.Company && e.Company.toLowerCase().includes(search)) ||
                                (e.Destination && e.Destination.toLowerCase().includes(search));
            if (!matchSearch) return false;
            
            if (isNightShiftFilterActive && !e.DayNightShift) return false;
            
            let currentStatus = getEmployeeCurrentStatusForDate(e, todayNum);
            
            if (currentStatus === 'standby_cover') currentStatus = 'work';
            if (currentStatus === 'rest') currentStatus = 'leave';
            
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
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

        // Update Headers UI
        document.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        document.getElementById('sort-' + col).classList.add(sortAsc ? 'sort-asc' : 'sort-desc');

        renderEmployees();
    }

    let currentPage = 1;
    const rowsPerPage = 50;

    function changeMainPage(dir) {
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        currentPage += dir;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages || 1;
        renderEmployees();
    }

    window.openLedgerBreakdown = function(empId) {
        currentLedgerEmpId = empId;
        var emp = employees.find(function(e) { return String(e.ID) === String(empId); });
        if (!emp) return;

        var calc = calculateTimeLedger(emp);

        var customStyle = `
        <style>
            .magic-ledger-container {
                z-index: 9999999 !important;
            }
            .magic-ledger-popup {
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%) !important;
                border: 1px solid rgba(139, 92, 246, 0.3);
                box-shadow: 0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.1) !important;
                border-radius: 24px !important;
                backdrop-filter: blur(16px);
                max-width: 95vw !important; /* Ensure it stays wide */
                padding: 30px !important;
            }
            .magic-ledger-title {
                font-size: 32px !important;
                background: linear-gradient(to right, #a855f7, #38bdf8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800 !important;
                margin-bottom: 10px !important;
                text-align: center;
                text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
            }
            .ml-kpi-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
                margin-top: 20px;
            }
            .ml-kpi-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 25px 20px;
                border-radius: 16px;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            .ml-kpi-card::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
                background: var(--glow-color);
                box-shadow: 0 0 15px var(--glow-color);
            }
            .ml-kpi-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.06);
                box-shadow: 0 10px 30px -10px var(--glow-color);
                border-color: rgba(255, 255, 255, 0.1);
            }
            .ml-kpi-value {
                font-size: 36px;
                font-weight: 900;
                color: var(--glow-color);
                margin-bottom: 5px;
                text-shadow: 0 0 15px var(--glow-color);
            }
            .ml-kpi-label {
                font-size: 14px;
                color: #cbd5e1;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            .ml-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 40px 0 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .ml-section-title {
                color: #e2e8f0;
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .ml-table-wrapper {
                overflow-x: auto;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .ml-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                min-width: 800px;
            }
            .ml-table th {
                padding: 15px 20px;
                font-size: 13px;
                color: #94a3b8;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                background: rgba(255, 255, 255, 0.02);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                white-space: nowrap;
            }
            .ml-table td {
                padding: 15px 20px;
                font-size: 14px;
                color: #e2e8f0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                white-space: nowrap;
                vertical-align: middle;
            }
            .ml-table tbody tr:hover {
                background: rgba(255, 255, 255, 0.04);
            }
            .ml-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            .ml-btn-add {
                background: linear-gradient(135deg, #38bdf8, #8b5cf6);
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
            }
            .ml-btn-add:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5);
            }
            .ml-btn-settle {
                background: transparent;
                border: 1px solid #10b981;
                color: #10b981;
                padding: 6px 15px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .ml-btn-settle:hover {
                background: rgba(16, 185, 129, 0.1);
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
            }
            .swal2-close {
                color: #94a3b8 !important;
                transition: color 0.3s !important;
            }
            .swal2-close:hover {
                color: #f87171 !important;
            }
        </style>`;

        var kpiHtml = '<div class="ml-kpi-container">' +
            '<div class="ml-kpi-card" style="--glow-color: #38bdf8;">' +
                '<div class="ml-kpi-value">' + calc.netOffDays + '</div>' +
                '<div class="ml-kpi-label">Net OFF Days</div></div>' +
            '<div class="ml-kpi-card" style="--glow-color: #ef4444;">' +
                '<div class="ml-kpi-value">' + calc.companyDebt + '</div>' +
                '<div class="ml-kpi-label">Owed to Company</div></div>' +
            '<div class="ml-kpi-card" style="--glow-color: #f59e0b;">' +
                '<div class="ml-kpi-value">' + calc.relieverDebt + '</div>' +
                '<div class="ml-kpi-label">Owed to Reliever</div></div>' +
            '<div class="ml-kpi-card" style="--glow-color: #10b981;">' +
                '<div class="ml-kpi-value">' + calc.totalCredits + '</div>' +
                '<div class="ml-kpi-label">Company Credits</div></div>' +
        '</div>';

        var parentRows = '';
        var childRows = '';
        if (emp.TimeLedger && emp.TimeLedger.length > 0) {
            emp.TimeLedger.filter(function(t){ return t.type !== 'SETTLEMENT'; })
                .sort(function(a,b){ return new Date(b.date) - new Date(a.date); })
                .forEach(function(p) {
                    var original = p.original_days || 0;
                    var remaining = typeof p.remaining_days !== 'undefined' ? p.remaining_days : original;
                    var progress = original > 0 ? ((original - remaining) / original) * 100 : 0;
                    var sc = p.status === 'SETTLED' ? '#10b981' : (p.status === 'PARTIAL' ? '#f59e0b' : '#ef4444');
                    parentRows += '<tr>' +
                        '<td style="color:#64748b; font-family: monospace;">' + p.id + '</td>' +
                        '<td>' + p.date + '</td>' +
                        '<td style="font-weight:bold;">' + (p.type === 'DEBT' ? '🔻' : '🟩') + ' ' + p.type + '</td>' +
                        '<td>' + p.entity + (p.related_employee_id ? ' <span style="color:#94a3b8">(' + p.related_employee_id + ')</span>' : '') + '</td>' +
                        '<td>' + original + '</td>' +
                        '<td style="font-weight:bold;color:' + sc + '; font-size: 16px;">' + remaining + '</td>' +
                        '<td><span class="ml-badge" style="background:' + sc + '22;color:' + sc + ';">' + p.status + '</span></td>' +
                        '<td style="width:120px;"><div style="width:100%;height:6px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden;"><div style="width:' + progress + '%;height:100%;background:' + sc + ';border-radius:3px;box-shadow:0 0 5px '+sc+';"></div></div></td>' +
                        '<td>' + (p.type === 'DEBT' && remaining > 0 ? '<button class="ml-btn-settle" onclick="Swal.close(); setTimeout(function(){ window.openSettlementModal(\'' + p.id + '\',' + remaining + '); }, 300);">Settle</button>' : '<span style="color:#64748b;">-</span>') + '</td></tr>';
                });

            emp.TimeLedger.filter(function(t){ return t.type === 'SETTLEMENT'; })
                .sort(function(a,b){ return new Date(b.date) - new Date(a.date); })
                .forEach(function(c) {
                    var mc = c.settlementMethod === 'WAIVER' ? '#a855f7' : (c.settlementMethod === 'PAYROLL' ? '#ec4899' : '#38bdf8');
                    childRows += '<tr>' +
                        '<td style="color:#64748b; font-family: monospace;">' + c.id + '</td>' +
                        '<td>' + c.date + '</td>' +
                        '<td><span class="ml-badge" style="background:' + mc + '22;color:' + mc + ';">' + c.settlementMethod + '</span></td>' +
                        '<td style="font-weight:bold;color:#10b981; font-size: 16px;">-' + c.days + '</td>' +
                        '<td style="color:#64748b; font-family: monospace;">' + c.parentId + '</td>' +
                        '<td style="color:#94a3b8; max-width:250px; overflow:hidden; text-overflow:ellipsis;" title="' + (c.reason || '') + '">' + (c.reason || '-') + '</td></tr>';
                });
        }

        var parentTable = '<div class="ml-section-header">' +
            '<h4 class="ml-section-title">✨ Active Debts & Credits</h4>' +
            '<button class="ml-btn-add" onclick="Swal.close(); setTimeout(function(){ window.openAddTransactionModal(); }, 300);">+ Add Transaction</button></div>' +
            '<div class="ml-table-wrapper"><table class="ml-table">' +
            '<thead><tr>' +
            '<th>ID</th><th>Date</th><th>Type</th><th>Entity</th><th>Original</th><th>Remaining</th><th>Status</th><th>Progress</th><th>Action</th>' +
            '</tr></thead>' +
            '<tbody>' + (parentRows || '<tr><td colspan="9" style="text-align:center;padding:40px;color:#64748b;font-size:16px;">No active transactions</td></tr>') + '</tbody></table></div>';

        var childTable = '<div class="ml-section-header" style="margin-top: 50px;">' +
            '<h4 class="ml-section-title">📜 Settlement History</h4></div>' +
            '<div class="ml-table-wrapper"><table class="ml-table">' +
            '<thead><tr>' +
            '<th>ID</th><th>Date</th><th>Method</th><th>Days</th><th>Parent Txn</th><th>Reason</th>' +
            '</tr></thead>' +
            '<tbody>' + (childRows || '<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;font-size:16px;">No settlement history</td></tr>') + '</tbody></table></div>';

        Swal.fire({
            title: '⚖️ Magic Ledger',
            html: '<h2 style="color:#94a3b8; font-size: 18px; margin-top: -15px; margin-bottom: 25px; font-weight: 500;">' + (emp.Name || empId) + '</h2>' + customStyle + kpiHtml + parentTable + childTable,
            width: '1100px',
            background: 'transparent',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: { 
                popup: 'magic-ledger-popup',
                title: 'magic-ledger-title',
                container: 'magic-ledger-container'
            }
        });
    };

    window.openAddTransactionModal = function() {
        document.getElementById('addTxnEmpId').value = currentLedgerEmpId;
        document.getElementById('addTxnType').value = 'DEBT';
        document.getElementById('addTxnEntity').value = 'COMPANY';
        document.getElementById('addTxnRelieverDiv').style.display = 'none';
        document.getElementById('addTxnRelieverId').value = '';
        document.getElementById('addTxnDays').value = '';
        document.getElementById('addTxnReason').value = '';
        document.getElementById('addTransactionModal').style.display = 'flex';
    };

    window.saveNewTransaction = function() {
        const empId = document.getElementById('addTxnEmpId').value;
        const type = document.getElementById('addTxnType').value;
        const entity = document.getElementById('addTxnEntity').value;
        const relieverId = document.getElementById('addTxnRelieverId').value;
        const days = parseInt(document.getElementById('addTxnDays').value);
        const reason = document.getElementById('addTxnReason').value;

        if (isNaN(days) || days <= 0) return Swal.fire('Error', 'Please enter valid days', 'error');
        if (entity === 'RELIEVER' && !relieverId) return Swal.fire('Error', 'Please enter Reliever ID', 'error');

        const emp = employees.find(e => String(e.ID) === String(empId));
        if (!emp) return;

        if (!emp.TimeLedger) emp.TimeLedger = [];

        const newTxn = {
            id: generateTxnId(),
            date: new Date().toISOString().split('T')[0],
            type: type,
            entity: entity,
            related_employee_id: entity === 'RELIEVER' ? relieverId : null,
            original_days: days,
            remaining_days: days,
            status: 'PENDING',
            reason: reason,
            loggedBy: 'Admin'
        };

        emp.TimeLedger.push(newTxn);

        db.collection("employees").doc(String(empId)).set({ TimeLedger: emp.TimeLedger }, { merge: true })
            .then(() => {
                Swal.fire('Success', 'Transaction Logged', 'success');
                document.getElementById('addTransactionModal').style.display = 'none';
                window.openLedgerBreakdown(empId); // refresh
                renderEmployees(); // refresh table kpis
            })
            .catch(e => Swal.fire('Error', e.message, 'error'));
    };

    window.openSettlementModal = function(parentId, remaining) {
        document.getElementById('settleEmpId').value = currentLedgerEmpId;
        document.getElementById('settleParentId').value = parentId;
        document.getElementById('settleTxnId').innerText = parentId;
        document.getElementById('settleRemaining').innerText = remaining;
        document.getElementById('settleDays').value = remaining;
        document.getElementById('settleDays').max = remaining;
        document.getElementById('settleMethod').value = 'WORK_BACK';
        document.getElementById('settleNote').value = '';
        document.getElementById('settlementModal').style.display = 'flex';
    };

    window.processSettlement = function() {
        const empId = document.getElementById('settleEmpId').value;
        const parentId = document.getElementById('settleParentId').value;
        const method = document.getElementById('settleMethod').value;
        const daysToSettle = parseInt(document.getElementById('settleDays').value);
        const note = document.getElementById('settleNote').value;

        if (isNaN(daysToSettle) || daysToSettle <= 0) return Swal.fire('Error', 'Invalid days', 'error');
        if (method === 'WAIVER' && !note.trim()) return Swal.fire('Warning', 'Waiver requires a mandatory reason/comment', 'warning');

        const emp = employees.find(e => String(e.ID) === String(empId));
        if (!emp || !emp.TimeLedger) return;

        const parentTxn = emp.TimeLedger.find(t => t.id === parentId);
        if (!parentTxn) return;

        if (daysToSettle > parentTxn.remaining_days) return Swal.fire('Error', 'Cannot settle more than remaining days', 'error');

        // 1. Create Child Transaction
        const childTxn = {
            id: generateTxnId(),
            date: new Date().toISOString().split('T')[0],
            type: 'SETTLEMENT',
            parentId: parentId,
            settlementMethod: method,
            days: daysToSettle,
            reason: note,
            loggedBy: 'Admin'
        };
        emp.TimeLedger.push(childTxn);

        // 2. Update Parent
        parentTxn.remaining_days -= daysToSettle;
        if (parentTxn.remaining_days === 0) {
            parentTxn.status = 'SETTLED';
        } else {
            parentTxn.status = 'PARTIAL';
        }

        db.collection("employees").doc(String(empId)).set({ TimeLedger: emp.TimeLedger }, { merge: true })
            .then(() => {
                Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Settlement Processed', showConfirmButton:false, timer:2000, background:'rgba(15, 23, 42, 0.9)', color:'white' });
                document.getElementById('settlementModal').style.display = 'none';
                window.openLedgerBreakdown(empId); // refresh modal
                renderEmployees(); // refresh KPIs
            })
            .catch(e => Swal.fire('Error', e.message, 'error'));
    };

    function renderEmployees() {
        const tbody = document.getElementById('employeesBody');
        if (filteredEmployees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div>🔍</div><h3>لا توجد نتائج</h3></div></td></tr>`;
            document.getElementById('mainPageNum').innerText = '1';
            document.getElementById('mainPageTotal').innerText = '1';
            document.getElementById('mainPrevBtn').disabled = true;
            document.getElementById('mainNextBtn').disabled = true;
            return;
        }

        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        if (currentPage > totalPages) currentPage = totalPages || 1;
        
        document.getElementById('mainPageNum').innerText = currentPage;
        document.getElementById('mainPageTotal').innerText = totalPages;
        document.getElementById('mainPrevBtn').disabled = (currentPage === 1);
        document.getElementById('mainNextBtn').disabled = (currentPage === totalPages);

        const startIdx = (currentPage - 1) * rowsPerPage;
        const pagedEmployees = filteredEmployees.slice(startIdx, startIdx + rowsPerPage);

        let html = '';
        const d = new Date();
        const todayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayNum = parseDate(todayStr).getTime();

        // ------------------ SMART ALERTS LOGIC (News Ticker) ------------------
        const tomorrowNum = todayNum + (24 * 3600 * 1000);
        let arrivals = [];
        let departures = [];

        filteredEmployees.forEach(e => {
            if (!e.Rotations) return;
            // Check for explicit blocks starting tomorrow
            e.Rotations.forEach(r => {
                const rStart = parseDate(r.start).getTime();
                if (rStart === tomorrowNum) {
                    if (r.type === 'work' || r.type === 'standby_cover') {
                        arrivals.push(e.Name);
                    } else if (r.type.includes('leave') || r.type === 'rest') {
                        departures.push(e.Name);
                    }
                }
            });
        });

        const alertsContainer = document.getElementById('smartAlertsContainer');
        if (alertsContainer) {
            if (arrivals.length > 0 || departures.length > 0) {
                let arrivalsStr = arrivals.map((name, i) => `<span style="background: rgba(0,0,0,0.15); color: #000; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; margin-right: 6px; font-size: 13px;">${i + 1}</span>${name}`).join(' &nbsp;&nbsp;&nbsp; ');
                let departuresStr = departures.map((name, i) => `<span style="background: rgba(0,0,0,0.15); color: #000; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; margin-right: 6px; font-size: 13px;">${i + 1}</span>${name}`).join(' &nbsp;&nbsp;&nbsp; ');

                let arrivalsText = arrivals.length > 0 ? `<span style="background: #10b981; color: #000; padding: 6px 20px; border-radius: 30px; font-weight: 700; font-size: 15px; margin-right: 15px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); display: inline-flex; align-items: center;">🟢 Arriving Tomorrow: &nbsp;&nbsp; ${arrivalsStr}</span>` : '';
                let departuresText = departures.length > 0 ? `<span style="background: #ef4444; color: #000; padding: 6px 20px; border-radius: 30px; font-weight: 700; font-size: 15px; margin-right: 50px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); display: inline-flex; align-items: center;">🔴 Departing Tomorrow: &nbsp;&nbsp; ${departuresStr}</span>` : '';
                
                let tickerContent = arrivalsText + departuresText;

                alertsContainer.innerHTML = `
                <style>
                @keyframes scrollTicker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .news-ticker-move:hover { animation-play-state: paused; }
                </style>
                <div style="overflow: hidden; white-space: nowrap; background: var(--input-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="font-weight: bold; color: var(--text-main); padding-right: 15px; border-right: 2px solid var(--glass-border); margin-right: 15px; z-index: 10; background: var(--input-bg); flex-shrink: 0; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-bolt" style="color: #f59e0b;"></i> Tomorrow's Movements
                    </div>
                    <div style="flex: 1; overflow: hidden; position: relative;">
                        <div class="news-ticker-move" style="display: inline-block; animation: scrollTicker 20s linear infinite; white-space: nowrap; cursor: pointer;">
                            ${tickerContent}
                            ${tickerContent}
                        </div>
                    </div>
                </div>`;
            } else {
                alertsContainer.innerHTML = '';
            }
        }
        // --------------------------------------------------------

        pagedEmployees.forEach(e => {
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

            let ringColor = 'rgba(255,255,255,0.2)';
            let glowColor = 'transparent';
            if (currentStatus === 'work' || currentStatus === 'standby_cover') {
                ringColor = '#10b981';
                glowColor = 'rgba(16,185,129,0.5)';
            } else if (currentStatus === 'leave' || currentStatus === 'rest') {
                ringColor = '#ffffff';
                glowColor = 'rgba(255,255,255,0.5)';
            } else if (currentStatus === 'sick_leave') {
                ringColor = '#ef4444';
                glowColor = 'rgba(239,68,68,0.5)';
            } else if (currentStatus === 'unknown') {
                ringColor = 'transparent';
                glowColor = 'transparent';
            } else {
                ringColor = '#f59e0b';
                glowColor = 'rgba(245,158,11,0.5)';
            }

            let avatarHtml = '';
            if (e.profilePic) {
                avatarHtml = `<img src="${e.profilePic}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 12px; border: 2px solid ${ringColor}; box-shadow: 0 0 10px ${glowColor};">`;
            } else {
                let initial = e.Name ? e.Name.charAt(0).toUpperCase() : '?';
                avatarHtml = `<div style="display:inline-flex; width: 32px; height: 32px; border-radius: 50%; background: var(--glass-bg); border: 2px solid ${ringColor}; box-shadow: 0 0 10px ${glowColor}; vertical-align: middle; margin-right: 12px; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: var(--text-main);">${initial}</div>`;
            }

            let b2bHtml = '';
            if (e.B2B_Alternate) {
                const alt = employees.find(emp => String(emp.ID) === String(e.B2B_Alternate));
                if (alt) {
                    b2bHtml = `<div style="font-size: 10px; color: #10b981; margin-top: 2px; margin-left: 36px;" title="B2B Alternate">🔄 ${alt.Name}</div>`;
                }
            }

            const ledger = calculateTimeLedger(e);
            let ledgerHtml = `<div style="display:flex; gap: 6px; flex-wrap: wrap;">
                <div onclick="window.openLedgerBreakdown('${e.ID}')" style="cursor: pointer; display:inline-flex; align-items:center; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 0 8px rgba(56, 189, 248, 0.1); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="Magic Ledger Breakdown">
                    ⚖️ ${ledger.netOffDays} OFF
                </div>`;
            
            if (ledger.companyDebt > 0) {
                ledgerHtml += `<div style="display:inline-flex; align-items:center; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);" title="Owed to Company">
                    🏢 -${ledger.companyDebt}
                </div>`;
            }
            if (ledger.relieverDebt > 0) {
                ledgerHtml += `<div style="display:inline-flex; align-items:center; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2);" title="Owed to Reliever">
                    🔄 -${ledger.relieverDebt}
                </div>`;
            }
            ledgerHtml += `</div>`;

            html += `<tr>
                <td data-label="ID"><strong>${e.ID || '-'}</strong></td>
                <td data-label="Name" onclick="openProfileCard('${e.ID}')" style="cursor: pointer; transition: all 0.2s;" title="View Profile">
                    <div style="display:flex; align-items:center;">${avatarHtml} <span style="font-weight: 500;">${e.Name || '-'}${e.Shift === 'Night' || e.Shift === 'Day/Night' ? ' <span title="Night/Rotating Shift" style="font-size:12px;">🌙</span>' : ''}</span></div>
                    ${b2bHtml}
                </td>
                <td data-label="Company">🏢 ${e.Company || '-'}</td>
                <td data-label="Department">💼 ${e.Department || '-'}</td>
                <td data-label="Destination">📍 ${e.Destination || '-'}</td>
                <td data-label="Status">
                    ${statusBadge}
                </td>
                <td data-label="Ledger">
                    ${ledgerHtml}
                </td>
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
                    if (['work', 'standby_cover'].includes(r.type)) {
                        arrivals.push({ emp, duration, end: r.end });
                    } else if (['leave', 'rest', 'annual_leave', 'sick_leave', 'emergency_leave', 'unpaid_leave'].includes(r.type)) {
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
                    <div style="font-weight: 600; color: white;">${getDisplayName(a.emp)}</div>
                </td>
                <td data-label="Company">🏢 ${a.emp.Company}</td>
                <td data-label="Destination">📍 ${a.isVisitor ? (a.emp.Destination || 'Unknown') : 'CPF'}</td>
                <td data-label="Remarks">
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7);">
                        🗓️ Work Period: ${a.duration} ${a.duration !== 'N/A' ? 'days' : ''}<br>
                        ${a.end !== 'N/A' ? `<span style="font-size: 11px; opacity: 0.7;">(until ${a.end})</span><br>` : ''}
                        ${a.emp.note ? `<span style="color: #00B4D8; font-weight: 600;">📝 Note: ${a.emp.note}</span>` : ''}
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
                    <div style="font-weight: 600; color: white;">${getDisplayName(d.emp)}</div>
                </td>
                <td data-label="Company">🏢 ${d.emp.Company}</td>
                <td data-label="Destination">📍 ${d.emp.Destination || 'Unknown'}</td>
                <td data-label="Remarks">
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7);">
                        🗓️ ${d.type === 'work' ? 'Work' : (d.type === 'rest' ? 'Rest' : (d.type === 'annual_leave' ? 'Annual Leave' : (d.type === 'sick_leave' ? 'Sick Leave' : (d.type === 'emergency_leave' ? 'Emergency Leave' : (d.type === 'unpaid_leave' ? 'Unpaid Leave' : 'Leave')))))}: ${d.duration} ${d.duration !== 'N/A' ? 'days' : ''}<br>
                        ${d.end !== 'N/A' ? `<span style="font-size: 11px; opacity: 0.7;">(until ${d.end})</span><br>` : ''}
                        ${d.emp.note ? `<span style="color: #f59e0b; font-weight: 600;">📝 Note: ${d.emp.note}</span>` : ''}
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
        dateRow.getCell(1).value = `Date: ${formatDisplayDate(dateStr)}`;
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
                        item.end !== 'N/A' ? formatDisplayDate(item.end) : item.end
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

        addTable('🛬 ARRIVALS (Back to Work)', 'FF10B981', 'FF059669', arrivals, true);
        addTable('🛫 DEPARTURES (Going on Leave)', 'FFF59E0B', 'FFD97706', departures, false);

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
            let currentStatus = getEmployeeCurrentStatusForDate(e, todayNum);

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
                    backgroundColor: ['#10b981', '#ffffff', '#ef4444', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                cutout: '75%', // Make donut thinner for center badge
                plugins: { 
                    legend: { 
                        position: 'top',
                        labels: { color: 'white', usePointStyle: true, padding: 15, font: { family: "'Inter', sans-serif", size: 11 } },
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
        // (compOnCounts and totalOn are now calculated in the main loop above to ensure they respect Overrides)

        // Update center badge total
        const centerBadge = document.getElementById('centerTotalValue');
        if (centerBadge) centerBadge.innerText = totalOn;

        const summaryContainer = document.getElementById('onDutySummary');
        if (summaryContainer) {
            let html = '<div style="width: 100%; display: flex; flex-direction: column; gap: 12px; padding: 0 5px;">';
            
            // Update the title badge
            const badge = document.getElementById('pobTotalBadge');
            if (badge) badge.innerText = totalOn;
            
            // Find max count to calculate bar widths
            const maxCount = Math.max(...Object.values(compOnCounts), 1);
            
            // Sort companies by count descending
            const sortedCompanies = Object.entries(compOnCounts).sort((a,b) => b[1] - a[1]);
            
            for (const [company, count] of sortedCompanies) {
                const widthPercent = (count / maxCount) * 100;
                html += `
                    <div class="company-bar-row" style="display: flex; align-items: center; width: 100%; padding: 8px 12px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: default;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='scale(1.02) translateX(5px)';" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.transform='scale(1) translateX(0)';">
                        <div style="width: 110px; text-align: left; padding-right: 10px; font-size: 12px; font-weight: 600; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 5px rgba(255,255,255,0.1);" title="${company}">
                            <i class="fas fa-building" style="color: #f97316; margin-right: 5px; opacity: 0.8;"></i> ${company}
                        </div>
                        <div style="flex-grow: 1; background: rgba(0,0,0,0.3); height: 12px; border-radius: 6px; overflow: hidden; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                            <div style="width: ${widthPercent}%; background: linear-gradient(90deg, #ea580c, #f97316, #fb923c); height: 100%; border-radius: 6px; box-shadow: 0 0 10px rgba(249, 115, 22, 0.5); animation: fillBar 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; position: relative;">
                                <!-- Glowing tip -->
                                <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 15px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8)); filter: blur(2px);"></div>
                            </div>
                        </div>
                        <div style="width: 40px; text-align: right; padding-left: 10px; font-weight: 900; font-size: 16px; color: #fff; text-shadow: 0 0 10px rgba(249, 115, 22, 0.8);">
                            ${count}
                        </div>
                    </div>`;
            }
            html += '</div>';
                
            summaryContainer.innerHTML = html || '<div style="color: #64748b; text-align:center; margin-top: 20px;">No employees currently ON duty</div>';
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

    function populateB2BDatalist(inputId, excludeIds = []) {
        if (!Array.isArray(excludeIds)) {
            excludeIds = excludeIds ? [String(excludeIds)] : [];
        } else {
            excludeIds = excludeIds.map(id => String(id));
        }

        const input = document.getElementById(inputId);
        if (!input) return;
        
        // Remove native list attribute if any
        input.removeAttribute("list");
        
        // Wrap input if not wrapped
        if (!input.parentNode.classList.contains('autocomplete-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'autocomplete-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            const dropdown = document.createElement('div');
            dropdown.className = 'autocomplete-dropdown';
            dropdown.id = inputId + '-dropdown';
            wrapper.appendChild(dropdown);
            
            input.addEventListener('input', function() {
                filterAutocomplete(this, dropdown.id, window[`${inputId}_exclude`] || []);
            });
            input.addEventListener('focus', function() {
                filterAutocomplete(this, dropdown.id, window[`${inputId}_exclude`] || []);
            });
            document.addEventListener('click', function(e) {
                if (e.target !== input && e.target !== dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        }
        
        // Store exclude list on window for dynamic updates
        window[`${inputId}_exclude`] = excludeIds;
    }

    function filterAutocomplete(input, dropdownId, excludeIds) {
        const val = input.value.toLowerCase().trim();
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '';
        let count = 0;
        
        let matches = [];
        employees.forEach(emp => {
            if (excludeIds.includes(String(emp.ID))) return;
            
            const text = `${emp.ID} - ${emp.Name}`;
            const textLower = text.toLowerCase();
            const nameLower = emp.Name.toLowerCase();
            
            if (val === '') {
                matches.push({ text: text, score: 0 });
            } else if (textLower.includes(val)) {
                let score = 0;
                if (String(emp.ID).startsWith(val)) score = 100;
                else if (nameLower.startsWith(val)) score = 90;
                else if (nameLower.includes(' ' + val)) score = 80;
                else score = 50 - textLower.indexOf(val);
                
                matches.push({ text: text, score: score });
            }
        });
        
        // Sort matches by highest score first
        matches.sort((a, b) => b.score - a.score);
        
        matches.forEach(match => {
            const item = document.createElement('div');
            // Highlight the matched part for better UX
            if (val !== '') {
                const regex = new RegExp(`(${val})`, "gi");
                item.innerHTML = match.text.replace(regex, `<span style="color: var(--primary); font-weight: bold;">$1</span>`);
            } else {
                item.textContent = match.text;
            }
            
            item.onclick = function() {
                input.value = match.text;
                dropdown.style.display = 'none';
                const evt = new Event('change');
                input.dispatchEvent(evt);
            };
            dropdown.appendChild(item);
            count++;
        });
        
        if (count > 0) {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    function openAddEmployeeModal() {
        populateB2BDatalist('newEmpB2B');
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
        const dayNightShift = document.getElementById('newEmpDayNightShift') ? document.getElementById('newEmpDayNightShift').checked : false;
        
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
        let b2bVal = document.getElementById('newEmpB2B').value;
        let b2b = null;
        if (b2bVal) {
            const match = b2bVal.match(/^(\d+)/);
            if (match) b2b = match[1];
        }

        const newEmp = {
            ID: id,
            Name: name,
            Company: company || 'N/A',
            Department: dept || 'N/A',
            Destination: dest || 'N/A',
            Phone: phone || '',
            B2B_Alternate: b2b || null,
            profilePic: profilePicData,
            Rotations: [],
            DayNightShift: dayNightShift
        };
        
        // If an alternate was selected, mutually link them
        if (b2b) {
            const altEmp = employees.find(e => String(e.ID) === b2b);
            if (altEmp) {
                altEmp.B2B_Alternate = newEmp.ID;
                db.collection("employees").doc(String(altEmp.ID)).set(altEmp).catch(e => console.error("Firebase sync error", e));
            }
        }
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
        if (document.getElementById('newEmpDayNightShift')) {
            document.getElementById('newEmpDayNightShift').checked = false;
            const newLabel = document.getElementById('newEmpDayNightShiftText');
            if (newLabel) {
                newLabel.style.opacity = '0.4';
                newLabel.style.color = 'var(--text-main)';
            }
        }
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
        document.getElementById('editEmpDayNightShift').checked = !!emp.DayNightShift;
        const editLabel = document.getElementById('editEmpDayNightShiftText');
        if (editLabel) {
            editLabel.style.opacity = emp.DayNightShift ? '1' : '0.4';
            editLabel.style.color = emp.DayNightShift ? 'var(--secondary)' : 'var(--text-main)';
        }
        document.getElementById('editEmpCompany').value = emp.Company === 'N/A' ? '' : (emp.Company || '');
        document.getElementById('editEmpDept').value = emp.Department === 'N/A' ? '' : (emp.Department || '');
        document.getElementById('editEmpDest').value = emp.Destination === 'N/A' ? '' : (emp.Destination || '');
        document.getElementById('editEmpPhone').value = emp.Phone || '';
        
        populateB2BDatalist('editEmpB2B', emp.ID);
        if (emp.B2B_Alternate) {
            const alt = employees.find(e => String(e.ID) === String(emp.B2B_Alternate));
            document.getElementById('editEmpB2B').value = alt ? `${alt.ID} - ${alt.Name}` : emp.B2B_Alternate;
        } else {
            document.getElementById('editEmpB2B').value = '';
        }
        
        document.getElementById('editEmpNotes').value = emp.Notes || '';

        
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
        const dayNight = document.getElementById('editEmpDayNightShift').checked;
        const company = document.getElementById('editEmpCompany').value.trim();
        const dept = document.getElementById('editEmpDept').value.trim();
        const dest = document.getElementById('editEmpDest').value.trim();
        const phone = document.getElementById('editEmpPhone').value.trim();
        
        if (!name) {
            return Swal.fire('Error', 'Name is required.', 'error');
        }
        
        emp.Name = name;
        emp.DayNightShift = dayNight;
        emp.Company = company || 'N/A';
        emp.Department = dept || 'N/A';
        emp.Destination = dest || 'N/A';
        emp.Phone = phone || '';
        emp.Notes = document.getElementById('editEmpNotes').value.trim();
        
        const oldB2B = emp.B2B_Alternate;
        let newB2BVal = document.getElementById('editEmpB2B').value;
        let newB2B = null;
        if (newB2BVal) {
            const match = newB2BVal.match(/^(\d+)/);
            if (match) newB2B = match[1];
        }
        emp.B2B_Alternate = newB2B || null;
        
        // Handle mutual linking
        if (oldB2B !== newB2B) {
            // Unlink old
            if (oldB2B) {
                const oldAlt = employees.find(e => String(e.ID) === oldB2B);
                if (oldAlt) {
                    oldAlt.B2B_Alternate = null;
                    db.collection("employees").doc(String(oldAlt.ID)).set(oldAlt).catch(e => console.error(e));
                }
            }
            // Link new
            if (newB2B) {
                const newAlt = employees.find(e => String(e.ID) === newB2B);
                if (newAlt) {
                    newAlt.B2B_Alternate = emp.ID;
                    db.collection("employees").doc(String(newAlt.ID)).set(newAlt).catch(e => console.error(e));
                }
            }
        }
        
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
            document.getElementById('profileName').innerText = getDisplayName(emp);
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
        
        // --- NEW LOGIC: Default 'Local' employees to 'work' ---
        const isLocal = (e.Destination && e.Destination.toLowerCase().includes('local')) || 
                        (e.Company && e.Company.toLowerCase().includes('local')) ||
                        (e.Department && e.Department.toLowerCase().includes('local'));
                        
        if (isLocal) {
            baseStatus = 'work';
        }
        
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
        
        // --- NEW LOGIC: Respect Custom Movements ---
        if (typeof visitorsData !== 'undefined') {
            const customMovement = visitorsData.find(v => String(v.id) === String(e.ID) && parseDate(v.date).getTime() === dateNum);
            if (customMovement) {
                currentStatus = customMovement.type; // override with 'work' or 'leave'
            }
        }
        
        return currentStatus;
    }

    let pobCurrentData = [];
    let isPobCompareMode = false;

    async function savePOBSnapshot(isAuto = false) {
        if (!employees || employees.length === 0) {
            if (!isAuto) Swal.fire('Wait', 'Data is still loading...', 'warning');
            return;
        }
        
        const todayStr = formatDateRaw(new Date());
        
        if (!isAuto) {
            const selectedDateStr = document.getElementById('pobArchiveDate').value;
            // Anti-Fraud Check: Ensure they are not trying to lock a past date
            if (selectedDateStr !== todayStr) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Action Denied ⛔',
                    text: `Access Denied! You can only lock the POB snapshot for today (${todayStr}).`
                });
            }
            
            // Confirmation before locking
            const confirm = await Swal.fire({
                title: 'Lock POB Snapshot?',
                text: `Are you sure you want to lock the Personnel On Board snapshot for ${todayStr}? This action will record the current state of all employees.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Lock it!'
            });
            
            if (!confirm.isConfirmed) return;
        }

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
                staffList.push({ id: e.ID, name: e.Name, company: comp, dept: e.Department || e.Destination || '-' });
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
            if (!isAuto) Swal.fire('Saved & Locked! 🔒', `Today's POB Snapshot (${todayStr}) has been securely archived.`, 'success');
            else console.log(`Auto-Saved Today's POB Snapshot (${todayStr}) at 11:59 PM`);
        } catch (err) {
            console.error(err);
            if (!isAuto) Swal.fire('Error', 'Failed to save snapshot.', 'error');
        }
    }

    async function autoGenerateMissingSnapshots() {
        if (!employees || employees.length === 0) return;
        
        try {
            const snapDocs = await db.collection('pob_archive').get();
            const existingDates = new Set();
            snapDocs.forEach(doc => existingDates.add(doc.id));
            
            const today = new Date();
            let snapshotsGenerated = 0;
            
            // Check past 14 days (excluding today)
            for (let i = 1; i <= 14; i++) {
                let d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
                const dateStr = formatDateRaw(d);
                
                if (!existingDates.has(dateStr)) {
                    const dateNum = parseDate(dateStr).getTime();
                    let compCounts = {};
                    let totalOn = 0;
                    let staffList = [];
                    
                    employees.forEach(e => {
                        const status = getEmployeeCurrentStatusForDate(e, dateNum);
                        if (status === 'work' || status === 'standby_cover') {
                            totalOn++;
                            const comp = e.Company || 'Unknown';
                            compCounts[comp] = (compCounts[comp] || 0) + 1;
                            staffList.push({ id: e.ID, name: e.Name, company: comp, dept: e.Department || e.Destination || '-' });
                        }
                    });
                    
                    const snapshot = {
                        date: dateStr,
                        timestamp: new Date().toISOString(),
                        total: totalOn,
                        companies: compCounts,
                        staff: staffList,
                        autoGenerated: true
                    };
                    
                    await db.collection('pob_archive').doc(dateStr).set(snapshot);
                    console.log(`Auto-generated missing snapshot for ${dateStr}`);
                    snapshotsGenerated++;
                }
            }
            
            if (snapshotsGenerated > 0 && typeof loadArchiveTree === 'function') {
                loadArchiveTree();
            }
        } catch(err) {
            console.error("Auto-snapshot failed:", err);
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
    
    async function loadArchiveTree() {
        const treeContainer = document.getElementById('pobArchiveTreeContainer');
        if (!treeContainer) return;
        treeContainer.innerHTML = '<div style="text-align:center; color: var(--text-muted); font-size: 14px; padding: 20px;"><i class="fa fa-spinner fa-spin"></i> Loading archive history...</div>';
        
        try {
            const snapshot = await db.collection('pob_archive').get();
            if (snapshot.empty) {
                treeContainer.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">No archived snapshots found yet.</div>';
                return;
            }
            
            // Group by Year -> Month -> Array of Docs
            const tree = {};
            snapshot.forEach(doc => {
                const dateId = doc.id; // YYYY-MM-DD
                const parts = dateId.split('-');
                if(parts.length === 3) {
                    const year = parts[0];
                    const month = parts[1];
                    if(!tree[year]) tree[year] = {};
                    if(!tree[year][month]) tree[year][month] = [];
                    tree[year][month].push(dateId);
                }
            });
            
            const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            let html = '<div class="archive-tree" style="display: flex; flex-direction: column; gap: 15px;">';
            // Sort years descending
            Object.keys(tree).sort((a,b) => b - a).forEach(year => {
                html += `
                <details class="tree-year" open style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 15px; box-shadow: var(--glass-shadow); transition: all 0.3s ease;">
                    <summary style="cursor: pointer; font-size: 18px; font-weight: 800; color: var(--secondary); list-style: none; display: flex; align-items: center; justify-content: space-between;">
                        <span style="display: flex; align-items: center; gap: 10px;">📅 ${year}</span>
                    </summary>
                    <div style="padding-left: 10px; margin-top: 15px; display: flex; flex-direction: column; gap: 12px;">`;
                
                // Sort months descending
                Object.keys(tree[year]).sort((a,b) => b - a).forEach(month => {
                    const monthName = monthNames[parseInt(month)];
                    html += `
                        <details class="tree-month" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px;">
                            <summary style="cursor: pointer; font-size: 15px; font-weight: 600; color: #cbd5e1; list-style: none; display: flex; align-items: center; justify-content: space-between; direction: ltr;">
                                <span>🗓️ ${monthName}</span>
                                <span style="font-size: 12px; color: var(--text-muted); background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px;">${tree[year][month].length} snapshots</span>
                            </summary>
                            <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 10px; direction: ltr;">`;
                    
                    // Sort days ascending (left to right)
                    tree[year][month].sort((a,b) => a.localeCompare(b)).forEach(dateId => {
                        const day = dateId.split('-')[2];
                        html += `
                                <button onclick="document.getElementById('pobArchiveDate').value='${dateId}'; loadPOBSnapshot();" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; font-weight: bold; padding: 8px 16px; border-radius: 50px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(16,185,129,0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(16,185,129,0.15)'; this.style.transform='translateY(0)';">
                                    Day ${day}
                                </button>`;
                    });
                    
                    html += `
                            </div>
                        </details>`;
                });
                
                html += `
                    </div>
                </details>`;
            });
            html += '</div>';
            
            treeContainer.innerHTML = html;
            
        } catch (err) {
            console.error(err);
            treeContainer.innerHTML = '<div style="text-align:center; color: var(--danger);">Error loading archive tree.</div>';
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
                compDiv.innerHTML += `<div style="background: rgba(16,185,129,0.15); padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid rgba(16,185,129,0.3);">
                    <strong style="color: #fff;">${comp}</strong>: <span style="color: #10b981; font-weight: bold;">${data.companies[comp]}</span>
                </div>`;
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
            deptFilter.innerHTML += `<option value="${d}">${d}</option>`;
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
                
                staffBody.innerHTML += `<tr style="${rowStyle}">
                    <td data-label="ID" style="text-align:center; width:80px;">${s.id || '-'}</td>
                    <td data-label="Name" style="text-align:left; direction: ltr;">${s.name || '-'}${actionBadge}</td>
                    <td data-label="Company" style="text-align:left; direction: ltr;"><span class="company-badge">${s.company || '-'}</span></td>
                    <td data-label="Department" style="text-align:left; direction: ltr;">${s.dept || '-'}</td>
                </tr>`;
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
            document.getElementById('pobTotalValue').innerHTML = `<span style="color:#10b981;">+${arrivals}</span> / <span style="color:#ef4444;">-${departures}</span>`;
            document.getElementById('pobDateValue').innerHTML = `<span style="font-size:16px;">${formatDisplayDate(dateA)}<br>vs<br>${formatDisplayDate(dateB)}</span>`;
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
        
        let csvContent = "data:text/csv;charset=utf-8,ID,Name,Company,Department,Status\n";
        filtered.forEach(s => {
            let status = 'ON';
            if (s.isArrival) status = 'ARRIVED';
            if (s.isDeparture) status = 'DEPARTED';
            csvContent += `${s.id},${s.name},${s.company || '-'},${s.dept || '-'},${status}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `POB_Archive_Export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function printPobReport() {
        const dateStr = document.getElementById('pobDateValue').innerText;
        const total = document.getElementById('pobTotalValue').innerText;
        let printContents = document.getElementById('pobTable').outerHTML;
        
        let printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`
            <html>
            <head>
                <title>POB Archive Report - ${dateStr}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
                    .header h1 { color: #0f172a; margin: 0 0 10px 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; }
                    .header h2 { color: #10b981; margin: 0 0 15px 0; font-size: 20px; }
                    .meta-info { display: flex; justify-content: space-between; font-size: 14px; color: #475569; font-weight: bold; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                    th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
                    th { background-color: #10b981; color: white; font-weight: bold; text-transform: uppercase; font-size: 13px; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>PetroMasila - BLK53</h1>
                    <h2>Personnel On Board (POB) Archive Report</h2>
                </div>
                
                <div class="meta-info">
                    <div>📅 Snapshot Date: <strong>${dateStr}</strong></div>
                    <div>👥 Total POB: <strong>${total} Personnel</strong></div>
                    <div>⏱️ Printed On: <strong>${new Date().toLocaleString('en-GB')}</strong></div>
                </div>

                ${printContents}
                
                <div class="footer">
                    Generated by HR-BLK53 System &copy; ${new Date().getFullYear()} PetroMasila
                </div>
            
</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    
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
            dropdown.innerHTML += `<option value="${e.ID}" ${selected}>${e.Name} (${e.ID})</option>`;
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
        const searchInput = document.getElementById('conflictSearchInput');
        if (searchInput) searchInput.value = '';
        
        // Delegate logic to DataAgent
        let conflicts = window.DataAgent ? window.DataAgent.detectConflicts(employees, 30) : [];
        
        // Load persistence
        const dismissed = JSON.parse(localStorage.getItem('dismissed_conflicts') || '[]');
        const snoozed = JSON.parse(localStorage.getItem('snoozed_conflicts') || '{}');
        const now = Date.now();
        
        // Filter out dismissed and active snoozed
        conflicts = conflicts.filter(c => {
            const id = btoa(unescape(encodeURIComponent(c.dateStr + '_' + c.msg))); // Unique ID hash
            c.hashId = id;
            if (dismissed.includes(id)) return false;
            if (snoozed[id] && now < snoozed[id]) return false;
            return true;
        });

        if (conflicts.length === 0) {
            notifList.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 14px;">No conflicts detected in the next 30 days. You\'re all good! 🎉</div>';
            notifBadge.style.display = 'none';
        } else {
            notifBadge.style.display = 'flex';
            notifBadge.innerText = conflicts.length;
            
            // Group by Date or just list them
            conflicts.sort((a,b) => new Date(a.dateStr) - new Date(b.dateStr)).forEach(c => {
                let icon = c.type === 'overlap' ? '⚠️' : '🚨';
                let border = c.type === 'overlap' ? '#f59e0b' : '#ef4444';
                let bg = c.type === 'overlap' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                
                let formattedDate = new Date(c.dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                
                notifList.innerHTML += `
                    <div class="conflict-item" id="conflict_${c.hashId}" style="background: ${bg}; border-left: 4px solid ${border}; padding: 10px; border-radius: 4px; font-size: 13px;">
                        <div class="conflict-action-btn conflict-snooze-btn" onclick="handleConflictAction('${c.hashId}', 'snooze')">
                            <i class="fas fa-clock"></i> Snooze
                        </div>
                        <div dir="ltr" style="font-weight: bold; margin-bottom: 5px; color: #fff; text-align: left;">${icon} ${formattedDate}</div>
                        <div style="color: rgba(255,255,255,0.8);">${c.msg}</div>
                        <div class="conflict-action-btn conflict-dismiss-btn" onclick="handleConflictAction('${c.hashId}', 'dismiss')">
                            <i class="fas fa-times"></i> Dismiss
                        </div>
                    </div>
                `;
            });
        }
    }

    function handleConflictAction(hashId, action) {
        const item = document.getElementById('conflict_' + hashId);
        if (item) {
            item.style.animation = 'fadeOutCollapse 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => {
                if(action === 'dismiss') {
                    const dismissed = JSON.parse(localStorage.getItem('dismissed_conflicts') || '[]');
                    if (!dismissed.includes(hashId)) { dismissed.push(hashId); localStorage.setItem('dismissed_conflicts', JSON.stringify(dismissed)); }
                } else if (action === 'snooze') {
                    const snoozed = JSON.parse(localStorage.getItem('snoozed_conflicts') || '{}');
                    snoozed[hashId] = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem('snoozed_conflicts', JSON.stringify(snoozed));
                }
                detectConflicts(); // Refresh list to update badge and UI
            }, 380);
        }
    }

    window.dismissAllConflicts = function() {
        const items = document.querySelectorAll('.conflict-item');
        if (items.length === 0) return;
        
        let dismissed = JSON.parse(localStorage.getItem('dismissed_conflicts') || '[]');
        items.forEach((item, index) => {
            const hashId = item.id.replace('conflict_', '');
            if (!dismissed.includes(hashId)) dismissed.push(hashId);
            setTimeout(() => {
                item.style.animation = 'fadeOutCollapse 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            }, index * 50); // Staggered animation
        });
        localStorage.setItem('dismissed_conflicts', JSON.stringify(dismissed));
        
        setTimeout(() => {
            detectConflicts();
        }, (items.length * 50) + 400);
    };

    function filterConflicts(query) {
        query = query.toLowerCase();
        const notifList = document.getElementById('notifList');
        const items = notifList.querySelectorAll('.conflict-item');
        let visibleCount = 0;
        
        items.forEach(item => {
            if (item.innerText.toLowerCase().includes(query)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        let emptyMsg = document.getElementById('conflictEmptyMsg');
        if (visibleCount === 0 && query !== '') {
            if (!emptyMsg) {
                notifList.innerHTML += `<div id="conflictEmptyMsg" style="text-align: center; color: var(--text-muted); font-size: 14px; padding: 20px;">No matches found.</div>`;
            } else {
                emptyMsg.style.display = 'block';
            }
        } else if (emptyMsg) {
            emptyMsg.style.display = 'none';
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
    
    // // Ensure today's field is prepopulated

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
                input.value = `${emp.ID} - ${emp.Name}`;
                return;
            }
        }
        // If not found or plain text
        delete input.dataset.empId;
    }
    
    function filterCustomEmployeeDropdown(query) {
        const dropdown = document.getElementById('customEmployeeDropdown');
        dropdown.innerHTML = '';
        
        let matched = employees;
        if (query) {
            const q = query.toLowerCase();
            matched = employees.filter(e => String(e.ID).includes(q) || String(e.Name).toLowerCase().includes(q));
        }
        
        if (matched.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        matched.slice(0, 100).forEach(emp => {
            const div = document.createElement('div');
            div.className = 'custom-dropdown-item';
            div.textContent = `${emp.ID} - ${emp.Name}`;
            div.onmousedown = (e) => {
                e.preventDefault(); // prevent input blur before click
                document.getElementById('visitorName').value = `${emp.ID} - ${emp.Name}`;
                dropdown.style.display = 'none';
                autoFillEmployee(`${emp.ID} - ${emp.Name}`);
            };
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    }

    // Close dropdown if clicked outside or input loses focus
    document.getElementById('visitorName').addEventListener('blur', function() {
        setTimeout(() => {
            document.getElementById('customEmployeeDropdown').style.display = 'none';
        }, 150);
    });

    function openVisitorModal() {
        const nameInput = document.getElementById('visitorName');
        nameInput.value = '';
        delete nameInput.dataset.empId;
        
        document.getElementById('customEmployeeDropdown').style.display = 'none';
        
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
        const note = document.getElementById('visitorNote').value.trim();
        
        if (!date) return Swal.fire('Error', 'Movement Date is required.', 'error');
        
        const proceedSave = () => {
            const newVisitor = {
                id: idStr,
                Name: name,
                Company: company,
                Destination: dest,
                type: moveType,
                date: date,
                note: note,
                isVisitor: isVisitorFlag
            };
            
            visitorsData.push(newVisitor);
            db.collection("system").doc("visitors_movements").set({ records: visitorsData }).then(() => {
                closeVisitorModal();
                document.getElementById('visitorNote').value = '';
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


    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js?v=2')
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
                renderTimesheetTable();
            } else {
                currentTimesheetData = {};
                // Automatically fill from rotations if not saved yet
                autoFillTimesheet(true); 
            }
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
        workbook.creator = 'PetroMasila Rotations System';
        const sheet = workbook.addWorksheet('Timesheet', {
            views: [{ state: 'frozen', ySplit: 5, xSplit: 3 }]
        });
        
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        // --- COLUMNS SETUP ---
        const cols = [
            { key: 'id', width: 15 },
            { key: 'shift', width: 5 },
            { key: 'name', width: 35 }
        ];
        for (let i = 1; i <= daysInMonth; i++) {
            cols.push({ key: 'd' + i, width: 6 });
        }
        cols.push({ key: 'total', width: 15 });
        cols.push({ key: 'status', width: 12 });
        sheet.columns = cols;

        // --- ROW 1: MAIN TITLE ---
        sheet.mergeCells(1, 1, 1, daysInMonth + 5);
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'PETROMASILA ROTATIONS SYSTEM - MONTHLY TIMESHEET';
        titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(1).height = 40;

        // --- ROW 2: SUBTITLE / METADATA ---
        sheet.mergeCells(2, 1, 2, daysInMonth + 5);
        const subTitleCell = sheet.getCell('A2');
        subTitleCell.value = `Month & Year: ${year}-${month}   |   Department: ${dept}   |   Company: ${company}`;
        subTitleCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF333333' } };
        subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } }; 
        subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(2).height = 30;

        // --- ROW 3: LEGEND ---
        sheet.mergeCells(3, 1, 3, daysInMonth + 5);
        const legendCell = sheet.getCell('A3');
        legendCell.value = 'LEGEND:   [ ON = On Duty (Green) ]     [ E = Emergency (Red) ]     [ X = Extra Days (Orange) ]     [ 🌙 = Night Shift ]     [ ☀️ = Day Shift ]';
        legendCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748b' } };
        legendCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(3).height = 25;

        // --- ROW 4: EMPTY SPACING ---
        sheet.addRow([]);

        // --- ROW 5: TABLE HEADERS ---
        const headerRowData = ['ID NO', 'S', 'Name'];
        for (let i = 1; i <= daysInMonth; i++) {
            headerRowData.push(String(i));
        }
        headerRowData.push('Total Days');
        headerRowData.push('Status');
        
        const headerRow = sheet.getRow(5);
        headerRow.values = headerRowData;
        headerRow.height = 35;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e293b' } };
            cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: {style:'medium', color: {argb:'FFcbd5e1'}}, left: {style:'medium', color: {argb:'FFcbd5e1'}}, bottom: {style:'medium', color: {argb:'FFcbd5e1'}}, right: {style:'medium', color: {argb:'FFcbd5e1'}} };
        });
        
        // --- TABLE DATA ---
        let filtered = employees;
        if (dept !== "All") filtered = filtered.filter(e => e.Department === dept);
        if (company !== "All") filtered = filtered.filter(e => e.Company === company);
        const shiftFilterEl = document.getElementById('timesheetShiftFilter');
        if (shiftFilterEl) {
            const shiftVal = shiftFilterEl.value;
            if (shiftVal === "Night") filtered = filtered.filter(e => e.DayNightShift === true);
            else if (shiftVal === "Day") filtered = filtered.filter(e => !e.DayNightShift);
        }
        
        let rowIndex = 6;
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            const shiftIcon = empData.shift === "Night" ? "🌙" : "☀️";
            const rowData = [emp.ID, shiftIcon, emp.Name];
            
            for (let i = 1; i <= daysInMonth; i++) {
                let dayVal = empData[i] || '';
                if (dayVal === '1') dayVal = 'ON';
                rowData.push(dayVal);
                if (dayVal === 'ON' || dayVal === 'E' || dayVal === 'X') {
                    totalDuty++;
                }
            }
            rowData.push(totalDuty);
            rowData.push("Regular");
            
            const dataRow = sheet.getRow(rowIndex);
            dataRow.values = rowData;
            dataRow.height = 25;
            
            // Style Data Row
            dataRow.eachCell((cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = { top: {style:'thin', color:{argb:'FFe2e8f0'}}, left: {style:'thin', color:{argb:'FFe2e8f0'}}, bottom: {style:'thin', color:{argb:'FFe2e8f0'}}, right: {style:'thin', color:{argb:'FFe2e8f0'}} };
                
                if (colNumber === 3) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left' };
                }
                
                if (cell.value === 'ON' || cell.value === 'X') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10b981' } };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                } else if (cell.value === 'E') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFef4444' } };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                } else if (colNumber > 3 && colNumber < (daysInMonth + 4) && !cell.value) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf1f5f9' } };
                }
            });
            
            rowIndex++;
        });

        // Write to Blob and Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Timesheet_${monthVal}_${dept}${company !== 'All' ? '_' + company : ''}.xlsx`;
        link.click();
    }

    function renderTimesheetTable() {
    try {
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
        const dayLetters = ['Su','Mo','Tu','We','Th','Fr','Sa'];
        let headHTML = `<th>ID</th><th>Name</th>`;
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
            const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
            const isToday = isCurrentMonth && (i === todayDate);
            const dayLetter = dayLetters[currentDayDate.getDay()];
            
            let thStyle = '';
            if (isToday) thStyle += 'box-shadow: inset 0 0 0 2px #f9a826; background: rgba(249, 168, 38, 0.1); color: #f9a826;';
            else if (isWeekend) thStyle += 'background: rgba(255, 255, 255, 0.05); color: rgba(255,255,255,0.4);';
            
            headHTML += `<th class="ts-day-col" style="${thStyle}"><div style="line-height:1.1;">${i}<br><span style="font-size:8px;font-weight:400;opacity:0.6;">${dayLetter}</span></div></th>`;
        }
        headHTML += `<th>Total</th><th>Status</th>`;
        document.getElementById('timesheetHeaderRow').innerHTML = headHTML;
        
        // Filter Employees
        let filtered = employees;
        if (dept !== "All") {
            filtered = filtered.filter(e => e.Department === dept);
        }
        if (company !== "All") {
            filtered = filtered.filter(e => e.Company === company);
        }
        const shiftFilterEl = document.getElementById('timesheetShiftFilter');
        if (shiftFilterEl) {
            const shiftVal = shiftFilterEl.value;
            if (shiftVal === "Night") {
                filtered = filtered.filter(e => e.DayNightShift === true);
            } else if (shiftVal === "Day") {
                filtered = filtered.filter(e => !e.DayNightShift);
            }
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
              
              const isNight = empData.shift === 'Night';
              const shiftIcon = isNight ? '&#127773;' : '&#9728;&#65039;';
              
              let rowHTML = `<tr>
                  <td>${emp.ID}</td>
                  <td style="white-space: nowrap;">
                      <span style="cursor:pointer; margin-right: 5px; font-size:16px; user-select:none;" onclick="toggleShift('${emp.ID}')" title="Toggle Shift">${shiftIcon}</span>
                      ${getDisplayName(emp)}
                  </td>`;
                
            for (let i = 1; i <= daysInMonth; i++) {
                const currentDayDate = new Date(parseInt(year), parseInt(month)-1, i);
                const isWeekend = currentDayDate.getDay() === 5 || currentDayDate.getDay() === 6;
                const isToday = isCurrentMonth && (i === todayDate);
                
                let extraStyle = '';
                if (isToday) extraStyle += 'box-shadow: inset 0 0 0 2px #f9a826; background-color: rgba(249, 168, 38, 0.05);';
                else if (isWeekend) extraStyle += 'background-color: rgba(0, 0, 0, 0.15);';
                
                const dayVal = empData[i] || '';
                let cellClass = 'ts-cell-empty';
                let displayChar = '';
                
                if (dayVal === '1' || dayVal === 'ON') { 
                    cellClass = 'ts-cell-ON'; 
                    displayChar = '✓';
                    totalDuty++; 
                    totalOnDuty++;
                    dailyCounts[i]++;
                }
                else if (dayVal === 'E') { 
                    cellClass = 'ts-cell-E'; 
                    displayChar = 'E';
                    totalDuty++; 
                    totalEmergency++;
                    dailyCounts[i]++;
                } 
                else if (dayVal === 'X') { 
                    cellClass = 'ts-cell-X'; 
                    displayChar = 'X';
                    totalDuty++; 
                    totalExtra++;
                    dailyCounts[i]++;
                }
                
                rowHTML += `<td class="ts-cell ts-day-cell ${cellClass}" style="${extraStyle}" onclick="toggleTsCell('${emp.ID}', ${i}, this)" data-val="${dayVal === '1' ? 'ON' : dayVal}">${displayChar}</td>`;
            }
            
            rowHTML += `<td id="ts_total_${emp.ID}" style="font-weight:bold; color: var(--primary); font-size:13px;">${totalDuty}</td>`;
            rowHTML += `<td style="color: var(--text-muted); font-size: 10px;">Reg</td>`;
            rowHTML += `</tr>`;
            
            bodyHTML += rowHTML;
        });
        
        
        document.getElementById('timesheetBody').innerHTML = bodyHTML;

        // --- MOBILE CARDS RENDER ---
        let cardsHTML = '';
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthName = monthNames[parseInt(month)-1];
        
        filtered.forEach(emp => {
            const empData = currentTimesheetData[emp.ID] || {};
            let totalDuty = 0;
            
            // Calculate Periods
            let periods = [];
            let currentPeriod = null;
            
            for(let i=1; i<=daysInMonth; i++) {
                let val = empData[i];
                if (val === '1' || val === 'ON' || val === 'E' || val === 'X') {
                    totalDuty++;
                    if (!currentPeriod) currentPeriod = { start: i, end: i };
                    else currentPeriod.end = i;
                } else {
                    if (currentPeriod) {
                        periods.push(currentPeriod);
                        currentPeriod = null;
                    }
                }
            }
            if (currentPeriod) periods.push(currentPeriod);
            
            let firstDay = periods.length > 0 ? periods[0].start : '-';
            let lastDay = periods.length > 0 ? periods[periods.length-1].end : '-';
            
            let fromText = firstDay !== '-' ? firstDay + ' ' + monthName : '-';
            let toText = lastDay !== '-' ? lastDay + ' ' + monthName : '-';
            
            const isNight = empData.shift === 'Night';
            const shiftIcon = isNight ? '&#127773;' : '&#9728;&#65039;';
            
            // Mini Grid
            let miniGridHTML = '';
            for(let i=1; i<=daysInMonth; i++) {
                const dayVal = empData[i] || '';
                let cellClass = 'ts-cell-empty';
                let statusText = '';
                
                if (dayVal === '1' || dayVal === 'ON') { cellClass = 'ts-cell-ON'; statusText = 'ON'; }
                else if (dayVal === 'E') { cellClass = 'ts-cell-E'; statusText = 'E'; }
                else if (dayVal === 'X') { cellClass = 'ts-cell-X'; statusText = 'X'; }
                
                const isToday = isCurrentMonth && (i === todayDate);
                let extraStyle = isToday ? 'border: 2px solid #f9a826; box-shadow: 0 0 8px rgba(249,168,38,0.4);' : '';
                
                miniGridHTML += `<div class="ts-mini-cell ${cellClass}" style="${extraStyle}" onclick="toggleTsCellMobile('${emp.ID}', ${i}, this)" data-val="${dayVal === '1' ? 'ON' : dayVal}" id="ts_mobile_${emp.ID}_${i}">
                    <span class="day-num">${i}</span>${statusText ? `<span class="day-status">${statusText}</span>` : ''}
                </div>`;
            }

            cardsHTML += `
              <div class="ts-mobile-card" id="ts_card_${emp.ID}">
                 <div class="ts-card-header">
                    <h4><span class="name-text">${getDisplayName(emp)}</span> <span class="ts-id">#${emp.ID}</span></h4>
                    <div style="font-size:20px; cursor:pointer; flex-shrink: 0;" onclick="toggleShift('${emp.ID}')" title="Toggle Shift">${shiftIcon}</div>
                 </div>
                 <div class="ts-card-stats">
                     <div class="stat-box">
                         <span class="stat-label">Total</span>
                         <span class="stat-value" id="ts_mob_total_${emp.ID}">${totalDuty}</span>
                     </div>
                     <div class="stat-box">
                         <span class="stat-label">From</span>
                         <span class="stat-value" id="ts_mob_from_${emp.ID}">${fromText}</span>
                     </div>
                     <div class="stat-box">
                         <span class="stat-label">To</span>
                         <span class="stat-value" id="ts_mob_to_${emp.ID}">${toText}</span>
                     </div>
                 </div>
                 <div class="ts-mini-grid-container">
                    <div class="ts-periods-title">
                        <span>Daily Grid</span>
                        <span style="font-size:11px; opacity:0.7;">Tap to edit</span>
                    </div>
                    <div class="ts-mini-grid">
                        ${miniGridHTML}
                    </div>
                 </div>
              </div>
            `;
        });
        
        document.getElementById('timesheetCardsContainer').innerHTML = cardsHTML;

        
        
    } catch (e) {
        Swal.fire("Error", e.message + e.stack, "error");
    }
}

    function toggleTsCell(empId, day, cellElement) {
        let currentVal = cellElement.getAttribute('data-val') || '';
        let newVal = '';
        let newClass = 'ts-cell-empty';
        let displayChar = '';
        
        if (currentVal === '') {
            newVal = '1'; newClass = 'ts-cell-ON'; displayChar = '✓';
        } else if (currentVal === '1' || currentVal === 'ON') {
            newVal = 'E'; newClass = 'ts-cell-E'; displayChar = 'E';
        } else if (currentVal === 'E') {
            newVal = 'X'; newClass = 'ts-cell-X'; displayChar = 'X';
        } else if (currentVal === 'X') {
            newVal = ''; newClass = 'ts-cell-empty'; displayChar = '';
        }
        
        cellElement.setAttribute('data-val', newVal);
        cellElement.innerText = displayChar;
        cellElement.className = `ts-cell ts-day-cell ${newClass}`;
        
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

    function toggleTsCellMobile(empId, day, cellElement) {
        let currentVal = cellElement.getAttribute('data-val') || '';
        let newVal = '';
        let newClass = 'ts-cell-empty';
        let statusText = '';
        
        if (currentVal === '') {
            newVal = '1'; newClass = 'ts-cell-ON'; statusText = 'ON';
        } else if (currentVal === '1' || currentVal === 'ON') {
            newVal = 'E'; newClass = 'ts-cell-E'; statusText = 'E';
        } else if (currentVal === 'E') {
            newVal = 'X'; newClass = 'ts-cell-X'; statusText = 'X';
        } else if (currentVal === 'X') {
            newVal = ''; newClass = 'ts-cell-empty'; statusText = '';
        }
        
        cellElement.setAttribute('data-val', newVal);
        cellElement.innerHTML = `<span class="day-num">${day}</span>${statusText ? `<span class="day-status">${statusText}</span>` : ''}`;
        cellElement.className = `ts-mini-cell ${newClass}`;
        
        if (!currentTimesheetData[empId]) currentTimesheetData[empId] = {};
        currentTimesheetData[empId][day] = newVal;
        
        recalcTsRowTotal(empId);
        updateMobileCardStats(empId);
    }
    
    function updateMobileCardStats(empId) {
        if (!currentTimesheetData[empId]) return;
        const empData = currentTimesheetData[empId];
        const monthVal = document.getElementById('timesheetMonth').value;
        if (!monthVal) return;
        const [year, month] = monthVal.split('-');
        const daysInMonth = getDaysInMonth(year, month);
        
        let totalDuty = 0;
        let periods = [];
        let currentPeriod = null;
        
        for(let i=1; i<=daysInMonth; i++) {
            let val = empData[i];
            if (val === '1' || val === 'ON' || val === 'E' || val === 'X') {
                totalDuty++;
                if (!currentPeriod) currentPeriod = { start: i, end: i };
                else currentPeriod.end = i;
            } else {
                if (currentPeriod) {
                    periods.push(currentPeriod);
                    currentPeriod = null;
                }
            }
        }
        if (currentPeriod) periods.push(currentPeriod);
        
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthName = monthNames[parseInt(month)-1];
        
        let firstDay = periods.length > 0 ? periods[0].start : '-';
        let lastDay = periods.length > 0 ? periods[periods.length-1].end : '-';
        
        let fromText = firstDay !== '-' ? firstDay + ' ' + monthName : '-';
        let toText = lastDay !== '-' ? lastDay + ' ' + monthName : '-';
        
        const totalEl = document.getElementById(`ts_mob_total_${empId}`);
        const fromEl = document.getElementById(`ts_mob_from_${empId}`);
        const toEl = document.getElementById(`ts_mob_to_${empId}`);
        
        if(totalEl) totalEl.innerText = totalDuty;
        if(fromEl) fromEl.innerText = fromText;
        if(toEl) toEl.innerText = toText;
    }

    function autoFillTimesheet(isInitialLoad = false) {
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
                
                // Keep intentional manual edits (if not an initial load and data already exists in cell, skip overwrite, unless user clicked Auto-Fill button manually which forces overwrite)
                // But since we want stability, let's just forcefully sync with rotations on Auto Fill
                
                if (status === 'work' || status === 'standby_cover') {
                    currentTimesheetData[emp.ID][i] = 'ON';
                } else if (status === 'sick_leave' || status === 'emergency' || status === 'sick') {
                    currentTimesheetData[emp.ID][i] = 'E';
                } else {
                    currentTimesheetData[emp.ID][i] = '';
                }
            }
        });
        
        renderTimesheetTable();
        if (!isInitialLoad) {
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Auto-filled from Rotations', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
        }
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


    let currentManagingRoomId = null;

    function switchRoomTab(tabName) {
        document.querySelectorAll('.room-tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('[id^="roomTab"][id$="Btn"]').forEach(el => {
            el.style.borderBottom = 'none';
            el.style.color = 'var(--text-muted)';
        });
        
        document.getElementById('roomTab' + tabName).style.display = 'block';
        const activeBtn = document.getElementById('roomTab' + tabName + 'Btn');
        activeBtn.style.borderBottom = '2px solid #3b82f6';
        activeBtn.style.color = '#fff';
    }

    function changeRoomStatusUI(newStatus) {
        if (!currentManagingRoomId) return;
        const success = window.AccommodationAgent.changeRoomStatus(currentManagingRoomId, newStatus);
        if (success) {
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Status Updated', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
            openRoomManagementModal(currentManagingRoomId);
            renderCampDashboard();
        }
    }

    function openRoomManagementModal(roomId) {
        try {
        if (!window.AccommodationAgent) { Swal.fire('Error', 'Agent not loaded', 'error'); return; }
        currentManagingRoomId = roomId;
        const room = window.AccommodationAgent.rooms.find(r => String(r.id) === String(roomId));
        if (!room) { Swal.fire('Error', 'Room ' + roomId + ' not found in data!', 'error'); return; }
        
        document.getElementById('roomModalTitle').innerHTML = 'Room ' + room.id + ' <span style="font-size:14px; color:#60a5fa; margin-left:10px;"><i class="fas fa-phone-alt" style="font-size:12px;"></i> Ext: ' + (room.extension || 'N/A') + '</span>';
        
        const badge = document.getElementById('roomModalStatusBadge');
        badge.innerText = room.status;
        if (room.status === 'Available') badge.style.background = '#10b98140';
        else if (room.status === 'NeedsCleaning') badge.style.background = '#f59e0b40';
        else if (room.status === 'Maintenance') badge.style.background = '#ef444440';
        else badge.style.background = '#3b82f640';

        document.getElementById('roomModalType').innerText = (room.type || 'Unknown').toUpperCase() + ' (' + (room.occupants ? room.occupants.length : 0) + '/' + (room.beds || 0) + ' Beds)';
        
        // Render History
        const historyList = document.getElementById('roomModalHistoryList');
        historyList.innerHTML = '';
        if (!room.history || room.history.length === 0) {
            historyList.innerHTML = '<div style="color:var(--text-muted); font-size:13px; text-align:center;">No history recorded yet.</div>';
        } else {
            // Reverse to show newest first
            [...room.history].reverse().forEach(log => {
                const dateStr = new Date(log.date).toLocaleString();
                historyList.innerHTML += `
                    <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px; border-left: 3px solid #3b82f6;">
                        <div style="font-size:11px; color:var(--text-muted); margin-bottom:3px;">${dateStr} - By: ${log.by}</div>
                        <div style="font-size:13px; color:#fff;">${log.action}</div>
                    </div>
                `;
            });
        }
        
        // Render Permanent Owners
        const ownersList = document.getElementById('roomModalOwnersList');
        ownersList.innerHTML = '';
        if (!room.owners || room.owners.length === 0) {
            ownersList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted);">No permanent owners assigned.</span>';
        } else {
            room.owners.forEach(ownerId => {
                const ownerEmp = employees.find(e => String(e.ID) === String(ownerId));
                if (ownerEmp) {
                    let altHTML = '';
                    if (ownerEmp.B2B_Alternate) {
                        const altEmp = employees.find(e => String(e.ID) === String(ownerEmp.B2B_Alternate));
                        if (altEmp) {
                            altHTML = ` <span style="color:#10b981; font-size:11px;" title="B2B Alternate">[🔄 ${altEmp.Name}]</span>`;
                        }
                    }
                    ownersList.innerHTML += `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 4px;">
                            <span onclick="checkInOwnerToRoomUI('${ownerId}')" style="font-size: 12px; color: #e2e8f0; cursor: pointer; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 3px;" title="Click to Check-In ${ownerEmp.Name}">
                                <i class="fas fa-key" style="margin-right: 5px; color: #f59e0b;"></i> ${ownerEmp.ID} - ${ownerEmp.Name}
                            </span>
                            <div>
                                ${altHTML}
                                <button onclick="removeOwnerFromRoomUI('${ownerId}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size: 14px; margin-left: 10px;" title="Remove Owner">&times;</button>
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        const occList = document.getElementById('roomOccupantsList');
        occList.innerHTML = '';
        
        if (room.occupants.length === 0) {
            occList.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center;">Room is currently empty.</div>';
        } else {
            room.occupants.forEach(emp => {
                occList.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div>
                            <div style="font-weight: bold; color: white;">${getDisplayName(emp)}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">${emp.Company} - ${emp.Department}</div>
                        </div>
                        <button class="btn btn-outline" style="border-color: #ef4444; color: #ef4444; padding: 4px 10px; font-size: 12px;" onclick="removeEmpFromRoom('${emp.ID}')">Check Out</button>
                    </div>
                `;
            });
        }

        const inputField = document.getElementById('roomEmpSelect');
        inputField.value = '';
        const currentOccupants = room.occupants.map(o => String(o.ID));
        populateB2BDatalist('roomEmpSelect', currentOccupants);
        
        const ownerInput = document.getElementById('roomOwnerSelect');
        if (ownerInput) {
            ownerInput.value = '';
            populateB2BDatalist('roomOwnerSelect');
        }

        if (room.occupants.length >= room.beds) {
            document.getElementById('addOccupantContainer').style.display = 'none';
            document.getElementById('addOccupantTitle').style.display = 'none';
        } else {
            document.getElementById('addOccupantContainer').style.display = 'flex';
            document.getElementById('addOccupantTitle').style.display = 'block';
        }

        const modal = document.getElementById('roomManagementModal');
        if (!modal) { Swal.fire('Error', 'Modal element not found in DOM!', 'error'); return; }
        
        // --- RADICAL FIX: Escape broken DOM hierarchy ---
        if (modal.parentNode !== document.body) {
            document.body.appendChild(modal);
        }
        
        modal.style.setProperty('display', 'block', 'important');
        modal.style.setProperty('opacity', '1', 'important');
        modal.style.setProperty('z-index', '2147483647', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('position', 'fixed', 'important');
        
        switchRoomTab('Info');
        
        } catch (e) {
            Swal.fire('Error', 'Failed to open room details: ' + e.message, 'error');
            console.error('Modal Error:', e);
        }
    }

    function closeRoomManagementModal() {
        document.getElementById('roomManagementModal').style.display = 'none';
        currentManagingRoomId = null;
    }

    function addEmpToRoom() {
        if (!currentManagingRoomId) return;
        const inputVal = document.getElementById('roomEmpSelect').value;
        if (!inputVal) {
            Swal.fire('Error', 'Please search and select an employee first.', 'error');
            return;
        }
        
        const empId = inputVal.split(' - ')[0].trim();
        const emp = employees.find(e => String(e.ID) === String(empId));
        if (!emp) return;
        
        // 1. Check if they are ALREADY physically in another room
        const currentRoom = window.AccommodationAgent.getEmployeeCurrentRoom(empId);
        if (currentRoom && String(currentRoom.id) !== String(currentManagingRoomId)) {
            Swal.fire({
                title: 'تنبيه (Already Occupying)',
                text: `هذا الموظف متواجد بالفعل وتم تسكينه في الغرفة رقم ${currentRoom.id}. هل تريد نقله إلى هذه الغرفة فعلاً؟`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'نعم، انقله هنا',
                cancelButtonText: 'إلغاء',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)'
            }).then((result) => {
                if (result.isConfirmed) {
                    checkOwnershipAndProceed(emp, empId, currentManagingRoomId);
                }
            });
        } else {
            checkOwnershipAndProceed(emp, empId, currentManagingRoomId);
        }
    }

    function checkOwnershipAndProceed(emp, empId, targetRoomId) {
        // 2. Check if they OWN a different room
        const ownedRoom = window.AccommodationAgent.getEmployeeOwnedRoom(empId);
        if (ownedRoom && String(ownedRoom.id) !== String(targetRoomId)) {
            Swal.fire({
                title: 'تنبيه ذكي (Smart Warning)',
                text: `غرفة الموظف (${emp.Name}) المخصصة له هي ${ownedRoom.id}. هل تريد تسكينه هنا فعلاً أم تجاهل؟`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'نعم، تسكينه هنا',
                cancelButtonText: 'إلغاء',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)'
            }).then((result) => {
                if (result.isConfirmed) {
                    performCheckIn(emp, targetRoomId);
                }
            });
        } else {
            performCheckIn(emp, targetRoomId);
        }
    }

    function performCheckIn(emp, roomId) {
        const success = window.AccommodationAgent.assignEmployeeToRoom(emp, roomId);
        
        if (success) {
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Checked In', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
            openRoomManagementModal(roomId);
            renderCampDashboard();
        } else {
            Swal.fire('Error', 'Could not assign room. It might be full.', 'error');
        }
    }

    function assignOwnerToRoomUI() {
        if (!currentManagingRoomId) return;
        const inputVal = document.getElementById('roomOwnerSelect').value;
        if (!inputVal) return;
        
        const empId = inputVal.split(' - ')[0].trim();
        const emp = employees.find(e => String(e.ID) === String(empId));
        if (!emp) return;

        window.AccommodationAgent.assignOwnerToRoom(emp, currentManagingRoomId);
        document.getElementById('roomOwnerSelect').value = '';

        if (emp.ReliefID) {
            const reliefEmp = employees.find(e => String(e.ID) === String(emp.ReliefID));
            if (reliefEmp) {
                Swal.fire({
                    title: 'تخصيص ذكي (Smart Allocation)',
                    text: `الموظف لديه بديل (${reliefEmp.Name}). هل تريد تخصيص هذه الغرفة للبديل أيضاً؟`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3b82f6',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'نعم، أضف البديل',
                    cancelButtonText: 'لا، الموظف فقط',
                    background: 'var(--glass-bg)',
                    color: 'var(--text-main)'
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.AccommodationAgent.assignOwnerToRoom(reliefEmp, currentManagingRoomId);
                    }
                    openRoomManagementModal(currentManagingRoomId);
                    renderCampDashboard();
                });
                return;
            }
        }
        
        openRoomManagementModal(currentManagingRoomId);
        renderCampDashboard();
    }

    function removeOwnerFromRoomUI(empId) {
        if (!currentManagingRoomId) return;
        window.AccommodationAgent.removeOwnerFromRoom(empId, currentManagingRoomId);
        openRoomManagementModal(currentManagingRoomId);
    }

    function checkInOwnerToRoomUI(empId) {
        if (!currentManagingRoomId) return;
        const emp = employees.find(e => String(e.ID) === String(empId));
        if (emp) {
            const success = window.AccommodationAgent.assignEmployeeToRoom(emp, currentManagingRoomId);
            if (success) {
                Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Checked In successfully', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
            } else {
                Swal.fire({ toast:true, position:'top-end', icon:'error', title:'Room is full or unavailable', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
            }
            openRoomManagementModal(currentManagingRoomId);
            renderCampDashboard();
        }
    }

    function removeEmpFromRoom(empId) {
        if (!currentManagingRoomId) return;
        
        Swal.fire({
            title: 'Check out?',
            text: "Remove this employee from the room?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, check out',
            background: 'var(--glass-bg)',
            color: 'var(--text-main)'
        }).then((result) => {
            if (result.isConfirmed) {
                window.AccommodationAgent.removeEmployeeFromRoom(empId);
                Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Checked Out', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'var(--text-main)' });
                openRoomManagementModal(currentManagingRoomId);
                renderCampDashboard();
            }
        });
    }


// ===================================================
// 📱 Mobile Back Button Navigation (History API)
// ===================================================
(function() {
    let _historySkipPush = false; // flag to avoid pushing state when popstate triggers switchTab
    
    // --- 1. Track tab navigation ---
    const _origSwitchTab = window.switchTab || switchTab;
    window.switchTab = function(tabId) {
        _origSwitchTab(tabId);
        if (!_historySkipPush) {
            history.pushState({ type: 'tab', tabId: tabId }, '', '#' + tabId);
        }
        // Scroll to top on tab switch (mobile convenience)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- 2. Track employee detail view ---
    const _origViewEmp = window.viewEmployeeRotations || viewEmployeeRotations;
    window.viewEmployeeRotations = function(id) {
        // Push employees tab state first (so back goes to employees)
        history.pushState({ type: 'tab', tabId: 'employees' }, '', '#employees');
        _origViewEmp(id);
        history.pushState({ type: 'employee', empId: id }, '', '#employee-' + id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- 3. Track modal opens ---
    function pushModalState(modalId) {
        history.pushState({ type: 'modal', modalId: modalId }, '', '#modal-' + modalId);
    }
    
    // Wrap modal open functions
    const modalOpenFuncs = {
        'addEmpModal': 'openAddEmployeeModal',
        'editEmpModal': 'openEditEmployeeModal', 
        'exceptionModal': 'openExceptionModal',
        'visitorModal': 'openVisitorModal',
        'visitorModal': 'openVisitorModal',
        'masterReportModal': 'openMasterReportModal'
        // 'roomManagementModal' is excluded from pushState to prevent glitches
    };
    
    Object.entries(modalOpenFuncs).forEach(([modalId, funcName]) => {
        if (typeof window[funcName] === 'function') {
            const origFunc = window[funcName];
            window[funcName] = function() {
                origFunc.apply(this, arguments);
                pushModalState(modalId);
            };
        }
    });
    
    // --- 4. Close all modals helper ---
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    function closeSpecificModal(modalId) {
        const closeFuncs = {
            'addEmpModal': typeof closeAddEmployeeModal === 'function' ? closeAddEmployeeModal : null,
            'editEmpModal': typeof closeEditEmployeeModal === 'function' ? closeEditEmployeeModal : null,
            'visitorModal': typeof closeVisitorModal === 'function' ? closeVisitorModal : null,
            'masterReportModal': typeof closeMasterReportModal === 'function' ? closeMasterReportModal : null,
            'roomManagementModal': typeof closeRoomManagementModal === 'function' ? closeRoomManagementModal : null,
            'exceptionModal': function() {
                const el = document.getElementById('exceptionModal');
                if (el) el.style.display = 'none';
            }
        };
        
        if (closeFuncs[modalId]) {
            closeFuncs[modalId]();
        } else {
            const el = document.getElementById(modalId);
            if (el) el.style.display = 'none';
        }
    }
    
    // --- 5. Handle back button (popstate) ---
    window.addEventListener('popstate', function(event) {
        const state = event.state;
        
        // Check if any modal is currently open
        const openModal = document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"], .modal[style*="display: flex"], .modal[style*="display:flex"]');
        if (openModal) {
            closeSpecificModal(openModal.id);
            return;
        }
        
        if (state) {
            if (state.type === 'tab') {
                _historySkipPush = true;
                _origSwitchTab(state.tabId);
                _historySkipPush = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (state.type === 'employee') {
                _historySkipPush = true;
                _origViewEmp(state.empId);
                _historySkipPush = false;
            }
        } else {
            // No state = go back to employees (default/home tab)
            _historySkipPush = true;
            _origSwitchTab('employees');
            _historySkipPush = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // --- 6. Set initial state ---
    history.replaceState({ type: 'tab', tabId: 'employees' }, '', '#employees');
    
})();


    // --- AI UI Logic ---
    function toggleAIChat() {
        const panel = document.getElementById('aiChatPanel');
        panel.classList.toggle('active');
        if(panel.classList.contains('active')) {
            document.getElementById('aiInput').focus();
            if(!localStorage.getItem('gemini_api_key')) {
                appendAIMessage("عذراً، يرجى إعداد مفتاح API الخاص بك أولاً من أيقونة الإعدادات (⚙️) لتتمكن من استخدامي.", "bot");
                openAISettings();
            }
        }
    }
    
    function toggleAIMaximize() {
        const panel = document.getElementById('aiChatPanel');
        panel.classList.toggle('maximized');
        const btn = document.getElementById('aiMaximizeBtn');
        if (panel.classList.contains('maximized')) {
            btn.innerText = '🗗';
        } else {
            btn.innerText = '🗖';
        }
    }
    
    function openAISettings() {
        document.getElementById('aiSettingsModal').style.display = 'flex';
        document.getElementById('aiApiKeyInput').value = localStorage.getItem('gemini_api_key') || '';
    }
    
    function closeAISettings() {
        document.getElementById('aiSettingsModal').style.display = 'none';
    }
    
    function saveAISettings() {
        const key = document.getElementById('aiApiKeyInput').value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            Swal.fire({toast:true, position:'top-end', icon:'success', title:'تم حفظ المفتاح', showConfirmButton:false, timer:2000, background:'var(--glass-bg)', color:'#fff'});
            closeAISettings();
        } else {
            Swal.fire('خطأ', 'يرجى إدخال مفتاح صحيح', 'error');
        }
    }

    function toggleAIPassword() {
        const input = document.getElementById('aiApiKeyInput');
        const btn = document.getElementById('aiToggleKeyBtn');
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
            btn.title = 'إخفاء المفتاح';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
            btn.title = 'إظهار المفتاح';
        }
    }
    
    function appendAIMessage(text, sender, isHTML=false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.dir = "auto"; // Auto-detect RTL/LTR
        if(isHTML) {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        const container = document.getElementById('aiMessages');
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    // --- Speech Recognition ---
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            document.getElementById('aiFab').classList.add('recording');
            document.getElementById('aiMicBtn').style.color = '#ef4444';
        };
        
        recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            document.getElementById('aiInput').value = text;
            sendAIMessage();
        };
        
        recognition.onerror = function(event) {
            console.error(event.error);
            stopAIVoiceUI();
        };
        
        recognition.onend = function() {
            stopAIVoiceUI();
        };
    }
    
    function stopAIVoiceUI() {
        document.getElementById('aiFab').classList.remove('recording');
        document.getElementById('aiMicBtn').style.color = 'white';
    }
    
    function toggleAIVoice() {
        if(!recognition) {
            Swal.fire('غير مدعوم', 'متصفحك لا يدعم التعرف على الصوت', 'warning');
            return;
        }
        if(document.getElementById('aiFab').classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }
    
    // --- Gemini API Logic ---
    let aiChatHistory = [];
    const AI_SYSTEM_PROMPT = `أنت مساعد ذكي واحترافي جداً لإدارة الموارد البشرية والسكن (HR & Camp Management).
مهمتك تقديم تحليلات دقيقة، تفصيلية، وواضحة جداً. 
استخدم الجداول لتنظيم البيانات إذا كانت طويلة، وضع ملخصاً واضحاً في البداية.
أجب باحترافية عالية، وتخيل أنك مدير تنفيذي يقرأ البيانات ويعطي قرارات ذكية. لا تستخدم ردوداً قصيرة جداً بل اشرح ووضح. استخدم لغة عربية سليمة وممتازة.`;
    
    async function sendAIMessage() {
        const input = document.getElementById('aiInput');
        const text = input.value.trim();
        if(!text) return;
        
        const apiKey = localStorage.getItem('gemini_api_key');
        if(!apiKey) {
            openAISettings();
            return;
        }
        
        appendAIMessage(text, "user");
        input.value = '';
        
        // Add to history
        aiChatHistory.push({ role: "user", parts: [{ text: text }] });
        
        // Show loading
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-msg bot';
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = '<span style="animation: pulseMic 1s infinite alternate;">جاري التفكير... 🧠</span>';
        document.getElementById('aiMessages').appendChild(loadingDiv);
        
        await callGeminiAPI(apiKey, loadingId);
    }
    
    function handleAIKeyPress(e) {
        if(e.key === 'Enter') sendAIMessage();
    }
    
    // ==========================================
    // 🧠 OLLAMA LOCAL LLM ENGINE (100% Free & Private)
    // ==========================================
    
    // ==========================================
    // 🧠 GROQ CLOUD API ENGINE (Function Calling)
    // ==========================================

    // Tools logic (JavaScript mathematically accurate functions)
    const AITools = {
        count_rooms: function({ status }) {
            const allRooms = window.AccommodationAgent.rooms || [];
            if (!status || status === 'all') {
                return JSON.stringify({ total_rooms: allRooms.length });
            } else if (status === 'empty') {
                const empty = allRooms.filter(r => !r.occupants || r.occupants.length === 0);
                return JSON.stringify({ total_empty: empty.length, details: empty.map(r => r.id) });
            } else if (status === 'occupied') {
                const occupied = allRooms.filter(r => r.occupants && r.occupants.length > 0);
                return JSON.stringify({ total_occupied: occupied.length, details: occupied.map(r => r.id) });
            }
            return JSON.stringify({ error: "Invalid status" });
        },
        
        get_room_info: function({ room_id }) {
            const allRooms = window.AccommodationAgent.rooms || [];
            let rId = String(room_id).toUpperCase().replace(/\s+/g, '');
            // Normalize single digits (e.g., E1 -> E01)
            if (/^[A-Z]\d$/.test(rId)) {
                rId = rId[0] + '0' + rId[1];
            }
            const room = allRooms.find(r => r.id.toUpperCase() === rId);
            
            if (!room) return JSON.stringify({ error: `Room ${rId} not found` });
            
            return JSON.stringify({
                room_id: room.id,
                block: room.block,
                type: room.type,
                beds: room.beds,
                status: room.status,
                extension: room.extension || "N/A",
                occupants: room.occupants.map(o => ({ id: o.ID, name: o.Name, company: o.Company })),
                permanent_owners: room.owners.map(oid => {
                    const emp = employees.find(e => String(e.ID) === String(oid));
                    return emp ? { id: emp.ID, name: emp.Name } : oid;
                })
            });
        },
        
        get_pob_report: function() {
            const todayTime = new Date().setHours(0,0,0,0);
            let onDuty = 0;
            let companies = {};
            employees.forEach(emp => {
                let isOn = false;
                if (emp.Rotations) {
                    emp.Rotations.forEach(r => {
                        const start = parseDate(r.start).getTime();
                        const end = parseDate(r.end).getTime();
                        if (todayTime >= start && todayTime <= end && r.type === 'work') isOn = true;
                    });
                }
                if (isOn) {
                    onDuty++;
                    companies[emp.Company] = (companies[emp.Company] || 0) + 1;
                }
            });
            return JSON.stringify({ total_on_duty: onDuty, breakdown_by_company: companies });
        },

        find_employee_by_id_or_name: function({ query }) {
            const q = String(query).toLowerCase();
            let emp = employees.find(e => String(e.ID).toLowerCase() === q || e.Name.toLowerCase().includes(q));
            if (!emp) return JSON.stringify({ error: "Employee not found" });
            
            const todayTime = new Date().setHours(0,0,0,0);
            let currentRotation = null;
            let nextRotation = null;
            let daysRemainingInCurrent = 0;
            
            if (emp.Rotations && emp.Rotations.length > 0) {
                const sortedRot = [...emp.Rotations].sort((a,b) => parseDate(a.start).getTime() - parseDate(b.start).getTime());
                for (let r of sortedRot) {
                    const start = parseDate(r.start).getTime();
                    const end = parseDate(r.end).getTime();
                    
                    if (todayTime >= start && todayTime <= end) {
                        currentRotation = r;
                        daysRemainingInCurrent = Math.ceil((end - todayTime) / (1000 * 60 * 60 * 24));
                    } else if (start > todayTime && !nextRotation) {
                        nextRotation = r;
                    }
                }
            }
            
            const room = window.AccommodationAgent.getEmployeeOwnedRoom(emp.ID);
            return JSON.stringify({
                id: emp.ID,
                name: emp.Name,
                company: emp.Company,
                isNightShiftWorker: !!emp.DayNightShift,
                department: emp.Department,
                room: room ? room.id : 'No room assigned',
                current_rotation: currentRotation ? { 
                    type: currentRotation.type, 
                    start: currentRotation.start, 
                    end: currentRotation.end, 
                    days_remaining: daysRemainingInCurrent 
                } : 'No active rotation today',
                next_scheduled_rotation: nextRotation ? {
                    type: nextRotation.type,
                    start: nextRotation.start,
                    end: nextRotation.end
                } : 'None scheduled'
            });
        },

        get_arrivals_departures: function({ date }) {
            const targetDate = parseDate(date);
            if (!targetDate || isNaN(targetDate.getTime())) return JSON.stringify({ error: "Invalid date format. Use YYYY-MM-DD" });
            const targetTime = targetDate.setHours(0,0,0,0);
            
            let arrivals = [];
            let departures = [];
            
            employees.forEach(emp => {
                if (!emp.Rotations) return;
                emp.Rotations.forEach(r => {
                    const startTime = parseDate(r.start).setHours(0,0,0,0);
                    const endTime = parseDate(r.end).setHours(0,0,0,0);
                    
                    // Arriving = work rotation starts on this date
                    if (r.type === 'work' && startTime === targetTime) {
                        arrivals.push({ id: emp.ID, name: emp.Name, company: emp.Company, rotation_start: r.start, rotation_end: r.end });
                    }
                    // Departing = work rotation ends on this date
                    if (r.type === 'work' && endTime === targetTime) {
                        departures.push({ id: emp.ID, name: emp.Name, company: emp.Company, rotation_start: r.start, rotation_end: r.end });
                    }
                });
            });
            
            return JSON.stringify({
                date: date,
                total_arrivals: arrivals.length,
                arrivals: arrivals,
                total_departures: departures.length,
                departures: departures
            });
        }
    };

    // Groq Tool Definitions (Descriptions in English to prevent LLM schema hallucinations)
    const groqTools = [
        {
            type: "function",
            function: {
                name: "get_fatigue_report",
                description: "Get a list of employees who have been working consecutively for more than a specified number of days (e.g., 28 days) to flag fatigue risk. If no days parameter is provided, it defaults to 28.",
                parameters: {
                    type: "object",
                    properties: {
                        days_threshold: { type: "number", description: "The number of consecutive days to check for (e.g., 28)." }
                    }
                }
            }
        },
        {
            type: "function",
            function: {
                name: "count_rooms",
                description: "Get the exact number of rooms based on their status (empty, occupied, or all).",
                parameters: {
                    type: "object",
                    properties: {
                        status: { type: "string", enum: ["empty", "occupied", "all"], description: "The status of the rooms to count." }
                    },
                    required: ["status"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "get_room_info",
                description: "Get detailed information about a specific accommodation room, including who is currently occupying it, its beds, status, and extension number. Use this when asked 'who is in room X' or 'details of room X'.",
                parameters: {
                    type: "object",
                    properties: {
                        room_id: { type: "string", description: "The ID of the room (e.g., 'A01', 'E03', 'e1', 'a 1'). Pass exactly what the user typed; the system handles normalization and formatting automatically." }
                    },
                    required: ["room_id"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "get_pob_report",
                description: "Get the Personnel On Board (POB) report for today, showing total on-duty employees and a breakdown by company.",
                parameters: { type: "object", properties: {} }
            }
        },
        {
            type: "function",
            function: {
                name: "find_employee_by_id_or_name",
                description: "Find an employee to get their current status, room assignment, current rotation (days remaining), and next scheduled rotation. Use this when asked about an employee's leave, shifts, or rotation schedule.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "The employee ID or name as a string (e.g., '112', 'Ahmed', 'ahmed'). Pass the exact name or ID provided by the user." }
                    },
                    required: ["query"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "get_arrivals_departures",
                description: "Get the list of employees arriving (starting work) or departing (ending work) on a specific date. If the user only asks for arrivals, only display the arrivals list. If they ask for departures, only display the departures list.",
                parameters: {
                    type: "object",
                    properties: {
                        date: { type: "string", description: "The date in YYYY-MM-DD format (e.g., '2026-07-30')." }
                    },
                    required: ["date"]
                }
            }
        }
    ];

    async function callGeminiAPI(apiKey, loadingId) {
        // We are using Groq API now for Function Calling
        if (!apiKey) {
            document.getElementById(loadingId)?.remove();
            appendAIMessage("❌ يرجى إدخال مفتاح API من (Groq) في الإعدادات ⚙️.", "sys");
            return;
        }

        const url = 'https://api.groq.com/openai/v1/chat/completions';
        
        let messages = [
            { 
                role: "system", 
                content: "You are Smart Pulse AI, an expert HR assistant. You MUST use the provided tools to answer user questions about employees, rooms, and rotations. DO NOT answer without using tools. ALWAYS output valid JSON when calling a tool. IMPORTANT: Reply in the SAME language as the user's question (if they ask in English, reply in English; if Arabic, reply in Arabic). Always use markdown and tables for formatting. CRITICAL: If the company name in the data is 'btromsylh-BLK53', 'btromsylh', or 'PetroMasila', you MUST auto-correct and format it properly as 'PetroMasila - BLK53' (in English) or 'بترومسيلة - قطاع 53' (in Arabic). Fix any other obvious typos in names or companies before displaying them. CRITICAL: Format ANY date as DD MMM YYYY (e.g. 01 Aug 2026), and ensure dates are displayed perfectly from left-to-right (LTR) even when writing in Arabic. CRITICAL: If the data shows `isNightShiftWorker: true` for an employee, explicitly mention that they work the Night Shift (مداوم ليل) and are eligible for night overtime/bonus in the Timesheet."
            }
        ];

        // Format history for Groq
        aiChatHistory.forEach(msg => {
            messages.push({ role: msg.role === "model" ? "assistant" : "user", content: msg.parts[0].text });
        });

        try {
            // First call to Groq
            let response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: messages, tools: groqTools, tool_choice: "auto" })
            });
            let data = await response.json();
            
            if(data.error) throw new Error(data.error.message);

            const responseMessage = data.choices[0].message;

            // Check if Groq decided to call a tool
            if (responseMessage.tool_calls) {
                messages.push(responseMessage); // Add assistant's tool call request
                
                for (const toolCall of responseMessage.tool_calls) {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    
                    // Execute the local JavaScript math tool!
                    const functionResponse = AITools[functionName](functionArgs);
                    
                    messages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        name: functionName,
                        content: functionResponse,
                    });
                }
                
                // Second call to Groq with the math results
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: messages })
                });
                data = await response.json();
            }

            document.getElementById(loadingId)?.remove();
            
            let finalOutput = data.choices[0].message.content;
            if (typeof marked !== 'undefined') {
                finalOutput = marked.parse(finalOutput);
            } else {
                finalOutput = finalOutput.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            }
            
            appendAIMessage(finalOutput, "bot", true);
            aiChatHistory.push({ role: "model", parts: [{ text: finalOutput }] });

        } catch (err) {
            document.getElementById(loadingId)?.remove();
            appendAIMessage(`❌ خطأ في الاتصال: ${err.message}`, "sys");
            console.error(err);
        }
    }

    // Automatic POB Snapshot at 11:59 PM (23:59)
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() < 10) {
            if (typeof savePOBSnapshot === 'function') {
                savePOBSnapshot(true);
            }
        }
    }, 10000);

    async function handleCSVImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(l => l.trim() !== '');
                if (lines.length < 2) return Swal.fire('Error', 'CSV file is empty or missing headers.', 'error');
                
                let successCount = 0;
                let errorCount = 0;
                
                Swal.fire({
                    title: 'Importing...',
                    text: 'Please wait while we process the CSV.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                    if (cols.length < 2) continue;
                    
                    const id = cols[0];
                    const name = cols[1];
                    if (!id || !name) {
                        errorCount++;
                        continue;
                    }
                    
                    const emp = {
                        ID: String(id),
                        Name: name,
                        Company: cols[2] || '',
                        Department: cols[3] || '',
                        Destination: cols[4] || cols[3] || '',
                        Phone: cols[5] || '',
                        Rotations: [],
                        Overrides: [],
                        Notes: ''
                    };
                    
                    try {
                        await db.collection("employees").doc(String(emp.ID)).set(emp);
                        successCount++;
                    } catch(err) {
                        console.error(err);
                        errorCount++;
                    }
                }
                
                if (typeof logAuditAction === 'function') {
                    logAuditAction("Bulk Import", `Imported ${successCount} employees from CSV.`);
                }
                
                Swal.fire('Import Complete', `Successfully imported ${successCount} employees.<br>Failed rows: ${errorCount}`, 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to read CSV. Please ensure it is a valid format.', 'error');
            }
            event.target.value = ''; 
        };
        reader.readAsText(file);
    }
    
    // --- PROFILE CARD MODAL LOGIC ---
    function openProfileCard(empId) {
        const emp = employees.find(e => String(e.ID) === String(empId));
        if (!emp) return;

        document.getElementById('pcName').innerText = getDisplayName(emp) || '-';
        document.getElementById('pcID').innerText = 'ID: ' + (emp.ID || '-');
        document.getElementById('pcCompany').innerText = emp.Company || '-';
        document.getElementById('pcDept').innerText = emp.Department || '-';
        document.getElementById('pcDest').innerText = emp.Destination || '-';
        document.getElementById('pcPhone').innerText = emp.Phone || '-';

        let avatarHtml = emp.Name ? emp.Name.charAt(0).toUpperCase() : '?';
        if (emp.profilePic) {
            avatarHtml = `<img src="${emp.profilePic}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        document.getElementById('pcAvatar').innerHTML = avatarHtml;

        const d = new Date();
        const todayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayNum = parseDate(todayStr).getTime();
        
        let currentStatus = getEmployeeCurrentStatusForDate(emp, todayNum);
        
        let totalWork = 0;
        let totalLeave = 0;
        if (emp.Rotations) {
            emp.Rotations.forEach(r => {
                const days = daysBetween(r.start, r.end);
                if (r.type === 'work') totalWork += days;
                if (r.type === 'leave' || r.type === 'rest') totalLeave += days;
            });
        }
        
        let multiplier = 0;
        if (emp.Company === 'PetroMasila-BLK53') {
            multiplier = 1.0;
        } else if (['1011', '1012', '1013'].includes(String(emp.ID))) {
            multiplier = 0.5;
        }
        
        let balanceStr = 'N/A';
        let balanceColor = 'white';
        if (multiplier > 0) {
            const earned = totalWork * multiplier;
            const balance = earned - totalLeave;
            if (balance > 0) {
                balanceStr = '+' + balance;
                balanceColor = '#10b981';
            } else if (balance < 0) {
                balanceStr = balance.toString();
                balanceColor = '#ef4444';
            } else {
balanceStr = '0';
                balanceColor = '#94a3b8';
            }
        }

        let statusBadge = `<div style="display:inline-flex; align-items:center; gap:6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); box-shadow: 0 0 15px rgba(245,158,11,0.15);">
            <div style="width:8px; height:8px; border-radius:50%; background:#f59e0b; box-shadow: 0 0 10px #f59e0b;"></div> Standby (Missing Data)
        </div>`;
        if (currentStatus === 'work' || currentStatus === 'standby_cover') {
            statusBadge = `<div style="display:inline-flex; align-items:center; gap:6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); box-shadow: 0 0 15px rgba(16,185,129,0.15);">
                <div style="width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow: 0 0 10px #10b981;"></div> ON SITE (At Work)
            </div>`;
        } else if (currentStatus === 'leave' || currentStatus === 'rest') {
            statusBadge = `<div style="display:inline-flex; align-items:center; gap:6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.2);">
                <div style="width:8px; height:8px; border-radius:50%; background:#ffffff; box-shadow: 0 0 10px rgba(255,255,255,0.5);"></div> OFF (On Leave)
            </div>`;
        } else if (currentStatus === 'sick_leave') {
            statusBadge = `<div style="display:inline-flex; align-items:center; gap:6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); box-shadow: 0 0 15px rgba(239,68,68,0.15);">
                <div style="width:8px; height:8px; border-radius:50%; background:#ef4444; box-shadow: 0 0 10px #ef4444;"></div> SICK LEAVE
            </div>`;
        }
        
        document.getElementById('pcStatus').innerHTML = statusBadge;
        document.getElementById('pcWork').innerText = totalWork;
        document.getElementById('pcLeave').innerText = totalLeave;
        document.getElementById('pcBalance').innerText = balanceStr;
        document.getElementById('pcBalance').style.color = balanceColor;

        document.getElementById('profileCardModal').style.display = 'flex';
    }
    
    function closeProfileCardModal() {
        document.getElementById('profileCardModal').style.display = 'none';
    }




    window.toggleBlockFullscreen = function(blockName) {
        // Prevent double click on rooms from triggering block expansion
        if (event && (event.target.closest('[onclick*="openRoomManagementModal"]') || event.target.closest('input') || event.target.closest('button'))) {
            return;
        }
        
        const card = document.getElementById('campBlockCard_' + blockName);
        const grid = document.getElementById('campBlockGrid_' + blockName);
        const expandIcon = card.querySelector('.fa-expand, .fa-compress');
        
        if (!card.classList.contains('expanded-camp-block')) {
            // Expand
            card.classList.add('expanded-camp-block');
            grid.style.maxHeight = 'calc(90vh - 100px)'; // Override max-height dynamically
            
            if (expandIcon) {
                expandIcon.classList.remove('fa-expand');
                expandIcon.classList.add('fa-compress');
            }
            
            // Add a temporary overlay click listener to close it when clicking outside
            if (!window.blockOverlayListener) {
                window.blockOverlayListener = function(e) {
                    if (!e.target.closest('.expanded-camp-block')) {
                        toggleBlockFullscreen(blockName);
                    }
                };
                setTimeout(() => document.addEventListener('click', window.blockOverlayListener), 100);
            }
        } else {
            // Collapse
            card.classList.remove('expanded-camp-block');
            grid.style.maxHeight = '400px';
            
            if (expandIcon) {
                expandIcon.classList.remove('fa-compress');
                expandIcon.classList.add('fa-expand');
            }
            
            if (window.blockOverlayListener) {
                document.removeEventListener('click', window.blockOverlayListener);
                window.blockOverlayListener = null;
            }
        }
    };    // Swipe-to-Action Logic for Mobile
    (function initSwipeToAction() {
        let xDown = null;
        let yDown = null;
        let currentSwipedRow = null;
        let currentSwipedConflict = null;

        document.addEventListener('touchstart', function(evt) {
            if (evt.touches.length > 1) return; // ignore multi-touch
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
        }, {passive: true});

        document.addEventListener('touchmove', function(evt) {
            if (!xDown || !yDown) return;
            let xUp = evt.touches[0].clientX;
            let yUp = evt.touches[0].clientY;
            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 30) {
                // Horizontal swipe detected
                let tr = evt.target.closest('table:not(.timesheet-table) tbody tr');
                let conflictItem = evt.target.closest('.conflict-item');
                
                if (tr && window.innerWidth <= 768) {
                    if (tr.querySelector('td[data-label="Actions"]')) {
                        if (xDiff > 0) { // Swiped left
                            if(currentSwipedRow && currentSwipedRow !== tr) currentSwipedRow.classList.remove('swiped');
                            tr.classList.add('swiped');
                            currentSwipedRow = tr;
                        } else { // Swiped right
                            tr.classList.remove('swiped');
                            if (currentSwipedRow === tr) currentSwipedRow = null;
                        }
                    }
                } else if (conflictItem) {
                    if (xDiff > 0) { // Swiped left
                        if (currentSwipedConflict && currentSwipedConflict !== conflictItem) {
                            currentSwipedConflict.classList.remove('swiped-left');
                            currentSwipedConflict.classList.remove('swiped-right');
                        }
                        conflictItem.classList.remove('swiped-right');
                        conflictItem.classList.add('swiped-left');
                        currentSwipedConflict = conflictItem;
                    } else { // Swiped right
                        if (currentSwipedConflict && currentSwipedConflict !== conflictItem) {
                            currentSwipedConflict.classList.remove('swiped-left');
                            currentSwipedConflict.classList.remove('swiped-right');
                        }
                        conflictItem.classList.remove('swiped-left');
                        conflictItem.classList.add('swiped-right');
                        currentSwipedConflict = conflictItem;
                    }
                }
            }
        }, {passive: true});

        document.addEventListener('touchend', function(evt) {
            xDown = null;
            yDown = null;
        });

        // Close swiped items if tapped outside
        document.addEventListener('click', function(evt) {
            if (currentSwipedRow && !currentSwipedRow.contains(evt.target)) {
                currentSwipedRow.classList.remove('swiped');
                currentSwipedRow = null;
            }
            if (currentSwipedConflict && !currentSwipedConflict.contains(evt.target)) {
                currentSwipedConflict.classList.remove('swiped-left');
                currentSwipedConflict.classList.remove('swiped-right');
                currentSwipedConflict = null;
            }
        });
    })();


    // Logic for Leave Report Modal
    function openLeaveReportModal(type) {
        if (!selectedEmployeeId) return;
        const emp = employees.find(e => String(e.ID) === String(selectedEmployeeId));
        if (!emp) return;

        const currentYear = new Date().getFullYear();
        let titleColor = '#ffffff';
        let typeLabel = '';
        let targetTypes = [];

        if (type === 'annual') {
            typeLabel = 'Annual Leaves';
            titleColor = '#60a5fa'; // Blue
            targetTypes = ['leave', 'annual_leave'];
        } else if (type === 'sick') {
            typeLabel = 'Sick Leaves';
            titleColor = '#a78bfa'; // Purple
            targetTypes = ['sick_leave', 'Sick', 'sick'];
        } else if (type === 'emergency') {
            typeLabel = 'Emergency / Unpaid Leaves';
            titleColor = '#f59e0b'; // Orange
            targetTypes = ['emergency_leave', 'unpaid_leave'];
        }

        document.getElementById('leaveReportTitle').innerHTML = `<span style="color: ${titleColor}">${typeLabel}</span>`;
        document.getElementById('leaveReportSubtitle').innerText = `${emp.Name} - All Time Records`;

        const tbody = document.getElementById('leaveReportTbody');
        const emptyState = document.getElementById('leaveReportEmpty');
        tbody.innerHTML = '';
        
        let hasData = false;
        
        // Safety: gather all possible records from emp if `records` global is out of sync or empty
        let allRecs = (typeof records !== 'undefined' && records.length > 0) ? [...records] : [];
        if (allRecs.length === 0) {
            if (emp.Rotations) allRecs = allRecs.concat(emp.Rotations);
            if (emp.Overrides) allRecs = allRecs.concat(emp.Overrides);
        }

        allRecs.filter(r => r && targetTypes.includes(r.type)).forEach(r => {
            hasData = true;
            const tr = document.createElement('tr');
            
            // Format Status
            let statusHtml = '';
            if (r.paidStatus === 'paid') statusHtml = '<span style="color: #10b981; background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span>';
            else if (r.paidStatus === 'unpaid') statusHtml = '<span style="color: #ef4444; background: rgba(239,68,68,0.1); padding: 2px 6px; border-radius: 4px; font-size: 11px;">Unpaid</span>';
            else statusHtml = '<span style="color: #94a3b8; font-size: 11px;">-</span>';

            // Format Notes / Replacement
            let notesHtml = '';
            if (r.note) notesHtml += `<div>💬 <span style="color: #cbd5e1;">${r.note}</span></div>`;
            if (r.replacementId) notesHtml += `<div style="margin-top: 3px; font-size: 11px; color: #94a3b8;">👥 Covered by: ${r.replacementId}</div>`;
            if (!notesHtml) notesHtml = '-';

            tr.innerHTML = `
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">${formatDisplayDate(r.start)} <span style="color:#64748b; margin: 0 5px;">&rarr;</span> ${formatDisplayDate(r.end)}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff; text-align: center; font-weight: bold;">${daysBetween(r.start, r.end)}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">${statusHtml}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">${notesHtml}</td>
            `;
            tbody.appendChild(tr);
        });

        // Fallback: If no records match exact type, but we know they clicked it, maybe show ALL leaves
        if (!hasData) {
            allRecs.filter(r => r && (String(r.type).includes('leave') || r.isOverride)).forEach(r => {
                hasData = true;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">${formatDisplayDate(r.start)} <span style="color:#64748b; margin: 0 5px;">&rarr;</span> ${formatDisplayDate(r.end)}</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff; text-align: center; font-weight: bold;">${daysBetween(r.start, r.end)}</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05);"><span style="color: #94a3b8; font-size: 11px;">Type: ${r.type}</span></td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">${r.note || '-'}</td>
                `;
                tbody.appendChild(tr);
            });
            if (hasData) {
                document.getElementById('leaveReportSubtitle').innerText = `${emp.Name} - All Exceptions (Exact match not found)`;
            }
        }

        if (hasData) {
            tbody.parentElement.style.display = 'table';
            emptyState.style.display = 'none';
        } else {
            tbody.parentElement.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerText = "No records found for this employee.";
        }

        document.getElementById('leaveReportModal').style.display = 'flex';
    }


        const tabsNav = document.querySelector('.tabs-nav');
        let isDockPinned = false;
        
        function toggleDockPin() {
            isDockPinned = !isDockPinned;
            const btn = document.getElementById('dockPinBtn');
            if (isDockPinned) {
                btn.classList.add('pinned');
                btn.title = "Unpin Dock";
            } else {
                btn.classList.remove('pinned');
                btn.title = "Pin Dock";
            }
            updateDockVisibility();
        }

        if (tabsNav) {
            let lastScrollY = window.scrollY;
            let isMouseAtBottom = false;
            let isScrolledDown = false;

            window.addEventListener('scroll', () => {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    isScrolledDown = true;
                } else {
                    isScrolledDown = false;
                }
                updateDockVisibility();
                lastScrollY = window.scrollY;
            });

            window.addEventListener('mousemove', (e) => {
                if (e.clientY > window.innerHeight - 100) {
                    isMouseAtBottom = true;
                } else {
                    isMouseAtBottom = false;
                }
                updateDockVisibility();
            });
            
            function updateDockVisibility() {
                if (isDockPinned) {
                    tabsNav.classList.remove('dock-hidden');
                    return;
                }
                if (isScrolledDown && !isMouseAtBottom) {
                    tabsNav.classList.add('dock-hidden');
                } else {
                    tabsNav.classList.remove('dock-hidden');
                }
            }
        }
    
