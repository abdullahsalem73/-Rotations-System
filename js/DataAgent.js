/**
 * DataAgent.js
 * 
 * Responsible for calculations related to Rotations, Schedules, and Conflict Detection.
 * Decouples complex date math from the UI.
 */

window.DataAgent = {
    // Utility to parse date robustly
    parseDate: function(str) {
        if (!str) return new Date();
        if (str.includes('/')) {
            const parts = str.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(str);
    },

    // Utility to format date to YYYY-MM-DD
    formatDateRaw: function(date) {
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        if (d < 10) d = '0' + d;
        if (m < 10) m = '0' + m;
        return `${y}-${m}-${d}`;
    },

    /**
     * Determines an employee's exact status for a specific date (timestamp).
     * @param {Object} employee 
     * @param {Number} dateNum (Timestamp in ms)
     * @returns {String} type of status (work, leave, sick_leave, etc.)
     */
    getEmployeeStatusForDate: function(employee, dateNum) {
        let baseStatus = 'missing';
        if (employee.Rotations && employee.Rotations.length > 0) {
            employee.Rotations.forEach(r => {
                const startNum = this.parseDate(r.start).getTime();
                const endNum = this.parseDate(r.end).getTime();
                if (dateNum >= startNum && dateNum <= endNum) {
                    baseStatus = r.type;
                }
            });
        }
        
        let currentStatus = baseStatus;
        
        if (employee.Overrides) {
            employee.Overrides.forEach(ov => {
                const oStart = this.parseDate(ov.start).getTime();
                const oEnd = this.parseDate(ov.end).getTime();
                if (dateNum >= oStart && dateNum <= oEnd) {
                    currentStatus = ov.type;
                }
            });
        }
        
        return currentStatus;
    },

    /**
     * Scans employees array for back-to-back overlaps and gaps over the next N days.
     * @param {Array} employees 
     * @param {Number} daysToCheck 
     * @returns {Array} List of conflict objects
     */
    detectConflicts: function(employees, daysToCheck = 30) {
        let conflicts = [];
        const today = new Date();
        today.setHours(0,0,0,0);

        employees.forEach(empA => {
            if (empA.B2B_Alternate) {
                const empB = employees.find(e => String(e.ID) === String(empA.B2B_Alternate));
                if (empB) {
                    // Prevent duplicate checks since A->B and B->A is possible
                    if (String(empA.ID) > String(empB.ID)) return;

                    for (let i = 0; i < daysToCheck; i++) {
                        let d = new Date(today);
                        d.setDate(today.getDate() + i);
                        const dNum = d.getTime();
                        
                        const statusA = this.getEmployeeStatusForDate(empA, dNum);
                        const statusB = this.getEmployeeStatusForDate(empB, dNum);

                        const isWorkA = (statusA === 'work' || statusA === 'standby_cover');
                        const isWorkB = (statusB === 'work' || statusB === 'standby_cover');

                        if (isWorkA && isWorkB) {
                            conflicts.push({
                                dateStr: this.formatDateRaw(d),
                                type: 'overlap',
                                empA: empA.Name,
                                empB: empB.Name,
                                msg: `<strong>${empA.Name}</strong> and <strong>${empB.Name}</strong> are both scheduled to be <span style="color:#10b981;">ON</span>.`
                            });
                        } else if (!isWorkA && !isWorkB) {
                            // Only report gap if neither is on site and it's a role that requires continuous coverage
                            // We assume all back-to-back pairs require coverage
                            conflicts.push({
                                dateStr: this.formatDateRaw(d),
                                type: 'gap',
                                empA: empA.Name,
                                empB: empB.Name,
                                msg: `<strong>${empA.Name}</strong> and <strong>${empB.Name}</strong> are both scheduled to be <span style="color:#ef4444;">OFF</span>. Position is unmanned!`
                            });
                        }
                    }
                }
            }
        });

        return conflicts;
    }
};
