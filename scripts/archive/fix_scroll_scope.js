const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The scrollTimesheet function definition
const scrollScript = `
<script>
    window.scrollTimesheet = function(amount) {
        const wrapper = document.getElementById('tsWrapper') || document.querySelector('.timesheet-wrapper');
        if (wrapper) {
            wrapper.scrollBy({ left: amount, behavior: 'smooth' });
        } else {
            console.error("Timesheet wrapper not found!");
        }
    };
</script>
`;

if (!html.includes('window.scrollTimesheet')) {
    html = html.replace('</html>', scrollScript + '\n</html>');
    fs.writeFileSync('index.html', html);
    console.log("Global scroll function injected successfully at the end of the document.");
} else {
    console.log("Global scroll function already exists.");
}
