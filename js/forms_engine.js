// js/forms_engine.js

// 1. Data Schema & Initial State
const FormsHub = {
    categories: [
        { id: 'cat_family', name_en: 'Family & Personal Affairs', name_ar: 'الشؤون العائلية والشخصية', icon: '👶' },
        { id: 'cat_ops', name_en: 'Operations & Shift Movement', name_ar: 'عمليات وتغيير المناوبات', icon: '🌴' },
        { id: 'cat_medical', name_en: 'Medical, Admin & Clearance', name_ar: 'الطبية والإدارية والتخليص', icon: '🏥' }
    ],
    templates: [
        {
            id: 'form_family_medical_termination', category_id: 'cat_family', title_en: 'Family Medical Form (Termination)', title_ar: 'نموذج الإلغاء الطبي للعائلة',
            ledger_impact: false, type: 'web',
            fields: [
                { name: 'dep1_name', label_en: 'Dependent 1 Name', label_ar: 'اسم التابع 1', type: 'text' },
                { name: 'dep1_relation', label_en: 'Dependent 1 Relation', label_ar: 'صلة القرابة', type: 'text' },
                { name: 'dep1_reason', label_en: 'Reason of Termination', label_ar: 'سبب الإلغاء', type: 'text' },
                { name: 'dep2_name', label_en: 'Dependent 2 Name', label_ar: 'اسم التابع 2', type: 'text' },
                { name: 'dep2_relation', label_en: 'Dependent 2 Relation', label_ar: 'صلة القرابة', type: 'text' },
                { name: 'dep2_reason', label_en: 'Reason of Termination', label_ar: 'سبب الإلغاء', type: 'text' }
            ]
        },
        {
            id: 'form_additional_dependents', category_id: 'cat_family', title_en: 'Additional Dependents', title_ar: 'إضافة تابعين إضافيين',
            ledger_impact: false, type: 'web',
            fields: [
                { name: 'spouse_name', label_en: 'Other Spouse Full Name (if any)', label_ar: 'اسم الزوج/ـة (إن وجد)', type: 'text' },
                { name: 'spouse_dob', label_en: 'Date of Birth', label_ar: 'تاريخ الميلاد', type: 'date' },
                { name: 'spouse_occupation', label_en: 'Spouse Occupation', label_ar: 'مهنة الزوج/ـة', type: 'text' },
                { name: 'child1_name', label_en: 'Child 1 Name', label_ar: 'اسم الطفل 1', type: 'text' },
                { name: 'child1_dob', label_en: 'Child 1 Date of Birth', label_ar: 'تاريخ الميلاد', type: 'date' },
                { name: 'child1_sex', label_en: 'Child 1 Sex', label_ar: 'الجنس', type: 'select', options: ['M', 'F'] },
                { name: 'child2_name', label_en: 'Child 2 Name', label_ar: 'اسم الطفل 2', type: 'text' },
                { name: 'child2_dob', label_en: 'Child 2 Date of Birth', label_ar: 'تاريخ الميلاد', type: 'date' },
                { name: 'child2_sex', label_en: 'Child 2 Sex', label_ar: 'الجنس', type: 'select', options: ['M', 'F'] }
            ]
        },
        {
            id: 'form_hajj_leave', category_id: 'cat_ops', title_en: 'Hajj Leave Request', title_ar: 'طلب إجازة الحج',
            ledger_impact: true, type: 'web',
            fields: [
                { name: 'years_service', label_en: 'Years of Service', label_ar: 'سنوات الخدمة', type: 'number' },
                { name: 'from_date', label_en: 'From Date', label_ar: 'من تاريخ', type: 'date' },
                { name: 'to_date', label_en: 'To Date', label_ar: 'إلى تاريخ', type: 'date' }
            ]
        },
        {
            id: 'form_child_birth_expenses', category_id: 'cat_medical', title_en: 'Payment of Child\'s Birth Expenses', title_ar: 'صرف مصاريف ولادة',
            ledger_impact: false, type: 'web',
            fields: [
                { name: 'child_name', label_en: 'Child\'s Name', label_ar: 'اسم المولود', type: 'text' },
                { name: 'sex', label_en: 'Sex', label_ar: 'الجنس', type: 'select', options: ['M', 'F'] },
                { name: 'birth_day', label_en: 'Birth Day', label_ar: 'تاريخ الميلاد', type: 'date' },
                { name: 'hospital_name', label_en: 'Hospital\'s Name', label_ar: 'اسم المستشفى', type: 'text' },
                { name: 'hospital_status', label_en: 'Status of Hospital', label_ar: 'حالة المستشفى', type: 'select', options: ['Contracted', 'Non-Contracted'] },
                { name: 'payment_method', label_en: 'Method of Payment', label_ar: 'طريقة الدفع', type: 'select', options: ['Invoice reimbursement', 'Lump Sum'] }
            ]
        }
    ],
    submissions: [] // Store active submissions here
};

// 2. Initialization & UI Builders
function initFormsHub() {
    renderFormCategories();
    renderMyRequests();
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if the tab exists
    if(document.getElementById('formsHub-tab')) {
        initFormsHub();
    }
});

