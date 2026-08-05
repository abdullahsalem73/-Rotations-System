const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = '<div id="roomTabInfo" class="room-tab-content">';
const mapHTML = `
<div id="roomModalMap" class="room-tab-content" style="display:none;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="margin:0; color:white;">Live Camp Grid</h4>
        <div style="display:flex; gap:10px; font-size:11px;">
            <span style="color:#10b981;">● Empty</span>
            <span style="color:#f59e0b;">● Partial</span>
            <span style="color:#ef4444;">● Full</span>
        </div>
    </div>
    <div id="liveCampGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(60px, 1fr)); gap:8px; max-height:400px; overflow-y:auto; padding-right:5px;"></div>
</div>
`;

if(html.includes(target) && !html.includes('id="roomModalMap"')) { 
    html = html.replace(target, mapHTML + target); 
    fs.writeFileSync('index.html', html); 
    console.log('Map Container Injected.'); 
} else { 
    console.log('Failed or already exists.'); 
}
