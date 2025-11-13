window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    let loadingScreenDismissed = false;

    const hideLoadingScreen = () => {
        if (!loadingScreen || loadingScreenDismissed) {
            return;
        }

        loadingScreenDismissed = true;
        loadingScreen.classList.add('is-hidden');
        document.body.classList.remove('is-loading');

        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 450);
    };

    const monitorImages = () => {
        if (!loadingScreen || loadingScreenDismissed) {
            return;
        }

        const pendingImages = Array.from(document.images).filter((image) => !image.complete);

        if (!pendingImages.length) {
            requestAnimationFrame(hideLoadingScreen);
            return;
        }

        let remaining = pendingImages.length;

        const handleImageSettled = () => {
            remaining -= 1;
            if (remaining <= 0) {
                hideLoadingScreen();
            }
        };

        pendingImages.forEach((image) => {
            image.addEventListener('load', handleImageSettled, { once: true });
            image.addEventListener('error', handleImageSettled, { once: true });
        });
    };

    if (loadingScreen) {
        document.body.classList.add('is-loading');
        window.addEventListener('load', hideLoadingScreen, { once: true });
    }

    const containers = document.querySelectorAll('.cert-swiper[data-cert-path]');
    const swiperInstances = new Map();

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

        const slidesCount = wrapper ? wrapper.children.length : 0;
        const breakpoints = {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 5,
            },
        };

        const maxSlidesPerView = Object.values(breakpoints).reduce((max, config) => {
            const current = typeof config.slidesPerView === 'number' ? config.slidesPerView : 1;
            return current > max ? current : max;
        }, 1);

        const shouldLoop = slidesCount > maxSlidesPerView;
        const shouldAutoplay = slidesCount > 1;

        const swiperOptions = {
            loop: shouldLoop,
            spaceBetween: 16,
            autoplay: shouldAutoplay ? {
                delay: 2000,
            } : false,
            breakpoints,
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

        const swiperInstance = new Swiper(container, swiperOptions);
        swiperInstances.set(container, swiperInstance);
    });

    if (loadingScreen) {
        monitorImages();
    }

    const collapsible = document.getElementById('cert-swiper-side');
    const toggleButton = document.getElementById('cert-swiper-toggle');

    if (collapsible && toggleButton) {
        const swiperInstance = swiperInstances.get(collapsible) || null;
        let isExpanded = false;

        const updateHeight = () => {
            if (!isExpanded) {
                return;
            }

            const measuredHeight = collapsible.scrollHeight;
            collapsible.style.setProperty('--cert-swiper-max-height', `${measuredHeight}px`);
        };

        const setExpandedState = (expanded) => {
            if (isExpanded === expanded) {
                updateHeight();
                return;
            }

            isExpanded = expanded;

            if (expanded) {
                updateHeight();
                toggleButton.setAttribute('aria-expanded', 'true');

                requestAnimationFrame(() => {
                    collapsible.classList.add('is-visible');
                    updateHeight();

                    requestAnimationFrame(() => {
                        if (swiperInstance) {
                            swiperInstance.update();
                        }

                        updateHeight();
                    });
                });
            } else {
                collapsible.classList.remove('is-visible');
                collapsible.style.removeProperty('--cert-swiper-max-height');
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        };

        setExpandedState(false);

        toggleButton.addEventListener('click', () => {
            setExpandedState(!isExpanded);
        });

        window.addEventListener('resize', () => {
            updateHeight();
        });
    }
});