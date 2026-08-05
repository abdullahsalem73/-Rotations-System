/**
 * Intelligent Rotation Agent
 * Runs silently in the background to auto-generate missing rotations
 * based on each employee's specific RotationPattern.
 */

async function runIntelligentRotationAgent() {
    console.log("[Rotation Agent] Waking up to check for missing rotations...");
    if (typeof employees === 'undefined' || !employees || employees.length === 0) {
        console.log("[Rotation Agent] No employees found. Going back to sleep.");
        return;
    }

    let updatesMade = false;
    const today = new Date();
    today.setHours(0,0,0,0);
    // Generate if they have less than 45 days of future rotations left
    const lookAheadDays = 45; 

    for (let i = 0; i < employees.length; i++) {
        let emp = employees[i];
        let pattern = emp.RotationPattern || "28/28"; // Default
        
        // Skip manual patterns
        if (pattern === "Timesheet" || pattern === "Visitor") {
            continue; 
        }

        let workDays = 28;
        let leaveDays = 28;
        let isContinuous = false;

        if (pattern === "28/14") {
            workDays = 28;
            leaveDays = 14;
        } else if (pattern === "14/14") {
            workDays = 14;
            leaveDays = 14;
        } else if (pattern === "5/2") {
            workDays = 5;
            leaveDays = 2;
        } else if (pattern === "365/0") {
            workDays = 365;
            leaveDays = 0;
            isContinuous = true;
        }

        if (!emp.Rotations) emp.Rotations = [];
        
        let records = [...emp.Rotations];
        if (records.length === 0) continue; // Can't auto-generate if we have no historical anchor

        records.sort((a, b) => (parseDate(a.end) > parseDate(b.end) ? 1 : -1));
        let lastRecord = records[records.length - 1];
        let lastEnd = parseDate(lastRecord.end);

        // Lookahead target: today + lookAheadDays
        let targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + lookAheadDays);

        let employeeUpdated = false;

        // Loop generating cycles until we surpass the target date
        while (lastEnd < targetDate) {
            let newType = (lastRecord.type === 'leave') ? 'work' : 'leave';
            
            // If continuous, force work
            if (isContinuous) newType = 'work';
            
            let duration = (newType === 'work') ? workDays : leaveDays;

            let newStartStr = addOneDay(lastRecord.end);
            let newStart = parseDate(newStartStr);
            let newEnd = new Date(newStart);
            
            // Date arithmetic: start + duration - 1 = end. 
            newEnd.setDate(newEnd.getDate() + (duration - 1));

            let neYear = newEnd.getFullYear();
            let neMonth = String(newEnd.getMonth() + 1).padStart(2, '0');
            let neDay = String(newEnd.getDate()).padStart(2, '0');
            let newEndStr = `${neYear}-${neMonth}-${neDay}`;

            let newRecord = {
                id: 'agent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                type: newType,
                start: newStartStr,
                end: newEndStr
            };
            
            records.push(newRecord);
            lastRecord = newRecord;
            lastEnd = parseDate(lastRecord.end);
            employeeUpdated = true;
        }

        if (employeeUpdated) {
            emp.Rotations = records;
            // Save to Firebase silently
            try {
                await db.collection("employees").doc(String(emp.ID)).set(emp);
                updatesMade = true;
                console.log(`[Rotation Agent] Generated new rotations for ${emp.Name} (${emp.ID}) based on ${pattern} pattern.`);
            } catch (err) {
                console.error(`[Rotation Agent] Failed to save for ${emp.Name}`, err);
            }
        }
    }

    if (updatesMade) {
        console.log("[Rotation Agent] Execution completed successfully.");
    } else {
        console.log("[Rotation Agent] All employees are up to date. No action needed.");
    }
}
