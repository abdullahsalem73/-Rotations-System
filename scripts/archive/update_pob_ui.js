const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const pobTabRegex = /<div id="pobArchive-tab" class="tab-pane">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Load Scripts -->/;

const newPobTabHtml = `<div id="pobArchive-tab" class="tab-pane">
        <div class="card" style="margin-bottom: 25px; text-align: center; position: relative;">
            <div style="position: absolute; top: 15px; right: 15px;">
                <button class="btn btn-outline" style="border-color: #f97316; color: #f97316; padding: 5px 10px; font-size: 13px;" onclick="togglePobCompareMode()">
                    <span id="compareModeText">⚖️ Enable Compare Mode</span>
                </button>
            </div>
            
            <h2 class="gradient-text" style="margin-top: 0;">⏳ POB Archive (Time Machine)</h2>
            <p style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">View historical Personnel On Board snapshots or compare two dates.</p>
            
            <!-- Standard Mode -->
            <div id="pobStandardMode" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; align-items: center;">
                <input type="date" id="pobArchiveDate" class="custom-date-input" style="padding: 10px;">
                <button class="btn btn-outline" style="border-color: #3b82f6; color: #3b82f6;" onclick="loadPOBSnapshot()">🔍 Load Snapshot</button>
                <button class="btn" style="background: linear-gradient(90deg, #10b981, #059669); border: none;" onclick="savePOBSnapshot()">🔒 Lock Today's POB</button>
            </div>
            
            <!-- Compare Mode -->
            <div id="pobCompareMode" style="display: none; justify-content: center; gap: 15px; flex-wrap: wrap; align-items: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.2);">
                <div>
                    <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 5px;">Date A (Older)</label>
                    <input type="date" id="pobCompareDateA" class="custom-date-input" style="padding: 10px;">
                </div>
                <div style="font-size: 20px; color: #64748b; font-weight: bold;">VS</div>
                <div>
                    <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 5px;">Date B (Newer)</label>
                    <input type="date" id="pobCompareDateB" class="custom-date-input" style="padding: 10px;">
                </div>
                <div style="align-self: flex-end;">
                    <button class="btn" style="background: linear-gradient(90deg, #8b5cf6, #6d28d9); border: none; padding: 12px 20px;" onclick="runPobCompare()">⚖️ Compare</button>
                </div>
            </div>
        </div>

        <div id="pobArchiveResults" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="pobSearchInput" class="custom-date-input" placeholder="🔍 Search Name or ID..." onkeyup="filterPobTable()" style="width: 250px;">
                    <select id="pobDeptFilter" class="custom-date-input" onchange="filterPobTable()">
                        <option value="All">All Departments</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" style="border-color: #10b981; color: #10b981; padding: 6px 12px;" onclick="exportPobExcel()">📊 Export Excel</button>
                    <button class="btn btn-outline" style="border-color: #64748b; color: #64748b; padding: 6px 12px;" onclick="printPobReport()">🖨️ Print Report</button>
                </div>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 25px;">
                <div class="stat-card">
                    <h3 id="pobStatTitle1">Total POB</h3>
                    <div class="value" id="pobTotalValue" style="color: #10b981;">0</div>
                </div>
                <div class="stat-card">
                    <h3 id="pobStatTitle2">Snapshot Date</h3>
                    <div class="value" id="pobDateValue" style="font-size: 24px;">-</div>
                </div>
            </div>

            <div class="card" id="pobBreakdownCard">
                <h3 class="gradient-text">🏢 Company Breakdown</h3>
                <div id="pobCompanyBreakdown" style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: center; padding: 10px;"></div>
            </div>
            
            <div class="card" style="margin-top: 25px;">
                <h3 class="gradient-text" id="pobTableTitle">📋 Staff List</h3>
                <div class="table-wrapper">
                    <table id="pobTable">
                        <thead>
                            <tr id="pobTableHeader">
                                <th style="text-align:center; width: 100px;">ID</th>
                                <th style="text-align:left;">Name</th>
                                <th style="text-align:left;">Company</th>
                                <th style="text-align:left;">Department</th>
                            </tr>
                        </thead>
                        <tbody id="pobStaffListBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Load Scripts -->`;

if (html.match(pobTabRegex)) {
    html = html.replace(pobTabRegex, newPobTabHtml);
    fs.writeFileSync('index.html', html);
    console.log('POB UI replaced successfully.');
} else {
    console.log('Regex did not match.');
}
