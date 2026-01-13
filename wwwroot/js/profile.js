// --- profile.js : Cognitive Runtime Logic ---

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NEURAL CLOCK LOGIC ---
    function updateNeuralClock() {
        const now = new Date();
        const hour = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // 1. Time Display (Local)
        // Note: site.js handles Lusaka time, this uses local browser time for the user's context of "their" day 
        // OR we can stick to Lusaka if you want the "System" to run on your time. 
        // Let's stick to the Portfolio Owner's Time (Lusaka) for the concept.

        const options = { timeZone: 'Africa/Lusaka', hour: 'numeric', hour12: false };
        const lusakaHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));

        document.getElementById('neuralTime').textContent = `${String(lusakaHour).padStart(2, '0')}:${minutes}`;

        // 2. Determine Phase
        let phase = "";
        let desc = "";
        let focus = 0;
        let creative = 0;
        let clockStatus = "STANDBY";

        if (lusakaHour >= 6 && lusakaHour < 11) {
            // 06:00 - 10:00: Startup
            phase = "STARTUP_SEQUENCE";
            desc = "Initializing daily tasks. High context-switching for logistical synchronization.";
            focus = 35;
            creative = 40;
            clockStatus = "INITIALIZING";
        } else if (lusakaHour >= 11 && lusakaHour < 15) {
            // 11:00 - 14:00: Peak Overclocking
            phase = "PEAK_OVERCLOCKING";
            desc = "Optimal runtime. Hard-coding, architectural builds, and deep logic.";
            focus = 95;
            creative = 80;
            clockStatus = "OVERCLOCKED";
        } else if (lusakaHour >= 15 && lusakaHour < 19) {
            // 15:00 - 18:00: Background Processing
            phase = "BACKGROUND_PROC";
            desc = "System maintenance, external coordination, and communication loops.";
            focus = 50;
            creative = 60;
            clockStatus = "THROTTLED";
        } else if (lusakaHour >= 19 && lusakaHour < 23) {
            // 19:00 - 22:00: System Restore (Creative Surge)
            phase = "CREATIVE_SURGE";
            desc = "Low-power technical mode. High-intensity media refactoring.";
            focus = 30;
            creative = 90;
            clockStatus = "HIGH_VOLTAGE";
        } else {
            // 23:00 - 05:00: Sleep / Idle
            phase = "STANDBY_MODE";
            desc = "System defragmentation and recharge cycles active.";
            focus = 5;
            creative = 10;
            clockStatus = "OFFLINE";
        }

        // 3. Update DOM
        document.getElementById('neuralPhase').textContent = `PHASE: ${phase}`;
        document.getElementById('clockStatus').textContent = `STATUS: ${clockStatus}`;
        document.getElementById('phaseDesc').textContent = `>> ${desc}`;

        // 4. Update Bars (Animation)
        document.getElementById('focusBar').style.width = `${focus}%`;
        document.getElementById('focusVal').textContent = `${focus}%`;

        document.getElementById('creativeBar').style.width = `${creative}%`;
        document.getElementById('creativeVal').textContent = `${creative}%`;
    }

    // Run immediately and then every minute
    updateNeuralClock();
    setInterval(updateNeuralClock, 60000);

    // --- 2. FILE EXPLORER LOGIC ---
    // This function must be global to be called by onclick in HTML
    window.openFile = function (element) {
        const name = element.getAttribute('data-name');
        const status = element.getAttribute('data-status');
        const content = element.getAttribute('data-content');

        const previewHeader = document.getElementById('previewHeader');
        const previewDetails = document.getElementById('previewDetails');

        // Animation for click feedback
        // Remove active class from all files
        document.querySelectorAll('.file-item').forEach(el => el.style.backgroundColor = '');
        // Add highlight to clicked
        element.style.backgroundColor = 'rgba(37, 140, 251, 0.2)';

        // Update Text
        previewHeader.innerHTML = `${name} <span style="float:right; font-size:0.7em; color:#888;">[READ_ONLY]</span>`;
        previewDetails.innerHTML = `
            <div class="status-tag">${status}</div>
            <p style="margin-top:5px; margin-bottom:0;">${content}</p>
        `;
    };
});