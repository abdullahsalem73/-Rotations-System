const fs = require('fs');
let data = fs.readFileSync('employees.js', 'utf8');

let m = data.indexOf('"ID": "132"');
let start = data.indexOf('"Rotations": [', m);
let end = data.indexOf(']', start) + 1;

const newRots = `"Rotations": [
  {
    "id": "rot_1785870124373_0",
    "type": "work",
    "start": "2025-11-08",
    "end": "2025-12-06"
  },
  {
    "id": "rot_1785870124373_1",
    "type": "leave",
    "start": "2025-12-07",
    "end": "2026-01-05"
  },
  {
    "id": "rot_1785870124373_2",
    "type": "work",
    "start": "2026-01-05",
    "end": "2026-02-04"
  },
  {
    "id": "rot_1785870124373_3",
    "type": "leave",
    "start": "2026-02-05",
    "end": "2026-03-04"
  },
  {
    "id": "rot_1785870124373_4",
    "type": "work",
    "start": "2026-03-04",
    "end": "2026-04-01"
  },
  {
    "id": "rot_1785870124373_5",
    "type": "leave",
    "start": "2026-04-02",
    "end": "2026-04-22"
  },
  {
    "id": "rot_1785870124373_6",
    "type": "work",
    "start": "2026-04-22",
    "end": "2026-05-13"
  },
  {
    "id": "rot_1785870124373_7",
    "type": "leave",
    "start": "2026-05-14",
    "end": "2026-06-10"
  },
  {
    "id": "rot_1785870124373_8",
    "type": "work",
    "start": "2026-06-10",
    "end": "2026-07-08"
  },
  {
    "id": "rot_1785870124373_9",
    "type": "leave",
    "start": "2026-07-09",
    "end": "2026-08-05"
  },
  {
    "id": "rot_1785870124373_10",
    "type": "work",
    "start": "2026-08-05",
    "end": "2026-09-02"
  },
  {
    "id": "rot_1785870124373_11",
    "type": "leave",
    "start": "2026-09-03",
    "end": "2026-09-30"
  },
  {
    "id": "rot_1785870124373_12",
    "type": "work",
    "start": "2026-09-30",
    "end": "2026-10-28"
  },
  {
    "id": "rot_1785870124373_13",
    "type": "leave",
    "start": "2026-10-29",
    "end": "2026-11-25"
  },
  {
    "id": "rot_1785870124373_14",
    "type": "work",
    "start": "2026-11-25",
    "end": "2026-12-23"
  },
  {
    "id": "rot_1785870124373_15",
    "type": "leave",
    "start": "2026-12-24",
    "end": "2027-01-20"
  },
  {
    "id": "rot_1785870124373_16",
    "type": "work",
    "start": "2027-01-20",
    "end": "2027-02-18"
  }
]`;

data = data.substring(0, start) + newRots + data.substring(end);
fs.writeFileSync('employees.js', data);
console.log('Done');
