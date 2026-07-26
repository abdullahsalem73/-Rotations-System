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

async function test() {
  try {
    await db.collection("system").doc("test").set({ hello: "world" });
    console.log("Write success!");
    const doc = await db.collection("system").doc("test").get();
    console.log("Read success:", doc.data());
  } catch(e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
test();
