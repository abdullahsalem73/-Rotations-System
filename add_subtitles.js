const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = {
    '👥 Employees Directory': '👥 Employees Directory <span class="ar-sub">دليل الموظفين</span>',
    '🔄 Employee Rotations': '🔄 Employee Rotations <span class="ar-sub">إدارة الدورات</span>',
    
    '<div class="label">🔄 Total Cycles</div>': '<div class="label">🔄 Total Cycles <span class="ar-sub">إجمالي الدورات</span></div>',
    '<div class="label">🟢 Work Days</div>': '<div class="label">🟢 Work Days <span class="ar-sub">أيام الدوام</span></div>',
    '<div class="label">🔵 Leave Days</div>': '<div class="label">🔵 Leave Days <span class="ar-sub">أيام الإجازات</span></div>',
    '<div class="label">⚖️ Final Balance</div>': '<div class="label">⚖️ Final Balance <span class="ar-sub">الرصيد الختامي</span></div>',
    
    '<div class="label">👥 Total Employees</div>': '<div class="label">👥 Total Employees <span class="ar-sub">إجمالي الموظفين</span></div>',
    '<div class="label">🏢 Total Companies</div>': '<div class="label">🏢 Total Companies <span class="ar-sub">إجمالي الشركات</span></div>',
    '<div class="label">📑 Total Departments</div>': '<div class="label">📑 Total Departments <span class="ar-sub">إجمالي الأقسام</span></div>',
    
    '<label>📌 Period Type</label>': '<label>📌 Period Type <span class="ar-sub">نوع الفترة</span></label>',
    '<label>📅 Start Date</label>': '<label>📅 Start Date <span class="ar-sub">تاريخ البداية</span></label>',
    '<label>📅 End Date</label>': '<label>📅 End Date <span class="ar-sub">تاريخ النهاية</span></label>',
    
    '<label>🔍 Quick Search</label>': '<label>🔍 Quick Search <span class="ar-sub">بحث سريع</span></label>',
    '<label>🏢 Filter by Company</label>': '<label>🏢 Filter by Company <span class="ar-sub">فلترة بالشركة</span></label>',
    '<label>📑 Filter by Department</label>': '<label>📑 Filter by Department <span class="ar-sub">فلترة بالقسم</span></label>',
    
    '<th class="sortable" onclick="sortRotations(\'type\')" id="sort-type">Type</th>': '<th class="sortable" onclick="sortRotations(\'type\')" id="sort-type">Type <div class="ar-sub">النوع</div></th>',
    '<th class="sortable" onclick="sortRotations(\'start\')" id="sort-start">Start Date</th>': '<th class="sortable" onclick="sortRotations(\'start\')" id="sort-start">Start Date <div class="ar-sub">تاريخ البداية</div></th>',
    '<th class="sortable" onclick="sortRotations(\'end\')" id="sort-end">End Date</th>': '<th class="sortable" onclick="sortRotations(\'end\')" id="sort-end">End Date <div class="ar-sub">تاريخ النهاية</div></th>',
    '<th class="sortable" onclick="sortRotations(\'days\')" id="sort-days">Days</th>': '<th class="sortable" onclick="sortRotations(\'days\')" id="sort-days">Days <div class="ar-sub">الأيام</div></th>',
    '<th style="text-align:center;">Actions</th>': '<th style="text-align:center;">Actions <div class="ar-sub">الإجراءات</div></th>',
    
    '<th class="sortable" onclick="sortEmployees(\'ID\')" id="sort-ID">Employee ID</th>': '<th class="sortable" onclick="sortEmployees(\'ID\')" id="sort-ID">Employee ID <div class="ar-sub">الرقم الوظيفي</div></th>',
    '<th class="sortable" onclick="sortEmployees(\'Name\')" id="sort-Name">Employee Name</th>': '<th class="sortable" onclick="sortEmployees(\'Name\')" id="sort-Name">Employee Name <div class="ar-sub">اسم الموظف</div></th>',
    '<th class="sortable" onclick="sortEmployees(\'Company\')" id="sort-Company">Company</th>': '<th class="sortable" onclick="sortEmployees(\'Company\')" id="sort-Company">Company <div class="ar-sub">الشركة</div></th>',
    '<th class="sortable" onclick="sortEmployees(\'Department\')" id="sort-Department">Department</th>': '<th class="sortable" onclick="sortEmployees(\'Department\')" id="sort-Department">Department <div class="ar-sub">القسم</div></th>',
    
    '➕ Add Period': '➕ Add Period <span class="ar-sub">إضافة فترة</span>',
    '📥 Export CSV': '📥 Export CSV <span class="ar-sub">تصدير CSV</span>',
    '✕ Cancel': '✕ Cancel <span class="ar-sub" style="display:inline; margin-left:4px;">إلغاء</span>',
    '💾 Save': '💾 Save <span class="ar-sub" style="display:inline; margin-left:4px;">حفظ</span>',
    'View Rotations': 'View Rotations <span class="ar-sub" style="display:inline; margin-left:4px;">عرض الدورات</span>'
};

for (let [en, combo] of Object.entries(replacements)) {
    // Only replace if it wasn't already replaced to avoid double spans if run twice
    if (!html.includes(combo)) {
        html = html.split(en).join(combo);
    }
}

// Add CSS for .ar-sub
const cssSnippet = `
        .ar-sub {
            display: block;
            font-size: 0.8em;
            font-weight: 400;
            opacity: 0.6;
            margin-top: 2px;
            letter-spacing: 0;
        }
        .tab-btn .ar-sub { display: inline; margin-left: 8px; font-size: 0.85em; opacity: 0.8; }
        .btn .ar-sub { display: inline; margin-left: 6px; font-size: 0.85em; opacity: 0.8; }
`;

if (!html.includes('.ar-sub {')) {
    html = html.replace('</style>', cssSnippet + '\n    </style>');
}

fs.writeFileSync('index.html', html);
console.log("Subtitles added.");
