window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    const pageLoader = document.getElementById('pageLoader');

    if (lang === 'vi') {
        const languageScreen = document.getElementById('languageScreen');
        if (languageScreen) languageScreen.classList.add('hidden');
    }

    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hide');
        }, 750);
    }

    // initialize basic UI hooks used by the HTML (menu, language select, passport, quiz)
    initNav();
});

// Simple nav initialiser (animates nav into view)
function initNav() {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) return;
    setTimeout(() => mainNav.classList.add('show'), 100);
}

document.addEventListener("DOMContentLoaded", function() {
    // Tìm tất cả các phần tử đang bị ẩn bởi CSS
    const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .place, .food-card');
    
    // Cài đặt Observer theo dõi thao tác cuộn
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Khi phần tử lọt vào khung nhìn của màn hình
            if (entry.isIntersecting) {
                // Thêm class 'visible' để kích hoạt opacity: 1 trong CSS
                entry.target.classList.add('visible');
                // Ngừng theo dõi phần tử này sau khi đã hiện lên
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15 // Kích hoạt khi cuộn thấy 15% phần tử
    });

    // Bắt đầu theo dõi từng phần tử
    hiddenElements.forEach(el => observer.observe(el));
});