/**
 * CASE_STUDY_LOGIC_ENGINE
 * Handles tab switching, entrance animations, and active state management for Mission Logs.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Animation Observer ---
    // Detects elements with 'fade-in-on-scroll' and triggers visibility
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for Staggered Goal Cards
                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.querySelectorAll('.goal-card, .result-card, .impact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100); // 100ms delay between each item
                    });
                }

                // Trigger Number Animation if visible
                const counters = entry.target.querySelectorAll('.counter-animate');
                counters.forEach(counter => animateValue(counter));
            }
        });
    }, observerOptions);

    // Initial Observation function
    function observeElements() {
        const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
        const staggerContainers = document.querySelectorAll('.stagger-container');

        fadeElements.forEach(el => sectionObserver.observe(el));
        staggerContainers.forEach(el => sectionObserver.observe(el));
    }

    // Start observing immediately
    observeElements();


    // --- 2. Tab Interaction Logic ---
    const tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');

    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            // Log the switch for "system feel"
            const targetId = event.target.getAttribute('data-bs-target');
            console.log(`[SYS] LOADING_MISSION_LOG: ${targetId}`);

            // Reset animations in the new tab to replay them (Optional effect)
            // Or just ensure we observe new elements if they were hidden
            const activePane = document.querySelector(targetId);
            if (activePane) {
                const newFadeElements = activePane.querySelectorAll('.fade-in-on-scroll');
                const newStaggerContainers = activePane.querySelectorAll('.stagger-container');

                // Optional: Reset opacity to 0 to replay animation
                newFadeElements.forEach(el => {
                    el.classList.remove('visible');
                    // Force reflow
                    void el.offsetWidth;
                    sectionObserver.observe(el);
                });

                // Reset stagger containers
                newStaggerContainers.forEach(el => {
                    const children = el.querySelectorAll('.goal-card, .result-card, .impact-item');
                    children.forEach(child => child.classList.remove('revealed'));
                    sectionObserver.observe(el);
                });
            }

            // Scroll to top of content area to prevent disorientation
            const navSection = document.getElementById('case-study-nav');
            if (navSection) {
                // Smooth adjustment if user is way down the page
                const rect = navSection.getBoundingClientRect();
                if (rect.top < 0) {
                    navSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- 3. Header Scroll Offset Logic ---
    // Ensures the sticky nav sits correctly below the main header
    const mainHeader = document.querySelector('.dynamic-header');
    const caseNav = document.querySelector('.case-study-nav-section');

    if (mainHeader && caseNav) {
        window.addEventListener('resize', () => {
            const headerHeight = mainHeader.offsetHeight;
            caseNav.style.top = `${headerHeight}px`;
        });

        // Initial set
        caseNav.style.top = `${mainHeader.offsetHeight}px`;
    }

    // --- 4. Infinite Slider Logic (DOM Cycling with Gap Support) ---
    const sliders = document.querySelectorAll('.strategy-slider-wrapper');

    sliders.forEach(wrapper => {
        const track = wrapper.querySelector('.slider-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (!track || !prevBtn || !nextBtn) return;

        // Helper to get total slide distance (width + gap)
        const getSlideDistance = () => {
            const card = track.firstElementChild;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            return card.offsetWidth + gap;
        };

        // We use DOM manipulation for infinite looping to avoid blank spaces

        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();

            // 1. Shift track left by one card + gap
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = `translateX(-${distance}px)`;

            // 2. After transition, move first element to end and reset transform
            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateX(0)';

                // Release lock
                setTimeout(() => { isAnimating = false; }, 10);
            }, { once: true });
        });

        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();

            // 1. Move last element to start instantly (hidden)
            track.style.transition = 'none';
            track.insertBefore(track.lastElementChild, track.firstElementChild);

            // 2. Shift track to offset the inserted element (looks like nothing changed)
            track.style.transform = `translateX(-${distance}px)`;

            // Force reflow
            void track.offsetWidth;

            // 3. Animate back to 0
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = 'translateX(0)';

            track.addEventListener('transitionend', () => {
                isAnimating = false;
            }, { once: true });
        });

        let isAnimating = false;
    });

    // --- 5. Numeric Counter Animation ---
    function animateValue(obj) {
        // Guard clause to prevent re-running animation if already done
        if (obj.classList.contains('animated-done')) return;

        const target = parseFloat(obj.getAttribute('data-target'));
        const suffix = obj.getAttribute('data-suffix') || '';
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // EaseOutExpo effect
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentVal = Math.floor(ease * target);
            obj.innerHTML = currentVal + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.classList.add('animated-done');
            }
        };

        window.requestAnimationFrame(step);
    }
});