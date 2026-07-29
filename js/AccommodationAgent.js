/**
 * AccommodationAgent.js
 * 
 * Manages the Camp housing blocks (A, B, E, H, F, G) and room assignments.
 */

window.AccommodationAgent = {
    // Configuration mapping each block to its total number of rooms.
    // This allows easy future expansion (e.g., adding 'K': 15).
    blockConfig: {
        'A': 13,
        'B': 25,
        'E': 12,
        'H': 20,
        'F': 11,
        'G': 11
    },
    
    // Dynamically get the array of block names from the configuration
    get blocks() { return Object.keys(this.blockConfig); },
    
    rooms: [], // Will store all room objects
    
    // Room Types: 
    // 'single' (1 bed, 1 dedicated person)
    // 'b2b' (1 bed, shared by 2 people on opposite rotations)
    // 'shared' (N beds, multiple concurrent people)

    /**
     * Initializes rooms based on blockConfig.
     */
    initMockRooms: function() {
        this.rooms = [];
        this.blocks.forEach(block => {
            const numRooms = this.blockConfig[block];
            for (let i = 1; i <= numRooms; i++) {
                const roomNo = `${block}${i < 10 ? '0'+i : i}`;
                
                // Distribute room types logically based on block capacity
                let type = 'single';
                let beds = 1;
                
                // Approx 40% B2B, 20% Shared, 40% Single
                if (i <= Math.ceil(numRooms * 0.4)) {
                    type = 'b2b';
                } else if (i >= Math.floor(numRooms * 0.8)) {
                    type = 'shared';
                    beds = 4; // 4 beds in shared rooms
                }

                // Generate a deterministic extension number (e.g. E01 -> 1501)
                const extPrefix = block.charCodeAt(0) - 64; // A=1, B=2, E=5, etc.
                const extension = '1' + extPrefix + (i < 10 ? '0'+i : i);

                this.rooms.push({
                    id: roomNo,
                    type: type,
                    beds: beds,
                    block: block,
                    extension: extension,
                    status: 'Available', // Available, Occupied, NeedsCleaning, Maintenance
                    occupants: [],
                    owners: [],
                    history: []
                });
            }
        });
    },

    /**
     * Change room status manually
     */
    changeRoomStatus: function(roomId, newStatus, userName = 'System') {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            room.status = newStatus;
            room.history.push({
                date: new Date().toISOString(),
                action: `Status changed to ${newStatus}`,
                by: userName
            });
            this.saveRooms();
            return true;
        }
        return false;
    },

    /**
     * Re-calculates occupancy based on who is actually ON site today.
     * @param {Array} onDutyEmployees (List of employees currently ON duty)
     */
    syncOccupancy: function(onDutyEmployees) {
        this.smartAlerts = []; // Reset alerts
        
        // Reset all to Available first
        this.rooms.forEach(r => {
            r.occupants = [];
            if (r.status !== 'Maintenance') {
                r.status = 'Available';
            }
        });

        let unassigned = [];
        let ghostOccupants = []; // If assigned to a room but not on-duty
        let processedB2B = new Set();
        
        onDutyEmployees.forEach(emp => {
            let assigned = false;
            
            // Check for B2B overlap
            if (emp.B2B_Alternate && !processedB2B.has(emp.ID)) {
                const altEmp = onDutyEmployees.find(e => String(e.ID) === String(emp.B2B_Alternate));
                if (altEmp) {
                    this.smartAlerts.push(`🚨 **B2B Overlap Detected!** ${emp.Name} and their alternate ${altEmp.Name} are both on-duty today.`);
                    processedB2B.add(emp.ID);
                    processedB2B.add(altEmp.ID);
                }
            }
            
            // 0. Smart check: Do they OWN a room permanently?
            let ownedRoom = this.getEmployeeOwnedRoom(emp.ID);
            if (ownedRoom && ownedRoom.status !== 'Maintenance') {
                if (ownedRoom.occupants.length < ownedRoom.beds) {
                    ownedRoom.occupants.push(emp);
                    ownedRoom.status = 'Occupied';
                    ownedRoom.history.push({ date: new Date().toISOString(), action: 'Auto-Checked In', by: 'System' });
                    assigned = true;
                }
            }
            
            // 1. Try single room fallback
            if (!assigned && (!emp.B2B_Alternate)) {
                let availableSingle = this.rooms.find(r => r.type === 'single' && (r.status === 'Available' || r.status === 'NeedsCleaning'));
                if (availableSingle) {
                    availableSingle.occupants.push(emp);
                    availableSingle.status = 'Occupied';
                    availableSingle.history.push({ date: new Date().toISOString(), action: 'Auto-Checked In', by: 'System' });
                    assigned = true;
                }
            }

            // 2. Fallback to shared room
            if (!assigned) {
                let availableShared = this.rooms.find(r => r.type === 'shared' && r.occupants.length < r.beds && r.status !== 'Maintenance');
                if (availableShared) {
                    availableShared.occupants.push(emp);
                    availableShared.history.push({ date: new Date().toISOString(), action: 'Auto-Checked In', by: 'System' });
                    if (availableShared.occupants.length >= availableShared.beds) {
                        availableShared.status = 'Occupied';
                    }
                    assigned = true;
                }
            }
            
            if (!assigned) {
                unassigned.push(emp);
            }
        });
        
        this.saveRooms();

        return {
            unassigned: unassigned,
            alerts: this.smartAlerts
        };
    },

    /**
     * Gets stats for the UI Dashboard
     */
    getStats: function() {
        let totalBeds = 0;
        let occupiedBeds = 0;
        
        let blockStats = {};
        this.blocks.forEach(b => blockStats[b] = { total: 0, occupied: 0, maintenance: 0 });
        
        let maintenanceRooms = 0;
        let needsCleaningRooms = 0;
        
        this.rooms.forEach(r => {
            totalBeds += r.beds;
            occupiedBeds += r.occupants.length;
            
            if (r.status === 'Maintenance') maintenanceRooms++;
            if (r.status === 'NeedsCleaning') needsCleaningRooms++;
            
            blockStats[r.block].total += r.beds;
            blockStats[r.block].occupied += r.occupants.length;
            if (r.status === 'Maintenance') blockStats[r.block].maintenance++;
        });

        let occupancyRate = totalBeds === 0 ? 0 : Math.round((occupiedBeds / totalBeds) * 100);

        return {
            totalBeds,
            occupiedBeds,
            maintenanceRooms,
            needsCleaningRooms,
            occupancyRate,
            blockStats
        };
    },

    /**
     * Manually assigns an employee to a specific room
     */
    assignEmployeeToRoom: function(emp, roomId) {
        // First remove from any existing room
        this.removeEmployeeFromRoom(emp.ID);
        
        const targetRoom = this.rooms.find(r => r.id === roomId);
        if (targetRoom && targetRoom.status !== 'Maintenance') {
            if (targetRoom.occupants.length < targetRoom.beds) {
                targetRoom.occupants.push(emp);
                targetRoom.status = 'Occupied';
                targetRoom.history.push({ date: new Date().toISOString(), action: 'Manual Check-in', by: 'Admin' });
                this.saveRooms();
                return true;
            }
        }
        return false;
    },

    /**
     * Manually removes an employee from their current room
     */
    removeEmployeeFromRoom: function(empId) {
        this.rooms.forEach(r => {
            const initialLength = r.occupants.length;
            r.occupants = r.occupants.filter(o => String(o.ID) !== String(empId));
            if (r.occupants.length < initialLength) {
                r.history.push({ date: new Date().toISOString(), action: `Checked out ID: ${empId}`, by: 'Admin' });
                if (r.occupants.length === 0 && r.status !== 'Maintenance') {
                    r.status = 'NeedsCleaning';
                }
            }
        });
        this.saveRooms();
    },

    /**
     * Finds if the employee owns a room permanently
     */
    getEmployeeOwnedRoom: function(empId) {
        return this.rooms.find(r => r.owners && r.owners.includes(String(empId)));
    },

    /**
     * Finds if the employee is currently physically occupying a room
     */
    getEmployeeCurrentRoom: function(empId) {
        return this.rooms.find(r => r.occupants && r.occupants.some(o => String(o.ID) === String(empId)));
    },
    
    /**
     * Manually assigns an owner to a room
     */
    assignOwnerToRoom: function(emp, roomId) {
        // Find if this emp has a B2B alternate
        let altId = emp.B2B_Alternate ? String(emp.B2B_Alternate) : null;
        
        // Remove both from any other room's owners
        this.rooms.forEach(r => {
            if (r.owners) {
                r.owners = r.owners.filter(id => id !== String(emp.ID) && id !== altId);
            }
        });
        const targetRoom = this.rooms.find(r => r.id === roomId);
        if (targetRoom) {
            if (!targetRoom.owners) targetRoom.owners = [];
            targetRoom.owners.push(String(emp.ID));
            if (altId && !targetRoom.owners.includes(altId)) {
                targetRoom.owners.push(altId);
            }
            this.saveRooms();
            return true;
        }
        return false;
    },

    /**
     * Manually removes an owner from a room
     */
    removeOwnerFromRoom: function(empId, roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room && room.owners) {
            room.owners = room.owners.filter(id => id !== String(empId));
            this.saveRooms();
        }
    },

    /**
     * Saves the rooms data to LocalStorage and Firebase
     */
    saveRooms: function() {
        try {
            localStorage.setItem('hr_accommodation_rooms', JSON.stringify(this.rooms));
            if (typeof db !== 'undefined' && db.collection) {
                db.collection("system").doc("accommodation_rooms").set({ rooms: this.rooms }).catch(console.error);
            }
        } catch(e) { console.error("Error saving rooms:", e); }
    },

    /**
     * Loads the rooms data from Firebase/LocalStorage
     */
    loadRooms: function() {
        try {
            const stored = localStorage.getItem('hr_accommodation_rooms');
            if (stored) {
                this.rooms = JSON.parse(stored);
            }
            
            if (typeof db !== 'undefined' && db.collection) {
                db.collection("system").doc("accommodation_rooms").get().then(doc => {
                    if (doc.exists && doc.data().rooms) {
                        this.rooms = doc.data().rooms;
                        localStorage.setItem('hr_accommodation_rooms', JSON.stringify(this.rooms));
                    } else if (!stored) {
                        this.initMockRooms();
                        this.saveRooms();
                    }
                    // Trigger UI update if function exists
                    if (typeof renderAccommodationDashboard === 'function') {
                        renderAccommodationDashboard();
                    }
                }).catch(err => {
                    if (!this.rooms || this.rooms.length === 0) {
                        this.initMockRooms();
                        this.saveRooms();
                    }
                });
            } else if (!this.rooms || this.rooms.length === 0) {
                this.initMockRooms();
                this.saveRooms();
            }
        } catch(e) {
            if (!this.rooms || this.rooms.length === 0) {
                this.initMockRooms();
                this.saveRooms();
            }
        }
    }
};

// Initialize the database of rooms on load
window.AccommodationAgent.loadRooms();
