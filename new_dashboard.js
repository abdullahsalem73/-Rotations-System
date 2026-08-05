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
