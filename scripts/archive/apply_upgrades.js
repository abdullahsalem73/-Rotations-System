const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Smart Card Indicator to Sidebar
// Look for a known sidebar element to inject the indicator.
const brandTarget = '<div class="brand-text">';
const brandReplace = `<div class="brand-text">
            <!-- Smart Card Pulse Indicator -->
            <div id="smartCardIndicator" style="display:flex; align-items:center; justify-content:center; gap:5px; margin-top:5px; padding: 4px 8px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 10px; color: #10b981;">
                <div style="width:6px; height:6px; background-color:#10b981; border-radius:50%; box-shadow: 0 0 5px #10b981; animation: pulse 1.5s infinite;"></div>
                Smart Card Ready
            </div>
            <style>
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
            </style>`;
if (html.includes(brandTarget) && !html.includes('id="smartCardIndicator"')) {
    html = html.replace(brandTarget, brandReplace);
    console.log("1. Smart Card Indicator added.");
}

// 2. Interactive Camp Map (Live Grid)
const roomTabTarget = `<button class="btn btn-outline active" id="roomTabInfoBtn" onclick="switchRoomTab('Info')"`;
const roomTabReplace = `<button class="btn btn-outline" id="roomTabMapBtn" onclick="switchRoomTab('Map')" style="border-radius: 20px; padding: 6px 15px; font-size: 13px;">🗺️ Map</button>
        <button class="btn btn-outline active" id="roomTabInfoBtn" onclick="switchRoomTab('Info')"`;

if (html.includes(roomTabTarget) && !html.includes('id="roomTabMapBtn"')) {
    html = html.replace(roomTabTarget, roomTabReplace);
    console.log("2. Room Map Tab added.");
}

// Inject Map Container
const roomModalInfoTarget = `<div id="roomModalInfo">`;
const roomModalMapHTML = `
    <!-- Live Camp Map Tab -->
    <div id="roomModalMap" style="display: none; margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: white;">Live Camp Grid</h4>
            <div style="display: flex; gap: 10px; font-size: 11px;">
                <span style="color: #10b981;">● Empty</span>
                <span style="color: #f59e0b;">● Partial</span>
                <span style="color: #ef4444;">● Full</span>
            </div>
        </div>
        <div id="liveCampGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 8px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
            <!-- Rendered via JS -->
        </div>
    </div>
    <div id="roomModalInfo">`;

if (html.includes(roomModalInfoTarget) && !html.includes('id="roomModalMap"')) {
    html = html.replace(roomModalInfoTarget, roomModalMapHTML);
    console.log("3. Room Map Container added.");
}

// Update switchRoomTab logic
const switchTabTarget = `function switchRoomTab(tab) {`;
const switchTabReplace = `function switchRoomTab(tab) {
        document.getElementById('roomTabInfoBtn').classList.remove('active');
        document.getElementById('roomTabInfoBtn').style.borderBottom = 'none';
        document.getElementById('roomTabOccupantsBtn').classList.remove('active');
        document.getElementById('roomTabOccupantsBtn').style.borderBottom = 'none';
        if(document.getElementById('roomTabMapBtn')) {
            document.getElementById('roomTabMapBtn').classList.remove('active');
            document.getElementById('roomTabMapBtn').style.borderBottom = 'none';
        }

        document.getElementById('roomModalInfo').style.display = 'none';
        document.getElementById('roomModalOccupants').style.display = 'none';
        if(document.getElementById('roomModalMap')) {
            document.getElementById('roomModalMap').style.display = 'none';
        }

        if (tab === 'Info') {
            document.getElementById('roomTabInfoBtn').classList.add('active');
            document.getElementById('roomTabInfoBtn').style.borderBottom = '2px solid #3b82f6';
            document.getElementById('roomModalInfo').style.display = 'block';
        } else if (tab === 'Occupants') {
            document.getElementById('roomTabOccupantsBtn').classList.add('active');
            document.getElementById('roomTabOccupantsBtn').style.borderBottom = '2px solid #3b82f6';
            document.getElementById('roomModalOccupants').style.display = 'block';
        } else if (tab === 'Map') {
            document.getElementById('roomTabMapBtn').classList.add('active');
            document.getElementById('roomTabMapBtn').style.borderBottom = '2px solid #3b82f6';
            document.getElementById('roomModalMap').style.display = 'block';
            renderLiveCampMap();
        }
    }
    
    function renderLiveCampMap() {
        const grid = document.getElementById('liveCampGrid');
        if (!grid) return;
        grid.innerHTML = '';
        
        // Sort rooms naturally
        const sortedRooms = [...rooms].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));
        
        sortedRooms.forEach(room => {
            const occCount = getRoomOccupants(room.id).length;
            let bgColor = 'rgba(16, 185, 129, 0.15)';
            let borderColor = '#10b981';
            
            if (room.status === 'occupied') {
                bgColor = 'rgba(239, 68, 68, 0.15)';
                borderColor = '#ef4444';
            } else if (occCount > 0 && occCount < room.beds) {
                bgColor = 'rgba(245, 158, 11, 0.15)';
                borderColor = '#f59e0b';
            }
            
            const cell = document.createElement('div');
            cell.style.cssText = \`
                background: \${bgColor}; 
                border: 1px solid \${borderColor}; 
                border-radius: 6px; 
                padding: 10px 5px; 
                text-align: center; 
                cursor: pointer; 
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            \`;
            cell.title = \`Room \${room.id} (\${occCount}/\${room.beds} Beds)\`;
            
            cell.onmouseover = () => cell.style.transform = 'scale(1.05)';
            cell.onmouseout = () => cell.style.transform = 'scale(1)';
            
            cell.onclick = () => {
                openRoomManagementModal(room.id);
                switchRoomTab('Info');
            };
            
            cell.innerHTML = \`<div style="font-weight: bold; font-size: 13px; color: white;">\${room.id}</div>
                               <div style="font-size: 10px; color: var(--text-muted);">\${occCount}/\${room.beds}</div>\`;
            
            grid.appendChild(cell);
        });
    }
    
    // Ignore original switchRoomTab definition to avoid syntax error by replacing it completely
    /*`;
    
