/* =======================================================
   CONTACT MODULE LOGIC
   Features: Clipboard Copy, Animations
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Clipboard Functionality ---
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-clipboard');
            const originalIcon = btn.innerHTML;

            try {
                // Modern Async Clipboard API
                await navigator.clipboard.writeText(textToCopy);

                // Success State
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#2EFA7D'; // Cyber green

                // Show floating feedback (optional but nice)
                showTooltip(btn, "COPIED!");

                // Reset after 2 seconds
                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.style.color = '';
                }, 2000);

            } catch (err) {
                console.error('Failed to copy: ', err);

                // Fallback / Error State
                btn.innerHTML = '<i class="fas fa-times"></i>';
                btn.style.color = '#ff4444';

                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.style.color = '';
                }, 2000);
            }
        });
    });

    // --- Simple Tooltip Helper ---
    function showTooltip(element, message) {
        // Check if tooltip already exists
        let existing = element.parentElement.querySelector('.cyber-tooltip');
        if (existing) existing.remove();

        const tooltip = document.createElement('span');
        tooltip.className = 'cyber-tooltip';
        tooltip.textContent = message;

        // Basic Styles for the tooltip (injected here to avoid CSS dependency issues)
        Object.assign(tooltip.style, {
            position: 'absolute',
            top: '-25px',
            right: '0',
            background: 'var(--accent-color, #e8aa3a)',
            color: '#000',
            padding: '2px 6px',
            fontSize: '10px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.2s, transform 0.2s',
            transform: 'translateY(5px)'
        });

        element.parentElement.style.position = 'relative'; // Ensure parent is relative
        element.parentElement.appendChild(tooltip);

        // Trigger animation
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });

        // Remove
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-5px)';
            setTimeout(() => tooltip.remove(), 200);
        }, 1500);
    }

    // --- Entrance Animation Stagger ---
    // Simple staggering for lists without heavy library dependency
    const listItems = document.querySelectorAll('.cyber-list li');
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 100)); // 100ms delay + stagger
    });

});