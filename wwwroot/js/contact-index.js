/**
 * COMMUNICATION_PROTOCOL_V1
 * Handles contact form submission via AJAX to ASP.NET Backend.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('hudContactForm');
    const formPanel = document.getElementById('formContent');
    const successPanel = document.getElementById('submissionSuccess');
    const submitBtn = document.getElementById('transmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Extract and Validate
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // 2. Lock Interface
            const inputs = contactForm.querySelectorAll('.hud-input');
            inputs.forEach(input => input.disabled = true);
            submitBtn.disabled = true;

            // 3. UI Feedback
            btnText.textContent = "ENCRYPTING & TRANSMITTING...";
            btnIcon.className = "fas fa-circle-notch fa-spin";

            try {
                // 4. Secure Transmission (Include Antiforgery Token)
                const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

                const response = await fetch('/Home/Contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': token
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // 5. Success State
                    formPanel.style.display = 'none';
                    successPanel.style.display = 'block';
                    console.log("[SYS] PACKET_SENT_SUCCESSFULLY");
                } else {
                    throw new Error("SERVER_REJECTED_TRANSMISSION");
                }
            } catch (error) {
                // 6. Error Handling
                console.error("[SYS] CRITICAL_UPLINK_FAILURE:", error);
                btnText.textContent = "RETRY TRANSMISSION";
                btnIcon.className = "fas fa-exclamation-triangle";
                inputs.forEach(input => input.disabled = false);
                submitBtn.disabled = false;

                // Show a non-blocking toast or error message in production here
            }
        });
    }
});