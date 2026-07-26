const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove ar-sub tags
html = html.replace(/<span class="ar-sub".*?>.*?<\/span>/g, '');
html = html.replace(/<div class="ar-sub".*?>.*?<\/div>/g, '');

// 2. Remove title subtitle
html = html.replace(/<span style="margin-left: 0; font-size: 15px; font-weight: normal;">نظام إدارة الموارد البشرية — الدورات والموظفين<\/span>/g, '');

// 3. Remove pill subtitles
html = html.replace(/<span style="opacity:0\.7; font-size:11px;">\(دورات\)<\/span>/g, '');
html = html.replace(/<span style="opacity:0\.7; font-size:11px;">\(دوام\)<\/span>/g, '');
html = html.replace(/<span style="opacity:0\.7; font-size:11px;">\(إجازة\)<\/span>/g, '');
html = html.replace(/<span style="opacity:0\.7; font-size:11px;">\(رصيد\)<\/span>/g, '');

// 4. Update table labels
html = html.replace(/'<span class="cycle-tag tag-work">دوام<\/span>'/g, "'<span class=\"cycle-tag tag-work\">Work</span>'");
html = html.replace(/'<span class="cycle-tag tag-rest">راحة<\/span>'/g, "'<span class=\"cycle-tag tag-rest\">Rest</span>'");
html = html.replace(/'<span class="cycle-tag tag-leave">إجازة<\/span>'/g, "'<span class=\"cycle-tag tag-leave\">Leave</span>'");

// 5. Update formatDisplayDate
const formatDisplayDateRegex = /function formatDisplayDate[\s\S]*?function parseDate/m;
const newFormatDisplayDate = `function formatDisplayDate(dateStr) {
        if(!dateStr) return '';
        const date = parseDate(dateStr);
        const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const year = date.getFullYear();
        const month = date.getMonth();
        return \`\${day} \${enMonths[month]} \${year}\`;
    }
    function parseDate`;
html = html.replace(formatDisplayDateRegex, newFormatDisplayDate);

// 6. Fix export CSV formatDisplayDate usage since we removed the isHtml param
html = html.replace(/formatDisplayDate\(r\.start, false\)/g, 'formatDisplayDate(r.start)');
html = html.replace(/formatDisplayDate\(r\.end, false\)/g, 'formatDisplayDate(r.end)');

// Clean up extra spaces
html = html.replace(/ >/g, '>');

fs.writeFileSync('index.html', html);
console.log("index.html cleaned");

let js = fs.readFileSync('employees.js', 'utf8');
js = js.replace(/<span class="ar-sub".*?>.*?<\/span>/g, '');
js = js.replace(/<div class="ar-sub".*?>.*?<\/div>/g, '');
js = js.replace(/\\n تأكيد الحذف؟/g, '');
js = js.replace(/\\n الرجاء اختيار التواريخ/g, '');
js = js.replace(/\\n تاريخ النهاية يجب أن يكون بعد تاريخ البداية/g, '');
fs.writeFileSync('employees.js', js);
console.log("employees.js cleaned");
