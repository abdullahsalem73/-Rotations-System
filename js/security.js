// js/security.js
// Cyber Security & Data Validation Module

window.SecurityAgent = {
    /**
     * Sanitizes input strings to prevent XSS (Cross-Site Scripting)
     * by converting HTML special characters to their entity equivalents.
     */
    sanitizeHTML: function(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"']/g, function(match) {
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escapeMap[match];
        });
    },

    /**
     * Reverts sanitized strings back to normal text if needed for form inputs.
     */
    unescapeHTML: function(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function(match) {
            const unescapeMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'"
            };
            return unescapeMap[match];
        });
    }
};
