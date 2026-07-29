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

async function migrate() {
    try {
        console.log("Starting migration 101 -> 1019");

        // 1. Employees Collection
        const empSnap = await db.collection("employees").get();
        let targetEmpData = null;
        const updates = [];

        empSnap.forEach(doc => {
            const data = doc.data();
            if (String(data.ID) === "101") {
                targetEmpData = data;
                targetEmpData.ID = "1019"; // update ID
            }
            if (String(data.B2B_Alternate) === "101") {
                data.B2B_Alternate = "1019";
                updates.push(db.collection("employees").doc(doc.id).set(data));
            }
        });

        if (targetEmpData) {
            console.log("Found employee 101, migrating to 1019...");
            await db.collection("employees").doc("1019").set(targetEmpData);
            await db.collection("employees").doc("101").delete();
            console.log("Migrated employee document.");
        } else {
            console.log("Employee 101 not found, maybe already migrated?");
        }

        if (updates.length > 0) {
            await Promise.all(updates);
            console.log("Updated B2B Alternates for", updates.length, "employees.");
        }

        // 2. Camp Rooms (system/camp_rooms)
        const roomDoc = await db.collection("system").doc("camp_rooms").get();
        if (roomDoc.exists) {
            const roomData = roomDoc.data();
            let changed = false;
            roomData.rooms.forEach(room => {
                if (room.owners) {
                    for (let i = 0; i < room.owners.length; i++) {
                        if (String(room.owners[i]) === "101") {
                            room.owners[i] = "1019";
                            changed = true;
                        } else if (room.owners[i] && String(room.owners[i].ID) === "101") {
                            room.owners[i].ID = "1019";
                            changed = true;
                        }
                    }
                }
                if (room.occupants) {
                    for (let i = 0; i < room.occupants.length; i++) {
                        if (String(room.occupants[i].ID) === "101") {
                            room.occupants[i].ID = "1019";
                            changed = true;
                        }
                    }
                }
            });
            if (changed) {
                await db.collection("system").doc("camp_rooms").set(roomData);
                console.log("Updated camp_rooms!");
            }
        }

        // 3. Visitors Movements
        const visDoc = await db.collection("system").doc("visitors_movements").get();
        if (visDoc.exists) {
            const visData = visDoc.data();
            let changed = false;
            if (visData.records) {
                visData.records.forEach(rec => {
                    if (String(rec.empId) === "101") {
                        rec.empId = "1019";
                        changed = true;
                    }
                });
            }
            if (changed) {
                await db.collection("system").doc("visitors_movements").set(visData);
                console.log("Updated visitors_movements!");
            }
        }

        console.log("Migration completed successfully!");
    } catch(e) {
        console.error("Migration failed:", e);
    }
    process.exit(0);
}
migrate();
