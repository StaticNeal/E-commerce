
const productId = window.location.pathname.split('/product/')[1];


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


function displayProductDetails(product) {
    
    const heroImgInput = document.getElementById('product-hero-img-wrapper');
    if (heroImgInput && product.heroImage) {
        heroImgInput.style.backgroundImage = `url(${product.heroImage})`;
        heroImgInput.style.backgroundSize = 'cover';
        heroImgInput.style.backgroundPosition = 'center';
    }

    
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

    
    const productName = document.querySelector('.product-name');
    if (productName) {
        productName.textContent = product.name;
    }

    
    const ratingStars = document.querySelectorAll('.stars .star');
    const rating = Math.round(product.rating || 0);
    ratingStars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
        star.style.color = index < rating ? '#ffc107' : '#ccc';
    });

    
    const ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
        ratingCount.textContent = `(${rating} stars)`;
    }

    
    const priceElements = document.querySelectorAll('.product-price, .quantity .price');
    priceElements.forEach(el => {
        el.textContent = `$ ${product.price.toFixed(2)}`;
    });

    
    const description = document.querySelector('.description');
    if (description) {
        description.textContent = product.description;
    }

    
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


function setupVariantFunctionality(product) {
    const variantList = document.querySelector('.varient-list');
    const expandBtn = document.querySelector('.variants .expand');
    const variantImages = document.querySelectorAll('.varient-img');
    const heroImgInput = document.getElementById('product-hero-img-wrapper');

    let isExpanded = false;

    
    if (variantImages.length > 0) {
        variantImages[0].classList.add('selected-varient');
    }

    
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            variantList.classList.toggle('expanded', isExpanded);
            expandBtn.classList.toggle('rotated', isExpanded);
        });
    }

    
    variantImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            
            variantImages.forEach((item) => item.classList.remove('selected-varient'));
            
            
            img.classList.add('selected-varient');

            
            if (heroImgInput && product.images && product.images[index]) {
                heroImgInput.style.backgroundImage = `url(${product.images[index]})`;
            }

            
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
