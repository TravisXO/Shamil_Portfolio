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
        heroTerminal: document.getElementById('heroTerminal'), // Added for typing effect
        timeDisplay: document.getElementById('lusakaTime'),
        mobileTimeDisplay: document.getElementById('lusakaTimeMobile'),
        techModal: document.getElementById('techModal'),
        projectLoader: document.getElementById('projectLoader'),
        projectGridContainer: document.getElementById('projectGridContainer'),
        projectGrid: document.getElementById('projectGrid'),
        projModal: document.getElementById('projectModal'),
        sidebar: document.getElementById('mobileSysSidebar'),
        trigger: document.getElementById('sysSidebarTrigger'),
        closeBtn: document.getElementById('sysSidebarClose'),
        gridContainer: document.querySelector('.grid-bg-container')
    };

    // --- FIX: Disable CSS Scroll Snap for Mouse Wheel ---
    // This forces natural scrolling behavior and removes the "sticky" 
    // or "snappy" feel when scrolling with a mouse.
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

    // --- 1.5. Hero Terminal Typing Effect (Line by Line) ---
    if (DOM.heroTerminal) {
        let terminalLines = [
            "INITIALIZING SYSTEM...",
            "LOADING PROFILE: SHAMIL_MONDOKA",
            "STATUS: ONLINE_"
        ];

        const pageTitle = document.title;

        // Context-aware typing
        if (pageTitle.includes("Contact")) {
            terminalLines = [
                "> ESTABLISH_CONNECTION",
                "Available for freelance projects, consulting, or full-time opportunities"
            ];
        } else if (pageTitle.includes("Dev_Log") || pageTitle.includes("Archive")) {
            terminalLines = [
                "> MOUNTING_DRIVE: /ARCHIVES",
                "ACCESSING: DEV_LOG_DATABASE...",
                "STATUS: READ_ONLY_MODE"
            ];
        } else if (document.querySelector('.article-container')) {
            terminalLines = [
                "> OPENING_FILE...",
                "MODE: READER_VIEW",
                "STATUS: ENGAGED"
            ];
        }

        let lineIndex = 0;
        let charIndex = 0;

        // Clear content initially to prevent FOUC
        DOM.heroTerminal.textContent = '';

        function typeWriter() {
            if (lineIndex < terminalLines.length) {
                const currentLine = terminalLines[lineIndex];

                if (charIndex < currentLine.length) {
                    // If starting a new line (except the first), add a break
                    if (charIndex === 0 && lineIndex > 0) {
                        DOM.heroTerminal.appendChild(document.createElement("br"));
                    }

                    // Append character
                    DOM.heroTerminal.innerHTML += currentLine.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 50); // Typing speed
                } else {
                    // End of line reached
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeWriter, 400); // Pause between lines
                }
            }
        }

        // Start typing after short delay
        setTimeout(typeWriter, 500);
    }

    // --- 2. Optimized Scroll & Navigation Logic ---

    // Cache tracked sections and their data
    let cachedSections = null;
    let cachedIndicators = null;

    function getTrackedSections() {
        // Return cached sections if available
        if (cachedSections) return cachedSections;

        // Query '.stack-card' to ensure we get sections in DOM order
        const allSections = Array.from(document.querySelectorAll('.stack-card'));

        // Filter out any sections that don't have an ID (nav relies on IDs)
        cachedSections = allSections.filter(section => section.id);

        return cachedSections;
    }

    function generateScrollIndicators() {
        if (!DOM.quickScrollNav) return;

        const sections = getTrackedSections();

        // FIX: If no trackable sections (e.g., Blog/Article pages), hide the container to prevent layout gaps
        if (sections.length === 0) {
            const container = DOM.quickScrollNav.closest('aside');
            if (container) container.style.display = 'none';
            return;
        } else {
            const container = DOM.quickScrollNav.closest('aside');
            // Restore display if it was hidden (and we have sections)
            if (container) container.style.display = '';
        }

        DOM.quickScrollNav.innerHTML = '';
        const fragment = document.createDocumentFragment();

        // Icon mapping for sections (Expanded for Contact/Blog pages)
        const iconMap = {
            'hero': 'fa-brands fa-hackerrank',
            'system': 'fa-solid fa-microchip',
            'stack': 'fa-solid fa-server',
            'projects': 'fa-solid fa-code',
            'experience': 'fa-solid fa-briefcase',
            'education': 'fa-solid fa-graduation-cap',
            'repository': 'fa-solid fa-folder-open',
            'references': 'fa-solid fa-user-check',
            'cta': 'fa-solid fa-terminal',
            'profile': 'fa-solid fa-user-astronaut',
            'sandbox': 'fa-solid fa-flask',
            'blog': 'fa-solid fa-rss',
            'footer': 'fa-solid fa-paper-plane',
            // Contact Page Mappings
            'comm-channels': 'fa-solid fa-satellite-dish',
            'transmission': 'fa-solid fa-tower-broadcast',
            'geolocation': 'fa-solid fa-map-location-dot',
            // Blog Page Mappings
            'blog-intro': 'fa-solid fa-newspaper',
            'featured-post': 'fa-solid fa-star',
            'content-stream': 'fa-solid fa-layer-group'
        };

        sections.forEach((section) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.setAttribute('data-target', section.id);

            // Determine icon (fallback to circle-nodes if not defined)
            const iconClass = iconMap[section.id] || 'fa-solid fa-circle-nodes';
            // Determine label (use data-title if available, else ID)
            const label = section.getAttribute('data-title') || section.id.toUpperCase();

            indicator.innerHTML = `
                <div class="nav-label">${label}</div>
                <div class="icon-box"><i class="${iconClass}"></i></div>
            `;

            // Store reference for quick access later
            indicator._targetSection = section;

            fragment.appendChild(indicator);
        });

        DOM.quickScrollNav.appendChild(fragment);

        // Cache indicators after creation
        cachedIndicators = Array.from(DOM.quickScrollNav.querySelectorAll('.scroll-indicator'));

        // Use event delegation for click handlers (more efficient)
        DOM.quickScrollNav.addEventListener('click', (e) => {
            const indicator = e.target.closest('.scroll-indicator');
            if (indicator && indicator._targetSection) {
                indicator._targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Optimized active indicator update using RAF
    const updateActiveIndicator = rafThrottle(() => {
        if (!DOM.quickScrollNav || !cachedSections || !cachedIndicators || cachedSections.length === 0) return;

        const triggerPoint = window.innerHeight / 3;
        let currentId = '';
        let activeIndex = 0;

        // Single loop to find active section
        // Since cachedSections is now in DOM order, this logic will correctly identify
        // the last section that has its top passed the trigger point.
        for (let i = 0; i < cachedSections.length; i++) {
            const rect = cachedSections[i].getBoundingClientRect();
            if (rect.top <= triggerPoint) {
                currentId = cachedSections[i].id;
                activeIndex = i;
            }
        }

        // Batch DOM updates
        for (let i = 0; i < cachedIndicators.length; i++) {
            const indicator = cachedIndicators[i];
            const isActive = indicator.getAttribute('data-target') === currentId;
            indicator.classList.toggle('active', isActive);

            // Visibility Logic: Show only 5 items (2 before, active, 2 after) if total > 5
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

    // Optimized header scroll handler using RAF
    const handleHeaderScroll = rafThrottle(() => {
        const scrollTop = window.scrollY || (DOM.stackContainer ? DOM.stackContainer.scrollTop : 0);

        if (DOM.header) {
            const shouldScroll = scrollTop > 50;
            DOM.header.classList.toggle('header-scrolled', shouldScroll);
        }
    });

    // Combined scroll handler (more efficient)
    const handleScroll = rafThrottle(() => {
        handleHeaderScroll();
        updateActiveIndicator();
    });

    // Attach optimized scroll listeners
    const scrollListenerTarget = DOM.stackContainer || window;
    scrollListenerTarget.addEventListener('scroll', handleScroll, { passive: true });

    if (scrollListenerTarget !== window) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Initial calls
    generateScrollIndicators();
    updateActiveIndicator();

    // Smooth scroll using event delegation (more efficient than individual listeners)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // --- 3. Lightbox Logic (System Architecture) ---
    if (DOM.techModal) {
        const techTitle = DOM.techModal.querySelector('#modalTitle');
        const techDesc = DOM.techModal.querySelector('#modalDesc');
        const techClose = DOM.techModal.querySelector('#closeModalBtn');

        // Use event delegation instead of individual listeners
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.process-card[data-layman-title]');
            if (card) {
                if (techTitle) techTitle.textContent = card.getAttribute('data-layman-title');
                if (techDesc) techDesc.textContent = card.getAttribute('data-layman-desc');
                DOM.techModal.classList.add('active');
            }
        });

        const closeTechModal = () => DOM.techModal.classList.remove('active');

        if (techClose) techClose.addEventListener('click', closeTechModal);

        DOM.techModal.addEventListener('click', (e) => {
            if (e.target === DOM.techModal) closeTechModal();
        });
    }

    // --- 4. Project Section Logic ---
    const runBtn = document.getElementById('runProjectsBtn');
    const projectPrompt = document.getElementById('projectPrompt');
    const codeStream = document.getElementById('codeStream');
    const progressBar = document.getElementById('progressBar');

    // Data Store (Centralized)
    const projects = [
        {
            id: 1,
            title: "BNOP_MEDIA_V2",
            subtitle: "Mock-up Rebuild (Wix/Velo)",
            desc: "A high-fidelity rebuild of the original ASP.NET architecture. Features complex behaviors, custom navigation logic, and a refined design system for media consumption.",
            tags: ["WIX_VELO", "JAVASCRIPT", "UI_UX", "MEDIA_ARCH"],
            docs: "This project serves as a testament to design adaptability. While the backend logic was simplified for this deployment, the frontend interactions emulate the original .NET Core behavior using Velo APIs. <br><br> CHALLENGE: Maintaining 60fps animations on a heavy media site. <br> SOLUTION: Optimized asset loading and custom viewport triggers.",
            link: "https://bnop-media-1.onrender.com/",
            status: "DEPLOYED"
        }
    ];

    if (runBtn) {
        runBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (projectPrompt) projectPrompt.classList.add('d-none');
            if (DOM.projectLoader) DOM.projectLoader.classList.remove('d-none');
            if (codeStream) codeStream.textContent = '';

            // Optimized code stream simulation
            const lines = [
                '> INITIALIZING PROJECT LOADER...',
                '> CONNECTING TO REMOTE REPOSITORY...',
                '> FETCHING PROJECT METADATA...',
                '> [✓] AUTHENTICATION VERIFIED',
                '> PARSING PROJECT FILES...',
                '> COMPILING ASSETS...',
                '> [✓] COMPILATION SUCCESSFUL',
                '> RENDERING PROJECT GRID...',
                '> [✓] READY FOR DISPLAY'
            ];

            let lineIndex = 0;
            const maxLines = lines.length;

            // Use RAF for smoother animation
            let lastTime = 0;
            const interval = 80;

            function animateStream(currentTime) {
                if (currentTime - lastTime >= interval) {
                    if (lineIndex < maxLines && codeStream) {
                        codeStream.textContent += lines[lineIndex] + '\n';
                        lineIndex++;

                        const percent = Math.round((lineIndex / maxLines) * 100);
                        const percentEl = document.getElementById('loadPercent');
                        if (percentEl) percentEl.textContent = percent + '%';
                        if (progressBar) progressBar.style.width = percent + '%';

                        lastTime = currentTime;
                    }

                    if (lineIndex < maxLines) {
                        requestAnimationFrame(animateStream);
                    } else {
                        setTimeout(finishLoading, 300);
                    }
                } else {
                    requestAnimationFrame(animateStream);
                }
            }

            requestAnimationFrame(animateStream);
        });
    }

    function finishLoading() {
        if (DOM.projectLoader) DOM.projectLoader.classList.add('d-none');
        if (DOM.projectGridContainer) DOM.projectGridContainer.classList.remove('d-none');
        renderProjects(1);
    }

    function renderProjects(page) {
        if (!DOM.projectGrid) return;

        const perPage = 4;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const pageItems = projects.slice(start, end);

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        pageItems.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'process-card project-card-trigger';
            card.setAttribute('data-project-id', proj.id);
            card.innerHTML = `
                <div class="card-header-line">
                    <span class="pid">ID: 00${proj.id}</span>
                    <span class="status text-info">READY</span>
                </div>
                <div class="card-body-content">
                    <h4 class="tech-name">${proj.title}</h4>
                    <p class="tech-desc">${proj.subtitle}</p>
                    <small class="uptime-text">CLICK_TO_EXPAND >></small>
                </div>
            `;
            fragment.appendChild(card);
        });

        DOM.projectGrid.innerHTML = '';
        DOM.projectGrid.appendChild(fragment);

        const indicator = document.getElementById('pageIndicator');
        if (indicator) {
            indicator.textContent = `PAGE ${page} / ${Math.ceil(projects.length / perPage) || 1}`;
        }
    }

    // --- 5. Project Lightbox Logic (Event Delegation) ---
    let currentProjIndex = 0;

    // Use event delegation for project cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card-trigger');
        if (card) {
            const projectId = parseInt(card.getAttribute('data-project-id'));
            const proj = projects.find(p => p.id === projectId);
            if (proj) openProjectModal(proj);
        }
    });

    function openProjectModal(proj) {
        if (!DOM.projModal) return;
        currentProjIndex = projects.findIndex(p => p.id === proj.id);
        updateModalContent(proj);
        DOM.projModal.classList.add('active');
    }

    function updateModalContent(proj) {
        const headerEl = document.getElementById('projModalHeader');
        const titleEl = document.getElementById('projTitle');
        const descEl = document.getElementById('projDesc');
        const docsEl = document.getElementById('projDocs');
        const tagsContainer = document.getElementById('projTags');
        const visitBtn = document.getElementById('visitSiteBtn');
        const wakeMsg = document.getElementById('serverWakeMsg');

        if (headerEl) headerEl.textContent = `> ${proj.title}.EXE`;
        if (titleEl) titleEl.textContent = proj.title;
        if (descEl) descEl.textContent = proj.desc;
        if (docsEl) docsEl.innerHTML = proj.docs;

        if (tagsContainer) {
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            proj.tags.forEach(tag => {
                const t = document.createElement('span');
                t.className = 'tech-tag';
                t.textContent = tag;
                fragment.appendChild(t);
            });
            tagsContainer.innerHTML = '';
            tagsContainer.appendChild(fragment);
        }

        if (visitBtn) {
            visitBtn.textContent = "[ INITIATE CONNECTION ]";
            visitBtn.disabled = false;
            if (wakeMsg) wakeMsg.classList.add('d-none');

            // Better way to replace event listener
            const newBtn = visitBtn.cloneNode(true);
            visitBtn.parentNode.replaceChild(newBtn, visitBtn);

            newBtn.addEventListener('click', () => {
                if (proj.link.includes("render.com")) {
                    newBtn.textContent = "ESTABLISHING UPLINK...";
                    newBtn.disabled = true;
                    if (wakeMsg) wakeMsg.classList.remove('d-none');

                    setTimeout(() => {
                        window.open(proj.link, '_blank');
                        newBtn.textContent = "[ CONNECTION ESTABLISHED ]";
                        newBtn.disabled = false;
                        if (wakeMsg) wakeMsg.classList.add('d-none');
                    }, 2000);
                } else {
                    window.open(proj.link, '_blank');
                }
            });
        }
    }

    // Modal Navigation
    const prevBtn = document.getElementById('modalPrevProj');
    const nextBtn = document.getElementById('modalNextProj');
    const closeProjBtn = document.getElementById('closeProjModalBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentProjIndex > 0) {
                currentProjIndex--;
                updateModalContent(projects[currentProjIndex]);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentProjIndex < projects.length - 1) {
                currentProjIndex++;
                updateModalContent(projects[currentProjIndex]);
            }
        });
    }

    const closeProjModal = () => { if (DOM.projModal) DOM.projModal.classList.remove('active'); };

    if (closeProjBtn) closeProjBtn.addEventListener('click', closeProjModal);

    if (DOM.projModal) {
        DOM.projModal.addEventListener('click', (e) => {
            if (e.target === DOM.projModal) closeProjModal();
        });
    }

    // --- 6. Optimized Grid Parallax ---
    let isDesktop = window.innerWidth > 768;

    const handleMouseMove = throttle((e) => {
        if (!isDesktop || !DOM.gridContainer) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;

        // Use transform for GPU acceleration
        DOM.gridContainer.style.transform = `perspective(100rem) rotateX(${moveY * 0.05}deg) rotateY(${moveX * 0.05}deg)`;
    }, 16); // ~60fps

    if (DOM.gridContainer) {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Debounced resize handler
    const handleResize = debounce(() => {
        isDesktop = window.innerWidth > 768;
        if (!isDesktop && DOM.gridContainer) {
            DOM.gridContainer.style.transform = '';
        }
    }, 250);

    window.addEventListener('resize', handleResize, { passive: true });

    // --- 7. Mobile Sidebar Logic ---
    function toggleSidebar() {
        if (DOM.sidebar) {
            DOM.sidebar.classList.toggle('open');
        }
    }

    if (DOM.trigger) DOM.trigger.addEventListener('click', toggleSidebar);
    if (DOM.closeBtn) DOM.closeBtn.addEventListener('click', toggleSidebar);

    // Optimized outside click detection
    document.addEventListener('click', (e) => {
        if (DOM.sidebar &&
            DOM.sidebar.classList.contains('open') &&
            !DOM.sidebar.contains(e.target) &&
            e.target !== DOM.trigger &&
            !DOM.trigger.contains(e.target)) {
            DOM.sidebar.classList.remove('open');
        }
    });
});