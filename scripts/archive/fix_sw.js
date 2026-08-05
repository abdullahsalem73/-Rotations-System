const fs = require('fs');

// 1. Update Service Worker Cache Version
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/const CACHE_NAME = 'hr-blk53-cache-v14';/, "const CACHE_NAME = 'hr-blk53-cache-v15';");
fs.writeFileSync('service-worker.js', sw);
console.log("Service Worker cache updated to v15.");

// 2. Remove the hacky unregister script from index.html to allow standard SW update lifecycle
let html = fs.readFileSync('index.html', 'utf8');
const unregisterScriptRegex = /<script>\s*if \('serviceWorker' in navigator\) {[\s\S]*?caches\.delete\(name\);\s*}\);\s*}\s*<\/script>\s*/;
html = html.replace(unregisterScriptRegex, '');
fs.writeFileSync('index.html', html);
console.log("Hacky SW unregister script removed from index.html.");
