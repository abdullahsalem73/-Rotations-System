# 🌐 HR-BLK53 System (Global Enterprise Edition)
**Advanced Rotations & Daily Movements Tracker**

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg) ![Security](https://img.shields.io/badge/security-XSS_Protected-success.svg) ![I18n](https://img.shields.io/badge/i18n-RTL%2FLTR-blueviolet.svg)

## 📖 Overview
The **HR-BLK53 System** is an enterprise-grade web application engineered to manage massive workforces, flight manifests, accommodations, and daily rotation patterns seamlessly. Built with high-performance Vanilla JavaScript, CSS Glassmorphism, and a robust DOM-manipulation engine, this system avoids the overhead of heavy frameworks while delivering a stunning, "Magical" user experience.

---

## ✨ Core Features & Engines

### 1. 🔄 Smart Rotation Engine (Pattern Matrix)
The system understands complex employee rotation patterns (e.g., `28/28`, `14/14`, `Office`).
- **Conflict Detection:** Evaluates overlapping schedules and highlights them dynamically.
- **Auto-Resolve Protocol:** A one-click magic button (`<i class="fas fa-magic"></i>`) that automatically shifts conflicting dates (+7 days offset) and suppresses collision alerts in real-time.

### 2. 🛡️ Enterprise Security Agent
A built-in sanitization layer (`js/security.js`) intercepts all user inputs before they hit the DOM or the backend.
- Neutralizes `<script>` injection and malicious event handlers.
- Encodes HTML entities securely.
- Actively logs security breaches to the internal `AuditLogger`.

### 3. 🌍 Localization Engine (i18n)
A dynamic, zero-reload translation matrix (`js/i18n.js`).
- Supports **English (LTR)** and **Arabic (RTL)**.
- Hot-swaps DOM structure, fonts (Inter to Cairo), and alignment properties instantly.
- Saves language preferences persistently to `localStorage`.

### 4. 🏨 Accommodation AI (Smart Beds)
- Visualizes camp rooms and occupancy rates.
- Distinguishes between `Occupied`, `Vacant`, and `Maintenance`.
- Color-coded grid map to track real-time physical presence.

### 5. 📊 Analytics & KPI Dashboard
Integrated with `Chart.js`, presenting real-time graphical representations of workforce statuses:
- On-Duty vs. Leave ratio.
- Headcount broken down by Company/Contractor.
- Real-time total staff counts.

---

## 🛠️ Architecture & Tech Stack

- **Core:** HTML5, CSS3, ES6 JavaScript.
- **Styling Paradigm:** Glassmorphism, Dark/Light Neon Accents, CSS Variables.
- **Data Persistence:** LocalStorage (Primary Cache) & Indexed/Backend Sync APIs.
- **Visuals:** Chart.js (Data Visualization), FontAwesome (Icons).
- **Modularity:** Highly segmented logic layers (`security.js`, `i18n.js`, `ui-conflicts.js`).

---

## 🚀 Installation & Deployment

1. **Clone the repository.**
2. **Launch a local server** (e.g., Live Server or Node `http-server`) to ensure module loading and avoid CORS issues.
3. Access `index.html`. 
4. The system automatically initializes the `AuditLogger` and `I18nEngine` upon `DOMContentLoaded`.

---

## 🔒 Security Best Practices
- **Never bypass `SecurityAgent.clean()`:** Any new input field added to the system MUST route its value through the Security Agent before processing.
- **Mutation Observers:** The system uses `MutationObserver` to attach logic (like Auto-Resolve) to dynamically created DOM nodes. Ensure these observers are kept lightweight.

---

*Designed and engineered for excellence, stability, and speed.*
