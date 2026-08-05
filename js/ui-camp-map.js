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