const switchTabEndTarget = `// Add new room via Modal`;
const switchTabReplaceComplete = switchTabReplace + `\n    // ` + switchTabEndTarget;

// We need a safer replace for the switchRoomTab function.
if (html.includes('function switchRoomTab(tab)') && !html.includes('renderLiveCampMap()')) {
    // Find index of function switchRoomTab(tab)
    const startIndex = html.indexOf('function switchRoomTab(tab)');
    // Find next function to know where to end
    const endIndex = html.indexOf('function openAddRoomModal()', startIndex);
    if(startIndex > -1 && endIndex > -1) {
        html = html.substring(0, startIndex) + switchTabReplace + "\n\n    " + html.substring(endIndex);
        console.log("4. switchRoomTab replaced successfully.");
    }
}

// 3. AI Enhancements: Add fatigue report tool
const aiToolsTarget = `const groqTools = [`;
const aiToolsReplace = `const groqTools = [
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
        },`;

if (html.includes(aiToolsTarget) && !html.includes('get_fatigue_report')) {
    html = html.replace(aiToolsTarget, aiToolsReplace);
    console.log("5. AI Fatigue tool definition added.");
}

// Add the tool executor logic
const aiExecutorTarget = `case "get_arrivals_departures":
                                toolResult = handle_get_arrivals_departures(args);
                                break;`;
const aiExecutorReplace = `case "get_arrivals_departures":
                                toolResult = handle_get_arrivals_departures(args);
                                break;
                            case "get_fatigue_report":
                                toolResult = handle_get_fatigue_report(args);
                                break;`;

if (html.includes(aiExecutorTarget) && !html.includes('handle_get_fatigue_report')) {
    html = html.replace(aiExecutorTarget, aiExecutorReplace);
    console.log("6. AI Fatigue executor added.");
}

const aiFunctionTarget = `function handle_get_arrivals_departures(args)`;
const aiFunctionReplace = `function handle_get_fatigue_report(args) {
        const threshold = args.days_threshold || 28;
        const today = new Date();
        const flagged = [];
        
        employees.forEach(emp => {
            if(emp.Status !== 'work') return;
            // Calculate days on site since latest rotation start
            const currentRot = (emp.Rotations || []).slice().reverse().find(r => r.type === 'work' && new Date(r.start) <= today && new Date(r.end) >= today);
            if(currentRot) {
                const startD = new Date(currentRot.start);
                const diffTime = Math.abs(today - startD);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if(diffDays >= threshold) {
                    flagged.push({ id: emp.ID, name: emp.Name, department: emp.Department, days_on_site: diffDays, rotation_end: currentRot.end });
                }
            }
        });
        
        return JSON.stringify({
            threshold_days: threshold,
            total_flagged: flagged.length,
            flagged_employees: flagged
        });
    }
    
    function handle_get_arrivals_departures(args)`;

if (html.includes(aiFunctionTarget) && !html.includes('function handle_get_fatigue_report')) {
    html = html.replace(aiFunctionTarget, aiFunctionReplace);
    console.log("7. AI Fatigue function logic added.");
}


fs.writeFileSync('index.html', html);
console.log('Upgrades applied successfully.');
