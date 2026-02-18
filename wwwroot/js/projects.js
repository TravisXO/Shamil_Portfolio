/* =======================================================
   PROJECTS MODULE LOGIC
   Features: Modal Management, Typewriter FX
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data/Content Store ---
    // In a real app, this would be fetched via AJAX/Fetch API. 
    // Storing here for immediate interactivity as requested.
    const projectData = {
        1: {
            title: "BNOP MEDIA WEBSITE",
            links: { demo: "#", github: "#", case: "#" },
            sections: [
                { title: "The Problem", content: "BNOP Media, a growing Zambian marketing agency, was operating with a generic website that failed to reflect the quality of their work or convert visitors into clients. The site lacked credibility, had no clear service architecture, and offered no way for potential clients to meaningfully engage." },
                { title: "The Solution", content: "A complete ground-up rebuild using ASP.NET 8 MVC. The new site was structured around the agency's core services, with a clean content hierarchy, professional visual design, and functional contact and inquiry workflows backed by server-side logic." },
                { title: "Technologies", content: "• ASP.NET 8 MVC (Framework)\n• C# (Server Logic)\n• Entity Framework Core & SQL Server\n• Bootstrap 5 & HTML5/CSS3\n• CI/CD Pipeline on Render" },
                { title: "Challenges", content: "Migrating from a loosely structured legacy site to a properly architected MVC application without disrupting operations. Implementing a user-friendly content management flow for non-technical staff." },
                { title: "Results", content: "• 95+ Lighthouse performance score\n• Sub-2 second page load times\n• 100% uptime since deployment\n• Increased contact form submissions" }
            ]
        },
        2: {
            title: "CANONICAL SEO AUDITOR",
            links: { github: "#", doc: "#" },
            sections: [
                { title: "The Problem", content: "Identifying canonical tag issues, duplicate content signals, and indexation conflicts across large websites is time-consuming. Existing tools were expensive or overly complex for simple audits." },
                { title: "The Solution", content: "A purpose-built, open-source SEO auditing tool designed specifically around canonical tag analysis. It focuses on doing one thing well: giving developers a fast, clear picture of canonical configurations." },
                { title: "Technologies", content: "• Python (Core Logic)\n• HTML Parsing Libraries\n• HTTP Request Handling\n• Command Line Interface (CLI)" },
                { title: "Challenges", content: "Handling edge cases like self-referencing canonicals, cross-domain conflicts, and JavaScript-rendered tags without generating false positives." },
                { title: "Results", content: "Successfully identified real canonical conflicts across client sites that major tools missed. Currently being refined for public open-source release." }
            ]
        },
        3: {
            title: "CLASSIC ZAMBIA SAFARIS",
            links: { live: "#", case: "#" },
            sections: [
                { title: "The Problem", content: "Classic Zambia Safaris offered exceptional itineraries but was invisible to international audiences (UK, US, AU). Organic traffic was minimal due to poor structure and low domain authority." },
                { title: "The Solution", content: "A comprehensive 13-month SEO engagement covering technical foundations, content strategy, and authority building. We targeted high-volume safari-related searches and fixed crawlability issues." },
                { title: "Technologies", content: "• Wix Platform (CMS)\n• Google Search Console\n• Ahrefs & Moz\n• Google Analytics" },
                { title: "Challenges", content: "Overcoming Wix's technical constraints to implement enterprise-level SEO strategies. Competing against established global operators with much higher domain ratings." },
                { title: "Results", content: "• 217% traffic growth (61 to 194 monthly)\n• Domain Rating +60% (20 to 32)\n• Top 1-2 positions for branded keywords" }
            ]
        },
        4: {
            title: "PORTFOLIO WEBSITE",
            links: { github: "#", about: "#" },
            sections: [
                { title: "The Problem", content: "Standard developer portfolios often fail to communicate personality and strategic thinking. I needed a site that demonstrated both technical skill and business value." },
                { title: "The Solution", content: "A 'living demonstration' built as a custom web app. It balances professional case studies with a unique visual identity that reflects my 'Tech Noir' aesthetic." },
                { title: "Technologies", content: "• ASP.NET 8\n• Vanilla JS (ES6+)\n• Custom CSS Variables\n• Firebase Integration\n• Render Deployment" },
                { title: "Challenges", content: "Balancing the 'cool factor' of the design with strict accessibility and performance standards. Curating content to be concise yet impactful." },
                { title: "Results", content: "A production-grade application that serves as the ultimate proof of capability." }
            ]
        }
    };

    // --- 2. Lightbox / Modal Logic ---
    const modal = document.querySelector('.mainframe-modal-overlay');
    const modalTitle = document.querySelector('#modal-title');
    const modalContent = document.querySelector('#modal-content-area');
    const modalLinks = document.querySelector('#modal-links');
    const closeBtn = document.querySelector('#close-modal');
    const prevBtn = document.querySelector('#btn-prev');
    const nextBtn = document.querySelector('#btn-next');
    const tabContainer = document.querySelector('#terminal-tabs');

    // FIX 1: Explicitly hide the modal on init to prevent the flicker where
    // the element briefly renders in its default DOM state before JS runs.
    if (modal) modal.classList.remove('active');

    let currentProjectId = null;
    let currentSectionIndex = 0;
    let typewriterTimeout;

    // FIX 2: Local typeText implementation.
    // Explicitly defined here to ensure <br/> tags are rendered as HTML, 
    // avoiding issues where external/global versions might treat them as text.
    const typeText = (element, text, speed = 10) => {
        element.innerHTML = '';
        element.classList.add('cursor-blink');
        let i = 0;

        clearTimeout(typewriterTimeout);

        const type = () => {
            if (i < text.length) {
                // Directly check for newline char and insert HTML tag
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br/>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;

                modalContent.scrollTop = modalContent.scrollHeight;
                typewriterTimeout = setTimeout(type, speed);
            } else {
                element.classList.remove('cursor-blink');
            }
        };
        type();
    };

    // Render Modal State
    const renderSection = (index) => {
        if (!currentProjectId) return;
        const data = projectData[currentProjectId];
        const section = data.sections[index];

        // Update Tabs
        const tabs = tabContainer.querySelectorAll('.terminal-tab');
        tabs.forEach((t, i) => {
            if (i === index) t.classList.add('active');
            else t.classList.remove('active');
        });

        // Update Content — type just the paragraph; h3 appears instantly
        modalContent.innerHTML = `<h3>${section.title}</h3>`;
        const p = document.createElement('p');
        modalContent.appendChild(p);
        typeText(p, section.content);

        // Update nav buttons
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === data.sections.length - 1;
        currentSectionIndex = index;
    };

    // Open Modal
    const openModal = (id) => {
        const data = projectData[id];
        if (!data) return;

        currentProjectId = id;
        currentSectionIndex = 0;
        modalTitle.textContent = `// ${data.title}`;

        // Build Tabs
        tabContainer.innerHTML = '';
        data.sections.forEach((sec, idx) => {
            const btn = document.createElement('button');
            btn.className = 'terminal-tab';
            btn.textContent = `0${idx + 1}_${sec.title.toUpperCase().split(' ')[0]}`;
            btn.addEventListener('click', () => renderSection(idx));
            tabContainer.appendChild(btn);
        });

        // Build Links
        modalLinks.innerHTML = '';
        Object.entries(data.links).forEach(([key, url]) => {
            const a = document.createElement('a');
            a.href = url;
            a.textContent = `[${key.toUpperCase()}]`;
            a.target = "_blank";
            modalLinks.appendChild(a);
        });

        modal.classList.add('active');
        renderSection(0);
    };

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        clearTimeout(typewriterTimeout);
        currentProjectId = null;
    };

    // --- 3. Event Listeners ---
    document.querySelectorAll('.data-cartridge').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            openModal(id);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', () => {
        if (currentSectionIndex > 0) renderSection(currentSectionIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        const max = projectData[currentProjectId].sections.length - 1;
        if (currentSectionIndex < max) renderSection(currentSectionIndex + 1);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

});