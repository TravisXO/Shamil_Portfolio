document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Form Interactions ---
    const form = document.getElementById('matrixContactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    const statusDiv = document.getElementById('formStatus');

    // Input animation logic (typing sound simulation visual only)
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('label').style.textShadow = "0 0 5px #00ff41";
        });

        input.addEventListener('blur', () => {
            input.parentElement.querySelector('label').style.textShadow = "none";
        });
    });

    // Form Submission Simulation
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('.transmit-btn');
            const originalBtnText = btn.innerHTML;

            // Disable button
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-text">ENCRYPTING & SENDING...</span>';
            statusDiv.textContent = '>> ESTABLISHING SECURE UPLINK...';
            statusDiv.style.color = '#ffff00'; // Yellow

            // Simulate Network Request
            setTimeout(() => {
                statusDiv.textContent = '>> UPLINK STABLE. TRANSMITTING DATA PACKETS...';
            }, 1000);

            setTimeout(() => {
                // Success State
                btn.innerHTML = '<span class="btn-text">[ TRANSMISSION COMPLETE ]</span>';
                btn.style.borderColor = '#00ff41';
                statusDiv.textContent = '>> MESSAGE DELIVERED SUCCESSFULLY.';
                statusDiv.style.color = '#00ff41'; // Green

                // Reset form
                form.reset();

                // Re-enable button after delay
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalBtnText;
                    statusDiv.textContent = '';
                }, 3000);
            }, 2500);
        });
    }

    // --- 2. Map Visual Effects ---
    // Simple glitch effect for map on interval
    const mapFrame = document.getElementById('googleMapFrame');

    if (mapFrame) {
        setInterval(() => {
            // Randomly slightly alter the filter to create a "flicker"
            if (Math.random() > 0.95) {
                mapFrame.style.filter = 'invert(100%) hue-rotate(140deg) brightness(90%) contrast(120%) sepia(50%)';
                setTimeout(() => {
                    // Restore default matrix filter
                    mapFrame.style.filter = 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%) sepia(30%) saturate(150%)';
                }, 100);
            }
        }, 2000);
    }

    // --- 3. Typing Effect for Placeholders ---
    // This adds a typing effect to the placeholders on load
    const typePlaceholder = (element, text, index = 0) => {
        if (index < text.length) {
            element.setAttribute('placeholder', text.substring(0, index + 1) + '_');
            setTimeout(() => typePlaceholder(element, text, index + 1), 50);
        } else {
            element.setAttribute('placeholder', text); // Remove underscore at end
        }
    };

    // Trigger placeholder typing
    setTimeout(() => {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        if (nameInput) typePlaceholder(nameInput, "Enter your identification...");
        if (emailInput) setTimeout(() => typePlaceholder(emailInput, "Enter return address..."), 500);
    }, 1000);
});