const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Force remove the old legend buttons
html = html.replace(/<div style="display: flex; gap: 10px; align-items: center; background: rgba\(16, 185, 129, 0\.1\)[^>]*>[\s\S]*?<\/div>/, '');

// Remove any lingering Scroll: labels just in case
html = html.replace(/<strong style="color: #10b981; font-size: 13px; margin-right: 10px;">Scroll:<\/strong>/g, '');
html = html.replace(/<button[^>]*onclick="scrollTimesheet\(-400\)"[^>]*>.*?<\/button>/g, '');
html = html.replace(/<button[^>]*onclick="scrollTimesheet\(400\)"[^>]*>.*?<\/button>/g, '');

// 2. Remove backdrop-filter from floating buttons to fix FPS lag
html = html.replace('backdrop-filter: blur(5px);', '');
html = html.replace('-webkit-backdrop-filter: blur(5px);', '');

// 3. Optimize the scrollTimesheet function for maximum performance
const optimizedScroll = `
<script>
    window.scrollTimesheet = function(amount) {
        const wrapper = document.getElementById('tsWrapper') || document.querySelector('.timesheet-wrapper');
        if (wrapper) {
            // Instant snappy scroll is much faster and less choppy for heavy tables
            wrapper.scrollBy({ left: amount, behavior: 'auto' });
        }
    };
    
    // DRAG TO SCROLL (World-class UX)
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('tsWrapper');
        if(!slider) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'default';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'default';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
    });
</script>
`;

// Replace the old global function with the new optimized one
html = html.replace(/<script>\s*window\.scrollTimesheet = function[\s\S]*?<\/script>/, optimizedScroll);

fs.writeFileSync('index.html', html);
console.log("Scroll optimized and Drag-to-Scroll added.");
