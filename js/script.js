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

    // --- 【已更新】遊戲音樂輪播功能 ---
    const musicSection = document.getElementById('music'); // 【已新增】選取整個 music section
    const musicContainer = document.querySelector('.music-carousel-container');
    
    if (musicSection && musicContainer) { // 確保兩個元素都存在
        const track = musicContainer.querySelector('.music-carousel-track');
        const audioPlayer = document.getElementById('music-player');
        const volumeSlider = document.getElementById('volume-slider');

        // 音量控制邏輯 (維持不變)
        if (audioPlayer && volumeSlider) {
            audioPlayer.volume = volumeSlider.value / 100;
            volumeSlider.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value / 100;
            });
        }
        
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
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
            // --- 桌面版：滑鼠懸停邏輯 ---
            let hoverTimer = null;

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
                        audioPlayer.play().catch(error => {});
                    }
                }
            };

            slides.forEach((slide, index) => {
                slide.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimer);
                    hoverTimer = setTimeout(() => {
                        updateCarousel(index, true);
                    }, 500);
                });
                slide.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                });
            });

            // 【已修改】將 mouseleave 事件綁定到整個 section
            musicSection.addEventListener('mouseleave', () => {
                if (audioPlayer) audioPlayer.pause();
                clearTimeout(hoverTimer);
            });

            const initialIndex = Math.floor(slides.length / 2);
            setTimeout(() => updateCarousel(initialIndex, false), 100);

        } else {
            // --- 手機版：滑動觸發邏輯 ---
            let currentIndex = -1;
            let scrollTimeout = null;

            const updateActiveSlide = (newIndex) => { // 【已修改】移除 playAudio 參數
                if (newIndex === currentIndex) return;
                currentIndex = newIndex;

                slides.forEach((slide, index) => {
                    slide.classList.toggle('active', index === newIndex);
                });

                // 【已修改】只要中心卡片更新，就直接播放音樂
                const activeSlide = slides[newIndex];
                if (activeSlide) {
                    const audioSrc = activeSlide.dataset.audioSrc;
                    // 只有當來源不同時才重新設定 src 並播放，避免中斷
                    if (!audioPlayer.src.endsWith(audioSrc)) {
                        audioPlayer.src = audioSrc;
                        audioPlayer.play().catch(error => {});
                    } else if (audioPlayer.paused) {
                        // 如果來源相同但已暫停，也重新播放
                        audioPlayer.play().catch(error => {});
                    }
                }
            };

            musicContainer.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const containerCenter = musicContainer.scrollLeft + musicContainer.offsetWidth / 2;
                    let closestIndex = 0;
                    let minDistance = Infinity;

                    slides.forEach((slide, index) => {
                        const slideCenter = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
                        const distance = Math.abs(containerCenter - slideCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestIndex = index;
                        }
                    });
                    
                    updateActiveSlide(closestIndex); // 【已修改】直接調用，不傳第二個參數

                }, 150);
            });

            // 初始載入
            const initialIndex = Math.floor(slides.length / 2);
            setTimeout(() => {
                const initialOffset = slides[initialIndex].offsetLeft + (slides[initialIndex].offsetWidth / 2) - (musicContainer.offsetWidth / 2);
                musicContainer.scrollTo({ left: initialOffset });
                updateActiveSlide(initialIndex);
            }, 100);
        }
    }
});