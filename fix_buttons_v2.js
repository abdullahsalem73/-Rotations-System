const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject a strong overriding style block just before </head>
const overrideStyles = `
<style>
    .ts-scroll-btn {
        opacity: 1 !important;
        z-index: 9999 !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.8) !important;
        border: 2px solid white !important;
        display: flex !important;
    }
</style>
</head>`;

if (!html.includes('opacity: 1 !important;')) {
    html = html.replace('</head>', overrideStyles);
    fs.writeFileSync('index.html', html);
    console.log("Override styles injected.");
} else {
    console.log("Styles already injected.");
}
