const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add CSS for mobile cards
const cssToAdd = `
                /* Mobile Timesheet Cards */
                .timesheet-cards-mobile { display: none; }
                .ts-mobile-card {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 15px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    backdrop-filter: blur(10px);
                }
                .ts-card-header {
                    display: flex; justify-content: space-between; align-items: center; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 12px;
                }
                .ts-card-header h4 { margin: 0; font-size: 16px; color: var(--text-main); font-weight: 600; display:flex; align-items:center; gap:8px; }
                .ts-id { font-size: 12px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); font-weight: normal; }
                .ts-card-stats {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;
                }
                .stat-box {
                    background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);
                }
                .stat-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;}
                .stat-value { display: block; font-size: 14px; font-weight: bold; color: var(--primary); }
                .ts-periods-title { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center;}
                
                .ts-mini-grid {
                    display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-top: 10px;
                }
                .ts-mini-cell {
                    aspect-ratio: 1; display: flex; flex-direction:column; align-items: center; justify-content: center;
                    font-size: 12px; font-weight:bold; border-radius: 6px;
                    border: 1px solid var(--glass-border); cursor: pointer;
                    user-select: none; transition: all 0.2s; position:relative;
                }
                .ts-mini-cell span.day-num { font-size:9px; position:absolute; top:2px; left:3px; opacity:0.7; font-weight:normal;}
                .ts-mini-cell:active { transform: scale(0.9); }
                
                @media (max-width: 768px) {
                    .timesheet-wrapper { display: none; }
                    .timesheet-legend { display: none; }
                    .timesheet-cards-mobile { display: block; }
                }
`;

if (!html.includes('.timesheet-cards-mobile')) {
    html = html.replace('</style>', cssToAdd + '\n            </style>');
}

// 2. Add Container
const containerToAdd = `
            <div id="timesheetCardsContainer" class="timesheet-cards-mobile"></div>
`;
if (!html.includes('id="timesheetCardsContainer"')) {
    html = html.replace('<div class="timesheet-wrapper">', containerToAdd + '\n            <div class="timesheet-wrapper">');
}

// 3. Add JS functions to calculate periods and render cards
const renderCardsLogic = `
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
                let displayVal = dayVal;
                
                if (dayVal === '1' || dayVal === 'ON') { cellClass = 'ts-cell-ON'; displayVal = 'ON'; }
                else if (dayVal === 'E') { cellClass = 'ts-cell-E'; }
                else if (dayVal === 'X') { cellClass = 'ts-cell-X'; }
                else { displayVal = ''; }
                
                const isToday = isCurrentMonth && (i === todayDate);
                let extraStyle = isToday ? 'border: 2px solid #f9a826;' : '';
                
                miniGridHTML += \`<div class="ts-mini-cell \${cellClass}" style="\${extraStyle}" onclick="toggleTsCellMobile('\${emp.ID}', \${i}, this)" data-val="\${dayVal === '1' ? 'ON' : dayVal}" id="ts_mobile_\${emp.ID}_\${i}">
                    <span class="day-num">\${i}</span>
                    \${displayVal}
                </div>\`;
            }

            cardsHTML += \`
              <div class="ts-mobile-card" id="ts_card_\${emp.ID}">
                 <div class="ts-card-header">
                    <h4>\${emp.Name} <span class="ts-id">#\${emp.ID}</span></h4>
                    <div style="font-size:20px; cursor:pointer;" onclick="toggleShift('\${emp.ID}')" title="Toggle Shift">\${shiftIcon}</div>
                 </div>
                 <div class="ts-card-stats">
                     <div class="stat-box">
                         <span class="stat-label">Total</span>
                         <span class="stat-value" id="ts_mob_total_\${emp.ID}">\${totalDuty}</span>
                     </div>
                     <div class="stat-box">
                         <span class="stat-label">From</span>
                         <span class="stat-value" id="ts_mob_from_\${emp.ID}">\${fromText}</span>
                     </div>
                     <div class="stat-box">
                         <span class="stat-label">To</span>
                         <span class="stat-value" id="ts_mob_to_\${emp.ID}">\${toText}</span>
                     </div>
                 </div>
                 <div class="ts-mini-grid-container">
                    <div class="ts-periods-title">
                        <span>Daily Grid</span>
                        <span style="font-size:11px; opacity:0.7;">Tap to edit</span>
                    </div>
                    <div class="ts-mini-grid">
                        \${miniGridHTML}
                    </div>
                 </div>
              </div>
            \`;
        });
        
        document.getElementById('timesheetCardsContainer').innerHTML = cardsHTML;
`;

