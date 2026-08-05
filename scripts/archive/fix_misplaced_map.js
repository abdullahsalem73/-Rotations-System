const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const mapStart = '<!-- Global Live Camp Map Modal -->';
const scriptEnd = '</script>\n</body>';

if (html.includes(mapStart)) {
    // Extract the block that was mistakenly injected
    const startIndex = html.indexOf(mapStart);
    const endIndex = html.indexOf('</script>\n</body>', startIndex) + '</script>\n'.length;
    
    if (startIndex > -1 && endIndex > startIndex) {
        const injectedBlock = html.substring(startIndex, endIndex);
        
        // Remove it from the wrong place and restore the first </body> it consumed
        html = html.substring(0, startIndex) + html.substring(endIndex);
        
        // Now find the LAST </body>
        const lastBodyIndex = html.lastIndexOf('</body>');
        if (lastBodyIndex > -1) {
            html = html.substring(0, lastBodyIndex) + injectedBlock + '\n</body>' + html.substring(lastBodyIndex + '</body>'.length);
            fs.writeFileSync('index.html', html);
            console.log("Moved Map Modal to the actual end of the document.");
        } else {
            console.log("Could not find last </body>.");
        }
    }
} else {
    console.log("Map block not found.");
}
