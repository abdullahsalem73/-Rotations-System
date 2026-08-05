// js/mobile-header-magic.js — Lightweight cleanup only
// Header is now 100% in HTML/CSS. No DOM rebuilding needed.
(function() {
    // Only job: remove any stale fixed-position lang container from old i18n versions
    function cleanup() {
        const old = document.getElementById('lang-toggle-container');
        if (old) old.remove();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanup);
    } else {
        cleanup();
        setTimeout(cleanup, 300); // catch late injection too
    }
})();
