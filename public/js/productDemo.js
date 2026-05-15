// Fallback demo product data - used if API fails
const fallbackDemoProducts = [
    {
        id: 1,
        name: "Brown Ceramic Vase Classic",
        description: "Beautiful handcrafted brown ceramic vase with elegant design",
        price: 45.99,
        rating: 5,
        image: "/product-images/vasebrown(1).png"
    },
    {
        id: 2,
        name: "Brown Vase Deluxe",
        description: "Premium brown vase with intricate detailing and smooth finish",
        price: 65.99,
        rating: 5,
        image: "/product-images/vasebrown(2).png"
    },
    {
        id: 3,
        name: "Brown Rustic Vase",
        description: "Rustic brown vase perfect for traditional home decor",
        price: 52.99,
        rating: 4,
        image: "/product-images/vasebrown(3).png"
    },
    {
        id: 4,
        name: "Brown Modern Vase",
        description: "Contemporary brown ceramic vase with sleek modern lines",
        price: 58.99,
        rating: 4,
        image: "/product-images/vasebrown(4).png"
    },
    {
        id: 5,
        name: "White Ceramic Vase",
        description: "Elegant white ceramic vase with minimalist design",
        price: 39.99,
        rating: 5,
        image: "/product-images/vasewhite(1).png"
    },
    {
        id: 6,
        name: "White Porcelain Vase",
        description: "Fine porcelain white vase with refined elegant style",
        price: 72.99,
        rating: 5,
        image: "/product-images/vasewhite(2).png"
    },
    {
        id: 7,
        name: "White Minimalist Vase",
        description: "Clean white vase with minimalist contemporary aesthetic",
        price: 49.99,
        rating: 4,
        image: "/product-images/vasewhite(3).png"
    },
    {
        id: 8,
        name: "White Modern Vase",
        description: "Modern white ceramic vase with artistic finish",
        price: 62.99,
        rating: 4,
        image: "/product-images/vasewhite(4).png"
    }
];

// Function to truncate description
function truncateDescription(text, maxLength = 55) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Function to render a single product card
function renderProductCard(product) {
    const stars = Array(5)
        .fill(0)
        .map((_, i) => `<span class="star">${i < (product.rating || 0) ? '★' : '☆'}</span>`)
        .join('');

    const image = product.images && product.images.length > 0 
        ? product.images[0] 
        : product.image;

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
            console.log('Product clicked:', productId);
            // TODO: Navigate to product details page or open modal
            // Example: window.location.href = `/product/${productId}`;
        });
    });
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
