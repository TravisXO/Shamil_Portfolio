// --- blog.js : Knowledge Base Logic ---

const blogData = [
    {
        id: 1,
        title: "The Era of Agentic Development",
        date: "2026-01-13",
        category: "engineering",
        ext: "dev",
        icon: "fa-code",
        colorClass: "color-dev",
        desc: "Agentic workflows, autonomous refactoring, and the shift from coder to System Architect.",
        content: `The landscape of software engineering in 2026 has shifted from simple code completion to Agentic Workflows. We are no longer just writing syntax; we are orchestrating autonomous agents that can refactor entire repositories, manage CI/CD pipelines, and perform real-time security audits. This shift means the modern engineer acts more like a System Architect than a traditional coder, focusing on high-level logic and intent while the agents handle the boilerplate "grunt work."

In this environment, the value of a developer is measured by their ability to provide precise context and constraints. As tools like GitHub Copilot Workspace evolve into fully autonomous environments, the gap between a "junior" and a "senior" is now defined by architectural foresight. Understanding how to structure a system so an AI can effectively maintain it has become the most critical skill in a 2026 developer’s toolkit.

This transition hasn't replaced the need for core logic; it has amplified it. For engineers working in C# and .NET, the integration of AI-native debugging tools means we can catch memory leaks and threading issues before a single line of code is deployed. It is a period of high-velocity deployment where the focus remains on building robust, scalable infrastructure that can withstand the demands of a globalized digital economy.`
    },
    {
        id: 2,
        title: "WebAssembly High-Perf Web",
        date: "2026-01-13",
        category: "web",
        ext: "wasm",
        icon: "fa-globe",
        colorClass: "color-web",
        desc: "Running C# and Rust in the browser. The death of the native vs web app boundary.",
        content: `WebAssembly (WASM) has finally broken out of its niche, becoming the standard for bringing high-performance applications to the browser. By 2026, the boundary between "native desktop apps" and "web apps" has effectively vanished. We are seeing complex audio engines, 3D visualizers, and heavy data-processing tools running at near-native speeds directly in Chrome and Firefox, powered by languages like C# and Rust compiled to WASM.

For a developer, this means the web is no longer limited by the single-threaded nature of JavaScript. We can now deploy heavy video post-production tools and complex simulations that previously required dedicated hardware. This hardware-agnostic shift allows for more creative freedom, as the browser becomes a powerful engine capable of rendering high-fidelity graphics and processing low-latency audio signals in real-time.

The impact on portfolio design and creative development is massive. It allows for the creation of immersive, interactive 3D environments—like the grid-based systems used in high-end portfolios—without sacrificing performance. As we move deeper into 2026, the ability to bridge the gap between low-level system performance and high-level web design will be the hallmark of the most successful creative engineers.`
    },
    {
        id: 3,
        title: "Shamil: Manual Logic Architect",
        date: "2026-01-13",
        category: "personal",
        ext: "sys",
        icon: "fa-user-astronaut",
        colorClass: "color-sys",
        desc: "Refusal of standard configs. Navigating the intersection of Software Engineering and Creative Production.",
        content: `My journey is defined by a refusal to settle for "standard" configurations. After spending two transformative years in Malaysia, I returned to Zambia with a refined perspective on how technology should intersect with creativity. I don't just "build websites"; I architect digital experiences that feel like living systems. Whether I'm hard-coding a portfolio in ASP.NET or designing a complex database schema, my approach is rooted in manual precision and a "Matrix-style" aesthetic.

I thrive in the space where Software Engineering meets Creative Production. My toolkit isn't just a list of languages; it's a hardware manifest built for rapid context switching. I can move from the rigid logic of a SQL query to the chaotic distortion of an audio track without losing momentum. This versatility is my primary "System Spec," allowing me to manage everything from Starlink network diagnostics to the creative rollout of a sports media platform.

At 25, I am focused on building a legacy of autonomy and technical rigor. I value transparency, high-fidelity execution, and "zero grace" for mediocrity. My work, branded under CTRL+ALT+SHAMIL, is a testament to the idea that an engineer can be both a master of structure and a disruptor of form. I am not just a graduate; I am a professional who has been tested in different global environments, ready to scale the next "multi-thousand dollar idea."`
    },
    {
        id: 4,
        title: "Kinetic Aesthetic Motion",
        date: "2026-01-13",
        category: "creative",
        ext: "vf",
        icon: "fa-film",
        colorClass: "color-vf",
        desc: "Visual friction and 140 BPM sync. Treating video frames as data points for optimization.",
        content: `In the world of high-intensity video editing—specifically within the AMV and visualizer subcultures—the goal is no longer just "smooth" transitions. In 2026, the trend has shifted toward Kinetic Distortion. Using tools like Blurrr, editors are refactoring video frames the same way a producer refactors a vocal signal. We are looking for "creative friction"—the moment where the visual breaks just enough to create a unique texture that matches a 140 BPM rhythm.

This aesthetic requires a deep understanding of keyframe interpolation and signal processing. It’s about more than just aesthetics; it’s about timing and technical control. When I’m working on a "Rest in Bass" style edit, I’m looking for the perfect sync between the audio transients and the visual "glitch." This requires a developer’s mindset—treating every frame as a data point that needs to be optimized for maximum impact.

The future of motion design is increasingly procedural. We are seeing more editors incorporate custom scripts and shaders into their workflows to create effects that can't be found in standard plugins. By treating video editing as an engineering challenge, we can push the boundaries of what is possible on mobile and desktop platforms, turning a simple sequence into a high-fidelity visual experience.`
    },
    {
        id: 5,
        title: "Data-Driven Blueprint",
        date: "2026-01-13",
        category: "business",
        ext: "dat",
        icon: "fa-chart-line",
        colorClass: "color-dat",
        desc: "Content Engineering for ZedSport. Scaling to 110k followers using metadata architecture.",
        content: `Sports media in Zambia is undergoing a digital revolution, and ZedSport is at the forefront of this shift. Creating a 100-article rollout isn't just about writing; it's about Content Engineering. It requires a strategic understanding of SEO, metadata architecture, and audience retention metrics. We are moving away from traditional reporting and toward a data-driven model where every article is a node in a larger network of sports information.

The goal is to reach a "critical mass" of 110k followers by treating the platform like a system that needs to be optimized. This means analyzing engagement logs, monitoring traffic spikes during peak match times, and ensuring that the content "rhythm" matches the audience's demand. It is a transactional relationship: we provide high-value, high-fidelity sports analysis, and the audience provides the growth metrics required to scale the "empire."

Ultimately, the success of a platform like ZedSport depends on the infrastructure behind the articles. It’s about how the site handles traffic, how the data is categorized, and how the "brand voice" is maintained across different channels. By applying a Software Engineering mindset to sports journalism, we can create a platform that is not only the "number one" in Zambia but a global benchmark for how digital sports media should be executed.`
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Note: We are targeting the same container ID as before, but changing the content structure.
    const desktopGrid = document.getElementById('blogDesktopGrid');
    const taskbar = document.querySelector('.taskbar'); // We might hide this or integrate logic

    // Reader Elements
    const readerModal = document.getElementById('readerModal');
    const closeReaderBtn = document.getElementById('closeReader');
    const readerContent = document.getElementById('readerContent');
    const readerTitle = document.getElementById('readerTitle');
    const readerDate = document.getElementById('readerDate');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNum = document.getElementById('pageNum');

    let currentPages = [];
    let currentPageIndex = 0;
    let currentFilter = 'all';

    // --- 1. RENDER EXPLORER WINDOW ---
    function initExplorer() {
        if (!desktopGrid) return;

        // Hide the original taskbar if it exists, as the explorer is self-contained or we want a cleaner look
        // For now, let's leave it as "OS Taskbar" but render the window inside the grid area

        desktopGrid.innerHTML = `
            <div class="profile-module h-100 explorer-theme w-100" style="min-height: 500px;">
                <div class="explorer-header">
                    <div class="win-controls">
                        <span class="win-btn close"></span>
                        <span class="win-btn min"></span>
                        <span class="win-btn max"></span>
                    </div>
                    <div class="win-address-bar" id="explorerAddress">
                        C:/Users/Shamil/Knowledge_Base/
                    </div>
                </div>
                <div class="explorer-body">
                    <div class="explorer-sidebar">
                        <ul id="explorerSidebarList">
                            <!-- Injected via JS -->
                        </ul>
                    </div>
                    <div class="explorer-main">
                        <div class="file-grid" id="explorerFileGrid">
                            <!-- Injected via JS -->
                        </div>
                        <div class="explorer-preview">
                            <div class="preview-header" id="blogPreviewHeader">SELECT_FILE_TO_PREVIEW</div>
                            <div class="preview-details" id="blogPreviewDetails">
                                Waiting for user input...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        renderSidebar();
        renderFiles('all');
    }

    // --- 2. RENDER SIDEBAR ---
    function renderSidebar() {
        const sidebarList = document.getElementById('explorerSidebarList');
        const categories = [
            { id: 'all', label: 'All Files', icon: 'fa-hdd' },
            { id: 'engineering', label: 'Engineering', icon: 'fa-code' },
            { id: 'web', label: 'Web/WASM', icon: 'fa-globe' },
            { id: 'personal', label: 'Personal_Log', icon: 'fa-user-secret' },
            { id: 'creative', label: 'Creative_VF', icon: 'fa-film' },
            { id: 'business', label: 'Business_Dat', icon: 'fa-chart-line' }
        ];

        sidebarList.innerHTML = categories.map(cat => `
            <li class="${cat.id === currentFilter ? 'active' : ''}" data-cat="${cat.id}">
                <i class="fas ${cat.icon}"></i> ${cat.label}
            </li>
        `).join('');

        // Add Listeners
        sidebarList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                // Update UI
                sidebarList.querySelectorAll('li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');

                // Update Logic
                currentFilter = li.getAttribute('data-cat');
                renderFiles(currentFilter);

                // Update Address Bar
                const path = currentFilter === 'all' ? '' : currentFilter;
                document.getElementById('explorerAddress').textContent = `C:/Users/Shamil/Knowledge_Base/${path}`;
            });
        });
    }

    // --- 3. RENDER FILES ---
    function renderFiles(filter) {
        const fileGrid = document.getElementById('explorerFileGrid');
        fileGrid.innerHTML = '';

        const filteredData = blogData.filter(item => filter === 'all' || item.category === filter);

        if (filteredData.length === 0) {
            fileGrid.innerHTML = '<div class="text-muted p-3">Folder is empty.</div>';
            return;
        }

        filteredData.forEach(article => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fas ${article.icon} file-icon ${article.colorClass}"></i>
                <span class="file-name text-truncate" style="max-width: 100px;">${article.title}.${article.ext}</span>
            `;

            // Click -> Update Preview
            fileItem.addEventListener('click', () => {
                // Remove active from others
                document.querySelectorAll('#explorerFileGrid .file-item').forEach(el => el.style.backgroundColor = '');
                fileItem.style.backgroundColor = 'rgba(37, 140, 251, 0.2)';

                updatePreview(article);
            });

            // Double Click -> Open Reader
            fileItem.addEventListener('dblclick', () => {
                openReader(article);
            });

            fileGrid.appendChild(fileItem);
        });
    }

    // --- 4. PREVIEW PANE LOGIC ---
    function updatePreview(article) {
        const header = document.getElementById('blogPreviewHeader');
        const details = document.getElementById('blogPreviewDetails');

        header.innerHTML = `${article.title}.${article.ext} <span style="float:right; font-size:0.7em; color:#888;">[READ_ONLY]</span>`;
        details.innerHTML = `
            <div class="status-tag mb-2">DATE: ${article.date}</div>
            <p style="margin-bottom: 1rem; color: #ccc; font-size: 0.85rem;">${article.desc}</p>
            <button class="term-btn w-100" id="previewOpenBtn">OPEN_FILE</button>
        `;

        document.getElementById('previewOpenBtn').addEventListener('click', () => openReader(article));
    }

    // --- 5. READER MODAL LOGIC (Preserved) ---
    function openReader(article) {
        currentPages = article.content.split('\n\n').filter(p => p.trim() !== "");
        currentPageIndex = 0;

        readerTitle.textContent = `${article.title}.${article.ext}`;
        readerDate.textContent = `CREATED: ${article.date} | SIZE: ${article.content.length}B`;

        updateReaderPage();
        readerModal.classList.add('active');
    }

    function updateReaderPage() {
        readerContent.innerHTML = `<div class="page-content">${currentPages[currentPageIndex]}</div>`;
        pageNum.textContent = `PAGE ${currentPageIndex + 1} / ${currentPages.length}`;

        prevPageBtn.disabled = currentPageIndex === 0;
        nextPageBtn.disabled = currentPageIndex === currentPages.length - 1;
    }

    if (prevPageBtn) {
        prevPageBtn.onclick = () => {
            if (currentPageIndex > 0) {
                currentPageIndex--;
                updateReaderPage();
            }
        };
    }

    if (nextPageBtn) {
        nextPageBtn.onclick = () => {
            if (currentPageIndex < currentPages.length - 1) {
                currentPageIndex++;
                updateReaderPage();
            }
        };
    }

    if (closeReaderBtn) {
        closeReaderBtn.onclick = () => {
            readerModal.classList.remove('active');
        };
    }

    // System Clock for Taskbar (Still relevant for the page footer/header if visible)
    function updateSysClock() {
        const clock = document.getElementById('blogSysClock');
        if (clock) {
            const now = new Date();
            const options = { timeZone: 'Africa/Lusaka', hour: '2-digit', minute: '2-digit' };
            clock.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
        }
    }
    setInterval(updateSysClock, 1000);
    updateSysClock();

    // Initial Launch
    initExplorer();
});