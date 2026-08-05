const firebase = require('firebase/app');
require('firebase/firestore');
const firebaseConfig = {
  apiKey: "AIzaSyBakWJvA6nC9yCOuVCIGQmi0v9P-boKM38",
  authDomain: "hr-blk53.firebaseapp.com",
  projectId: "hr-blk53",
  storageBucket: "hr-blk53.firebasestorage.app",
  messagingSenderId: "734368575001",
  appId: "1:734368575001:web:4709f6a667a129ea338488"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection('employees').doc('69').get().then(doc => {
   if(doc.exists) {
       console.log('Rotations count:', doc.data().Rotations.length);
       console.log('Last few rotations:', JSON.stringify(doc.data().Rotations.slice(-2), null, 2));
   } else {
       console.log('Doc not found');
   }
   process.exit(0);
});
