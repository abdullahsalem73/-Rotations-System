const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldJS = `const sortedRooms = [...rooms].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));
    
    sortedRooms.forEach(room => {
        const occCount = getRoomOccupants(room.id).length;`;

const newJS = `if(!window.AccommodationAgent || !window.AccommodationAgent.rooms) return;
    const sortedRooms = [...window.AccommodationAgent.rooms].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric:true}));
    
    sortedRooms.forEach(room => {
        const occCount = (room.occupants || []).length;`;

if(html.includes(oldJS)) {
    html = html.replace(oldJS, newJS);
    fs.writeFileSync('index.html', html);
    console.log('Fixed JS references for global map.');
} else {
    console.log('Not found or already fixed.');
}
