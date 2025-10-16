document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIKA UNTUK SCROLL TO TOP ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.onscroll = function() {
        if (scrollTopBtn && (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)) {
            scrollTopBtn.classList.add('show');
        } else if (scrollTopBtn) {
            scrollTopBtn.classList.remove('show');
        }
    };

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- INISIALISASI AOS ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- LOGIKA UNTUK DARK MODE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const themeIcon = themeToggleBtn.querySelector('i');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        } else {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        }
        localStorage.setItem('theme', theme);
    });

    // --- LOGIKA UNTUK CAROUSEL PROGRESS BAR (HANYA JALAN JIKA ADA CAROUSEL) ---
    const carouselElement = document.getElementById('featuredCarousel');
    if (carouselElement) {
        const progressBar = document.getElementById('carousel-progress-bar');
        const interval = 5000; // HARUS SAMA DENGAN data-bs-interval di HTML

        const startProgressBar = () => {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            void progressBar.offsetWidth; // Force reflow
            progressBar.style.transition = `width ${interval / 1000}s linear`;
            progressBar.style.width = '100%';
        };

        carouselElement.addEventListener('slid.bs.carousel', startProgressBar);
        startProgressBar(); // Jalankan untuk slide pertama
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const pesanModal = new bootstrap.Modal(document.getElementById('pesanTirimModal'));
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            pesanModal.show();
            contactForm.reset();
        });
    }

    const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
    const likeCounter = document.getElementById('like-counter');
    if (likeCounter) {
        likeCounter.innerText = likedItems.length;
    }
});