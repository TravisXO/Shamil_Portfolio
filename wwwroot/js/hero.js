document.addEventListener('DOMContentLoaded', () => {
    const heroContainer = document.getElementById('dynamic-hero-container');
    if (!heroContainer) return;

    const headlineEl = document.getElementById('hero-headline');
    const subheadEl = document.getElementById('hero-subheadline');
    const ctaContainer = document.getElementById('hero-cta-buttons');
    const statsContainer = document.getElementById('hero-stats-grid');
    const path = window.location.pathname.toLowerCase();

    // Configuration for different pages (Extensible)
    const pageData = {
        home: {
            headline: "Full-Stack Developer + SEO Specialist",
            subheadline: "I build high-performance web applications that rank #1 on Google",
            buttons: [
                { text: "[View Case Studies]", link: "/CaseStudy", class: "btn-outline-success" },
                { text: "[Download CV]", link: "/docs/Alexander_Shamil_Mondoka_Resume.pdf", class: "btn-outline-primary", target: "_blank" },
                { text: "[Contact Me]", link: "/Contact", class: "btn-outline-warning" }
            ],
            stats: [
                "217% Traffic Growth",
                "60% Domain Authority Increase",
                "#1 Google Rankings",
                "15+ Countries Reached"
            ]
        },
        casestudy: {
            headline: "MISSION_LOGS // CASE_STUDIES",
            subheadline: "Deep dive into architectural decisions, performance metrics, and business outcomes.",
            buttons: [
                { text: "[RETURN_HOME]", link: "/", class: "btn-outline-primary" },
                { text: "[GITHUB_REPO]", link: "https://github.com/TravisXO", class: "btn-outline-success", target: "_blank" }
            ],
            stats: [
                "217% TRAFFIC_GROWTH",
                "98/100 PERFORMANCE_SCORE",
                "0.3s LOAD_LATENCY",
                "#1 SERP_RANKING"
            ]
        },
        skills: {
            headline: "TECHNICAL SKILLS",
            subheadline: "Engineering scalable solutions at the intersection of code and strategy.",
            buttons: [],
            stats: [
                "20+ TECHNOLOGIES",
                "4 CORE DISCIPLINES",
                "100% CODE QUALITY",
                "AGILE METHODOLOGY"
            ]
        },
        // FIX 3: New entry for the Projects/Index page
        projects: {
            headline: "PROJECT_ARCHIVE // SELECTED WORKS",
            subheadline: "A curated index of builds — from full-stack web apps to SEO systems. Click any cartridge to inspect the mission brief.",
            buttons: [
                { text: "[GITHUB_REPO]", link: "https://github.com/TravisXO", class: "btn-outline-success", target: "_blank" },
                { text: "[CONTACT_ME]", link: "/Home/Contact", class: "btn-outline-warning" }
            ],
            stats: [
                "4+ PROJECTS_SHIPPED",
                "3 ACTIVE_CLIENTS",
                "100% ON_SCHEDULE",
                "FULL_STACK + SEO"
            ]
        },
        // FIX 4: New entry for Contact page
        contact: {
            headline: "SYSTEM_UPLINK // CONTACT_MODE",
            subheadline: "Initiating secure connection. Available for freelance, contract, and full-time deployment.",
            buttons: [], // No buttons needed as the page content is the call to action
            stats: [
                "24H RESPONSE_TIME",
                "REMOTE_READY",
                "OPEN_TO_WORK",
                "LUSAKA_BASED"
            ]
        }
    };

    // Determine current page content
    let content = null;
    let isCaseStudy = false;
    let isSkills = false;
    let isProjects = false;
    let isContact = false;

    if (path === '/' || path === '/home' || path === '/home/index') {
        content = pageData.home;
    } else if (path.includes('/casestudy')) {
        content = pageData.casestudy;
        isCaseStudy = true;
    } else if (path.includes('/skills')) {
        content = pageData.skills;
        isSkills = true;
    } else if (path.includes('/project')) {
        // Matches /project/index, /projects, /project, etc.
        content = pageData.projects;
        isProjects = true;
    } else if (path.includes('/contact')) {
        content = pageData.contact;
        isContact = true;
    }

    // Execute if content exists for this page
    if (content) {
        heroContainer.classList.remove('d-none');
        if (isCaseStudy) {
            runCaseStudySequence(content);
        } else if (isSkills) {
            runSkillsSequence(content);
        } else if (isProjects) {
            runProjectsSequence(content);
        } else if (isContact) {
            runContactSequence(content);
        } else {
            runHomeSequence(content);
        }
    }

    // --- Standard Home Sequence (Typewriter) ---
    async function runHomeSequence(data) {
        await typeWriter(headlineEl, data.headline, 50);
        applyGlitch(headlineEl);
        await typeWriter(subheadEl, data.subheadline, 30);
        renderButtons(data.buttons);
        renderStats(data.stats, false);
    }

    // --- REFACTORED Case Study Sequence (Standardized) ---
    async function runCaseStudySequence(data) {
        // Reuse the standard Home sequence logic for consistency
        // (applyGlitch is handled inside runHomeSequence)
        await runHomeSequence(data);
    }

    // --- Skills Sequence ---
    async function runSkillsSequence(data) {
        await typeWriter(headlineEl, data.headline, 50);
        applyGlitch(headlineEl);

        subheadEl.style.opacity = '0';
        subheadEl.innerHTML = data.subheadline;
        subheadEl.classList.add('fade-in-up');
        void subheadEl.offsetWidth;
        subheadEl.style.opacity = '1';

        setTimeout(() => renderStats(data.stats, true), 800);
    }

    // --- Projects Sequence (Typewriter headline + cinematic stats) ---
    async function runProjectsSequence(data) {
        // Type the headline for that terminal feel
        await typeWriter(headlineEl, data.headline, 40);
        applyGlitch(headlineEl);

        // Fade in the subheadline
        subheadEl.style.opacity = '0';
        subheadEl.innerHTML = data.subheadline;
        subheadEl.classList.add('fade-in-up');
        void subheadEl.offsetWidth;
        subheadEl.style.opacity = '1';

        // Reveal buttons
        setTimeout(() => renderButtons(data.buttons), 400);

        // Animate stats with count-up
        setTimeout(() => renderStats(data.stats, true), 800);
    }

    // --- Contact Sequence (Fast Typewriter + Immediate Stats) ---
    async function runContactSequence(data) {
        await typeWriter(headlineEl, data.headline, 40);
        applyGlitch(headlineEl);

        subheadEl.style.opacity = '0';
        subheadEl.innerHTML = data.subheadline;
        subheadEl.classList.add('fade-in-up');
        void subheadEl.offsetWidth;
        subheadEl.style.opacity = '1';

        // Reveal stats immediately without counting animation
        setTimeout(() => renderStats(data.stats, false), 600);
    }

    // --- Utilities ---

    // Stamps data-text and activates the CSS glitch effect on a headline
    // after the typewriter has finished writing it.
    function applyGlitch(el) {
        el.setAttribute('data-text', el.textContent);
        el.classList.add('glitch-text');
    }

    function typeWriter(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            element.innerHTML = '';
            element.setAttribute('data-text', ''); // Sync initial empty state
            element.classList.add('typing-cursor');

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    element.setAttribute('data-text', element.textContent); // Sync data-text for glitch effect
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }
            type();
        });
    }

    function renderButtons(buttons) {
        ctaContainer.innerHTML = '';
        buttons.forEach(btn => {
            const a = document.createElement('a');
            a.href = btn.link;
            a.className = `btn ${btn.class} matrix-hero-btn`;
            a.textContent = btn.text;
            if (btn.target) a.target = btn.target;
            ctaContainer.appendChild(a);
        });
        void ctaContainer.offsetWidth;
        ctaContainer.classList.remove('opacity-0');
    }

    function renderStats(stats, animateCount) {
        statsContainer.innerHTML = '';
        stats.forEach(stat => {
            const col = document.createElement('div');
            col.className = 'col-6';

            const card = document.createElement('div');
            card.className = 'hero-stat-card';

            const textEl = document.createElement('div');
            textEl.className = 'stat-text';

            if (animateCount) {
                const numberMatch = stat.match(/(\d+(\.\d+)?)/);
                if (numberMatch) {
                    const targetNum = parseFloat(numberMatch[0]);
                    const originalText = stat;
                    textEl.textContent = stat.replace(targetNum, "0");
                    animateCounter(textEl, targetNum, originalText);
                } else {
                    textEl.textContent = stat;
                }
            } else {
                textEl.textContent = stat;
            }

            card.appendChild(textEl);
            col.appendChild(card);
            statsContainer.appendChild(col);
        });

        void statsContainer.offsetWidth;
        statsContainer.classList.remove('opacity-0');
    }

    function animateCounter(element, target, fullText) {
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = start + (target - start) * ease;

            const formattedVal = Number.isInteger(target)
                ? Math.round(currentVal)
                : currentVal.toFixed(1);

            element.textContent = fullText.replace(target, formattedVal);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = fullText;
            }
        }

        requestAnimationFrame(update);
    }
});