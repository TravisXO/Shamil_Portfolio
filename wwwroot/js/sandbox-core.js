// --- sandbox-core.js : Logic & Authentication ---

// Define globals to prevent access errors if Firebase fails
let auth = null;
let db = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'shamil-sandbox';

document.addEventListener('DOMContentLoaded', async () => {
    const gatekeeper = document.getElementById('sandboxGatekeeper');
    const sandboxInterface = document.getElementById('sandboxInterface');
    const bypassInput = document.getElementById('bypassInput');
    const bypassBtn = document.getElementById('bypassBtn');
    const logs = document.getElementById('gatekeeperLogs');

    // --- 1. FIREBASE INIT (SAFE MODE) ---
    try {
        if (typeof firebase !== 'undefined' && typeof __firebase_config !== 'undefined') {
            const firebaseConfig = JSON.parse(__firebase_config);
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            auth = firebase.auth();
            db = firebase.firestore();

            // Auth Priority
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await auth.signInWithCustomToken(__initial_auth_token);
            } else {
                await auth.signInAnonymously();
            }
        } else {
            console.warn(">> FIREBASE_CONFIG not found. Running in OFFLINE/UI_ONLY mode.");
        }
    } catch (error) {
        console.error(">> SYSTEM_WARN: Backend connectivity failed. UI functional.", error);
    }

    // --- 2. UI LOGIC ---

    const attemptBypass = () => {
        const val = bypassInput.value.trim();
        // Check for 1024, C#_CORE, or PID1024
        if (val === "1024" || val === "C#_CORE" || val === "PID1024") {
            gatekeeper.classList.add('d-none');
            sandboxInterface.classList.remove('d-none');
            initMatrix();
            initSandboxModules();
        } else {
            bypassInput.value = "";
            const errorLog = document.createElement('p');
            errorLog.className = "log-line text-danger";
            errorLog.textContent = "> [ERR] ACCESS_DENIED: CHECKSUM_FAILURE";
            logs.appendChild(errorLog);

            // Scroll to bottom of logs
            logs.scrollTop = logs.scrollHeight;

            // Shake effect
            gatekeeper.style.animation = 'none';
            // Trigger reflow
            gatekeeper.offsetHeight;
            gatekeeper.style.animation = 'shake 0.3s';
        }
    };

    // Listeners
    if (bypassBtn) {
        bypassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            attemptBypass();
        });
    }

    if (bypassInput) {
        bypassInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                attemptBypass();
            }
        });
    }

    // Nav Toggle Logic
    const opts = document.querySelectorAll('.sandbox-opt');
    const panels = document.querySelectorAll('.sandbox-panel');

    opts.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            // 1. Remove active class from all buttons and panels
            opts.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // 2. Add active class to clicked button
            btn.classList.add('active');

            // 3. Add active class to target panel
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            } else {
                console.error("Target panel not found:", targetId);
            }
        });
    });
});

function initSandboxModules() {
    if (typeof initGameEngine === 'function') initGameEngine();
    if (typeof initTreeEngine === 'function') initTreeEngine();
    if (typeof initCipherEngine === 'function') initCipherEngine();
}

function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(draw, 33);
}