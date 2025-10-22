document.addEventListener('DOMContentLoaded', function () {
    // Carousel
    const slide = document.querySelector('.carousel-slide');
    const images = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots-container');

    let counter = 0;
    const size = images[0].clientWidth;

    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    // Dots
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            counter = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    function updateCarousel() {
        slide.style.transition = "transform 0.5s ease-in-out";
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === counter);
        });
    }

    nextBtn.addEventListener('click', () => {
        if (counter >= images.length - 1) counter = -1;
        counter++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (counter <= 0) counter = images.length;
        counter--;
        updateCarousel();
    });

    setInterval(() => {
        if (counter >= images.length - 1) counter = -1;
        counter++;
        updateCarousel();
    }, 5000); // Auto-play every 5 seconds

    // Music Player
    const playPauseBtns = document.querySelectorAll('.play-pause-btn');

    playPauseBtns.forEach(btn => {
        const songId = btn.getAttribute('data-song');
        const song = document.getElementById(songId);

        btn.addEventListener('click', () => {
            if (song.paused) {
                song.play();
                btn.textContent = '暫停';
            } else {
                song.pause();
                btn.textContent = '播放';
            }
        });
    });
});