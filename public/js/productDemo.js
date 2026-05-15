

// Function to truncate description
function truncateDescription(text, maxLength = 55) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Function to render a single product card
function renderProductCard(product) {
    // Set default rating to 4 if not provided or is 0
    const rating = (product.rating && product.rating > 0) ? Math.round(product.rating) : 4;
    
    const stars = Array(5)
        .fill(0)
        .map((_, i) => `<span class="star">${i < rating ? '★' : '☆'}</span>`)
        .join('');

    // Prioritize heroImage first, then images array, then fallback image
    const image = product.heroImage 
        ? product.heroImage
        : (product.images && product.images.length > 0 ? product.images[0] : product.image);

    const truncatedDescription = truncateDescription(product.description);

    return `
        <div class="card" data-product-id="${product._id || product.id}">
            <img src="${image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${truncatedDescription}</p>
            <div class="rating">
                ${stars}
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
        </div>
    `;
}

// Function to fetch products from API
async function fetchProductsFromAPI() {
    try {
        const response = await fetch('/products');
        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        } else {
            console.warn('API returned no products, using fallback demo data');
            return fallbackDemoProducts;
        }
    } catch (error) {
        console.error('Error fetching products from API:', error);
        console.warn('Using fallback demo data');
        return fallbackDemoProducts;
    }
}

// Function to load and display all products
async function loadProducts() {
    const productsContainer = document.querySelector('.products');
    
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }

    // Clear existing content
    productsContainer.innerHTML = '';

    // Fetch products from API
    const products = await fetchProductsFromAPI();

    // Render all products
    products.forEach(product => {
        const cardHTML = renderProductCard(product);
        productsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Add click handlers to product cards
    attachProductClickHandlers();
}

// Function to attach click handlers to product cards
function attachProductClickHandlers() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `/product/${productId}`;
            }
        });
    });
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
