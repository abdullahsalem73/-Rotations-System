/**
 * POBAgent.js
 * 
 * Responsible for calculating Personnel On Board (POB) statistics and snapshots.
 * Works alongside DataAgent.js to determine employee status.
 */

window.POBAgent = {
    /**
     * Calculates the POB summary for a given date.
     * @param {Array} employees 
     * @param {Number} targetDateNum (Timestamp)
     * @param {Object} dataAgent (Reference to DataAgent for status checking)
     * @returns {Object} { onDuty: [], offDuty: [], summaryByCompany: {}, grandTotal: 0 }
     */
    calculatePOB: function(employees, targetDateNum, dataAgent) {
        let onDuty = [];
        let offDuty = [];
        let summaryByCompany = {};
        let grandTotal = 0;

        employees.forEach(emp => {
            // Use DataAgent if provided, otherwise default to missing
            const status = dataAgent ? dataAgent.getEmployeeStatusForDate(emp, targetDateNum) : 'missing';
            
            const isWork = (status === 'work' || status === 'standby_cover');
            
            if (isWork) {
                onDuty.push(emp);
                grandTotal++;
                if (!summaryByCompany[emp.Company]) {
                    summaryByCompany[emp.Company] = 0;
                }
                summaryByCompany[emp.Company]++;
            } else {
                offDuty.push(emp);
            }
        });

        return {
            onDuty,
            offDuty,
            summaryByCompany,
            grandTotal
        };
    },

    /**
     * Generates a snapshot payload suitable for saving to the database.
     * @param {String} dateStr (YYYY-MM-DD)
     * @param {Object} pobData (Result from calculatePOB)
     * @returns {Object} JSON payload
     */
    generateSnapshotPayload: function(dateStr, pobData) {
        return {
            date: dateStr,
            grandTotal: pobData.grandTotal,
            summary: pobData.summaryByCompany,
            timestamp: new Date().toISOString()
        };
    }
};
