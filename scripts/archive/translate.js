const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = {
    '<html lang="ar" dir="rtl">': '<html lang="en" dir="ltr">',
    'نظام إدارة الدورات والموظفين - الموارد البشرية': 'HR Rotations & Employee Management System',
    '👥 دليل الموظفين': '👥 Employees Directory',
    '🗓️ إدارة الدورات': '🗓️ Manage Rotations',
    'إجمالي الموظفين': 'Total Employees',
    'إجمالي الشركات': 'Total Companies',
    'إجمالي الأقسام': 'Total Departments',
    '🔍 بحث سريع': '🔍 Quick Search',
    'ابحث بالاسم أو الرقم الوظيفي...': 'Search by name or ID...',
    '🏢 فلترة بالشركة': '🏢 Filter by Company',
    '-- جميع الشركات --': '-- All Companies --',
    '📑 فلترة بالقسم': '📑 Filter by Department',
    '-- جميع الأقسام --': '-- All Departments --',
    'الرقم الوظيفي': 'Employee ID',
    'اسم الموظف': 'Employee Name',
    'الشركة': 'Company',
    'القسم': 'Department',
    'الإجراءات': 'Actions',
    'عرض الدورات': 'View Rotations',
    'لا يوجد موظفين يطابقون البحث.': 'No employees match the search.',
    '📥 تصدير CSV': '📥 Export CSV',
    '📌 نوع الفترة': '📌 Period Type',
    '📅 تاريخ البداية': '📅 Start Date',
    '📅 تاريخ النهاية': '📅 End Date',
    'عدد الأيام': 'Days',
    '➕ إضافة الفترة': '➕ Add Period',
    '✕ إلغاء': '✕ Cancel',
    '💾 حفظ': '💾 Save',
    'تأكيد الحذف؟': 'Confirm deletion?',
    'الرجاء اختيار التواريخ.': 'Please select dates.',
    'تاريخ النهاية يجب أن يكون بعد البداية.': 'End date must be after start date.',
    ' يوم': ' days',
    'يوم': 'days',
    'الدوام (عمل)': 'Work',
    'الراحة (8 أيام)': 'Rest',
    'الإجازة': 'Leave',
    '# الدورة': '# Cycle',
    'دورة ': 'Cycle ',
    'لا توجد دورات مسجلة.': 'No rotations recorded.',
    '<script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ar.js"></script>': '',
    'locale: "ar",': '',
    'text-align: right;': 'text-align: left;',
    'margin-right: 8px;': 'margin-left: 8px;',
    'margin-right: auto;': 'margin-left: auto;',
    'margin-right: 10px;': 'margin-left: 10px;',
    'right: 14px;': 'left: 14px;',
    'padding-right: 40px;': 'padding-left: 40px;',
    'border-right: 6px': 'border-left: 6px',
    'border-right: 4px': 'border-left: 4px'
};

for (const [ar, en] of Object.entries(replacements)) {
    // Escape special characters for regex if needed, or just use string replace for multiple
    html = html.split(ar).join(en);
}

fs.writeFileSync('index.html', html);
console.log("Translation complete.");
