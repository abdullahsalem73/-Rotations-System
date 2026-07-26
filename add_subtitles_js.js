const fs = require('fs');
let js = fs.readFileSync('employees.js', 'utf8');

const replacements = {
    "'View Rotations'": "'View Rotations <span class=\"ar-sub\" style=\"display:inline; margin-left:4px;\">عرض الدورات</span>'",
    "'No employees match the search.'": "'No employees match the search. <div class=\"ar-sub\">لا يوجد موظفين يطابقون البحث</div>'",
    "'No rotations recorded.'": "'No rotations recorded. <div class=\"ar-sub\">لا توجد دورات مسجلة</div>'",
    "'Confirm deletion?'": "'Confirm deletion? \\n تأكيد الحذف؟'",
    "'Please select dates.'": "'Please select dates. \\n الرجاء اختيار التواريخ'",
    "'End date must be after start date.'": "'End date must be after start date. \\n تاريخ النهاية يجب أن يكون بعد تاريخ البداية'"
};

for (let [en, combo] of Object.entries(replacements)) {
    if (!js.includes(combo)) {
        js = js.split(en).join(combo);
    }
}

fs.writeFileSync('employees.js', js);
console.log("JS Subtitles added.");
