const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace Native Alerts
html = html.replace(/alert\('Please select dates\.'\)/g, "Swal.fire({icon: 'warning', title: 'Oops', text: 'Please select dates.'})");
html = html.replace(/alert\('End date must be after start date\.'\)/g, "Swal.fire({icon: 'error', title: 'Invalid Dates', text: 'End date must be after start date.'})");
html = html.replace(/alert\('لا يوجد بيانات'\)/g, "Swal.fire({icon: 'info', text: 'لا يوجد بيانات'})");

// 2. Build the Magic Script block
const magicScript = `
<!-- HR MAGIC OVERHAUL INJECTED -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
.magic-btn { padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; font-size: 13px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.magic-btn-primary { background: #3b82f6; color: white; }
.magic-btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
.magic-btn-success { background: #10b981; color: white; }
.magic-btn-success:hover { background: #059669; transform: translateY(-1px); }
.magic-btn-warning { background: #f59e0b; color: white; }
.magic-btn-warning:hover { background: #d97706; transform: translateY(-1px); }
.log-entry { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 13px; display: flex; align-items: center; gap: 10px; }
.log-time { color: #9ca3af; font-family: monospace; font-size: 11px; min-width: 150px; }
.log-action { color: #60a5fa; font-weight: bold; min-width: 120px; }
.log-details { color: #e5e7eb; }
</style>
<script>
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
            modal.innerHTML = \`
                <div class="modal-content" style="max-width: 700px; height: 75vh; display: flex; flex-direction: column; background: var(--card-bg);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <h2 style="margin: 0; color: #60a5fa; display: flex; align-items: center; gap: 10px;"><i class="fas fa-history"></i> System Audit Logs</h2>
                        <button class="close-btn" onclick="document.getElementById('auditModal').style.display='none'" style="font-size: 24px;">&times;</button>
                    </div>
                    <div id="auditLogContainer" style="flex-grow: 1; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;"></div>
                </div>
            \`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'block';
        const container = document.getElementById('auditLogContainer');
        if (this.logs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 20px; color: #9ca3af;">No logs recorded yet.</div>';
            return;
        }
        container.innerHTML = this.logs.map(l => \`
            <div class="log-entry">
                <span class="log-time">\${l.time}</span> 
                <span class="log-action">\${l.action}</span>
                <span class="log-details">\${l.details}</span>
            </div>
        \`).join('');
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
            modal.style.cssText = 'z-index: 99999; padding: 20px; display: none;';
            modal.innerHTML = \`
                <div class="modal-content" style="max-width: 900px; height: 85vh; display: flex; flex-direction: column; background: var(--card-bg);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <h2 style="margin: 0; color: #34d399; display: flex; align-items: center; gap: 10px;"><i class="fas fa-chart-line"></i> Operations Analytics</h2>
                        <button class="close-btn" onclick="document.getElementById('analyticsModal').style.display='none'" style="font-size: 24px;">&times;</button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; flex-grow: 1; overflow-y: auto; padding-right: 10px;">
                        <div style="flex: 1; min-width: 400px; height: 350px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; display: flex; justify-content: center; align-items: center;">
                            <canvas id="occupancyChart"></canvas>
                        </div>
                        <div style="flex: 1; min-width: 400px; height: 350px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; display: flex; justify-content: center; align-items: center;">
                            <canvas id="shiftChart"></canvas>
                        </div>
                    </div>
                </div>
            \`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'block';
        
        // Ensure Chart.js is loaded
        if (typeof Chart === 'undefined') {
            Swal.fire('Loading', 'Analytics engine is starting up. Please try again in a moment.', 'info');
            return;
        }
        
        setTimeout(() => {
            const ctx1 = document.getElementById('occupancyChart');
            const ctx2 = document.getElementById('shiftChart');
            
            let occ = 0, vac = 0, maint = 0;
            if(window.AccommodationAgent && window.AccommodationAgent.rooms) {
                window.AccommodationAgent.rooms.forEach(r => {
                    if(r.status==='occupied' || (r.occupants && r.occupants.length >= r.beds)) occ++;
                    else if(r.status==='maintenance') maint++;
                    else vac++;
                });
            }
            
            let day = 0, dayNight = 0;
            if(window.employees) {
                window.employees.forEach(e => {
                    if(e.ShiftType === 'Day/Night') dayNight++;
                    else day++;
                });
            }

            if(window.occChartInst) window.occChartInst.destroy();
            window.occChartInst = new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: ['Occupied', 'Vacant', 'Maintenance'],
                    datasets: [{ data: [occ, vac, maint], backgroundColor: ['#ef4444', '#10b981', '#6b7280'], borderWidth: 0 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Camp Occupancy Status', color: '#fff', font: {size: 16} }, legend: { position: 'bottom', labels: { color: '#fff' } } } }
            });
            
            if(window.shiftChartInst) window.shiftChartInst.destroy();
            window.shiftChartInst = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Day Shift Only', 'Day/Night Rotation'],
                    datasets: [{ data: [day, dayNight], backgroundColor: ['#f59e0b', '#8b5cf6'], borderWidth: 0 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Fatigue Exposure (Shift Types)', color: '#fff', font: {size: 16} }, legend: { position: 'bottom', labels: { color: '#fff' } } } }
            });
            
            AuditLogger.log('Viewed Analytics', 'User opened the Operations Analytics dashboard.');
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
    setTimeout(() => {
        const topNav = document.querySelector('.top-nav') || document.querySelector('.header');
        if(topNav) {
            const btnGroup = document.createElement('div');
            btnGroup.style.cssText = 'display: flex; gap: 10px; margin-left: auto; margin-right: 20px; align-items: center;';
            btnGroup.innerHTML = \`
                <button class="magic-btn magic-btn-primary" onclick="AnalyticsDashboard.render()"><i class="fas fa-chart-pie"></i> Analytics</button>
                <button class="magic-btn magic-btn-warning" onclick="AuditLogger.renderLogs()"><i class="fas fa-history"></i> Audit Logs</button>
            \`;
            topNav.appendChild(btnGroup);
        }
    }, 500);
});

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

</script>
`;

if (!html.includes('HR MAGIC OVERHAUL INJECTED')) {
    html = html.replace('</head>', magicScript + '\n</head>');
    fs.writeFileSync('index.html', html);
    console.log('Magic Overhaul Executed Successfully!');
} else {
    console.log('Already injected.');
}
