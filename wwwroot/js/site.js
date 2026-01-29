document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const stackContainer = document.querySelector('.stack-container'); // Or document.body / window if main scroll is there
    const header = document.querySelector('.dynamic-header');
    const quickScrollNav = document.getElementById('quickScrollNav');

    // --- 1. System Time Logic (Lusaka) ---
    function updateTime() {
        const timeDisplay = document.getElementById('lusakaTime');
        const mobileTimeDisplay = document.getElementById('lusakaTimeMobile');

        const now = new Date();
        const options = {
            timeZone: 'Africa/Lusaka',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);

        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
        if (mobileTimeDisplay) {
            mobileTimeDisplay.textContent = timeString;
        }
    }
    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // --- 2. Scroll & Navigation Logic ---

    // Helper: Identify all main sections for tracking
    function getTrackedSections() {
        // Explicitly list the IDs we care about in order
        const ids = ['hero', 'stack', 'projects', 'profile', 'sandbox', 'blog', 'footer'];
        const sections = [];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) sections.push(el);
        });

        // Fallback: If explicit IDs aren't found, query generic sections
        if (sections.length === 0) {
            return Array.from(document.querySelectorAll('section[id]'));
        }
        return sections;
    }

    // Generate Side Navigation Dots
    function generateScrollIndicators() {
        if (!quickScrollNav) return;

        quickScrollNav.innerHTML = '';
        const sections = getTrackedSections();

        sections.forEach((section, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.setAttribute('data-target', section.id);
            // Format number: 01, 02, etc.
            const num = String(index + 1).padStart(2, '0');
            indicator.innerHTML = `<span>${num}</span>`;

            // Add click listener directly here
            indicator.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            quickScrollNav.appendChild(indicator);
        });
    }

    // Active State Updater
    function updateActiveIndicator() {
        if (!quickScrollNav) return;

        const sections = getTrackedSections();
        const indicators = document.querySelectorAll('.scroll-indicator');

        // Trigger point: 1/3 down the viewport
        const triggerPoint = window.innerHeight / 3;
        let currentId = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If the top of the section is above the trigger point, it's the current "active" one
            // We loop through all; the last one that satisfies this condition is the winner.
            if (rect.top <= triggerPoint) {
                currentId = section.id;
            }
        });

        // Update classes
        indicators.forEach(ind => {
            ind.classList.remove('active');
            if (ind.getAttribute('data-target') === currentId) {
                ind.classList.add('active');
            }
        });
    }

    // Header styling on scroll
    function handleHeaderScroll() {
        // Determine scroll position based on where the scrolling happens (window or container)
        // Adjust 'window.scrollY' if you are using a specific overflow container
        const scrollTop = window.scrollY || (stackContainer ? stackContainer.scrollTop : 0);

        if (header) {
            if (scrollTop > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    }

    // Listeners - FIXED: Now listening to stackContainer
    const scrollListenerTarget = stackContainer || window;

    scrollListenerTarget.addEventListener('scroll', () => {
        handleHeaderScroll();
        updateActiveIndicator();
    }, { passive: true });

    // Also listen to window for good measure (e.g. mobile layout changes)
    if (scrollListenerTarget !== window) {
        window.addEventListener('scroll', () => {
            handleHeaderScroll();
            updateActiveIndicator();
        }, { passive: true });
    }

    // Initial call
    generateScrollIndicators();
    updateActiveIndicator();

    // Smooth Scroll for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- 3. Lightbox Logic (System Architecture) ---
    const techModal = document.getElementById('techModal');
    if (techModal) {
        const techTitle = techModal.querySelector('#modalTitle');
        const techDesc = techModal.querySelector('#modalDesc');
        const techClose = techModal.querySelector('#closeModalBtn');
        const processCards = document.querySelectorAll('.process-card[data-layman-title]');

        // Open Modal
        processCards.forEach(card => {
            card.addEventListener('click', () => {
                if (techTitle) techTitle.textContent = card.getAttribute('data-layman-title');
                if (techDesc) techDesc.textContent = card.getAttribute('data-layman-desc');
                techModal.classList.add('active');
            });
        });

        // Close Modal Helper
        const closeTechModal = () => techModal.classList.remove('active');

        if (techClose) techClose.addEventListener('click', closeTechModal);

        // Close on click outside
        techModal.addEventListener('click', (e) => {
            if (e.target === techModal) closeTechModal();
        });
    }

    // --- 4. Project Section Logic ---
    const runBtn = document.getElementById('runProjectsBtn');
    const projectPrompt = document.getElementById('projectPrompt');
    const projectLoader = document.getElementById('projectLoader');
    const codeStream = document.getElementById('codeStream');
    const projectGridContainer = document.getElementById('projectGridContainer');
    const projectGrid = document.getElementById('projectGrid');
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
            e.preventDefault(); // Prevent jump if it's in a form or link

            // 1. Hide Prompt
            if (projectPrompt) projectPrompt.classList.add('d-none');
            // 2. Show Loader
            if (projectLoader) projectLoader.classList.remove('d-none');

            // 3. Run Code Stream Animation
            let lines = 0;
            const maxLines = 15; // Shorter for better UX
            const interval = setInterval(() => {
                if (!codeStream) {
                    clearInterval(interval);
                    return;
                }

                const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
                const operations = ['LOAD_MODULE', 'DECRYPT_SECTOR', 'INIT_PROCESS', 'VERIFY_HASH', 'MOUNT_VOLUME'];
                const op = operations[Math.floor(Math.random() * operations.length)];
                const codeLine = `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${op}_0x${randomHex} ...OK`;

                const lineDiv = document.createElement('div');
                lineDiv.textContent = codeLine;
                codeStream.appendChild(lineDiv);
                codeStream.scrollTop = codeStream.scrollHeight;
                lines++;

                // Update Progress Bar
                const percent = Math.floor((lines / maxLines) * 100);
                if (document.getElementById('loadPercent')) {
                    document.getElementById('loadPercent').textContent = percent + '%';
                }
                if (progressBar) {
                    progressBar.style.width = percent + '%';
                }

                if (lines >= maxLines) {
                    clearInterval(interval);
                    setTimeout(finishLoading, 300);
                }
            }, 80); // Faster speed
        });
    }

    function finishLoading() {
        if (projectLoader) projectLoader.classList.add('d-none');
        if (projectGridContainer) projectGridContainer.classList.remove('d-none');
        renderProjects(1);
    }

    function renderProjects(page) {
        if (!projectGrid) return;
        projectGrid.innerHTML = '';
        const perPage = 4;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const pageItems = projects.slice(start, end);

        pageItems.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'process-card project-card-trigger';
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
            card.addEventListener('click', () => openProjectModal(proj));
            projectGrid.appendChild(card);
        });

        const indicator = document.getElementById('pageIndicator');
        if (indicator) {
            indicator.textContent = `PAGE ${page} / ${Math.ceil(projects.length / perPage) || 1}`;
        }
    }

    // --- 5. Project Lightbox Logic ---
    const projModal = document.getElementById('projectModal');
    let currentProjIndex = 0;

    function openProjectModal(proj) {
        if (!projModal) return;
        currentProjIndex = projects.findIndex(p => p.id === proj.id);
        updateModalContent(proj);
        projModal.classList.add('active');
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
            tagsContainer.innerHTML = '';
            proj.tags.forEach(tag => {
                const t = document.createElement('span');
                t.className = 'tech-tag';
                t.textContent = tag;
                tagsContainer.appendChild(t);
            });
        }

        if (visitBtn) {
            visitBtn.textContent = "[ INITIATE CONNECTION ]";
            visitBtn.disabled = false;
            if (wakeMsg) wakeMsg.classList.add('d-none');

            // Clone to remove old listeners
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

    const closeProjModal = () => { if (projModal) projModal.classList.remove('active'); };

    if (closeProjBtn) closeProjBtn.addEventListener('click', closeProjModal);

    if (projModal) {
        projModal.addEventListener('click', (e) => {
            if (e.target === projModal) closeProjModal();
        });
    }

    // --- 6. Grid Parallax (Mobile Optimized) ---
    // Only enable heavy mouse listeners on desktop to save mobile battery/CPU
    const gridContainer = document.querySelector('.grid-bg-container');
    let isDesktop = window.innerWidth > 768;

    function handleMouseMove(e) {
        if (!isDesktop || !gridContainer) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Subtle parallax effect on the container
        const moveX = (x - 0.5) * 20; // -10 to 10deg
        const moveY = (y - 0.5) * 20;

        gridContainer.style.transform = `perspective(100rem) rotateX(${moveY * 0.05}deg) rotateY(${moveX * 0.05}deg)`;
    }

    // Attach listener only if potentially needed
    if (gridContainer) {
        document.addEventListener('mousemove', handleMouseMove);
    }

    // Resize Observer to toggle 'isDesktop' flag
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
        // Reset transform if switching to mobile to ensure clean state
        if (!isDesktop && gridContainer) {
            gridContainer.style.transform = '';
        }
    });

    // --- 7. Mobile Sidebar Logic ---
    const sidebar = document.getElementById('mobileSysSidebar');
    const trigger = document.getElementById('sysSidebarTrigger');
    const closeBtn = document.getElementById('sysSidebarClose');

    function toggleSidebar() {
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }

    if (trigger) trigger.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside on the backdrop
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            e.target !== trigger &&
            !trigger.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
});