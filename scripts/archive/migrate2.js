const fs = require('fs');
let html = fs.readFileSync('d:/Rotations/index.html', 'utf-8');

// 1. Firebase SDK
if (!html.includes('firebase-app-compat.js')) {
    html = html.replace('</head>', '    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>\n</head>');
}

// 2. Firebase Init
if (!html.includes('firebaseConfig')) {
    html = html.replace('<script>\n    // ---------------------------------\n    // Tabs Logic', '<script>\n    // ---------------------------------\n    // Firebase Setup\n    // ---------------------------------\n    const firebaseConfig = {\n      apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",\n      authDomain: "hr-blk53.firebaseapp.com",\n      projectId: "hr-blk53",\n      storageBucket: "hr-blk53.firebasestorage.app",\n      messagingSenderId: "734368575001",\n      appId: "1:734368575001:web:4709f6a667a129ea338488"\n    };\n    firebase.initializeApp(firebaseConfig);\n    const db = firebase.firestore();\n\n    // ---------------------------------\n    // Tabs Logic');
}

// 3. employees replacement
const oldEmpBlock = \    let employees = [];
    try {
        const storedEmployees = localStorage.getItem('hrEmployeesData');
        if (storedEmployees) {
            employees = JSON.parse(storedEmployees);
        } else {
            employees = typeof EMPLOYEE_DATA !== 'undefined' ? EMPLOYEE_DATA : [];
        }
    } catch(e) {
        employees = typeof EMPLOYEE_DATA !== 'undefined' ? EMPLOYEE_DATA : [];
    }

    function saveEmployeesData() {
        try {
            localStorage.setItem('hrEmployeesData', JSON.stringify(employees));
        } catch(e) {
            console.error('Failed to save to localStorage', e);
        }
    }\;

const newEmpBlock = \    let employees = [];
    let initialEmployeesLoad = true;

    db.collection("employees").onSnapshot((snapshot) => {
        if (snapshot.empty && initialEmployeesLoad) {
            initialEmployeesLoad = false;
            let localData = [];
            try {
                const stored = localStorage.getItem('hrEmployeesData');
                if (stored) localData = JSON.parse(stored);
                else if (typeof EMPLOYEE_DATA !== 'undefined') localData = EMPLOYEE_DATA;
            } catch(e) {}
            
            if (localData.length > 0) {
                employees = localData;
                saveEmployeesData(); 
            }
        } else {
            initialEmployeesLoad = false;
            employees = [];
            snapshot.forEach(doc => {
                employees.push(doc.data());
            });
            
            employees.forEach(e => {
                if (!e.Destination && e.Department) e.Destination = e.Department;
            });
            
            filteredEmployees = [...employees];
            
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initEmployees();
                initCharts();
                if (typeof filterEmployees === 'function') filterEmployees();
            }
        }
    });

    function saveEmployeesData() {
        const batch = db.batch();
        employees.forEach(emp => {
            const docRef = db.collection("employees").doc(String(emp.ID));
            batch.set(docRef, emp);
        });
        batch.commit().catch(e => console.error("Firebase sync error", e));
    }\;

html = html.replace(oldEmpBlock, newEmpBlock);

// 4. Update saveData for rotations
const oldSaveDataEnd = \            const emp = employees.find(e => e.ID === selectedEmployeeId);
            if (emp) emp.Rotations = records;
            // Optionally, we could save the whole EMPLOYEE_DATA back to a backend, but here it's just in memory.
        } else {
            localStorage.setItem('hrRotationRecords', JSON.stringify(records)); 
        }\;

const newSaveDataEnd = \            const emp = employees.find(e => e.ID === selectedEmployeeId);
            if (emp) {
                emp.Rotations = records;
                saveEmployeesData(); // Sync to Firebase!
            }
        } else {
            // General records
            db.collection("system").doc("general_rotations").set({ records: records });
        }\;

html = html.replace(oldSaveDataEnd, newSaveDataEnd);

// 5. Update loadData for general rotations
const oldLoadDataEnd = \        } else {
            const stored = localStorage.getItem('hrRotationRecords');
            if (stored) {
                try { records = JSON.parse(stored); } catch(e) { records = []; }
            } else { records = []; }
        }\;

const newLoadDataEnd = \        } else {
            db.collection("system").doc("general_rotations").get().then(doc => {
                if (doc.exists) {
                    records = doc.data().records || [];
                    renderTable();
                    updateStats();
                } else {
                    records = [];
                }
            });
        }\;

html = html.replace(oldLoadDataEnd, newLoadDataEnd);

// 6. Fix window.onload removing the static loadData since it's async now (mostly for general)
html = html.replace('window.onload = function() {\\n        // Rotations\\n        loadData();', 'window.onload = function() {\\n        // Rotations\\n        if (selectedEmployeeId) loadData();');

fs.writeFileSync('d:/Rotations/index.html', html, 'utf-8');
console.log('Firebase injected successfully');
