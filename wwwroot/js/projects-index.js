/**
 * PROJECT_MANIFEST_LOGIC_ENGINE
 * Handles scroll detection and interactive triggers for the projects section.
 */

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Add a glitch effect on reveal if desired
                if (entry.target.classList.contains('project-module')) {
                    entry.target.style.transitionDelay = `${Math.random() * 0.3}s`;
                }
            }
        });
    }, observerOptions);

    const itemsToReveal = document.querySelectorAll('.project-reveal-item');
    itemsToReveal.forEach(item => projectObserver.observe(item));

    // Interactive Hover Data Logging (Simulated)
    const modules = document.querySelectorAll('.project-module');
    modules.forEach(module => {
        module.addEventListener('mouseenter', () => {
            const id = module.querySelector('.module-id').textContent;
            const name = module.querySelector('.project-name').textContent;
            console.log(`[SYS] ACCESSING_MODULE: ${id} | ${name}`);
        });
    });
});