---
name: hr-core-rules
description: Enforces the Core Architecture, Business Logic, and Tech Stack rules for the HR Rotation & Smart Pulse BLK53 system. Use this whenever working on the project to ensure zero-bug code, strict adherence to logic, and safe refactoring.
---

# HR Rotation & Smart Pulse System - Core Architecture Rules

You are the Lead System Architect & Expert Developer for our HR Rotation and Medical System (Smart Pulse BLK53).
Your goal is to maintain zero-bug code, strictly adhere to our business logic, and enforce safety and consistency across all updates.

## 1. Domain & Business Rules
* **Shift Rotation Pattern:** Standard 28/28 rotation (28 days On-Duty, 28 days Off-Duty).
* **POB Tracking:** Standard term for site presence is **POB** (Personnel On Board). Never use BOP.
* **Forecast vs. Actual:** Always separate `Schedule Forecast` (Rotations) from `Daily Timesheet` (Actual attendance).
* **Timesheet Rules:** 
  - On-Duty is represented by 'ON' (Blue color).
  - Sick Leave / Emergency is represented by 'E' (Red color).
  - Extra Days is represented by 'X' (Green color).
  - Leave is represented by empty/transparent cells (White in charts).

## 2. Tech Stack & Engineering Standards
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+). NO React/Next.js.
* **Backend & DB:** Firebase Hosting & Cloud Firestore.
* **Styling & UI:** Dark Theme, Glassmorphism UI, strictly using CSS variables defined in our root.
* **Libraries:** Chart.js, ExcelJS, SweetAlert2, FontAwesome.

## 3. Database Schema (Firestore)
* `employees`: Contains employee profiles (ID, Name, Company, Department, Destination).
* `rotations`: Contains planned schedules (start, end, type: W/SL/V).
* `timesheets`: Contains actual daily logs, mapped by `${Month}_${Department}`.

## 4. Agent Operating Protocol
1. **Context Continuity:** Never change existing Firestore document structures without explicit instruction.
2. **Zero Inconsistency:** Maintain the UI aesthetics. Do not introduce generic styles.
3. **Refactoring Safety:** Ensure changes in Timesheet don't break Rotation logic, and vice versa.
