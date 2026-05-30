/**
 * Swiper Gallery Initialization
 * Initializes the product image swiper
 */

class SwiperGallery {
    constructor() {
        this.productSwiper = null;
        this.maxRetries = 50;
        this.retryCount = 0;
        this.waitForSwiperLibrary();
    }

    /**
     * Wait for Swiper library to be loaded
     */
    waitForSwiperLibrary() {
        if (typeof Swiper === 'undefined') {
            this.retryCount++;
            if (this.retryCount <= this.maxRetries) {
                setTimeout(() => this.waitForSwiperLibrary(), 100);
            } else {
                console.error('Swiper library failed to load after maximum retries');
            }
        } else {
            console.log('✓ Swiper library loaded successfully');
        }
    }

    /**
     * Initialize the product swiper
     */
    initializeSwipers() {
        try {
            // Destroy existing swiper if it exists
            this.destroySwipers();

            // Check if Swiper is available
            if (typeof Swiper === 'undefined') {
                console.error('✗ Swiper library not loaded');
                return false;
            }

            // Check if container exists
            const swiperContainer = document.querySelector('.product-swiper');
            if (!swiperContainer) {
                console.warn('✗ No .product-swiper container found');
                return false;
            }

            console.log('Initializing product swiper...');

            // Initialize main swiper
            this.productSwiper = new Swiper('.product-swiper', {
                loop: true,
                loopFillGroupWithBlank: false, spaceBetween: 15,
                grabCursor: true,
                simulateTouch: true,
                touchRatio: 1,
                touchAngle: 45,
                slidesPerView: 4,
                normalizeSlideIndex: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                keyboard: {
                    enabled: true
                },
                observer: true,
                observeParents: true,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 5
                    },
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 15
                    }
                },
                on: {
                    init: () => {
                        console.log('✓ Product swiper initialized successfully');
                    },
                    sliderMove: () => {
                        console.log('Swiper moved');
                    },
                    error: (error) => {
                        console.error('✗ Product swiper error:', error);
                    }
                }
            });

            return !!this.productSwiper;
        } catch (error) {
            console.error('✗ Error initializing swiper:', error);
            return false;
        }
    }

    /**
     * Destroy existing swiper
     */
    destroySwipers() {
        try {
            if (this.productSwiper && typeof this.productSwiper.destroy === 'function') {
                this.productSwiper.destroy();
                this.productSwiper = null;
                console.log('Swiper destroyed');
            }
        } catch (error) {
            console.error('Error destroying swiper:', error);
        }
    }

    /**
     * Update swiper after slides change
     */
    updateSwiper() {
        try {
            if (this.productSwiper) {
                if (typeof this.productSwiper.update === 'function') {
                    this.productSwiper.update();
                    console.log('✓ Swiper updated');
                }
                if (typeof this.productSwiper.slideTo === 'function') {
                    this.productSwiper.slideTo(0);
                }
            }
        } catch (error) {
            console.error('Error updating swiper:', error);
        }
    }

    /**
     * Check if swiper is initialized
     */
    isInitialized() {
        return !!this.productSwiper;
    }
}

// Create global instance
const swiperGallery = new SwiperGallery();
console.log('✓ SwiperGallery instance created');