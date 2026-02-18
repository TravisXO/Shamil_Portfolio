document.addEventListener('DOMContentLoaded', () => {
    // --- Performance Utilities ---

    // Throttle function - limits execution rate
    function throttle(func, wait) {
        let timeout;
        let lastRan;
        return function executedFunction(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (Date.now() - lastRan >= wait) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, wait - (Date.now() - lastRan));
            }
        };
    }

    // Debounce function - delays execution until after events stop
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // RequestAnimationFrame wrapper for smooth updates
    function rafThrottle(callback) {
        let requestId = null;
        let lastArgs;

        const later = (context) => () => {
            requestId = null;
            callback.apply(context, lastArgs);
        };

        const throttled = function (...args) {
            lastArgs = args;
            if (requestId === null) {
                requestId = requestAnimationFrame(later(this));
            }
        };

        throttled.cancel = () => {
            if (requestId !== null) {
                cancelAnimationFrame(requestId);
                requestId = null;
            }
        };

        return throttled;
    }

    // --- Cached DOM Elements (query once, reuse many times) ---
    const DOM = {
        stackContainer: document.querySelector('.stack-container'),
        header: document.querySelector('.dynamic-header'),
        quickScrollNav: document.getElementById('quickScrollNav'),
        timeDisplay: document.getElementById('lusakaTime'),
        mobileTimeDisplay: document.getElementById('lusakaTimeMobile'),
        sidebar: document.getElementById('mobileSysSidebar'),
        trigger: document.getElementById('sysSidebarTrigger'),
        closeBtn: document.getElementById('sysSidebarClose'),
        gridContainer: document.querySelector('.grid-bg-container')
    };

    // --- FIX: Disable CSS Scroll Snap for Mouse Wheel ---
    if (DOM.stackContainer) {
        DOM.stackContainer.style.scrollSnapType = 'none';
    }

    // --- 1. Optimized System Time Logic ---
    let lastTimeString = '';
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lusaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    function updateTime() {
        const now = new Date();
        const timeString = timeFormatter.format(now);

        // Only update DOM if time actually changed
        if (timeString !== lastTimeString) {
            lastTimeString = timeString;
            if (DOM.timeDisplay) {
                DOM.timeDisplay.textContent = timeString;
            }
            if (DOM.mobileTimeDisplay) {
                DOM.mobileTimeDisplay.textContent = timeString;
            }
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // --- 2. Optimized Scroll & Navigation Logic ---

    // Cache tracked sections and their data
    let cachedSections = null;
    let cachedIndicators = null;

    function getTrackedSections() {
        // Return cached sections if available
        if (cachedSections) return cachedSections;

        // Query '.stack-card' to ensure we get sections in DOM order
        const allSections = Array.from(document.querySelectorAll('.stack-card'));

        // Filter out sections that are hidden (e.g., in inactive tabs)
        // offsetParent is null for display:none elements
        cachedSections = allSections.filter(section => {
            return section.id && section.offsetParent !== null;
        });

        return cachedSections;
    }

    function generateScrollIndicators() {
        if (!DOM.quickScrollNav) return;

        const sections = getTrackedSections();

        // Hide container if no visible sections
        const container = DOM.quickScrollNav.closest('aside');
        if (sections.length === 0) {
            if (container) container.style.display = 'none';
            return;
        } else {
            if (container) container.style.display = '';
        }

        DOM.quickScrollNav.innerHTML = '';
        const fragment = document.createDocumentFragment();

        // Icon mapping for sections
        const iconMap = {
            // Home Page
            'hero': 'fa-brands fa-hackerrank',
            'system-stats': 'fa-solid fa-tachometer-alt',
            'about-profile': 'fa-solid fa-user-astronaut',
            'tech-stack': 'fa-solid fa-microchip',
            'projects': 'fa-solid fa-code',
            'contact': 'fa-solid fa-satellite-dish',

            // Case Study Pages
            'case-study-nav': 'fa-solid fa-layer-group',
            'classic-overview': 'fa-solid fa-binoculars',
            'classic-challenge': 'fa-solid fa-mountain',
            'classic-goals': 'fa-solid fa-crosshairs',
            'classic-approach': 'fa-solid fa-chess-knight',
            'classic-results': 'fa-solid fa-chart-line',
            'classic-impact': 'fa-solid fa-meteor',
            'classic-details': 'fa-solid fa-server',
            'classic-cta': 'fa-solid fa-paper-plane',

            // Skills Page (Explicit IDs)
            'skills-intro': 'fa-solid fa-star',
            'section-fullstack': 'fa-solid fa-code',
            'section-cloud': 'fa-solid fa-cloud',
            'section-seo': 'fa-solid fa-chart-line',
            'section-engineering': 'fa-solid fa-cogs',
            'section-additional': 'fa-solid fa-plus-circle',

            // Generic Categories (Used for fallbacks)
            'overview': 'fa-solid fa-binoculars',
            'challenge': 'fa-solid fa-mountain',
            'goals': 'fa-solid fa-crosshairs',
            'approach': 'fa-solid fa-chess-knight',
            'results': 'fa-solid fa-chart-line',
            'impact': 'fa-solid fa-meteor',
            'details': 'fa-solid fa-server',
            'cta': 'fa-solid fa-paper-plane',
            'footer': 'fa-solid fa-power-off'
        };

        sections.forEach((section) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.setAttribute('data-target', section.id);

            // Determine icon
            let iconClass = iconMap[section.id];
            if (!iconClass) {
                // Heuristic fallback for dynamic sections
                const id = section.id.toLowerCase();
                if (id.includes('overview')) iconClass = iconMap['overview'];
                else if (id.includes('challenge')) iconClass = iconMap['challenge'];
                else if (id.includes('goals')) iconClass = iconMap['goals'];
                else if (id.includes('approach')) iconClass = iconMap['approach'];
                else if (id.includes('results')) iconClass = iconMap['results'];
                else if (id.includes('impact')) iconClass = iconMap['impact'];
                else if (id.includes('details')) iconClass = iconMap['details'];
                else if (id.includes('cta') || id.includes('next')) iconClass = iconMap['cta'];
                else if (id.includes('footer')) iconClass = iconMap['footer'];
                else iconClass = 'fa-solid fa-circle-nodes';
            }

            // Determine label (Use data-title strictly if available, or clean ID)
            const label = section.getAttribute('data-title') || section.id.toUpperCase().replace(/-/g, ' ');

            indicator.innerHTML = `
                <div class="nav-label">${label}</div>
                <div class="icon-box"><i class="${iconClass}"></i></div>
            `;

            // Store reference for quick access
            indicator._targetSection = section;

            fragment.appendChild(indicator);
        });

        DOM.quickScrollNav.appendChild(fragment);

        // Cache indicators
        cachedIndicators = Array.from(DOM.quickScrollNav.querySelectorAll('.scroll-indicator'));

        // Use event delegation for click handlers
        DOM.quickScrollNav.addEventListener('click', (e) => {
            const indicator = e.target.closest('.scroll-indicator');
            if (indicator && indicator._targetSection) {
                indicator._targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Dynamic Update on Tab Change (Case Studies)
    const tabTriggerList = document.querySelectorAll('button[data-bs-toggle="pill"], button[data-bs-toggle="tab"]');
    if (tabTriggerList.length > 0) {
        tabTriggerList.forEach(tabTrigger => {
            tabTrigger.addEventListener('shown.bs.tab', () => {
                // Invalidate cache and regenerate when tabs switch
                cachedSections = null;
                generateScrollIndicators();
                updateActiveIndicator();
            });
        });
    }

    // Optimized active indicator update
    const updateActiveIndicator = rafThrottle(() => {
        if (!DOM.quickScrollNav || !cachedSections || !cachedIndicators || cachedSections.length === 0) return;

        // Account for sticky nav on Skills page
        const stickyNav = document.getElementById('skills-nav');
        const stickyNavHeight = stickyNav ? stickyNav.offsetHeight : 0;

        const triggerPoint = (window.innerHeight / 3) + stickyNavHeight;
        let currentId = '';
        let activeIndex = 0;

        // Find the current active section
        for (let i = 0; i < cachedSections.length; i++) {
            const rect = cachedSections[i].getBoundingClientRect();
            // If section top is above trigger point (scrolled past), it's a candidate
            if (rect.top <= triggerPoint) {
                currentId = cachedSections[i].id;
                activeIndex = i;
            }
        }

        // Apply active class to strictly ONE indicator
        for (let i = 0; i < cachedIndicators.length; i++) {
            const indicator = cachedIndicators[i];
            const isActive = indicator.getAttribute('data-target') === currentId;
            indicator.classList.toggle('active', isActive);

            // Visibility Logic (Fish-eye view)
            if (cachedIndicators.length > 5) {
                if (i >= activeIndex - 2 && i <= activeIndex + 2) {
                    indicator.style.display = '';
                } else {
                    indicator.style.display = 'none';
                }
            } else {
                indicator.style.display = '';
            }
        }
    });

    // Optimized header scroll handler
    const handleHeaderScroll = rafThrottle(() => {
        const scrollTop = window.scrollY || (DOM.stackContainer ? DOM.stackContainer.scrollTop : 0);

        if (DOM.header) {
            const shouldScroll = scrollTop > 50;
            DOM.header.classList.toggle('header-scrolled', shouldScroll);
        }
    });

    const handleScroll = rafThrottle(() => {
        handleHeaderScroll();
        updateActiveIndicator();
    });

    const scrollListenerTarget = DOM.stackContainer || window;
    scrollListenerTarget.addEventListener('scroll', handleScroll, { passive: true });

    if (scrollListenerTarget !== window) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Initial calls
    generateScrollIndicators();
    updateActiveIndicator();

    // Smooth scroll for anchors
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            // Ensure target is visible before scrolling
            if (targetElement && targetElement.offsetParent !== null) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // --- 3. Optimized Grid Parallax ---
    let isDesktop = window.innerWidth > 768;

    const handleMouseMove = throttle((e) => {
        if (!isDesktop || !DOM.gridContainer) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;

        DOM.gridContainer.style.transform = `perspective(100rem) rotateX(${moveY * 0.05}deg) rotateY(${moveX * 0.05}deg)`;
    }, 16);

    if (DOM.gridContainer) {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const handleResize = debounce(() => {
        isDesktop = window.innerWidth > 768;
        if (!isDesktop && DOM.gridContainer) {
            DOM.gridContainer.style.transform = '';
        }
    }, 250);

    window.addEventListener('resize', handleResize, { passive: true });

    // --- 4. Mobile Sidebar Logic ---
    const backdrop = document.getElementById('sysSidebarBackdrop');

    function openSidebar() {
        if (DOM.sidebar) DOM.sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('visible');
    }

    function closeSidebar() {
        if (DOM.sidebar) DOM.sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
    }

    function toggleSidebar() {
        if (DOM.sidebar && DOM.sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    if (DOM.trigger) DOM.trigger.addEventListener('click', toggleSidebar);
    if (DOM.closeBtn) DOM.closeBtn.addEventListener('click', closeSidebar);

    // Close on backdrop tap
    if (backdrop) backdrop.addEventListener('click', closeSidebar);

    // Close on outside click (desktop fallback)
    document.addEventListener('click', (e) => {
        if (DOM.sidebar &&
            DOM.sidebar.classList.contains('open') &&
            !DOM.sidebar.contains(e.target) &&
            e.target !== DOM.trigger &&
            DOM.trigger && !DOM.trigger.contains(e.target) &&
            e.target !== backdrop) {
            closeSidebar();
        }
    });

    // --- Swipe-to-open / swipe-to-close gesture ---
    const swipeZone = document.getElementById('sysSidebarSwipeZone');
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 40;   // min px to count as a swipe
    const SWIPE_MAX_Y = 80;    // max vertical drift before ignoring as a scroll

    // Swipe RIGHT-to-LEFT on the sidebar itself closes it
    if (DOM.sidebar) {
        DOM.sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        DOM.sidebar.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            if (dx > SWIPE_THRESHOLD && dy < SWIPE_MAX_Y) {
                closeSidebar();
            }
        }, { passive: true });
    }

    // Swipe LEFT-to-RIGHT from right edge opens it
    if (swipeZone) {
        swipeZone.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        swipeZone.addEventListener('touchend', (e) => {
            const dx = touchStartX - e.changedTouches[0].clientX;
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            if (dx > SWIPE_THRESHOLD && dy < SWIPE_MAX_Y) {
                openSidebar();
            }
        }, { passive: true });
    }
});