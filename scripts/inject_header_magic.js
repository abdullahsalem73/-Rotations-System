const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const target = '<script src="js/ui-clock.js"></script>';
if (html.includes(target) && !html.includes('mobile-header-magic.js')) {
    html = html.replace(target, target + '\n    <script src="js/mobile-header-magic.js"></script>');
    fs.writeFileSync('index.html', html);
    console.log('Injected mobile-header-magic.js');
} else {
    console.log('Failed or already injected');
}
