document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    };

    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah link '#' bekerja
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    AOS.init({
        duration: 800, // Durasi animasi dalam milidetik
        once: true, // Animasi hanya berjalan sekali
    });
});