document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        spaceBetween: 10,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 4,
                loop: false,           // desactiva loop
                allowTouchMove: false, // desactiva navegación táctil
                autoplay: false        // desactiva autoplay
            }
        }
    });
});