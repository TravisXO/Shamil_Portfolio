document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Category Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-card');
    const featuredSection = document.getElementById('featured-post');
    const noResults = document.getElementById('noResults');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                let visibleCount = 0;

                // Filter grid posts
                posts.forEach(post => {
                    const category = post.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        post.style.display = 'flex';
                        visibleCount++;
                    } else {
                        post.style.display = 'none';
                    }
                });

                // Handle featured post visibility (treated as a Stack Card)
                if (featuredSection) {
                    const featuredGrid = featuredSection.querySelector('.featured-grid');
                    if (featuredGrid) {
                        const featCat = featuredGrid.getAttribute('data-category');
                        if (filter === 'all' || featCat === filter) {
                            featuredSection.style.display = 'block';
                        } else {
                            featuredSection.style.display = 'none';
                        }
                    }
                }

                // Show/Hide "No Results"
                if (noResults) {
                    // Check if featured is visible
                    const isFeaturedVisible = featuredSection && featuredSection.style.display !== 'none';

                    if (visibleCount === 0 && !isFeaturedVisible) {
                        noResults.style.display = 'block';
                    } else {
                        noResults.style.display = 'none';
                    }
                }
            });
        });
    }

    // --- 2. Search Functionality ---
    const searchInput = document.getElementById('blogSearch');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            let visibleCount = 0;

            // Reset filters first
            filterBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-filter="all"]')?.classList.add('active');

            posts.forEach(post => {
                const title = post.getAttribute('data-title').toLowerCase();
                if (title.includes(term)) {
                    post.style.display = 'flex';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                }
            });

            // Also search featured
            if (featuredSection) {
                const featTitle = featuredSection.querySelector('.featured-title').textContent.toLowerCase();
                if (featTitle.includes(term)) {
                    featuredSection.style.display = 'block';
                } else {
                    featuredSection.style.display = 'none';
                }
            }

            if (noResults) {
                const isFeaturedVisible = featuredSection && featuredSection.style.display !== 'none';
                if (visibleCount === 0 && !isFeaturedVisible) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
        });
    }
});