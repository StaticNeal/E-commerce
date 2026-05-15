// Get product ID from URL
const productId = window.location.pathname.split('/product/')[1];

// Fetch and display product details
async function loadProductDetails() {
    if (!productId) {
        console.error('Product ID not found');
        return;
    }

    try {
        const response = await fetch(`/products/${productId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const product = result.data;
            displayProductDetails(product);
            setupVariantFunctionality(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

// Display product details on the page
function displayProductDetails(product) {
    // Update hero image
    const heroImgInput = document.getElementById('product-hero-img-wrapper');
    if (heroImgInput && product.heroImage) {
        heroImgInput.style.backgroundImage = `url(${product.heroImage})`;
        heroImgInput.style.backgroundSize = 'cover';
        heroImgInput.style.backgroundPosition = 'center';
    }

    // Update other images
    const otherImgsWrapper = document.querySelector('.product-other-imgs-wrapper');
    if (otherImgsWrapper && product.images && product.images.length > 0) {
        otherImgsWrapper.innerHTML = '';
        product.images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.alt = product.name;
            otherImgsWrapper.appendChild(imgEl);
        });
    }

    // Update product name
    const productName = document.querySelector('.product-name');
    if (productName) {
        productName.textContent = product.name;
    }

    // Update rating
    const ratingStars = document.querySelectorAll('.stars .star');
    const rating = Math.round(product.rating || 0);
    ratingStars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
        star.style.color = index < rating ? '#ffc107' : '#ccc';
    });

    // Update rating count
    const ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
        ratingCount.textContent = `(${rating} stars)`;
    }

    // Update price
    const priceElements = document.querySelectorAll('.product-price, .quantity .price');
    priceElements.forEach(el => {
        el.textContent = `$ ${product.price.toFixed(2)}`;
    });

    // Update description
    const description = document.querySelector('.description');
    if (description) {
        description.textContent = product.description;
    }

    // Update variants if available
    if (product.images && product.images.length > 0) {
        const variantList = document.querySelector('.varient-list');
        if (variantList) {
            variantList.innerHTML = '';
            product.images.forEach((img, index) => {
                const li = document.createElement('li');
                li.className = 'varient-img' + (index === 0 ? ' selected-varient' : '');
                li.innerHTML = `<img src="${img}" alt="Variant ${index + 1}">`;
                variantList.appendChild(li);
            });
        }
    }
}

// Setup variant functionality
function setupVariantFunctionality(product) {
    const variantList = document.querySelector('.varient-list');
    const expandBtn = document.querySelector('.variants .expand');
    const variantImages = document.querySelectorAll('.varient-img');
    const heroImgInput = document.getElementById('product-hero-img-wrapper');

    let isExpanded = false;

    // Set first image as selected by default
    if (variantImages.length > 0) {
        variantImages[0].classList.add('selected-varient');
    }

    // Expand/collapse button functionality
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            variantList.classList.toggle('expanded', isExpanded);
            expandBtn.classList.toggle('rotated', isExpanded);
        });
    }

    // Image selection functionality
    variantImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            // Remove selected class from all
            variantImages.forEach((item) => item.classList.remove('selected-varient'));
            
            // Add selected class to clicked image
            img.classList.add('selected-varient');

            // Update hero image
            if (heroImgInput && product.images && product.images[index]) {
                heroImgInput.style.backgroundImage = `url(${product.images[index]})`;
            }

            // Collapse after selection if expanded
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

// Load product when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProductDetails);
} else {
    loadProductDetails();
}
