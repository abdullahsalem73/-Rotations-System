const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace ringColor condition
html = html.replace(
    /\} else if \(currentStatus === 'leave' \|\| currentStatus === 'rest'\) \{\s*ringColor = '#ffffff';/g,
    `} else if (currentStatus === 'leave' || currentStatus === 'rest' || currentStatus === 'standby') {\n                    ringColor = '#ffffff';`
);

// Replace statusBadge condition
html = html.replace(
    /\} else if \(currentStatus === 'leave' \|\| currentStatus === 'rest'\) \{\s*statusBadge = `<div style="[^>]+>\s*<div style="[^>]+><\/div> Leave\s*<\/div>`;/g,
    `} else if (currentStatus === 'leave' || currentStatus === 'rest' || currentStatus === 'standby') {\n                    statusBadge = \`<div style="display:inline-flex; align-items:center; gap:6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.2);"><div style="width:8px;height:8px;border-radius:50%;background:#ffffff;box-shadow:0 0 8px #ffffff;"></div> \${currentStatus === 'standby' ? 'Standby (Leave)' : 'Leave'}</div>\`;`
);

fs.writeFileSync('index.html', html);
console.log('Fixed using regex!');
