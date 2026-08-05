const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const tabs = ['employees', 'rotations', 'movements', 'timesheet', 'audit', 'pobArchive'];

tabs.forEach(tab => {
    let el = document.getElementById(tab + '-tab');
    if (!el) {
        console.log(`Tab ${tab} not found!`);
    } else {
        console.log(`Tab ${tab}: parent = ${el.parentElement.tagName} ${el.parentElement.className}`);
        if (el.parentElement.id) {
            console.log(`   Parent ID = ${el.parentElement.id}`);
        }
    }
});
