const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject the button next to the Maint. filter
const filterTarget = `<button class="btn btn-outline" id="filterMaintenance" onclick="setCampFilter('Maintenance')" style="border-color: #ef4444; color: #ef4444; padding: 5px 10px; font-size: 12px; \${campCurrentFilter==='Maintenance' ? 'background: #ef444420' : ''}">Maint.</button>`;
const filterReplace = filterTarget + `\n                        <button class="btn btn-outline" onclick="openGlobalLiveMap()" style="border-color: #8b5cf6; color: #8b5cf6; padding: 5px 10px; font-size: 12px; margin-left: 10px; font-weight:bold; box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);">🗺️ Live Map</button>`;

if (html.includes(filterTarget) && !html.includes('openGlobalLiveMap()')) {
    html = html.replace(filterTarget, filterReplace);
    console.log("Global Live Map button added.");
}

// 2. Inject the Global Map Modal HTML and JS before </body>
const bodyEndTarget = '</body>';
const globalMapHTML = `
<!-- Global Live Camp Map Modal -->
<div id="globalMapModal" class="modal" style="z-index: 10000; padding: 20px;">
    <div class="modal-content" style="max-width: 90%; height: 85vh; display: flex; flex-direction: column; background: var(--card-bg);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 class="gradient-text" style="margin: 0;">🗺️ Live Camp Grid</h2>
            <div style="display: flex; gap: 15px; font-size: 14px; font-weight: bold;">
                <span style="color: #10b981; text-shadow: 0 0 5px rgba(16,185,129,0.5);">● Empty</span>
                <span style="color: #f59e0b; text-shadow: 0 0 5px rgba(245,158,11,0.5);">● Partial</span>
                <span style="color: #ef4444; text-shadow: 0 0 5px rgba(239,68,68,0.5);">● Full</span>
            </div>
            <button class="close-btn" onclick="closeGlobalLiveMap()" style="font-size: 24px;">&times;</button>
        </div>
        
        <div id="globalCampGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; flex-grow: 1; overflow-y: auto; padding-right: 10px; padding-bottom: 20px;">
            <!-- Rendered via JS -->
        </div>
    </div>
</div>

<script>
function openGlobalLiveMap() {
    document.getElementById('globalMapModal').style.display = 'block';
    renderGlobalLiveMap();
}

function closeGlobalLiveMap() {
    document.getElementById('globalMapModal').style.display = 'none';
}

function renderGlobalLiveMap() {
    const grid = document.getElementById('globalCampGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Sort rooms naturally by ID
    const sortedRooms = [...rooms].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));
    
    sortedRooms.forEach(room => {
        const occCount = getRoomOccupants(room.id).length;
        let bgColor = 'rgba(16, 185, 129, 0.1)';
        let borderColor = '#10b981';
        let statusText = 'Empty';
        
        if (room.status === 'occupied' || occCount >= room.beds) {
            bgColor = 'rgba(239, 68, 68, 0.15)';
            borderColor = '#ef4444';
            statusText = 'Full';
        } else if (occCount > 0 && occCount < room.beds) {
            bgColor = 'rgba(245, 158, 11, 0.15)';
            borderColor = '#f59e0b';
            statusText = 'Partial';
        }
        
        if (room.status === 'maintenance') {
            bgColor = 'rgba(107, 114, 128, 0.2)';
            borderColor = '#6b7280';
            statusText = 'Maint.';
        }
        
        const cell = document.createElement('div');
        cell.style.cssText = \`
            background: \${bgColor}; 
            border: 2px solid \${borderColor}; 
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
        \`;
        
        cell.onmouseover = () => {
            cell.style.transform = 'translateY(-3px)';
            cell.style.boxShadow = \`0 6px 12px \${borderColor}40\`;
        };
        cell.onmouseout = () => {
            cell.style.transform = 'translateY(0)';
            cell.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        };
        
        cell.onclick = () => {
            closeGlobalLiveMap();
            openRoomManagementModal(room.id);
        };
        
        cell.innerHTML = \`
            <div style="font-weight: 900; font-size: 16px; color: white; margin-bottom: 5px;">\${room.id}</div>
            <div style="font-size: 12px; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">\${occCount} / \${room.beds}</div>
        \`;
        
        grid.appendChild(cell);
    });
}
</script>
`;

if (html.includes(bodyEndTarget) && !html.includes('id="globalMapModal"')) {
    html = html.replace(bodyEndTarget, globalMapHTML + '\n' + bodyEndTarget);
    console.log("Global Live Map Modal added.");
}

fs.writeFileSync('index.html', html);
console.log("Done.");
