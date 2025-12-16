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

    // --- 手機版漢堡選單功能 ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-links');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // --- 空點游標效果 ---
    const htmlEl = document.documentElement;
    document.addEventListener('mousedown', function(event) {
        const interactiveElement = event.target.closest('a, button, .dot, .prev-btn, .next-btn, .music-slide');
        if (!interactiveElement) {
            htmlEl.classList.add('empty-click-cursor');
            setTimeout(function() {
                htmlEl.classList.remove('empty-click-cursor');
            }, 200);
        }
    });

    // --- 主視覺輪播圖功能 ---
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slide = carouselContainer.querySelector('.carousel-slide');
        const images = carouselContainer.querySelectorAll('.carousel-slide img');
        if (images.length > 0) {
            const prevBtn = carouselContainer.querySelector('.prev-btn');
            const nextBtn = carouselContainer.querySelector('.next-btn');
            const dotsContainer = carouselContainer.querySelector('.dots-container');
            let counter = 0;
            let slideWidth = carouselContainer.clientWidth;
            let autoPlayInterval;
            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    counter = i;
                    updateCarousel();
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
            const dots = carouselContainer.querySelectorAll('.dot');
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
                autoPlayInterval = setInterval(nextSlide, 3500);
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
    }

    // --- 【已更新】遊戲音樂輪播功能 (增加延遲觸發) ---
    const musicContainer = document.querySelector('.music-carousel-container');
    if (musicContainer) {
        const track = musicContainer.querySelector('.music-carousel-track');
        const audioPlayer = document.getElementById('music-player');

        const musicData = [
            { imgSrc: 'images/音樂圖1.png', audioSrc: 'audio/1.mp3' },
            { imgSrc: 'images/音樂圖2.png', audioSrc: 'audio/2.mp3' },
            { imgSrc: 'images/音樂圖3.png', audioSrc: 'audio/3.mp3' },
            { imgSrc: 'images/音樂圖4.png', audioSrc: 'audio/4.mp3' },
            { imgSrc: 'images/音樂圖5.png', audioSrc: 'audio/5.mp3' }
        ];

        musicData.forEach(data => {
            const slide = document.createElement('div');
            slide.className = 'music-slide';
            slide.dataset.audioSrc = data.audioSrc;
            const img = document.createElement('img');
            img.src = data.imgSrc;
            slide.appendChild(img);
            track.appendChild(slide);
        });

        const slides = Array.from(track.children);
        let hoverTimer = null; // 新增：用於存放計時器 ID

        const updateCarousel = (targetIndex, playAudio) => {
            const targetSlide = slides[targetIndex];
            const containerRect = musicContainer.getBoundingClientRect();
            
            const offset = (containerRect.width / 2) - (targetSlide.offsetWidth / 2) - targetSlide.offsetLeft;
            track.style.transform = `translateX(${offset}px)`;

            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === targetIndex);
            });

            if (playAudio) {
                const audioSrc = targetSlide.dataset.audioSrc;
                if (!audioPlayer.src.endsWith(audioSrc) || audioPlayer.paused) {
                    audioPlayer.src = audioSrc;
                    audioPlayer.play().catch(error => console.log("Audio play was interrupted:", error));
                }
            }
        };

        slides.forEach((slide, index) => {
            // 當滑鼠移入時，啟動計時器
            slide.addEventListener('mouseenter', () => {
                // 先清除可能存在的舊計時器，防止快速滑過時觸發多次
                clearTimeout(hoverTimer);
                
                // 設定一個新的計時器，1.5秒後觸發
                hoverTimer = setTimeout(() => {
                    updateCarousel(index, true);
                }, 500); // 1500 毫秒 = 1.5 秒
            });

            // 當滑鼠移出時，取消計時器
            slide.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
            });
        });

        musicContainer.addEventListener('mouseleave', () => {
            if (audioPlayer) {
                audioPlayer.pause();
            }
            // 同時清除計時器，以防滑鼠從卡片快速移出容器
            clearTimeout(hoverTimer);

        });

        // 初始載入時，設定到中間位置，但不播放音樂
        const initialIndex = Math.floor(slides.length / 2);
        setTimeout(() => {
            updateCarousel(initialIndex, false);
        }, 100);
    }
});