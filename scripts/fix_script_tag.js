const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the pattern: });   (newline)   (whitespace) <div class="tabs-nav">
// and insert </script> between them
const before = `        });\r\n    \r\n    <div class="tabs-nav">`;
const after  = `        });\r\n    </script>\r\n\r\n    <div class="tabs-nav">`;

if (html.includes(before)) {
    html = html.replace(before, after);
    fs.writeFileSync('index.html', html);
    console.log('Fixed!');
} else {
    // Try unix line endings
    const before2 = `        });\n    \n    <div class="tabs-nav">`;
    const after2  = `        });\n    </script>\n\n    <div class="tabs-nav">`;
    if (html.includes(before2)) {
        html = html.replace(before2, after2);
        fs.writeFileSync('index.html', html);
        console.log('Fixed (unix)!');
    } else {
        console.log('Pattern not found. Searching near tabs-nav...');
        const idx = html.indexOf('<div class="tabs-nav">');
        console.log('Context:', JSON.stringify(html.slice(idx - 60, idx + 20)));
    }
}
