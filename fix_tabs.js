const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The issue is that the timesheet-tab is missing its closing </div> tag.
// We can find where the Audit Logs Tab begins, and ensure there are 4 closing divs before it instead of 3.
// Specifically, it currently looks like:
//           </div>
//       </div>
//
//     <!-- 4. 🗄️ Audit Logs Tab -->

if (!html.includes('</div>\n    <!-- 4. 🗄️ Audit Logs Tab -->')) {
    html = html.replace(
        '      </div>\n  \n    <!-- 4. 🗄️ Audit Logs Tab -->',
        '      </div>\n</div>\n  \n    <!-- 4. 🗄️ Audit Logs Tab -->'
    );
    // If the exact whitespace varies:
    html = html.replace(
        /<\/div>\s*<!-- 4\. 🗄️ Audit Logs Tab -->/,
        '</div>\n</div>\n    <!-- 4. 🗄️ Audit Logs Tab -->'
    );
    
    // Also, handle the fallback if the emoji encoding is weird
    html = html.replace(
        /<\/div>\s*<!-- 4\..*Audit Logs Tab -->/,
        '</div>\n</div>\n    <!-- 4. 🗄️ Audit Logs Tab -->'
    );
}

fs.writeFileSync('index.html', html);
console.log("Missing div added!");
