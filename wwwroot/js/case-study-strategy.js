/**
 * STRATEGY_LIGHTBOX_ENGINE
 * Handles the strategy card [ VIEW_MODULE ] buttons in the slider.
 * Uses a dedicated overlay (#cs-strategy-lightbox) to avoid
 * any conflicts with the existing results lightbox in case-study.js.
 *
 * Data flow:
 *   strategy-card[data-sg, data-si]  → button.strategy-lb-btn click
 *   → look up .strategy-lb-pool[data-sg] → .strategy-lb-item[data-si]
 *   → render into #cs-strategy-lightbox
 */

document.addEventListener('DOMContentLoaded', () => {

    const overlay = document.getElementById('cs-strategy-lightbox');
    if (!overlay) return;                           // guard: overlay must exist

    const slbIcon = overlay.querySelector('.slb-dyn-icon');
    const slbChip = overlay.querySelector('.slb-dyn-chip');
    const slbTitle = overlay.querySelector('.slb-dyn-title');
    const slbList = overlay.querySelector('.slb-dyn-list');
    const slbClose = overlay.querySelector('.cs-slb-close');
    const slbPrev = overlay.querySelector('.cs-slb-prev');
    const slbNext = overlay.querySelector('.cs-slb-next');
    const slbCount = overlay.querySelector('.cs-slb-counter');

    // type → accent colour map (mirrors card-type-* CSS)
    const typeColour = {
        a: '#00ffcc',
        b: '#ff9900',
        c: '#ff00ff',
        d: '#00ccff',
        e: '#ff3333',
    };

    let currentGroup = null;   // e.g. 'strategy-classic'
    let currentIndex = 0;
    let groupItems = [];     // array of DOM .strategy-lb-item nodes for this group
    let itemCache = {};     // { group: [items...] }

    /* ── helpers ───────────────────────────────────────────── */

    function getItems(group) {
        if (itemCache[group]) return itemCache[group];
        const pool = document.querySelector(`.strategy-lb-pool[data-sg="${group}"]`);
        if (!pool) return [];
        const items = Array.from(pool.querySelectorAll('.strategy-lb-item'))
            .sort((a, b) => parseInt(a.dataset.si) - parseInt(b.dataset.si));
        itemCache[group] = items;
        return items;
    }

    function render(group, index) {
        const items = getItems(group);
        if (!items.length) return;

        currentGroup = group;
        currentIndex = Math.max(0, Math.min(index, items.length - 1));
        groupItems = items;

        const item = items[currentIndex];
        const type = item.dataset.type || 'a';
        const colour = typeColour[type] || '#e8aa3a';
        const chip = item.dataset.chip || '';
        const icon = item.dataset.icon || 'fas fa-star';
        const title = item.dataset.title || '';

        // Icon colour
        slbIcon.className = icon;
        slbIcon.style.color = colour;

        // Chip & title
        slbChip.textContent = chip;
        slbTitle.textContent = title;

        // List items
        const srcList = item.querySelector('ul');
        slbList.innerHTML = '';
        if (srcList) {
            srcList.querySelectorAll('li').forEach(li => {
                const newLi = document.createElement('li');
                newLi.textContent = li.textContent;
                slbList.appendChild(newLi);
            });
        }

        // Counter
        slbCount.textContent =
            `${String(currentIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;

        // Nav button states
        slbPrev.disabled = currentIndex === 0;
        slbNext.disabled = currentIndex === items.length - 1;
    }

    function open(group, index) {
        render(group, index);
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        slbClose.focus();
    }

    function close() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    /* ── card button listeners ──────────────────────────────── */

    document.querySelectorAll('.strategy-card .strategy-lb-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.strategy-card');
            if (!card) return;
            const group = card.dataset.sg;
            const index = parseInt(card.dataset.si, 10) || 0;
            open(group, index);
        });
    });

    /* ── pagination ─────────────────────────────────────────── */

    slbPrev.addEventListener('click', () => {
        if (currentIndex > 0) render(currentGroup, currentIndex - 1);
    });

    slbNext.addEventListener('click', () => {
        if (currentIndex < groupItems.length - 1) render(currentGroup, currentIndex + 1);
    });

    /* ── close handlers ─────────────────────────────────────── */

    slbClose.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('is-open')) return;
        if (e.key === 'Escape') { close(); }
        else if (e.key === 'ArrowLeft' && currentIndex > 0) { render(currentGroup, currentIndex - 1); }
        else if (e.key === 'ArrowRight' && currentIndex < groupItems.length - 1) { render(currentGroup, currentIndex + 1); }
    });

});