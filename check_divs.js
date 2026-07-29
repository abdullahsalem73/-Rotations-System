const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Get HTML up to Audit Logs Tab
const auditIndex = html.indexOf('<!-- 4. 🗄️ Audit Logs Tab -->');
if (auditIndex === -1) {
    console.log("Audit tab not found!");
} else {
    const subset = html.substring(0, auditIndex);
    
    // Count opening and closing divs
    let openMatch = subset.match(/<div\b[^>]*>/gi);
    let closeMatch = subset.match(/<\/div>/gi);
    
    let openCount = openMatch ? openMatch.length : 0;
    let closeCount = closeMatch ? closeMatch.length : 0;
    
    console.log(`Before Audit Tab: Open Divs = ${openCount}, Closed Divs = ${closeCount}`);
    console.log(`Unclosed Divs = ${openCount - closeCount}`);
}
