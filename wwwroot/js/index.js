document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. DATA SOURCES
    // ==========================================================================

    // Section 2 Data (System Stats)
    const STAT_LOGS = {
        'exp': {
            title: 'YEARS_OF_EXPERIENCE.LOG',
            description: 'Focused exclusively on full-stack .NET development. Specialized in enterprise-grade architecture, microservices, and scalable web solutions since 2023.',
            details: '<strong>KEY MILESTONES:</strong><br>- Started professional dev journey in 2023.<br>- Deployed 3 major production applications.<br>- Focus: ASP.NET Core, Entity Framework, Clean Architecture.'
        },
        'langs': {
            title: 'SKILL_MATRIX.JSON',
            description: 'Maintains a polyglot approach with a heavy emphasis on the .NET ecosystem, complemented by modern frontend frameworks and robust database management.',
            details: '<strong>CORE STACK:</strong><br>- Backend: C# (.NET 8), Python.<br>- Frontend: JavaScript (ES6+), Razor Pages, React.<br>- Data: MSSQL, PostgreSQL, Redis.<br>- DevOps: Docker, Git, Azure.'
        },
        'clients': {
            title: 'CLIENT_ROSTER.DB',
            description: 'Delivering custom digital solutions for diverse clients including high-traffic media platforms and business automation systems.',
            details: '<strong>NOTABLE DELIVERY:</strong><br>- BNOP Media: High-performance media streaming platform.<br>- Focus: Deliverable ROI, latency reduction, and UX optimization.'
        },
        'seo': {
            title: 'GROWTH_METRICS.ANALYTICS',
            description: 'Implemented technical SEO strategies including Server-Side Rendering (SSR), semantic HTML5, and automated sitemap generation to drive organic growth.',
            details: '<strong>CASE STUDY: BNOP MEDIA</strong><br>- Result: 217% increase in organic search impressions.<br>- Timeframe: 3 Months.<br>- Method: Core Web Vitals optimization & structured data.'
        },
        'uptime': {
            title: 'SYSTEM_HEALTH.STATUS',
            description: 'Maintains 100% availability for deployed applications through rigorous testing, stateless service architecture, and cloud-native resilience.',
            details: '<strong>INFRASTRUCTURE:</strong><br>- Hosting: Azure App Service / Render / Railway.<br>- CDN: Cloudflare.<br>- Monitoring: Application Insights.<br>- Downtime: 0% unplanned.'
        }
    };

    // Section 3 Data (Tech Stack)
    const STACK_DATA = {
        'backend': {
            title: './BACKEND_ARCH.EXE',
            description: 'Executing server-side logic...',
            details: '[OK] ASP.NET 8 MVC Loaded<br>[OK] .NET Core Services Active<br>[OK] Entity Framework Core Initialized<br>[OK] C# Advanced Patterns Ready<br><br>> ARCHITECTURE_CHECK:<br>  - Dependency Injection: ENABLED<br>  - Repository Pattern: ENABLED<br>  - CQRS: ACTIVE'
        },
        'frontend': {
            title: './UI_INTERFACE.EXE',
            description: 'Rendering frontend modules...',
            details: '[OK] JavaScript (ES6+) Engine Running<br>[OK] TypeScript Compiler Ready<br>[OK] Semantic HTML5 Parsed<br>[OK] CSS3 Animation Subsystem Online<br><br>> LIBRARIES_LOADED:<br>  - Bootstrap 5<br>  - Tailwind CSS<br>  - React.js Components'
        },
        'database': {
            title: './DATA_CORE.SQL',
            description: 'Connecting to data persistence layer...',
            details: '[OK] SQL Server Connection Established<br>[OK] T-SQL Stored Procedures Verified<br>[OK] Normalization Check: PASSED<br><br>> STORAGE_SYSTEMS:<br>  - MSSQL Primary<br>  - PostgreSQL Secondary<br>  - Redis Cache: WARM'
        },
        'cloud': {
            title: './CLOUD_INFRA.AWS',
            description: 'Initializing cloud services...',
            details: '[OK] AWS EC2 Instances: RUNNING<br>[OK] S3 Buckets: MOUNTED<br>[OK] RDS Connectivity: STABLE<br>[OK] Lambda Functions: DEPLOYED<br><br>> SECURITY_AUDIT:<br>  - IAM Policies: ENFORCED<br>  - API Gateway: SECURE'
        },
        'tools': {
            title: './DEV_TOOLS.BIN',
            description: 'Loading developer toolchain...',
            details: '[OK] Git Version Control: SYNCED<br>[OK] GitHub Repository: CONNECTED<br>[OK] VS Code Environment: READY<br><br>> WORKFLOW_STATUS:<br>  - Agile/Scrum: IN_PROGRESS<br>  - Docker Containers: SPUN_UP'
        },
        'specs': {
            title: './SPECIAL_OPS.SYS',
            description: 'Running advanced diagnostics...',
            details: '[OK] Technical SEO Protocols: ACTIVE<br>[OK] SSR Rendering: ENABLED<br>[OK] Structured Data: VALIDATED<br><br>> PERFORMANCE_METRICS:<br>  - Core Web Vitals: OPTIMIZED<br>  - System Architecture: SCALABLE'
        }
    };

    // ==========================================================================
    // 2. SHARED SERVICES
    // ==========================================================================

    const AnimationService = {
        animateValue: (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = Math.floor(easeProgress * (end - start) + start);

                element.textContent = currentVal;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    element.textContent = end;
                }
            };
            window.requestAnimationFrame(step);
        },

        animateWidth: (element, targetWidth) => {
            setTimeout(() => {
                element.style.width = targetWidth;
            }, 100);
        }
    };

    const ModalService = (() => {
        const modal = document.getElementById('statsModal');
        const modalTitle = document.getElementById('statModalTitle');
        const modalDesc = document.getElementById('statDescription');
        const modalDetails = document.getElementById('statDetails');
        const modalTimestamp = document.getElementById('statTimestamp');
        const closeModalBtn = document.getElementById('closeStatModal');
        const actionBtn = document.getElementById('modalActionBtn');
        let currentTimeout = null;

        const open = (data, mode = 'default') => {
            if (!modal || !data) return;

            // 1. Reset
            clearTimeout(currentTimeout);
            modal.classList.remove('terminal-mode');
            if (modalDesc) modalDesc.innerHTML = '';
            if (modalDetails) modalDetails.innerHTML = '';

            // 2. Setup based on mode
            if (mode === 'terminal') {
                setupTerminalMode(data);
            } else {
                setupDefaultMode(data);
            }

            // 3. Timestamp
            if (modalTimestamp) {
                const now = new Date();
                modalTimestamp.textContent = `LOG: ${now.toISOString().split('T')[0]} // ${now.toLocaleTimeString()}`;
            }

            modal.classList.add('active');
        };

        const setupDefaultMode = (data) => {
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalDesc) modalDesc.textContent = data.description;
            if (modalDetails) modalDetails.innerHTML = data.details;
        };

        const setupTerminalMode = (data) => {
            modal.classList.add('terminal-mode');
            if (modalTitle) modalTitle.textContent = data.title;

            // Animated Console Output
            const descLines = [data.description];
            const detailLines = data.details.split('<br>');
            const allLines = [...descLines, '', ...detailLines]; // Add gap

            let lineIndex = 0;
            const printLine = () => {
                if (lineIndex < allLines.length) {
                    const lineContent = allLines[lineIndex];

                    if (lineContent === '') {
                        // Empty line spacer
                        const br = document.createElement('br');
                        if (modalDetails) modalDetails.appendChild(br);
                    } else {
                        const p = document.createElement('div');
                        p.className = 'console-line';
                        p.innerHTML = lineContent;

                        if (modalDetails) {
                            modalDetails.appendChild(p);
                            // Trigger reflow/animation
                            setTimeout(() => p.classList.add('visible'), 10);
                        }
                    }

                    lineIndex++;
                    // Speed of typing new lines
                    currentTimeout = setTimeout(printLine, 150);
                } else {
                    // Add cursor at the end
                    const cursor = document.createElement('span');
                    cursor.className = 'console-cursor';
                    if (modalDetails) modalDetails.appendChild(cursor);
                }
            };

            printLine();
        };

        const close = () => {
            if (modal) modal.classList.remove('active');
            clearTimeout(currentTimeout);
        };

        const init = () => {
            if (!modal) return;
            if (closeModalBtn) closeModalBtn.addEventListener('click', close);
            if (actionBtn) actionBtn.addEventListener('click', close);
            modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        };

        return { init, open };
    })();

    ModalService.init();

    // ==========================================================================
    // 3. CONTROLLERS
    // ==========================================================================

    // --- Section 2: Stats ---
    const StatsController = (() => {
        const statsSection = document.querySelector('.system-stats-wrapper');
        const counters = document.querySelectorAll('.counter');
        const progressBars = document.querySelectorAll('.progress-bar');
        const statCards = document.querySelectorAll('.stat-card');
        let hasAnimated = false;

        const init = () => {
            if (statsSection) {
                setupObserver();
                setupInteractions();
            }
        };

        const setupObserver = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        runAnimations();
                        hasAnimated = true;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(statsSection);
        };

        const runAnimations = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                AnimationService.animateValue(counter, 0, target, 2000);
            });
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                AnimationService.animateWidth(bar, width);
            });
        };

        const setupInteractions = () => {
            statCards.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-stat-id');
                    const data = STAT_LOGS[id];
                    if (data) ModalService.open(data, 'default');
                });
            });
        };

        return { init };
    })();

    // --- Section 3: Tech Stack ---
    const StackController = (() => {
        const nodes = document.querySelectorAll('.tech-node');

        const init = () => {
            if (nodes.length > 0) setupInteractions();
        };

        const setupInteractions = () => {
            nodes.forEach(node => {
                node.addEventListener('click', () => {
                    const id = node.getAttribute('data-stack-id');
                    const data = STACK_DATA[id];
                    if (data) ModalService.open(data, 'terminal');
                });
            });
        };

        return { init };
    })();

    // --- Section 4: Projects (Matrix Loader) ---
    const ProjectsController = (() => {
        const overlay = document.getElementById('matrixOverlay');
        const canvas = document.getElementById('matrixCanvas');
        const loaderText = document.getElementById('loaderText');
        const loaderBar = document.getElementById('loaderBar');
        const loaderPercent = document.getElementById('loaderPercent');
        const links = document.querySelectorAll('.matrix-link');

        let ctx = null;
        let animationFrame = null;
        let drops = [];
        const fontSize = 14;

        const init = () => {
            if (links.length > 0 && overlay && canvas) {
                ctx = canvas.getContext('2d');
                setupInteractions();
                // Resize listener
                window.addEventListener('resize', () => {
                    if (overlay.classList.contains('active')) resizeCanvas();
                });
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reset drops
            const columns = canvas.width / fontSize;
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
        };

        const startMatrixRain = () => {
            resizeCanvas();

            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

            const draw = () => {
                // Semi-transparent black to create trail effect
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "#0F0"; // Green text
                ctx.font = fontSize + "px monospace";

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }

                animationFrame = requestAnimationFrame(draw);
            };

            draw();
        };

        const stopMatrixRain = () => {
            cancelAnimationFrame(animationFrame);
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const startLoadingSequence = (url) => {
            overlay.classList.add('active');
            startMatrixRain();

            // Random duration between 3 and 5 seconds
            const duration = Math.floor(Math.random() * 2000) + 3000;
            const startTime = Date.now();

            // Console text steps
            const steps = [
                "ESTABLISHING_SECURE_UPLINK...",
                "BYPASSING_FIREWALL...",
                "HANDSHAKE_INITIATED...",
                "DECRYPTING_PACKETS...",
                "ACCESS_GRANTED."
            ];

            const updateLoop = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Update Progress Bar
                loaderBar.style.width = `${progress * 100}%`;
                loaderPercent.textContent = `${Math.floor(progress * 100)}%`;

                // Update Text based on progress chunk
                const stepIndex = Math.floor(progress * (steps.length - 0.1));
                loaderText.textContent = steps[stepIndex];

                if (progress < 1) {
                    requestAnimationFrame(updateLoop);
                } else {
                    // Finished
                    setTimeout(() => {
                        window.open(url, '_blank');
                        stopMatrixRain();
                        overlay.classList.remove('active');
                        // Reset width for next time
                        loaderBar.style.width = '0%';
                    }, 200);
                }
            };

            updateLoop();
        };

        const setupInteractions = () => {
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = link.getAttribute('href');
                    startLoadingSequence(url);
                });
            });
        };

        return { init };
    })();

    // --- Section 5: Experience Timeline ---
    const ExperienceController = (() => {
        const items = document.querySelectorAll('.timeline-item');

        const init = () => {
            if (items.length > 0) setupEvents();
        };

        const setupEvents = () => {
            items.forEach(item => {
                item.addEventListener('click', () => {
                    // Toggle active class
                    // Optionally close others: items.forEach(i => i.classList.remove('active'));
                    item.classList.toggle('active');

                    // Update hint text
                    const hint = item.querySelector('.expand-hint');
                    if (hint) {
                        hint.textContent = item.classList.contains('active')
                            ? '[ CLICK_TO_COLLAPSE ]'
                            : '[ CLICK_TO_EXPAND ]';
                    }
                });
            });
        };

        return { init };
    })();

    // --- Section 9: CTA Interaction ---
    const ContactController = (() => {
        const btn = document.getElementById('initContactBtn');
        const body = document.querySelector('body');

        const init = () => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    // Optional: Add sound effect or visual flash
                    body.style.filter = 'invert(1)';
                    setTimeout(() => {
                        body.style.filter = 'invert(0)';
                    }, 100);
                });
            }
        };

        return { init };
    })();

    // Initialize All
    StatsController.init();
    StackController.init();
    ProjectsController.init();
    ExperienceController.init();
    ContactController.init();
});