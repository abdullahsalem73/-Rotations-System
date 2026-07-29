const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject detectConflicts() into initEmployees() so the badge is updated automatically
html = html.replace(/if \(typeof filterEmployees === 'function'\) filterEmployees\(\);/, 
    `$&
                if (typeof detectConflicts === 'function') detectConflicts();`);

fs.writeFileSync('index.html', html);
console.log("Auto-detection hooked");
