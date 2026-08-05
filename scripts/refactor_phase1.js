const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// Target 2: Auto-Resolve Conflicts logic
const conflictMatch = html.match(/(?:\/\/\s*---\s*AUTO-RESOLVE CONFLICTS\s*---[\s\S]*?)(?=\/\/\s*Intercept conflicts rendering)/);
if (conflictMatch) {
    const jsContent = conflictMatch[0].trim();
    fs.writeFileSync(path.join(__dirname, '..', 'js', 'ui-conflicts.js'), jsContent);
    
    html = html.replace(
        /(?:\/\/\s*---\s*AUTO-RESOLVE CONFLICTS\s*---[\s\S]*?)(?=\/\/\s*Intercept conflicts rendering)/,
        '<script src="js/ui-conflicts.js"></script>\n'
    );
    console.log('Extracted Auto-Resolve Conflicts to js/ui-conflicts.js');
} else {
    console.log('Auto-Resolve Conflicts not found.');
}

fs.writeFileSync(indexFile, html);
console.log('Phase 1 Step 2 complete.');
