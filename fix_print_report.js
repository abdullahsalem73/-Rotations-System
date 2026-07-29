const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The corrupted printMasterReport block
const brokenRegex = /function printMasterReport\(\) \{[\s\S]*?\n\s*let cardSwipeBuffer/m;
const match = html.match(brokenRegex);

if (match) {
    const fixedBlock = `function printMasterReport() {
        const printContent = document.getElementById('masterReportPrintArea').innerHTML;
        const printWindow = window.open('', '', 'width=1000,height=700');
        printWindow.document.write(\`
            <html>
                <head>
                    <title>Print Master Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #000; background: #fff; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                        th:nth-child(3), td:nth-child(3) { text-align: left; }
                        th { background-color: #f1f5f9; -webkit-print-color-adjust: exact; font-weight: bold; }
                        h2 { text-align: center; color: #000; margin-bottom: 5px; }
                        .date-info { text-align: center; font-style: italic; color: #666; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <h2>👥 Employees Directory Master Report</h2>
                    <div class="date-info">Generated on: \${new Date().toLocaleDateString()}</div>
                    \${printContent}
                </body>
            </html>
        \`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    // ---------------------------------
    // Magnetic / Smart Card Reader Logic
    // ---------------------------------
    let cardSwipeBuffer`;

    html = html.replace(brokenRegex, fixedBlock);
    
    // Check if the </script> tag was missing
    if (!html.includes('</script>\n\n<datalist id="companyDataList">')) {
        // We might need to add </script> at the end if it was removed
        console.log("Checking if </script> is missing...");
    }
    
    fs.writeFileSync('index.html', html);
    console.log("Fixed printMasterReport syntax.");
} else {
    console.log("Could not find the printMasterReport block!");
}
