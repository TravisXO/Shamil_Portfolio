/**
 * COMMUNICATION_PROTOCOL_V1
 * Handles contact form submission simulation and UI feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('hudContactForm');
    const formPanel = document.getElementById('formContent');
    const successPanel = document.getElementById('submissionSuccess');
    const submitBtn = document.getElementById('transmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Lock Interface
            const inputs = contactForm.querySelectorAll('.hud-input');
            inputs.forEach(input => input.disabled = true);
            submitBtn.disabled = true;

            // 2. Simulate Transmission Protocol
            btnText.textContent = "ENCRYPTING & TRANSMITTING...";
            btnIcon.className = "fas fa-circle-notch fa-spin";

            // 3. Simulated Network Delay (1.5s)
            setTimeout(() => {
                // 4. Success State
                formPanel.style.display = 'none';
                successPanel.style.display = 'block';

                // Optional: Reset form after delay
                // setTimeout(() => {
                //    resetForm();
                // }, 5000);

                // Log transmission
                console.log("[SYS] PACKET_SENT_SUCCESSFULLY");
            }, 1500);
        });
    }

    function resetForm() {
        contactForm.reset();
        const inputs = contactForm.querySelectorAll('.hud-input');
        inputs.forEach(input => input.disabled = false);
        submitBtn.disabled = false;
        btnText.textContent = "INITIATE TRANSMISSION";
        btnIcon.className = "fas fa-paper-plane";

        successPanel.style.display = 'none';
        formPanel.style.display = 'block';
    }
});