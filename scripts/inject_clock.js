const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const target = '<script src="js/i18n.js"></script>';
if (html.includes(target) && !html.includes('ui-clock.js')) {
    html = html.replace(target, target + '\n<script src="js/ui-clock.js"></script>');
    fs.writeFileSync('index.html', html);
    console.log('Injected ui-clock.js');
}
