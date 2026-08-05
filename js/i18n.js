// js/i18n.js
// Internationalization & Localization Engine (RTL/LTR)

window.I18nEngine = {
    currentLang: localStorage.getItem('hr_language') || 'en',
    
    dict: {
        en: {
            'nav_directory': 'Employees Directory',
            'nav_manifest': 'Flight Manifest',
            'nav_roster': 'Daily Roster',
            'nav_accommodations': 'Accommodations',
            'nav_analytics': 'Analytics',
            'btn_add_employee': 'Add Employee',
            'btn_add_visitor': 'Add Visitor',
            'btn_auto_resolve': 'Auto-Resolve',
            'search_placeholder': 'Search by Name, ID...',
            'lbl_total_staff': 'Total Staff',
            'lbl_work_leave': 'Work vs Leave Status',
            'lbl_on_duty': 'ON-Duty by Company',
            'status_work': 'Work',
            'status_leave': 'Leave',
            'status_sick': 'Sick',
            'status_missing': 'Missing',
            'modal_edit_emp': 'Edit Employee Profile',
            'lbl_name': 'Full Name',
            'lbl_company': 'Company',
            'lbl_dept': 'Department',
            'lbl_pattern': 'Rotation Pattern',
            'lbl_phone': 'Phone Number',
            'btn_save': 'Save Changes',
            'btn_cancel': 'Cancel'
        },
        ar: {
            'nav_directory': 'دليل الموظفين',
            'nav_manifest': 'سجل الرحلات',
            'nav_roster': 'الكشف اليومي',
            'nav_accommodations': 'السكن والمرافق',
            'nav_analytics': 'التحليلات',
            'btn_add_employee': 'إضافة موظف',
            'btn_add_visitor': 'إضافة زائر',
            'btn_auto_resolve': 'حل تلقائي',
            'search_placeholder': 'ابحث بالاسم أو الرقم الوظيفي...',
            'lbl_total_staff': 'إجمالي الموظفين',
            'lbl_work_leave': 'حالة العمل والإجازات',
            'lbl_on_duty': 'على رأس العمل حسب الشركة',
            'status_work': 'مداوم',
            'status_leave': 'إجازة',
            'status_sick': 'مرضي',
            'status_missing': 'غائب',
            'modal_edit_emp': 'تعديل ملف الموظف',
            'lbl_name': 'الاسم الكامل',
            'lbl_company': 'الشركة',
            'lbl_dept': 'القسم',
            'lbl_pattern': 'نظام المناوبة',
            'lbl_phone': 'رقم الهاتف',
            'btn_save': 'حفظ التغييرات',
            'btn_cancel': 'إلغاء'
        }
    },

    translate: function(key) {
        if (this.dict[this.currentLang] && this.dict[this.currentLang][key]) {
            return this.dict[this.currentLang][key];
        }
        return key;
    },

    setLanguage: function(lang) {
        if (lang !== 'en' && lang !== 'ar') return;
        this.currentLang = lang;
        localStorage.setItem('hr_language', lang);
        this.applyLanguage();
    },

    toggleLanguage: function() {
        const newLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    },

    applyLanguage: function() {
        const isAr = this.currentLang === 'ar';
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', this.currentLang);
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = this.translate(key);
            } else {
                const textSpan = el.querySelector('.i18n-text');
                if (textSpan) {
                    textSpan.textContent = this.translate(key);
                } else {
                    el.innerText = this.translate(key);
                }
            }
        });
        
        if (window.Chart) {
            Chart.defaults.font.family = isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif";
            if (window.occChartInst) window.occChartInst.update();
            if (window.statusChartInst) window.statusChartInst.update();
        }
        
        if (window.AuditLogger) {
            AuditLogger.log('Language Change', 'System language switched to ' + this.currentLang.toUpperCase());
        }

        const btnLabel = document.getElementById('lang-indicator');
        if (btnLabel) {
            // Show compact 2-letter code: if now in English, offer AR; if now Arabic, offer EN
            btnLabel.innerText = this.currentLang === 'en' ? 'AR' : 'EN';
        }
        // Update button title tooltip
        const langBtn = document.getElementById('langToggleBtn');
        if (langBtn) {
            langBtn.title = this.currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English';
        }

    },
    
    renderButton: function() {
        if (document.getElementById('langToggleBtn')) return;

        // ── Create a compact icon-only button ──────────────────────────────
        // Label: globe icon + 2-letter code (AR / EN)
        const langCode = this.currentLang === 'en' ? 'AR' : 'EN';

        const btn = document.createElement('button');
        btn.id = 'langToggleBtn';
        btn.title = this.currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English';
        btn.setAttribute('onclick', 'I18nEngine.toggleLanguage()');
        btn.innerHTML =
            '<i class="fas fa-globe" style="font-size:14px;"></i>' +
            '<span id="lang-indicator" style="font-size:11px; font-weight:800; letter-spacing:.5px;">' + langCode + '</span>';

        // Styling — looks like a premium pill chip
        btn.style.cssText =
            'display:inline-flex; align-items:center; gap:5px;' +
            'background:linear-gradient(135deg,rgba(56,189,248,.15),rgba(0,180,216,.08));' +
            'border:1px solid rgba(56,189,248,.35);' +
            'border-radius:20px; padding:0 11px; height:36px;' +
            'color:#38bdf8; cursor:pointer; font-family:"Cairo",sans-serif;' +
            'box-shadow:0 3px 10px rgba(0,0,0,.2);' +
            'transition:all .25s ease; white-space:nowrap; flex-shrink:0;';

        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.08) translateY(-1px)';
            btn.style.borderColor = '#38bdf8';
            btn.style.boxShadow = '0 6px 18px rgba(56,189,248,.35)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.borderColor = 'rgba(56,189,248,.35)';
            btn.style.boxShadow = '0 3px 10px rgba(0,0,0,.2)';
        };

        // ── Inject into the header icon row, or fallback to body ──────────
        const tryInject = () => {
            // Prefer injecting BEFORE the theme button inside .hdr-action-col or .hdr-icons-row
            const iconsRow = document.querySelector('.hdr-icons-row');
            const themeBtn = document.getElementById('themeToggleBtn');
            if (iconsRow && themeBtn && iconsRow.contains(themeBtn)) {
                iconsRow.insertBefore(btn, themeBtn);
                return true;
            }
            // Fallback: before theme button wherever it is
            if (themeBtn && themeBtn.parentNode) {
                themeBtn.parentNode.insertBefore(btn, themeBtn);
                return true;
            }
            return false;
        };

        if (!tryInject()) {
            // Last resort: fixed bottom-right corner (small, unobtrusive)
            btn.style.position = 'fixed';
            btn.style.bottom = '80px';
            btn.style.right = '15px';
            btn.style.zIndex = '9999';
            document.body.appendChild(btn);
        }

        this.applyLanguage();
    },

    init: function() {
        if (!document.getElementById('cairo-font')) {
            const link = document.createElement('link');
            link.id = 'cairo-font';
            link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        
        if (!document.getElementById('rtl-styles')) {
            const style = document.createElement('style');
            style.id = 'rtl-styles';
            
            style.innerHTML = 
                'html[dir="rtl"] {' +
                '    font-family: "Cairo", sans-serif !important;' +
                '}' +
                'html[dir="rtl"] body {' +
                '    font-family: "Cairo", sans-serif !important;' +
                '}' +
                'html[dir="rtl"] .modal-content {' +
                '    text-align: right;' +
                '}' +
                'html[dir="rtl"] .form-group label {' +
                '    display: block;' +
                '    text-align: right;' +
                '}' +
                'html[dir="rtl"] .search-bar input {' +
                '    padding-right: 40px;' +
                '    padding-left: 20px;' +
                '}' +
                'html[dir="rtl"] .search-bar i {' +
                '    right: 15px;' +
                '    left: auto;' +
                '}' +
                'html[dir="rtl"] .magic-sidebar {' +
                '    right: -100%;' +
                '    left: auto;' +
                '    border-right: none;' +
                '    border-left: 1px solid rgba(255,255,255,0.1);' +
                '}' +
                'html[dir="rtl"] .magic-sidebar.open {' +
                '    right: 0;' +
                '    left: auto;' +
                '}';
            
            document.head.appendChild(style);
        }
        
        if (document.body) {
            this.renderButton();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.renderButton());
        }
    }
};

I18nEngine.init();
