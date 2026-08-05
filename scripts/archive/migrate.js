const fs = require('fs');
let html = fs.readFileSync('d:/Rotations/index.html', 'utf-8');

// 1. Add Firebase SDK
if (!html.includes('firebase-app-compat.js')) {
    html = html.replace('</head>', '    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>\n</head>');
}

// 2. Add Firebase Config
if (!html.includes('firebaseConfig')) {
    html = html.replace('<script>\n    // ---------------------------------\n    // Tabs Logic', '<script>\n    const firebaseConfig = {\n      apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",\n      authDomain: "hr-blk53.firebaseapp.com",\n      projectId: "hr-blk53",\n      storageBucket: "hr-blk53.firebasestorage.app",\n      messagingSenderId: "734368575001",\n      appId: "1:734368575001:web:4709f6a667a129ea338488"\n    };\n    firebase.initializeApp(firebaseConfig);\n    const db = firebase.firestore();\n\n    // ---------------------------------\n    // Tabs Logic');
}

// 3. Replace saveEmployeesData
html = html.replace(/function saveEmployeesData\(\) \{[\s\S]*?localStorage\.setItem\('hrEmployeesData'[\s\S]*?\}\n    \}/, 
    unction saveEmployeesData() {\n        const batch = db.batch();\n        employees.forEach(emp => {\n            const docRef = db.collection("employees").doc(String(emp.ID));\n            batch.set(docRef, emp);\n        });\n        batch.commit().catch(e => console.error("Firebase sync error", e));\n    });

// 4. Update window.onload for employees sync
const oldOnload =     window.onload = function() {
        // Rotations
        loadData();
        renderTable();
        updateStats();
        // Employees
        initEmployees();
        initCharts();;

const newOnload =     window.onload = function() {
        // Rotations
        loadData();
        renderTable();
        updateStats();
        
        // Listen to Firebase Realtime updates for Employees
        db.collection("employees").onSnapshot((snapshot) => {
            if (snapshot.empty) {
                // Initial Migration if DB is empty but we have local data
                let localData = [];
                try {
                    const stored = localStorage.getItem('hrEmployeesData');
                    if (stored) localData = JSON.parse(stored);
                    else if (typeof EMPLOYEE_DATA !== 'undefined') localData = EMPLOYEE_DATA;
                } catch(e) {}
                
                if (localData.length > 0) {
                    employees = localData;
                    saveEmployeesData(); // push to Firebase
                }
            } else {
                employees = [];
                snapshot.forEach(doc => {
                    employees.push(doc.data());
                });
                
                // Normalize legacy data
                employees.forEach(e => {
                    if (!e.Destination && e.Department) e.Destination = e.Department;
                });
                
                filteredEmployees = [...employees];
                initEmployees();
                initCharts();
            }
        });;

html = html.replace(oldOnload, newOnload);

fs.writeFileSync('d:/Rotations/index.html', html, 'utf-8');
console.log('Firebase injected successfully');
