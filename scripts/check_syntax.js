const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    i++;
    if (i === 1) {
        const code = match[1];
        // Try parsing line by line to find the issue
        const lines = code.split('\n');
        let accumulated = '';
        for (let j = 0; j < lines.length; j++) {
            accumulated += lines[j] + '\n';
            try {
                new Function(accumulated);
            } catch(e) {
                if (e.message !== 'Unexpected end of input') {
                    // This might be a real error at line j
                    if (j > 0) {
                        const prevOk = (() => { try { new Function(accumulated.split('\n').slice(0,-2).join('\n')); return true; } catch(e2) { return false; } })();
                        if (prevOk) {
                            console.log('Error at line', j+1, ':', e.message);
                            console.log('Line content:', lines[j].trim().substring(0, 200));
                            console.log('Context:', lines.slice(Math.max(0,j-2), j+3).join('\n'));
                            break;
                        }
                    }
                }
            }
        }
        break;
    }
}
