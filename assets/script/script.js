window.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.cert-swiper[data-cert-path]');

    containers.forEach((container) => {
        const wrapper = container.querySelector('.swiper-wrapper');
        const total = parseInt(container.dataset.total, 10) || 0;
        const path = container.dataset.certPath;
        const filesAttr = container.dataset.files || '';
    const extensionList = (container.dataset.ext || 'png,jpg,jpeg,webp')
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean);
        const resolvedExtensions = extensionList.length ? extensionList : ['jpg', 'png'];

        if (wrapper && path && !wrapper.children.length) {
            const files = filesAttr
                .split(',')
                .map((name) => name.trim())
                .filter(Boolean);

            if (!files.length && total > 0) {
                for (let i = 1; i <= total; i++) {
                    files.push(`sertifikat_${i}`);
                }
            }

            files.forEach((fileName, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide certificate-img';

                const img = document.createElement('img');
                const candidates = fileName.includes('.')
                    ? [`${path}/${fileName}`]
                    : resolvedExtensions.map((extName) => `${path}/${fileName}.${extName}`);

                let attemptIndex = 0;
                const tryNextSource = () => {
                    if (attemptIndex >= candidates.length) {
                        img.removeEventListener('error', handleError);
                        return;
                    }

                    img.src = candidates[attemptIndex++];
                };

                const handleError = () => {
                    tryNextSource();
                };

                img.addEventListener('error', handleError);
                img.addEventListener('load', () => {
                    img.removeEventListener('error', handleError);
                }, { once: true });

                tryNextSource();
                img.alt = `Sertifikat ${index + 1}`;

                slide.appendChild(img);
                wrapper.appendChild(slide);
            });
        }

        const swiperOptions = {
            loop: true,
            spaceBetween: 16,

            autoplay: {
                delay: 2000,
            },

            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 5,
                },
            }
        };

        const paginationEl = container.querySelector('.swiper-pagination');
        if (paginationEl) {
            swiperOptions.pagination = { el: paginationEl };
        }

        const nextEl = container.querySelector('.swiper-button-next');
        const prevEl = container.querySelector('.swiper-button-prev');
        if (nextEl && prevEl) {
            swiperOptions.navigation = { nextEl, prevEl };
        }

        new Swiper(container, swiperOptions);
    });
});