// js/ui-clock.js — Magic Clock Engine (non-destructive)
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes glowPulse {
            0%,100% { box-shadow: 0 0 8px rgba(56,189,248,.15), 0 4px 10px rgba(0,0,0,.15); border-color: rgba(56,189,248,.25); }
            50%      { box-shadow: 0 0 18px rgba(56,189,248,.5),  0 4px 18px rgba(0,0,0,.2);  border-color: rgba(56,189,248,.6); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }

        #sysClockText {
            background: linear-gradient(135deg, rgba(15,23,42,.85), rgba(30,41,59,.85)) !important;
            border: 1px solid rgba(56,189,248,.35) !important;
            border-radius: 22px !important;
            padding: 6px 14px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            cursor: pointer !important;
            backdrop-filter: blur(12px) !important;
            animation: glowPulse 3s infinite !important;
            white-space: nowrap !important;
            transition: transform .3s ease !important;
        }
        #sysClockText:hover { transform: scale(1.03) translateY(-1px) !important; }

        .clk-icon-wrap {
            position: relative;
            display: flex; align-items: center; justify-content: center;
            width: 18px; height: 18px; flex-shrink: 0;
        }
        .clk-spinner {
            position: absolute; inset: -3px;
            border: 1.5px dashed rgba(56,189,248,.5);
            border-radius: 50%;
            animation: spinSlow 8s linear infinite;
        }
        .clk-icon { font-size: 13px; color: #38bdf8; z-index: 1; }

        .clk-time {
            font-size: 14px; font-weight: 800;
            color: #f1f5f9;
            letter-spacing: .5px;
            text-shadow: 0 0 8px rgba(56,189,248,.4);
            font-family: 'Inter', 'Cairo', monospace;
        }
        .clk-time .clk-sec { font-size: 11px; color: #38bdf8; }

        .clk-date {
            font-size: 10px; font-weight: 600;
            color: #7dd3fc;
            text-transform: uppercase;
            letter-spacing: .8px;
            text-shadow: 0 0 6px rgba(56,189,248,.25);
        }
        .clk-stack { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; gap: 1px; }
    `;
    document.head.appendChild(style);

    function buildClock() {
        const el = document.getElementById('sysClockText');
        if (!el) return;

        el.innerHTML = `
            <div class="clk-icon-wrap">
                <div class="clk-spinner"></div>
                <i class="fas fa-satellite-dish clk-icon"></i>
            </div>
            <div class="clk-stack">
                <span class="clk-time" id="magicTimeText">--:--:--</span>
                <span class="clk-date" id="magicDateText">---</span>
            </div>
        `;

        function tick() {
            const timeEl = document.getElementById('magicTimeText');
            const dateEl = document.getElementById('magicDateText');
            if (!timeEl || !dateEl) return;

            const now = new Date();
            let h = now.getHours();
            const m = String(now.getMinutes()).padStart(2,'0');
            const s = String(now.getSeconds()).padStart(2,'0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;

            const lang = (window.I18nEngine && window.I18nEngine.currentLang === 'ar') ? 'ar-SA' : 'en-US';
            const dateStr = now.toLocaleDateString(lang, { weekday:'short', month:'short', day:'numeric' });

            timeEl.innerHTML = `${h}:${m}<span class="clk-sec">:${s}</span> ${ampm}`;
            dateEl.textContent = dateStr;
        }

        tick();
        setInterval(tick, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildClock);
    } else {
        buildClock();
    }
})();
