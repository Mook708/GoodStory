document.addEventListener('DOMContentLoaded', function () {

    // --- 新增：導覽列滾動效果 ---
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }

    // --- 輪播圖功能 (已修復 Bug) ---
    const carouselContainer = document.querySelector('.carousel-container');
    const slide = document.querySelector('.carousel-slide');
    const images = document.querySelectorAll('.carousel-slide img');
    
    if (images.length > 0) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.dots-container');

        let counter = 0;
        let slideWidth = carouselContainer.clientWidth;
        let autoPlayInterval;

        for (let i = 0; i < images.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                counter = i;
                updateCarousel();
                resetAutoPlay(); // 點擊後重置自動播放計時器
            });
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.dot');

        function updateCarousel() {
            slide.style.transition = "transform 0.5s ease-in-out";
            slide.style.transform = `translateX(${-slideWidth * counter}px)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === counter);
            });
        }

        function nextSlide() {
            counter = (counter + 1) % images.length;
            updateCarousel();
        }

        function prevSlide() {
            counter = (counter - 1 + images.length) % images.length;
            updateCarousel();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 3500); // 直接調用 nextSlide 函數
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
        
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
        
        window.addEventListener('resize', () => {
            slideWidth = carouselContainer.clientWidth;
            slide.style.transition = "none";
            slide.style.transform = `translateX(${-slideWidth * counter}px)`;
        });

        updateCarousel();
        startAutoPlay();
    }

    // --- 音樂播放器功能 ---
    const playPauseBtns = document.querySelectorAll('.play-pause-btn');
    let currentlyPlaying = null;

    playPauseBtns.forEach(btn => {
        const songId = btn.getAttribute('data-song');
        const song = document.getElementById(songId);

        btn.addEventListener('click', () => {
            if (song.paused) {
                if (currentlyPlaying && currentlyPlaying !== song) {
                    currentlyPlaying.pause();
                    document.querySelector(`[data-song="${currentlyPlaying.id}"]`).textContent = '播放';
                }
                song.play();
                btn.textContent = '暫停';
                currentlyPlaying = song;
            } else {
                song.pause();
                btn.textContent = '播放';
                currentlyPlaying = null;
            }

            song.onended = () => {
                btn.textContent = '播放';
                currentlyPlaying = null;
            };
        });
    });
});