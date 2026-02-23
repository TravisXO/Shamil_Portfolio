/**
 * CASE_STUDY_LOGIC_ENGINE
 * Handles tab switching, entrance animations, slider, counter animation,
 * and the results lightbox with pagination.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // 1. ANIMATION OBSERVER
    // ─────────────────────────────────────────────
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.querySelectorAll('.goal-card, .result-card, .impact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
                }

                const counters = entry.target.querySelectorAll('.counter-animate');
                counters.forEach(counter => animateValue(counter));
            }
        });
    }, observerOptions);

    function observeElements() {
        document.querySelectorAll('.fade-in-on-scroll').forEach(el => sectionObserver.observe(el));
        document.querySelectorAll('.stagger-container').forEach(el => sectionObserver.observe(el));
    }

    observeElements();


    // ─────────────────────────────────────────────
    // 2. TAB INTERACTION
    // ─────────────────────────────────────────────

    // Map each tab target to the ID of its first section
    const tabFirstSection = {
        '#content-classic': 'classic-overview',
        '#content-house': 'house-overview',
        '#content-bnop': 'bnop-overview',
    };

    const tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');

    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            const targetId = event.target.getAttribute('data-bs-target');
            console.log(`[SYS] LOADING_MISSION_LOG: ${targetId}`);

            const activePane = document.querySelector(targetId);
            if (activePane) {
                activePane.querySelectorAll('.fade-in-on-scroll').forEach(el => {
                    el.classList.remove('visible');
                    void el.offsetWidth;
                    sectionObserver.observe(el);
                });

                activePane.querySelectorAll('.stagger-container').forEach(el => {
                    el.querySelectorAll('.goal-card, .result-card, .impact-item').forEach(child => {
                        child.classList.remove('revealed');
                    });
                    sectionObserver.observe(el);
                });
            }

            // Auto-scroll to the first section of the newly activated tab
            const firstSectionId = tabFirstSection[targetId];
            if (firstSectionId) {
                const firstSection = document.getElementById(firstSectionId);
                const caseNav = document.querySelector('.case-study-nav-section');
                if (firstSection) {
                    // Small timeout lets Bootstrap finish its tab paint before we scroll
                    setTimeout(() => {
                        const navHeight = caseNav ? caseNav.offsetHeight : 0;
                        const top = firstSection.getBoundingClientRect().top + window.scrollY - navHeight;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }, 50);
                }
            }
        });
    });


    // ─────────────────────────────────────────────
    // 3. HEADER SCROLL OFFSET
    // ─────────────────────────────────────────────
    const mainHeader = document.querySelector('.dynamic-header');
    const caseNav = document.querySelector('.case-study-nav-section');

    if (mainHeader && caseNav) {
        const setNavTop = () => {
            caseNav.style.top = `${mainHeader.offsetHeight}px`;
        };
        window.addEventListener('resize', setNavTop);
        setNavTop();
    }


    // ─────────────────────────────────────────────
    // 4. INFINITE SLIDER
    // ─────────────────────────────────────────────
    document.querySelectorAll('.strategy-slider-wrapper').forEach(wrapper => {
        const track = wrapper.querySelector('.slider-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (!track || !prevBtn || !nextBtn) return;

        let isAnimating = false;

        const getSlideDistance = () => {
            const card = track.firstElementChild;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            return card.offsetWidth + gap;
        };

        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = `translateX(-${distance}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateX(0)';
                setTimeout(() => { isAnimating = false; }, 10);
            }, { once: true });
        });

        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();
            track.style.transition = 'none';
            track.insertBefore(track.lastElementChild, track.firstElementChild);
            track.style.transform = `translateX(-${distance}px)`;

            void track.offsetWidth;

            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = 'translateX(0)';

            track.addEventListener('transitionend', () => {
                isAnimating = false;
            }, { once: true });
        });
    });


    // ─────────────────────────────────────────────
    // 5. NUMERIC COUNTER ANIMATION
    // ─────────────────────────────────────────────
    function animateValue(obj) {
        if (obj.classList.contains('animated-done')) return;

        const target = parseFloat(obj.getAttribute('data-target'));
        const suffix = obj.getAttribute('data-suffix') || '';
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            obj.innerHTML = Math.floor(ease * target) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.classList.add('animated-done');
            }
        };

        window.requestAnimationFrame(step);
    }


    // ─────────────────────────────────────────────
    // 6. RESULTS LIGHTBOX
    // ─────────────────────────────────────────────
    const lightboxOverlay = document.getElementById('cs-lightbox');
    const lbCounter = lightboxOverlay.querySelector('.cs-lightbox-counter');
    const lbTitle = lightboxOverlay.querySelector('.cs-lightbox-title');
    const lbBody = lightboxOverlay.querySelector('.cs-lightbox-body');
    const lbDots = lightboxOverlay.querySelector('.cs-lb-dots');
    const lbPrev = lightboxOverlay.querySelector('.cs-lb-prev');
    const lbNext = lightboxOverlay.querySelector('.cs-lb-next');
    const lbClose = lightboxOverlay.querySelector('.cs-lightbox-close');

    let currentGroup = null; // e.g. 'classic'
    let currentIndex = 0;
    let totalModules = 0;
    let panelCache = {}; // { groupName: [panel0, panel1, panel2, panel3] }

    /**
     * Build or return cached panels for a group
     */
    function getPanels(group) {
        if (panelCache[group]) return panelCache[group];

        const pool = document.querySelector(`.cs-lb-content-pool[data-lb-group="${group}"]`);
        if (!pool) return [];

        const panels = Array.from(pool.querySelectorAll('.cs-lb-panel'))
            .sort((a, b) => parseInt(a.dataset.lbIndex) - parseInt(b.dataset.lbIndex));

        panelCache[group] = panels;
        return panels;
    }

    /**
     * Render lightbox for the given group + index
     */
    function renderLightbox(group, index) {
        const panels = getPanels(group);
        if (!panels.length) return;

        totalModules = panels.length;
        currentGroup = group;
        currentIndex = Math.max(0, Math.min(index, totalModules - 1));

        const panel = panels[currentIndex];
        const title = panel.dataset.lbTitle || `MODULE_0${currentIndex + 1}`;

        // Populate header
        lbCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalModules).padStart(2, '0')}`;
        lbTitle.textContent = `/// ${title}`;

        // Clone content into body (so counters can re-animate)
        lbBody.innerHTML = '';
        const clone = panel.cloneNode(true);
        lbBody.appendChild(clone);

        // Fire counter animations for cloned elements
        clone.querySelectorAll('.counter-animate').forEach(el => {
            el.classList.remove('animated-done');
            animateValue(el);
        });

        // Rebuild dots
        lbDots.innerHTML = '';
        for (let i = 0; i < totalModules; i++) {
            const dot = document.createElement('button');
            dot.className = `cs-lb-dot${i === currentIndex ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Module ${i + 1}`);
            dot.addEventListener('click', () => renderLightbox(currentGroup, i));
            lbDots.appendChild(dot);
        }

        // Update nav button states
        lbPrev.disabled = currentIndex === 0;
        lbNext.disabled = currentIndex === totalModules - 1;
    }

    /**
     * Open lightbox
     */
    function openLightbox(group, index) {
        renderLightbox(group, index);
        lightboxOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        lightboxOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Trigger card clicks
    document.querySelectorAll('.cs-result-trigger').forEach(trigger => {
        const activate = () => {
            const group = trigger.dataset.lbGroup;
            const index = parseInt(trigger.dataset.lbIndex, 10);
            openLightbox(group, index);
        };

        trigger.addEventListener('click', activate);
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    // Pagination
    lbPrev.addEventListener('click', () => {
        if (currentIndex > 0) renderLightbox(currentGroup, currentIndex - 1);
    });

    lbNext.addEventListener('click', () => {
        if (currentIndex < totalModules - 1) renderLightbox(currentGroup, currentIndex + 1);
    });

    // Close handlers
    lbClose.addEventListener('click', closeLightbox);

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            renderLightbox(currentGroup, currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < totalModules - 1) {
            renderLightbox(currentGroup, currentIndex + 1);
        }
    });
});