function renderFormCategories() {
    const container = document.getElementById('forms-categories-grid');
    if (!container) return;
    container.innerHTML = '';

    FormsHub.categories.forEach(cat => {
        const catForms = FormsHub.templates.filter(t => t.category_id === cat.id);
        const card = document.createElement('div');
        card.className = 'card forms-cat-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">${cat.icon}</div>
            <h3 style="margin: 0 0 10px 0; color: var(--secondary);">${cat.name_en}</h3>
            <p style="margin: 0; color: var(--text-muted); font-size: 13px;">${catForms.length} Forms Available</p>
        `;
        card.onclick = () => showFormsForCategory(cat.id);
        container.appendChild(card);
    });
}

function showFormsForCategory(categoryId) {
    const cat = FormsHub.categories.find(c => c.id === categoryId);
    const forms = FormsHub.templates.filter(t => t.category_id === categoryId);
    
    let html = `<h3>${cat.icon} ${cat.name_en} Forms</h3><div class="forms-list" style="display:flex; flex-direction:column; gap:10px;">`;
    forms.forEach(form => {
        const isLegacy = form.type === 'legacy';
        const actionBtn = isLegacy 
            ? `<button class="btn btn-outline" onclick="alert('Downloading ${form.title_en} template...')">⬇️ Download Template</button>`
            : `<button class="btn" onclick="openWebForm('${form.id}')">✍️ Fill Form</button>`;
        
        html += `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h4 style="margin: 0 0 5px 0;">${form.title_en}</h4>
                    <span style="font-size: 12px; color: var(--text-muted);">${form.title_ar}</span>
                </div>
                <div>${actionBtn}</div>
            </div>
        `;
    });
    html += `</div><button class="btn btn-outline" style="margin-top: 20px;" onclick="renderFormCategories()">🔙 Back to Categories</button>`;
    
    document.getElementById('forms-categories-grid').innerHTML = html;
}

// 3. Form Handling Logic
function openWebForm(formId) {
    const form = FormsHub.templates.find(t => t.id === formId);
    if (!form) return;

    const empData = { name: "Ahmed Salem", id: "EMP-4512", dept: "Operations" };

    let fieldsHtml = form.fields.map(f => {
        let inputHtml = '';
        if (f.type === 'select') {
            inputHtml = `<select id="field_${f.name}" class="form-input" style="width:100%; padding:10px; border-radius:8px; background:var(--input-bg); color:white; border:1px solid var(--glass-border);">
                ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`;
        } else if (f.type === 'textarea') {
            inputHtml = `<textarea id="field_${f.name}" class="form-input" rows="3" style="width:100%; padding:10px; border-radius:8px; background:var(--input-bg); color:white; border:1px solid var(--glass-border);"></textarea>`;
        } else {
            inputHtml = `<input type="${f.type}" id="field_${f.name}" class="form-input" style="width:100%; padding:10px; border-radius:8px; background:var(--input-bg); color:white; border:1px solid var(--glass-border);">`;
        }

        return `
            <div style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom:5px; color:var(--text-muted); font-size:13px;">${f.label_en} / ${f.label_ar}</label>
                ${inputHtml}
            </div>
        `;
    }).join('');

    const modalHtml = `
        <div id="dynamicFormModal" class="modal" style="display:block;">
            <div class="modal-content" style="max-width: 600px;">
                <span class="close" onclick="closeWebForm()">&times;</span>
                <h2 class="gradient-text">${form.title_en}</h2>
                <div style="background: rgba(0, 180, 216, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
                    <strong>Employee:</strong> ${empData.name} | <strong>ID:</strong> ${empData.id} | <strong>Dept:</strong> ${empData.dept}
                </div>
                <div id="dynamicFormBody">
                    ${fieldsHtml}
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; color:var(--text-muted); font-size:13px;">Attachments (Optional)</label>
                        <input type="file" id="form_attachment" style="color:white; font-size: 13px;">
                    </div>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                    <button class="btn btn-outline" onclick="closeWebForm()">Cancel</button>
                    <button class="btn" onclick="submitWebForm('${formId}')">🚀 Submit Form</button>
                </div>
            </div>
        </div>
    `;

    const existing = document.getElementById('dynamicFormModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeWebForm() {
    const modal = document.getElementById('dynamicFormModal');
    if (modal) modal.remove();
}

function submitWebForm(formId) {
    const form = FormsHub.templates.find(t => t.id === formId);
    
    const data = {};
    form.fields.forEach(f => {
        const el = document.getElementById(`field_${f.name}`);
        if(el) data[f.name] = el.value;
    });

    const newSub = {
        id: 'SUB-' + Math.floor(Math.random()*10000),
        form_id: formId,
        form_title: form.title_en,
        emp_name: 'Ahmed Salem', // Mock employee for now
        emp_id: '120',           // Mock employee ID
        data: data,
        status: 'Pending HR Approval',
        date: new Date().toLocaleDateString(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (typeof db !== 'undefined') {
        db.collection('form_submissions').doc(newSub.id).set(newSub).then(() => {
            closeWebForm();
            const sysMsg = form.ledger_impact ? 'Submitted successfully. Note: Approval will auto-update Time Ledger.' : 'Submitted successfully.';
            if (typeof Swal !== 'undefined') {
                Swal.fire({ title: 'Success!', text: sysMsg, icon: 'success', customClass: { popup: 'swal2-popup' } });
            } else {
                alert(sysMsg);
            }
        }).catch(err => {
            console.error("Error saving form: ", err);
            alert("Error saving form to database.");
        });
    } else {
        // Fallback if DB not loaded
        FormsHub.submissions.push(newSub);
        closeWebForm();
        alert('Saved locally. Database not connected.');
        renderMyRequests();
    }
}

function renderMyRequests() {
    const tbody = document.getElementById('forms-requests-tbody');
    if (!tbody) return;
    
    if (typeof db !== 'undefined') {
        db.collection('form_submissions').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No requests found.</td></tr>`;
                return;
            }
            
            snapshot.forEach(doc => {
                const sub = doc.data();
                FormsHub.submissions = FormsHub.submissions.filter(s => s.id !== sub.id); // Deduplicate
                FormsHub.submissions.push(sub);
                
                let badgeClass = sub.status.includes('Pending') ? 'badge-rest' : 'badge-work';
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${sub.id}</strong></td>
                        <td>${sub.form_title}</td>
                        <td>${sub.date}</td>
                        <td><span class="badge ${badgeClass}">${sub.status}</span></td>
                        <td>
                            <button class="btn btn-outline" style="padding: 5px 10px; font-size: 12px; margin: 2px;" onclick="previewFormPDF('${sub.id}')">📄 PDF</button>
                            ${sub.status.includes('Pending') ? `<button class="btn" style="padding: 5px 10px; font-size: 12px; background: var(--success); margin: 2px;" onclick="approveForm('${sub.id}')">✔️ Approve</button>` : ''}
                        </td>
                    </tr>
                `;
            });
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Database not connected.</td></tr>`;
    }
}

function approveForm(subId) {
    const sub = FormsHub.submissions.find(s => s.id === subId);
    if (!sub) return;
    
    if (typeof db !== 'undefined') {
        db.collection('form_submissions').doc(subId).update({
            status: 'Approved'
        }).then(() => {
            const form = FormsHub.templates.find(t => t.id === sub.form_id);
            let msg = `Request ${subId} Approved.`;
            
            if (form && form.ledger_impact && sub.form_id === 'form_hajj_leave') {
                // Deduct 20 days for Hajj Leave from rotations (assuming rotations collection)
                db.collection('rotations').where('employeeId', '==', sub.emp_id).get().then(snap => {
                    if(!snap.empty) {
                        const rotDoc = snap.docs[0];
                        const currentDays = rotDoc.data().daysAccrued || 0;
                        rotDoc.ref.update({ daysAccrued: currentDays - 20 });
                        msg += ` Time Ledger updated automatically (-20 days).`;
                    }
                    showApproveSuccess(msg);
                });
            } else {
                showApproveSuccess(msg);
            }
        });
    }
}

function showApproveSuccess(msg) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Approved', text: msg, icon: 'success', customClass: { popup: 'swal2-popup' } });
    } else {
        alert(msg);
    }
}

