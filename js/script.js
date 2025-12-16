document.addEventListener('DOMContentLoaded', function () {

    // --- 導覽列滾動效果 ---
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

    // --- 新增：手機版漢堡選單功能 ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-links');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // 點擊手機選單連結後，自動關閉選單
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // --- 新增：空點游標效果 ---
    const htmlEl = document.documentElement; // 獲取 <html> 元素

    // 監聽整個文件的 mousedown 事件 (比 click 更即時)
    document.addEventListener('mousedown', function(event) {
        
        // 檢查被點擊的元素是不是我們定義的可互動元素
        // .closest() 會檢查自身以及所有父元素，非常可靠
        const interactiveElement = event.target.closest('a, button, .dot, .prev-btn, .next-btn');

        // 如果點擊的不是可互動元素 (即點在空白處)
        if (!interactiveElement) {
            // 1. 立刻為 <html> 添加 class，顯示「空點」游標
            htmlEl.classList.add('empty-click-cursor');

            // 2. 設定一個短暫的計時器 (例如 200 毫秒)
            setTimeout(function() {
                // 3. 時間到後，移除 class，讓游標恢復正常
                htmlEl.classList.remove('empty-click-cursor');
            }, 200); // 您可以調整這個時間長短，單位是毫秒
        }
    });


    // --- 輪播圖功能 ---
    // ... (您的輪播圖 JS 程式碼維持不變) ...

    // --- 音樂播放器功能 ---
    // ... (您的音樂播放器 JS 程式碼維持不變) ...
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
