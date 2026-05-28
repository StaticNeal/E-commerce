/**
 * Swiper Gallery Initialization
 * Handles both hero gallery and thumbnail gallery with proper error handling
 */

class SwiperGallery {
    constructor() {
        this.gallerySwiper = null;
        this.thumbsSwiper = null;
        this.maxRetries = 50; // Maximum retries before giving up
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
                console.warn('Swiper library failed to load after maximum retries');
            }
        } else {
            console.log('Swiper library loaded successfully');
        }
    }

    /**
     * Initialize both swipers
     */
    initializeSwipers() {
        try {
            // Destroy existing swipers if they exist
            this.destroySwipers();

            // Check if Swiper is available
            if (typeof Swiper === 'undefined') {
                console.error('Swiper library not loaded');
                return false;
            }

            // Check if containers exist
            const thumbsContainer = document.querySelector('.product-thumbs-swiper');
            const galleryContainer = document.querySelector('.product-hero-swiper');

            if (!thumbsContainer && !galleryContainer) {
                console.warn('No Swiper containers found on this page');
                return false;
            }

            // Initialize thumbnails swiper first
            if (thumbsContainer) {
                try {
                    this.thumbsSwiper = new Swiper('.product-thumbs-swiper', {
                        spaceBetween: 10,
                        slidesPerView: 4,
                        freeMode: true,
                        watchSlidesProgress: true,
                        breakpoints: {
                            320: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 4 }
                        },
                        observer: true,
                        observeParents: true,
                        on: {
                            init: () => {
                                console.log('Thumbnails swiper initialized successfully');
                            },
                            error: (error) => {
                                console.error('Thumbnails swiper error:', error);
                            }
                        }
                    });
                    console.log('Thumbnails swiper created successfully');
                } catch (error) {
                    console.error('Error creating thumbnails swiper:', error);
                }
            }

            // Initialize main gallery swiper
            if (galleryContainer) {
                try {
                    this.gallerySwiper = new Swiper('.product-hero-swiper', {
                        loop: true,
                        loopFillGroupWithBlank: false,
                        spaceBetween: 0,
                        grabCursor: true,
                        simulateTouch: true,
                        touchRatio: 1,
                        touchAngle: 45,
                        slidesPerView: 1,
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
                        mousewheel: {
                            invert: false
                        },
                        keyboard: {
                            enabled: true
                        },
                        observer: true,
                        observeParents: true,
                        preloadImages: true,
                        updateOnWindowResize: true,
                        thumbs: this.thumbsSwiper ? {
                            swiper: this.thumbsSwiper
                        } : undefined,
                        on: {
                            init: () => {
                                console.log('Gallery swiper initialized successfully');
                            },
                            error: (error) => {
                                console.error('Gallery swiper error:', error);
                            }
                        }
                    });
                    console.log('Gallery swiper created successfully');
                } catch (error) {
                    console.error('Error creating gallery swiper:', error);
                }
            }

            return !!(this.gallerySwiper || this.thumbsSwiper);
        } catch (error) {
            console.error('Error initializing swipers:', error);
            return false;
        }
    }

    /**
     * Destroy existing swipers
     */
    destroySwipers() {
        try {
            if (this.thumbsSwiper && typeof this.thumbsSwiper.destroy === 'function') {
                this.thumbsSwiper.destroy();
                this.thumbsSwiper = null;
                console.log('Thumbnails swiper destroyed');
            }
            if (this.gallerySwiper && typeof this.gallerySwiper.destroy === 'function') {
                this.gallerySwiper.destroy();
                this.gallerySwiper = null;
                console.log('Gallery swiper destroyed');
            }
        } catch (error) {
            console.error('Error destroying swipers:', error);
        }
    }

    /**
     * Update swiper when slides change
     */
    updateSwiper() {
        try {
            if (this.thumbsSwiper) {
                if (typeof this.thumbsSwiper.update === 'function') {
                    this.thumbsSwiper.update();
                }
                if (typeof this.thumbsSwiper.slideTo === 'function') {
                    this.thumbsSwiper.slideTo(0);
                }
                console.log('Thumbnails swiper updated and reset to slide 0');
            }
            
            if (this.gallerySwiper) {
                if (typeof this.gallerySwiper.update === 'function') {
                    this.gallerySwiper.update();
                }
                if (typeof this.gallerySwiper.slideTo === 'function') {
                    this.gallerySwiper.slideTo(0);
                }
                if (typeof this.gallerySwiper.updateAutoHeight === 'function') {
                    this.gallerySwiper.updateAutoHeight();
                }
                console.log('Gallery swiper updated and reset to slide 0');
            }
        } catch (error) {
            console.error('Error updating swipers:', error);
        }
    }

    /**
     * Get current gallery swiper instance
     */
    getGallerySwiper() {
        return this.gallerySwiper;
    }

    /**
     * Get current thumbs swiper instance
     */
    getThumbsSwiper() {
        return this.thumbsSwiper;
    }

    /**
     * Check if swipers are initialized
     */
    isInitialized() {
        return !!(this.gallerySwiper || this.thumbsSwiper);
    }
}

// Create global instance
const swiperGallery = new SwiperGallery();
console.log('SwiperGallery instance created');
