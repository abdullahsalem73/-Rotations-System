window.AnalyticsDashboard = {
    render: function() {
        let modal = document.getElementById('analyticsModal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'analyticsModal';
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 99999; padding: 20px; display: none;';
            modal.innerHTML = `
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
            `;
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