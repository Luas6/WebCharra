document.addEventListener("DOMContentLoaded", () => {
    const swiperContainer = document.querySelector(".mySwiper");

    if (!swiperContainer) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {

            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js";
            script.onload = () => {
                new Swiper('.mySwiper', {
                loop: true,
                spaceBetween: 10,
                autoplay: {
                    delay: 5000,
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
            };

            document.body.appendChild(script);
            observer.disconnect();
        }
    });

    observer.observe(swiperContainer);
});