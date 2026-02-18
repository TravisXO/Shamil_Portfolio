document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer options
    const options = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Trigger Fade-in Animation
                target.classList.add('is-visible');

                // Handle stat card animations
                if (target.classList.contains('stat-card')) {
                    const valueElement = target.querySelector('.stat-value');
                    const progressElement = target.querySelector('.stat-progress-bar');

                    if (valueElement && !valueElement.classList.contains('counted')) {
                        valueElement.classList.add('counted');
                        decryptValue(valueElement);
                    }

                    if (progressElement) {
                        requestAnimationFrame(() => {
                            progressElement.style.width = '100%';
                        });
                    }
                }

                observer.unobserve(target);
            }
        });
    }, options);

    // Observe elements
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll, .stat-card');
    fadeElements.forEach(el => observer.observe(el));

    /**
     * Animates a number with a "Digital Decryption" effect
     * Smoothly counts up with glitch overlay
     */
    function decryptValue(obj) {
        const target = obj.getAttribute('data-target');
        const suffix = obj.getAttribute('data-suffix') || '';
        const numericTarget = parseFloat(target);

        const duration = 1500;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (progress >= 1) {
                // Final state
                obj.innerHTML = target + `<span class="stat-suffix">${suffix}</span>`;
                obj.style.textShadow = 'none';
            } else {
                // Smooth easing function (ease-out)
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                // Calculate current value smoothly
                const currentValue = Math.floor(easeProgress * numericTarget);

                // Add decryption effect in early stages
                let displayValue;
                if (progress < 0.7) {
                    // Mix random digits with real value
                    const randomChance = 0.7 - progress;
                    if (Math.random() < randomChance) {
                        displayValue = Math.floor(Math.random() * numericTarget);
                    } else {
                        displayValue = currentValue;
                    }
                } else {
                    // Smooth counting in final stage
                    displayValue = currentValue;
                }

                obj.innerHTML = displayValue + `<span class="stat-suffix">${suffix}</span>`;

                // Glitch effect (decreases over time)
                if (progress < 0.5 && Math.random() > 0.9) {
                    obj.style.textShadow = '2px 0 var(--desert-bloom), -2px 0 var(--mountain-teal)';
                } else {
                    obj.style.textShadow = 'none';
                }

                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
});