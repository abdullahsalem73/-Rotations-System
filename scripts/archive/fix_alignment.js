const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix the alignment for Name, Company, Department in the POB table
html = html.replace(/<td style="text-align:center;">\$\{s.id \|\| '-'\}.*?<\/td>/, '<td style="text-align:center; width:80px;">${s.id || \'-\'}</td>');
html = html.replace(/<td>\$\{s.name \|\| '-'\}/, '<td style="text-align:left;">${s.name || \'-\'}');
html = html.replace(/<td><span class="company-badge">\$\{s.company \|\| '-'\}/, '<td style="text-align:left;"><span class="company-badge">${s.company || \'-\'}');
html = html.replace(/<td>\$\{s.dept \|\| '-'\}/, '<td style="text-align:left;">${s.dept || \'-\'}');

// Also make sure we save both Department and Destination if available just in case
html = html.replace(/dept: e.Department \|\| 'Unknown'/g, "dept: e.Department || e.Destination || '-'");

fs.writeFileSync('index.html', html);
console.log("Alignment and dept field fixed.");
