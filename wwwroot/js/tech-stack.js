document.addEventListener('DOMContentLoaded', () => {

    const section = document.getElementById('tech-stack');
    const cursor = document.getElementById('virtual-cursor');
    const icons = document.querySelectorAll('.tech-icon-container');
    const windows = {
        'backend': document.getElementById('win-backend'),
        'frontend': document.getElementById('win-frontend'),
        'database': document.getElementById('win-database'),
        'cloud': document.getElementById('win-cloud'),
        'tools': document.getElementById('win-tools'),
        'special': document.getElementById('win-special')
    };

    let animationStarted = false;
    let isMobile = window.innerWidth < 992;

    // Check for resize to update mobile state
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 992;
    });

    // Intersection Observer to start animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationStarted) {
                animationStarted = true;
                if (!isMobile) {
                    runDesktopSimulation();
                } else {
                    showAllMobile();
                }
            }
        });
    }, { threshold: 0.2 });

    if (section) {
        observer.observe(section);
    }

    function showAllMobile() {
        // Just fade in all windows for mobile
        Object.values(windows).forEach((win, index) => {
            win.classList.remove('d-none');
            // Staggered fade in
            setTimeout(() => {
                win.classList.add('show-window');
            }, index * 100);
        });
    }

    async function runDesktopSimulation() {
        // Sequence of categories to click
        const sequence = ['backend', 'frontend', 'database', 'cloud', 'tools', 'special'];

        // Initial cursor position (center or predefined)
        // Reset cursor to start position if needed

        for (const category of sequence) {
            await simulateClickSequence(category);
            // Wait a bit before next action
            await wait(800);
        }

        // Fade out cursor at the end
        if (cursor) cursor.style.opacity = '0';
    }

    async function simulateClickSequence(category) {
        const iconEl = document.querySelector(`.tech-icon-container[data-category="${category}"]`);
        const windowEl = windows[category];

        if (!iconEl || !windowEl || !cursor) return;

        // 1. Move Cursor to Icon
        const iconRect = iconEl.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect(); // Relative to section

        // Calculate position relative to the container .desktop-wrapper
        // Since cursor is absolute in .desktop-wrapper (closest positioned ancestor assumed, 
        // actually .tech-stack-section is relative, .desktop-wrapper is relative)

        // We need coordinates relative to the viewport for getBoundingClientRect, 
        // but we need to set top/left relative to the wrapper.
        // Let's rely on offsetTop/Left for simpler logic if structure permits, 
        // or calculate offsets.

        // Better calculation:
        const wrapper = document.querySelector('.desktop-wrapper');
        const wrapperRect = wrapper.getBoundingClientRect();

        const targetX = (iconRect.left - wrapperRect.left) + (iconRect.width / 2);
        const targetY = (iconRect.top - wrapperRect.top) + (iconRect.height / 2);

        // Move cursor
        cursor.style.transition = 'top 1s ease-in-out, left 1s ease-in-out';
        cursor.style.left = `${targetX}px`;
        cursor.style.top = `${targetY}px`;

        // Wait for movement to finish
        await wait(1000);

        // 2. Click Animation
        cursor.classList.add('click-animation');
        iconEl.classList.add('active');

        await wait(200);
        cursor.classList.remove('click-animation');

        // 3. Open Window
        windowEl.classList.remove('d-none');
        // Small delay to allow display:block to apply before adding opacity transition class
        await wait(50);
        windowEl.classList.add('show-window');
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});