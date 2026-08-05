const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",
  authDomain: "hr-blk53.firebaseapp.com",
  projectId: "hr-blk53",
  storageBucket: "hr-blk53.firebasestorage.app",
  messagingSenderId: "734368575001",
  appId: "1:734368575001:web:4709f6a667a129ea338488"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fix1009() {
  try {
    const doc = await db.collection("employees").doc("1009").get();
    if (doc.exists) {
      let emp = doc.data();
      console.log("Current rotations length:", emp.Rotations ? emp.Rotations.length : 0);
      if (emp.Rotations) {
        let rotIndex = emp.Rotations.findIndex(r => r.id === "rot_771");
        if (rotIndex !== -1) {
            emp.Rotations[rotIndex].start = "2026-08-20";
            emp.Rotations[rotIndex].end = "2026-09-16";
            await db.collection("employees").doc("1009").set(emp);
            console.log("Fixed employee 1009 rotation rot_771 in Firestore!");
        } else {
            console.log("rot_771 not found");
        }
      }
    } else {
      console.log("Employee 1009 not found!");
    }
  } catch(e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
fix1009();
