// --- sandbox-game_v2.js : Breach Game Logic ---

// Expose function globally
window.initGameEngine = function () {
    const puzzleGrid = document.getElementById('puzzleGrid');
    const scoreEl = document.getElementById('gameScore');
    const typingArea = document.getElementById('typingArea');
    const crackArea = document.getElementById('crackArea');
    const targetCode = document.getElementById('targetCode');
    const typeInput = document.getElementById('typeInput');

    // Safety check if elements exist
    if (!puzzleGrid || !typeInput) return;

    let score = 0;

    // Code Snippets for Typing Challenge
    const snippets = [
        "public async Task<IActionResult> Get()",
        "var data = await _db.Artifacts.List();",
        "SELECT * FROM Users WHERE Role = 'Admin'",
        "npm install --save firebase-firestore",
        "git commit -m 'Fixed security breach'",
        "const userId = auth.currentUser?.uid;",
        "await db.collection('data').add(payload);"
    ];

    function startTypingPhase() {
        if (crackArea) crackArea.classList.add('d-none');
        if (typingArea) typingArea.classList.remove('d-none');

        const snippet = snippets[Math.floor(Math.random() * snippets.length)];
        if (targetCode) targetCode.textContent = snippet;

        if (typeInput) {
            typeInput.value = "";
            typeInput.focus();
        }
    }

    if (typeInput) {
        typeInput.addEventListener('input', () => {
            if (targetCode && typeInput.value === targetCode.textContent) {
                score += 100;
                updateScore();
                resetPuzzle();
            }
        });
    }

    function updateScore() {
        if (scoreEl) scoreEl.textContent = String(score).padStart(4, '0');
        if (score > 0 && score % 500 === 0) saveScore(score);
    }

    function resetPuzzle() {
        if (typingArea) typingArea.classList.add('d-none');
        if (crackArea) crackArea.classList.remove('d-none');
        generatePuzzle();
    }

    function generatePuzzle() {
        if (!puzzleGrid) return;
        puzzleGrid.innerHTML = '';

        for (let i = 0; i < 16; i++) {
            const hex = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            const node = document.createElement('div');
            node.className = 'puzzle-node';
            node.textContent = hex;

            node.onclick = () => {
                node.classList.add('active');
                // Simulate "processing" delay
                setTimeout(() => {
                    score += 10;
                    updateScore();
                    startTypingPhase();
                }, 200);
            };
            puzzleGrid.appendChild(node);
        }
    }

    async function saveScore(s) {
        // Check for global firebase/auth objects from core
        if (typeof auth === 'undefined' || !auth || !auth.currentUser || typeof db === 'undefined' || !db) return;

        try {
            await db.collection('artifacts', appId, 'public', 'data', 'leaderboard').doc(auth.currentUser.uid).set({
                user: auth.currentUser.uid,
                score: s,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.log("Offline mode: Score not saved.");
        }
    }

    // Initialize
    generatePuzzle();
    fetchLeaderboard();
};

window.fetchLeaderboard = async function () {
    const list = document.getElementById('leaderboardList');
    if (!list) return;

    // Check if Firebase is active
    if (typeof db === 'undefined' || !db) {
        list.innerHTML = '<p class="text-muted small">OFFLINE_MODE: Leaderboard unavailable.</p>';
        return;
    }

    try {
        db.collection('artifacts', appId, 'public', 'data', 'leaderboard')
            .orderBy('score', 'desc')
            .limit(5)
            .onSnapshot((snapshot) => {
                const data = [];
                snapshot.forEach(doc => data.push(doc.data()));

                list.innerHTML = data.map((entry, idx) => `
                <div class="d-flex justify-content-between mb-2 border-bottom border-dark pb-1">
                    <span><span class="text-white-50">${idx + 1}.</span> ${entry.user ? entry.user.substring(0, 8) : 'Unknown'}</span>
                    <span class="text-success fw-bold">${entry.score}</span>
                </div>
            `).join('') || '<p class="text-muted">No records found.</p>';
            }, (err) => console.log("LB Fetch Error:", err));
    } catch (e) {
        console.warn("Leaderboard fetch failed:", e);
        list.innerHTML = '<p class="text-muted small">Connection Error.</p>';
    }
};