function previewFormPDF(subId) {
    const sub = FormsHub.submissions.find(s => s.id === subId);
    if (!sub) return;

    const printZone = document.createElement('div');
    printZone.id = 'pdf-render-zone';
    printZone.style.cssText = 'position:absolute; left:-9999px; top:0; width:800px; padding:40px; background:white; color:black; font-family:Arial, sans-serif;';
    
    let dataHtml = Object.keys(sub.data).map(k => `<p><strong>${k}:</strong> ${sub.data[k]}</p>`).join('');
    
    printZone.innerHTML = `
        <div style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
            <h2>${sub.form_title}</h2>
            <div style="text-align:right;">
                <p style="margin:0;"><strong>PetroMasila HR</strong></p>
                <p style="margin:0; font-size:12px;">Ref: ${sub.id}</p>
                <p style="margin:0; font-size:12px;">Date: ${sub.date}</p>
            </div>
        </div>
        <div style="margin-bottom: 30px;">
            <h3>Employee Details</h3>
            <p><strong>Name:</strong> ${sub.emp_name}</p>
        </div>
        <div style="margin-bottom: 30px;">
            <h3>Form Data</h3>
            ${dataHtml}
        </div>
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align:center;">
            <p style="font-size:10px; color:#666;">Digitally Verified via HR-BLK53-System</p>
            <p style="font-size:10px; color:#666;">Status: ${sub.status}</p>
            <div style="border: 1px solid #ccc; width:80px; height:80px; margin: 10px auto; display:flex; align-items:center; justify-content:center; font-size:10px;">QR CODE</div>
        </div>
    `;
    
    document.body.appendChild(printZone);

    if (typeof html2pdf === 'undefined') {
        alert('html2pdf library not loaded yet!');
        document.body.removeChild(printZone);
        return;
    }

    const opt = {
        margin:       0.5,
        filename:     `${sub.id}_${sub.form_title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(printZone).save().then(() => {
        document.body.removeChild(printZone);
    });
}
