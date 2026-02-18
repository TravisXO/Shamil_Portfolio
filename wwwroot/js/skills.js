/**
 * SKILLS_MATRIX_ENGINE
 * Handles interactive elements, 3D cards, and particle systems for the Skills Page.
 * NOTE: Scroll Navigation is handled exclusively by site.js.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. ENTRANCE SEQUENCE
    // =========================================================
    const overlay = document.getElementById('skills-load-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1500);
        }, 500);
    }

    // =========================================================
    // 2. PARTICLE SYSTEM
    // =========================================================
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
        createParticles(particleContainer, 30);
    }

    function createParticles(container, count) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 5 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;

            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
    }

    // =========================================================
    // 3. SKILLS-INTERNAL NAV — active state on scroll
    // Updates the .skill-nav-item active class based on which
    // section is currently in view. Independent of site.js.
    // =========================================================
    const skillsNavItems = document.querySelectorAll('.skill-nav-item');
    const skillSections = ['section-fullstack', 'section-cloud', 'section-seo', 'section-engineering', 'section-additional']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (skillsNavItems.length > 0 && skillSections.length > 0) {
        const stickyNav = document.getElementById('skills-nav');

        function updateSkillsNav() {
            const offset = (stickyNav ? stickyNav.offsetHeight : 0) + 80;
            let activeId = skillSections[0].id;

            for (let i = 0; i < skillSections.length; i++) {
                const rect = skillSections[i].getBoundingClientRect();
                if (rect.top <= offset) {
                    activeId = skillSections[i].id;
                }
            }

            skillsNavItems.forEach(item => {
                const href = item.getAttribute('href');
                item.classList.toggle('active', href === `#${activeId}`);
            });
        }

        window.addEventListener('scroll', updateSkillsNav, { passive: true });
        updateSkillsNav();
    }

    // =========================================================
    // 4. VISUAL EFFECTS OBSERVER
    // Handles CSS reveal animations (fade-ins, progress rings).
    // Does NOT handle navigation — that is site.js's job.
    // =========================================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const visualEffectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = entry.target;

            // General reveal (slide-in-*, highlight-phrase, section-title, tech-counter-badge)
            target.classList.add('visible');

            // Counter animation for tech-counter-badge
            if (target.classList.contains('tech-counter-badge')) {
                const counter = target.querySelector('.counter-val');
                if (counter) animateCounter(counter);
                // Stop observing — counter only needs to run once
                visualEffectsObserver.unobserve(target);
                return;
            }

            // Circular progress ring for skill cards
            if (target.classList.contains('skill-3d-card')) {
                const circle = target.querySelector('.progress-ring__circle');
                if (circle) {
                    const percent = parseFloat(circle.getAttribute('data-percent')) || 0;
                    const circumference = 2 * Math.PI * 26; // r=26 → ~163.4
                    const offset = circumference - (percent / 100) * circumference;
                    // Delay slightly so card entry animation plays first
                    setTimeout(() => {
                        circle.style.strokeDasharray = circumference;
                        circle.style.strokeDashoffset = offset;
                    }, 500);
                }
                // Keep observing — transition delay varies per card
                return;
            }

            // Unobserve static one-shot animations once triggered
            if (
                target.classList.contains('slide-in-left') ||
                target.classList.contains('slide-in-right') ||
                target.classList.contains('highlight-phrase')
            ) {
                visualEffectsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    // Slide animations
    document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in-up').forEach(el => {
        visualEffectsObserver.observe(el);
    });

    // Highlight phrases (underline animation)
    document.querySelectorAll('.highlight-phrase').forEach(el => {
        visualEffectsObserver.observe(el);
    });

    // FIX: section-title — was never observed, so opacity:0 never resolved
    document.querySelectorAll('.section-title').forEach(el => {
        visualEffectsObserver.observe(el);
    });

    // FIX: tech-counter-badge — was never observed for its own reveal
    document.querySelectorAll('.tech-counter-badge').forEach(el => {
        visualEffectsObserver.observe(el);
    });

    // Staggered card reveals
    document.querySelectorAll('.skill-3d-card').forEach((card, index) => {
        // Cascade delay: reset every 3 columns (Bootstrap grid col-lg-4)
        card.style.transitionDelay = `${(index % 3) * 0.12}s`;
        visualEffectsObserver.observe(card);
    });

    // =========================================================
    // 5. 3D TILT EFFECT
    // =========================================================
    document.querySelectorAll('.skill-3d-card').forEach(card => {
        const content = card.querySelector('.card-content');
        if (!content) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            const maxRot = 10;

            content.style.transform = `perspective(1000px) rotateX(${-yPct * maxRot}deg) rotateY(${xPct * maxRot}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            content.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // =========================================================
    // 6. INTERACTIVE FEATURES — Filter & Toggle
    // =========================================================

    // Toggle "Show Project Details" switch
    const toggleSwitch = document.getElementById('toggleProjects');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            document.querySelectorAll('.project-details').forEach(detail => {
                detail.classList.toggle('expanded', e.target.checked);
            });
        });
    }

    // Category filter buttons
    const filterBtns = document.querySelectorAll('[data-filter]');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                const allCards = document.querySelectorAll('.skill-3d-card');

                allCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const isMatch = filter === 'all' || category === filter;

                    if (isMatch) {
                        // Show: reset display first, then fade in
                        card.style.display = '';
                        // Use rAF to allow display change to paint before transition
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.92) translateY(8px)';
                        // Hide after transition completes
                        card.addEventListener('transitionend', function hideCard() {
                            if (card.style.opacity === '0') {
                                card.style.display = 'none';
                            }
                            card.removeEventListener('transitionend', hideCard);
                        });
                    }
                });
            });
        });
    }

    // =========================================================
    // 7. CODE BACKGROUND ANIMATION
    // =========================================================
    const bgCode = document.querySelector('.section-bg-code');
    if (bgCode) {
        const snippets = [
            "public class SkillMatrix : IExperience { ... }",
            "const optimize = async (code) => { await refactor(); }",
            "SELECT * FROM Knowledge WHERE Type = 'FullStack';",
            ".skills-section { display: flex; justify-content: center; }",
            "git commit -m 'Deploying innovative solutions'",
            "docker-compose up -d --build",
            "await Task.WhenAll(tasks);",
            "services.AddDbContext<AppDbContext>(options => ...);",
            "@await Html.PartialAsync('_SkillCard', model)",
            "az webapp deploy --resource-group rg-portfolio",
        ];

        setInterval(() => {
            const div = document.createElement('div');
            div.textContent = snippets[Math.floor(Math.random() * snippets.length)];
            div.style.cssText = `
                position: absolute;
                left: ${Math.random() * 80}%;
                top: ${Math.random() * 90}%;
                opacity: 0;
                transition: opacity 1s ease;
                pointer-events: none;
            `;
            bgCode.appendChild(div);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => { div.style.opacity = '1'; });
            });

            setTimeout(() => {
                div.style.opacity = '0';
                div.addEventListener('transitionend', () => div.remove(), { once: true });
            }, 4000);

        }, 2000);
    }

    // =========================================================
    // UTILITIES
    // =========================================================
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const duration = 1500;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease-out quad
            const eased = 1 - Math.pow(1 - progress, 2);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(step);
    }
});