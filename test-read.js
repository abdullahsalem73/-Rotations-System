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

async function run() {
  try {
    const docRef = db.collection("employees").doc("1015");
    const doc = await docRef.get();
    console.log("Doc 1015 exists?", doc.exists);
    if(doc.exists) {
        console.log("Data:", doc.data());
    }
  } catch(e) {
    console.error("Fetch Error:", e.message);
  }
  process.exit();
}
run();
