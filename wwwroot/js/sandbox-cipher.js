// --- sandbox-cipher_v2.js : Cipher Playground ---

// Expose globally
window.initCipherEngine = function () {
    const rawInput = document.getElementById('cipherRaw');
    const algoSelect = document.getElementById('cipherAlgo');
    const procBtn = document.getElementById('processCipher');
    const resultBox = document.getElementById('cipherResult');
    const copyBtn = document.getElementById('copyCipher');

    if (procBtn) {
        procBtn.onclick = () => {
            if (!rawInput || !algoSelect || !resultBox) return;

            const text = rawInput.value;
            const method = algoSelect.value;
            let output = "";

            if (!text) return;

            try {
                if (method === "base64") {
                    output = btoa(text);
                } else if (method === "rot13") {
                    output = text.replace(/[a-zA-Z]/g, (c) => {
                        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
                    });
                } else if (method === "binary") {
                    output = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                }
            } catch (e) {
                output = "TRANSFORMATION_ERROR: " + e.message;
            }

            resultBox.textContent = output;
        };
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            if (!resultBox) return;
            const text = resultBox.textContent;

            // Clipboard fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = "[ COPIED ]";
                    setTimeout(() => copyBtn.textContent = "COPY_HEX", 2000);
                });
            } else {
                // Fallback for iframes or older browsers
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyBtn.textContent = "[ COPIED ]";
                } catch (err) {
                    copyBtn.textContent = "[ ERR ]";
                }
                document.body.removeChild(textArea);
                setTimeout(() => copyBtn.textContent = "COPY_HEX", 2000);
            }
        };
    }

    // Secret Decoder Logic
    const unlockBtn = document.getElementById('unlockSecret');
    const secretInput = document.getElementById('secretKeyInput');
    const dossier = document.getElementById('secretDossier');

    if (unlockBtn) {
        unlockBtn.onclick = () => {
            if (!secretInput || !dossier) return;

            const key = secretInput.value.trim().toUpperCase();

            // Logical "Seeds" hidden in other sections
            if (key === "1024" || key === "C#_CORE" || key === "PID1024") {
                dossier.classList.remove('d-none');
                dossier.innerHTML = `
                    <div class="p-3 bg-black border border-success" style="box-shadow: inset 0 0 10px #00ff4133">
                        <h6 class="text-success fw-bold mb-2">> DOSSIER_LOG: DEV_SPEC_01</h6>
                        <p class="small text-white">"True efficiency isn't just about speed; it's about the resilience of the logic under pressure. This Sandbox environment was constructed using the very Firebase constraints that power the live systems."</p>
                        <hr class="border-success opacity-25">
                        <p class="text-muted" style="font-size: 0.65rem">CRC_VERIFIED // AUTH_LEVEL: ROOT</p>
                    </div>
                `;
            } else {
                secretInput.value = "ERR_KEY_MISMATCH";
                setTimeout(() => secretInput.value = "", 1000);
            }
        };
    }
};