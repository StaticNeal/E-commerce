
const productId = window.location.pathname.split('/product/')[1];

// Placeholder image as data URL (simple gray square)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23e0e0e0" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';

let currentHeroImage = null;

// Helper function to resolve image paths
function resolveImagePath(imagePath) {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return imagePath;
    return `/uploads/${imagePath}`;
}

// Create swiper slide for thumbnail gallery
function createThumbnailSlide(imageSrc, isFirst = false) {
    const slide = document.createElement('div');
    slide.className = `swiper-slide ${isFirst ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Product image';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.onerror = function() {
        this.src = PLACEHOLDER_IMAGE;
    };
    
    slide.appendChild(img);
    
    // Add click handler to update hero image
    slide.addEventListener('click', function() {
        updateHeroImage(imageSrc);
        
        // Remove active class from all slides
        document.querySelectorAll('.product-swiper .swiper-slide').forEach(s => {
            s.classList.remove('active');
        });
        
        // Add active class to clicked slide
        slide.classList.add('active');
    });
    
    return slide;
}

// Update hero image when thumbnail is clicked
function updateHeroImage(imageSrc) {
    currentHeroImage = imageSrc;
    const heroWrapper = document.getElementById('product-hero-img-wrapper');
    if (heroWrapper) {
        heroWrapper.style.backgroundImage = `url('${imageSrc}')`;
        heroWrapper.classList.add('has-image');
    }
}


async function loadProductDetails() {
    if (!productId) {
        console.error('Product ID not found');
        return;
    }

    try {
        // Fetch product details
        const productResponse = await fetch(`/products/${productId}`);
        const productResult = await productResponse.json();

        if (!productResult.success || !productResult.data) {
            console.error('Product not found');
            return;
        }

        const product = productResult.data;

        // Fetch variations for this product
        const variationsResponse = await fetch(`/variations/product/${productId}`);
        const variationsResult = await variationsResponse.json();

        console.log('Product variations fetched:', {
            success: variationsResult.success,
            count: variationsResult.data ? variationsResult.data.length : 0,
            variations: variationsResult.data
        });

        if (variationsResult.success && variationsResult.data && variationsResult.data.length > 0) {
            displayProductDetails(product, variationsResult.data);
            setupVariantFunctionality(product, variationsResult.data);
        } else {
            console.error('No variations found for this product');
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
}


function displayProductDetails(product, variations) {
    // Display first variation by default
    if (variations.length === 0) return;
    const firstVariation = variations[0];

    // Collect all images from all variations, avoiding duplicates
    const allImages = [];
    const imageSet = new Set(); // Track added images to avoid duplicates

    variations.forEach((variation, vidx) => {
        console.log(`Processing variation ${vidx}:`, {
            hasHeroImage: !!variation.heroImage,
            imagesCount: variation.images ? variation.images.length : 0,
            heroImage: variation.heroImage,
            images: variation.images
        });

        if (variation.heroImage) {
            const resolvedPath = resolveImagePath(variation.heroImage);
            if (!imageSet.has(resolvedPath)) {
                imageSet.add(resolvedPath);
                allImages.push({
                    src: resolvedPath,
                    alt: `${product.name} - ${variation.value}`
                });
                console.log('Added hero image:', resolvedPath);
            }
        }
        if (variation.images && variation.images.length > 0) {
            variation.images.forEach((img, iidx) => {
                const resolvedPath = resolveImagePath(img);
                if (!imageSet.has(resolvedPath)) {
                    imageSet.add(resolvedPath);
                    allImages.push({
                        src: resolvedPath,
                        alt: `${product.name} - ${variation.value}`
                    });
                    console.log(`Added image ${iidx}:`, resolvedPath);
                }
            });
        }
    });

    console.log('Total images collected:', allImages.length, allImages);

    // Display first image in hero by default
    if (allImages.length > 0) {
        updateHeroImage(allImages[0].src);
        console.log('Hero image set to first image:', allImages[0].src);
    }

    // Add thumbs gallery images - create swiper slides
    const thumbsWrapper = document.getElementById('product-other-imgs-wrapper');
    if (thumbsWrapper) {
        thumbsWrapper.innerHTML = '';
        console.log(`Loading ${allImages.length} thumbnail images into Swiper`);
        allImages.forEach((image, index) => {
            const thumbSlide = createThumbnailSlide(image.src, index === 0);
            thumbsWrapper.appendChild(thumbSlide);
            console.log(`Created thumbnail slide ${index}:`, image.src);
        });
        console.log(`Total thumbnails created: ${allImages.length}`);
        
        // Initialize Swiper after slides are added
        if (typeof swiperGallery !== 'undefined' && swiperGallery && window.Swiper) {
            console.log('Initializing Swiper gallery...');
            swiperGallery.initializeSwipers();
        } else {
            console.warn('Swiper library or swiperGallery not ready');
        }
    }

    // Display product name
    const productName = document.querySelector('.product-name');
    const readMoreBtn = document.querySelector('.read-more-btn');
    if (productName) {
        const maxLength = 50;
        let isExpanded = false;
        
        function updateProductName() {
            let displayName = product.name;
            
            if (!isExpanded && product.name.length > maxLength) {
                displayName = product.name.substring(0, maxLength);
            }
            
            // Clear existing text nodes but keep the button
            while (productName.firstChild && productName.firstChild.nodeType === Node.TEXT_NODE) {
                productName.removeChild(productName.firstChild);
            }
            
            // Add the display name as text at the beginning
            productName.insertAdjacentText('afterbegin', displayName);
            
            // Show/hide button based on name length
            if (readMoreBtn) {
                if (product.name.length > maxLength) {
                    readMoreBtn.style.display = 'inline-block';
                    readMoreBtn.textContent = isExpanded ? 'Read Less' : '...Read More';
                } else {
                    readMoreBtn.style.display = 'none';
                }
            }
        }
        
        updateProductName();
        
        // Add click event listener to the ...Read More/less button
        if (readMoreBtn && product.name.length > maxLength) {
            readMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                isExpanded = !isExpanded;
                updateProductName();
            });
        }
    }

    // Display rating
    const ratingStars = document.querySelectorAll('.stars .star');
    const rating = Math.round(firstVariation.rating || 0);
    ratingStars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
        star.style.color = index < rating ? '#ffc107' : '#ccc';
    });

    // Display rating count
    const ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
        ratingCount.textContent = `(${rating} stars)`;
    }

    // Display price from first variation
    const priceElements = document.querySelectorAll('.product-price, .quantity .price');
    priceElements.forEach(el => {
        el.textContent = `$ ${firstVariation.price.toFixed(2)}`;
    });

    // Display description
    const description = document.querySelector('.description');
    const readMoreDescBtn = document.querySelector('.read-more-desc-btn');
    if (description) {
        const maxLength = 150;
        let isDescExpanded = false;
        
        function updateDescription() {
            let displayDesc = product.description;
            
            if (!isDescExpanded && product.description.length > maxLength) {
                displayDesc = product.description.substring(0, maxLength);
            }
            
            // Clear existing text nodes but keep the button
            while (description.firstChild && description.firstChild.nodeType === Node.TEXT_NODE) {
                description.removeChild(description.firstChild);
            }
            
            // Add the display description as text at the beginning
            description.insertAdjacentText('afterbegin', displayDesc);
            
            // Show/hide button based on description length
            if (readMoreDescBtn) {
                if (product.description.length > maxLength) {
                    readMoreDescBtn.style.display = 'inline-block';
                    readMoreDescBtn.textContent = isDescExpanded ? 'Read Less' : '...Read More';
                } else {
                    readMoreDescBtn.style.display = 'none';
                }
            }
        }
        
        updateDescription();
        
        // Add click event listener to the ...Read More/less button for description
        if (readMoreDescBtn && product.description.length > maxLength) {
            readMoreDescBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                isDescExpanded = !isDescExpanded;
                updateDescription();
            });
        }
    }    

    // Display variation options
    const variantList = document.querySelector('.varient-list');
    if (variantList) {
        variantList.innerHTML = '';
        variations.forEach((variation, index) => {
            const li = document.createElement('li');
            li.className = 'varient-img' + (index === 0 ? ' selected-varient' : '');
            if (variation.heroImage) {
                li.innerHTML = `<img src="${resolveImagePath(variation.heroImage)}" alt="${variation.value}" onerror="this.src='${PLACEHOLDER_IMAGE}'">`;
            } else if (variation.images && variation.images.length > 0) {
                li.innerHTML = `<img src="${resolveImagePath(variation.images[0])}" alt="${variation.value}" onerror="this.src='${PLACEHOLDER_IMAGE}'">`;
            }
            li.dataset.variationId = variation._id;
            variantList.appendChild(li);
        });
    }
}


function setupVariantFunctionality(product, variations) {
    const variantList = document.querySelector('.varient-list');
    const expandBtn = document.querySelector('.variants .expand');
    const variantImages = document.querySelectorAll('.varient-img');

    let isExpanded = false;

    // Mark first as selected
    if (variantImages.length > 0) {
        variantImages[0].classList.add('selected-varient');
    }

    // Expand/collapse variants
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            variantList.classList.toggle('expanded', isExpanded);
            expandBtn.classList.toggle('rotated', isExpanded);
        });
    }

    // Handle variant selection
    variantImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const selectedVariation = variations[index];

            // Remove selection from all
            variantImages.forEach((item) => item.classList.remove('selected-varient'));
            
            // Add selection to clicked
            img.classList.add('selected-varient');

            // Update price
            const priceElements = document.querySelectorAll('.product-price, .quantity .price');
            priceElements.forEach(el => {
                el.textContent = `$ ${selectedVariation.price.toFixed(2)}`;
            });

            // Update rating
            const ratingStars = document.querySelectorAll('.stars .star');
            const rating = Math.round(selectedVariation.rating || 0);
            ratingStars.forEach((star, idx) => {
                star.textContent = idx < rating ? '★' : '☆';
                star.style.color = idx < rating ? '#ffc107' : '#ccc';
            });

            // Update rating count
            const ratingCount = document.querySelector('.rating-count');
            if (ratingCount) {
                ratingCount.textContent = `(${rating} stars)`;
            }

            // Collapse variants if expanded
            if (isExpanded) {
                isExpanded = false;
                variantList.classList.remove('expanded');
                if (expandBtn) {
                    expandBtn.classList.remove('rotated');
                }
            }
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProductDetails);
} else {
    loadProductDetails();
}
