const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// The file currently looks like:
//        }, 150);
//    }
//};
//
//<script src="js/ui-conflicts.js"></script>
//<script src="js/security.js"></script>
//<script src="js/i18n.js"></script>
//<!-- SMART PULSE AI UI -->
//<div class="ai-fab" id="aiFab" onclick="toggleAIChat()">
//
// We need to add </script>\n</head>\n<body> after };

const target = `            AuditLogger.log('Viewed Analytics', 'Opened Magical Analytics Dashboard.');
        }, 150);
    }
};`;

const replacement = `            AuditLogger.log('Viewed Analytics', 'Opened Magical Analytics Dashboard.');
        }, 150);
    }
};
</script>
</head>
<body>`;

if (html.includes(target) && !html.includes('</script>\n</head>\n<body>\n\n<script src="js/ui-conflicts.js">')) {
    html = html.replace(target, replacement);
    fs.writeFileSync(indexFile, html);
    console.log('Fixed broken HTML structure!');
} else {
    console.log('Target not found or already fixed.');
}