if (html.includes("document.getElementById('timesheetBody').innerHTML = bodyHTML;")) {
    html = html.replace("document.getElementById('timesheetBody').innerHTML = bodyHTML;", "document.getElementById('timesheetBody').innerHTML = bodyHTML;\n" + renderCardsLogic);
}


// 4. Add Mobile Toggle Function (and update recalc)
const mobileFuncs = `
    function toggleTsCellMobile(empId, day, cellElement) {
        // Find the desktop cell to keep it in sync
        // Desktop cells are generated in renderTimesheetTable, they have no ID right now.
        // We can just update the array and re-render the card or re-calculate stats.
        
        let currentVal = cellElement.getAttribute('data-val') || '';
        let newVal = '';
        let newClass = 'ts-cell-empty';
        let displayVal = '';
        
        if (currentVal === '') {
            newVal = '1'; newClass = 'ts-cell-ON'; displayVal = 'ON';
        } else if (currentVal === '1' || currentVal === 'ON') {
            newVal = 'E'; newClass = 'ts-cell-E'; displayVal = 'E';
        } else if (currentVal === 'E') {
            newVal = 'X'; newClass = 'ts-cell-X'; displayVal = 'X';
        } else if (currentVal === 'X') {
            newVal = ''; newClass = 'ts-cell-empty'; displayVal = '';
        }
        
        cellElement.setAttribute('data-val', newVal);
        cellElement.innerHTML = \`<span class="day-num">\${day}</span>\${displayVal}\`;
        cellElement.className = \`ts-mini-cell \${newClass}\`;
        
        if (!currentTimesheetData[empId]) currentTimesheetData[empId] = {};
        currentTimesheetData[empId][day] = newVal;
        
        recalcTsRowTotal(empId);
        updateMobileCardStats(empId);
    }
    
    function updateMobileCardStats(empId) {
        if (!currentTimesheetData[empId]) return;
        const empData = currentTimesheetData[empId];
        const monthVal = document.getElementById('timesheetMonth').value;
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
        
        const totalEl = document.getElementById(\`ts_mob_total_\${empId}\`);
        const fromEl = document.getElementById(\`ts_mob_from_\${empId}\`);
        const toEl = document.getElementById(\`ts_mob_to_\${empId}\`);
        
        if(totalEl) totalEl.innerText = totalDuty;
        if(fromEl) fromEl.innerText = fromText;
        if(toEl) toEl.innerText = toText;
        
        // Also sync desktop table if we are on desktop
        renderTimesheetTable(); // Simply re-render to keep everything perfectly in sync
    }
`;

if (!html.includes('toggleTsCellMobile')) {
    html = html.replace('function recalcTsRowTotal(empId) {', mobileFuncs + '\n    function recalcTsRowTotal(empId) {');
}

// 5. Ensure toggleTsCell calls renderTimesheetTable to sync mobile
const toggleSync = `
        recalcTsRowTotal(empId);
        // Sync mobile
        renderTimesheetTable();
`;
if (html.includes('recalcTsRowTotal(empId);') && html.includes('toggleTsCell') && !html.includes('// Sync mobile')) {
    html = html.replace('recalcTsRowTotal(empId);', toggleSync);
}


fs.writeFileSync('index.html', html);
console.log("Mobile UI Timesheet fixes applied.");
