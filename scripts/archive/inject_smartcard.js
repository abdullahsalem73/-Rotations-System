const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject Smart Card Indicator next to the system title "Rotations System"
const brandRegex = /(<h2[^>]*>.*?Rotations System.*?<\/h2>)/i;
const indicatorHTML = `
            <!-- Smart Card Pulse Indicator -->
            <div id="smartCardIndicator" style="display:inline-flex; align-items:center; justify-content:center; gap:5px; margin-left: 10px; padding: 4px 8px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 10px; color: #10b981; vertical-align: middle;">
                <div style="width:6px; height:6px; background-color:#10b981; border-radius:50%; box-shadow: 0 0 5px #10b981; animation: pulse 1.5s infinite;"></div>
                <span title="Ready to swipe magnetic card">Smart Card Ready</span>
            </div>
            <style>
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
            </style>`;
            
if (html.match(brandRegex) && !html.includes('id="smartCardIndicator"')) {
    html = html.replace(brandRegex, "$1" + indicatorHTML);
    console.log("Smart Card Indicator injected.");
} else if (html.includes('<div class="brand-text">') && !html.includes('id="smartCardIndicator"')) {
    html = html.replace('<div class="brand-text">', '<div class="brand-text">' + indicatorHTML);
    console.log("Smart Card Indicator injected (fallback).");
}

fs.writeFileSync('index.html', html);
console.log("Done.");
