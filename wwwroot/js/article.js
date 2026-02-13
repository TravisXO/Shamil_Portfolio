document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Reading Progress Bar ---
    const progressBar = document.getElementById('readingProgress');

    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // --- 2. Share Buttons (Simulation) ---
    const shareBtns = document.querySelectorAll('.share-btn');

    shareBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const originalIcon = this.innerHTML;

            // Simulate action
            this.innerHTML = '<i class="fas fa-check" style="color: #00ff9f;"></i>';

            if (navigator.clipboard && this.title === "Copy Link") {
                navigator.clipboard.writeText(window.location.href);
            }

            setTimeout(() => {
                this.innerHTML = originalIcon;
            }, 2000);
        });
    });
});