const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const mapStart = '<!-- Global Live Camp Map Modal -->';
const mapStartIndex = html.indexOf(mapStart);

if (mapStartIndex > -1) {
    const nextBodyIndex = html.indexOf('</body>', mapStartIndex);
    if (nextBodyIndex > -1) {
        // Extract the block that was wrongly injected
        const injectedBlock = html.substring(mapStartIndex, nextBodyIndex);
        
        // Remove it from the current position
        html = html.substring(0, mapStartIndex) + html.substring(nextBodyIndex);
        
        // Now find the absolute last </body>
        const lastBodyIndex = html.lastIndexOf('</body>');
        if (lastBodyIndex > -1) {
            // Inject it before the last </body>
            html = html.substring(0, lastBodyIndex) + injectedBlock + html.substring(lastBodyIndex);
            fs.writeFileSync('index.html', html);
            console.log("Successfully moved the modal to the absolute end of the document.");
        } else {
            console.log("Could not find the last </body>.");
        }
    } else {
        console.log("Could not find </body> after the modal.");
    }
} else {
    console.log("Modal not found at all.");
}
