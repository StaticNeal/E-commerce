

// Function to truncate description
function truncateDescription(text, maxLength = 55) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Function to render a single product card with first available variant
function renderProductCard(product, variant) {
    // Use variant data if available, otherwise use product defaults
    const rating = variant ? (variant.rating && variant.rating > 0 ? Math.round(variant.rating) : 4) : 4;
    const price = variant ? variant.price : 0;
    
    // Handle image with fallback
    let image = null;
    if (variant) {
        if (variant.heroImage) {
            image = variant.heroImage.startsWith('http') 
                ? variant.heroImage 
                : `/uploads/${variant.heroImage}`;
        } else if (variant.images && variant.images.length > 0) {
            const firstImg = variant.images[0];
            image = firstImg.startsWith('http') 
                ? firstImg 
                : `/uploads/${firstImg}`;
        }
    }
    
    // Fallback placeholder - SVG data URL
    if (!image) {
        image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23e0e0e0" width="250" height="250"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    const stars = Array(5)
        .fill(0)
        .map((_, i) => `<span class="star">${i < rating ? '★' : '☆'}</span>`)
        .join('');

    const truncatedDescription = truncateDescription(product.description);

    return `
        <div class="card" data-product-id="${product._id}">
            <img src="${image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23999%22%3EImage Error%3C/text%3E%3C/svg%3E'">
            <h2>${product.name}</h2>
            <p>${truncatedDescription}</p>
            <div class="rating">
                ${stars}
            </div>
            <p class="price">$${price.toFixed(2)}</p>
        </div>
    `;
}

// Function to fetch products with variations from API
async function fetchProductsWithVariations() {
    try {
        const response = await fetch('/products');
        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
            // Get all products with their variations populated
            const productsWithVariations = await Promise.all(
                result.data.map(async (product) => {
                    try {
                        const variationResponse = await fetch(`/variations/product/${product._id}`);
                        const variationResult = await variationResponse.json();
                        
                        return {
                            ...product,
                            variations: (variationResult.success && variationResult.data) ? variationResult.data : []
                        };
                    } catch (error) {
                        console.error(`Error fetching variations for product ${product._id}:`, error);
                        return {
                            ...product,
                            variations: []
                        };
                    }
                })
            );
            
            return productsWithVariations;
        } else {
            console.warn('No products found from API');
            return [];
        }
    } catch (error) {
        console.error('Error fetching products from API:', error);
        return [];
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

    // Fetch products with variations from API
    const products = await fetchProductsWithVariations();

    if (products.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">No products available</p>';
        return;
    }

    // Render all products with their first available variant
    products.forEach(product => {
        // Use first variant if available
        const firstVariant = product.variations && product.variations.length > 0 
            ? product.variations[0] 
            : null;
        
        const cardHTML = renderProductCard(product, firstVariant);
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
