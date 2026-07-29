const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject Notification Bell in the Top Bar
const themeToggleRegex = /<button id="themeToggleBtn"/;
if (html.match(themeToggleRegex)) {
    const notificationHTML = `
    <div style="position: relative;">
        <button id="notificationBtn" class="btn" onclick="toggleNotifications()" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; width: 45px; height: 45px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: all 0.3s ease;">
            🔔
            <span id="notifBadge" style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg); display: none;">0</span>
        </button>
        <div id="notifDropdown" class="card" style="display: none; position: absolute; top: 60px; right: 0; width: 380px; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 0; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px);">
            <div style="padding: 15px; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05);">
                <h3 style="margin: 0; color: #fff; font-size: 16px;">🚨 Back-to-Back Conflicts</h3>
                <span style="font-size: 12px; color: #3b82f6; cursor: pointer;" onclick="detectConflicts()">🔄 Refresh</span>
            </div>
            <div id="notifList" style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                <div style="text-align: center; color: var(--text-muted); font-size: 14px;">No conflicts detected. You're all good! 🎉</div>
            </div>
        </div>
    </div>
    <button id="themeToggleBtn"`;
    
    html = html.replace(themeToggleRegex, notificationHTML);
}

// 2. Find Employee Modal and add ReliefID field
const destRegex = /<label>Destination:<\/label>[\s\S]*?<\/div>/;
if (html.match(destRegex)) {
    const reliefFieldHTML = `
        <div style="margin-bottom:15px;">
            <label style="color:#f97316;">🔄 Alternate / Relief Employee:</label>
            <select id="empRelief" style="width:100%; padding:8px; border-radius:5px; border:1px solid #ccc; background:#fff; color:#000;">
                <option value="">-- None (No Relief) --</option>
            </select>
            <small style="color: #64748b; font-size: 11px;">Select the Back-to-Back relief for this employee to detect schedule conflicts.</small>
        </div>`;
    html = html.replace(destRegex, `$& ${reliefFieldHTML}`);
}

// 3. Update Profile Card to show Relief info
const profilePhoneRegex = /<span><strong style="color: var\(--text-muted\);">Phone:<\/strong> <span id="profilePhone".*?<\/span><\/span>/;
if (html.match(profilePhoneRegex)) {
    const reliefInfoHTML = `
        <span style="background: rgba(249, 115, 22, 0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(249, 115, 22, 0.3);">
            <strong style="color: #f97316;">🔄 Relief:</strong> <span id="profileRelief" style="font-weight:600; color:#fff;">---</span>
        </span>`;
    html = html.replace(profilePhoneRegex, `$& ${reliefInfoHTML}`);
}

fs.writeFileSync('inject_ui.js', 'console.log("ready")');
fs.writeFileSync('index.html', html);
console.log("UI Injected");
