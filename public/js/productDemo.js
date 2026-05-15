// Fallback demo product data - used if API fails
const fallbackDemoProducts = [
    {
        id: 1,
        name: "Gaming Mouse Pro",
        description: "High performance gaming mouse with precision tracking",
        price: 45.99,
        rating: 5,
        image: "/product-images/hero-images/gaming%20mouse.jpg"
    },
    {
        id: 2,
        name: "RGB Gaming Mouse",
        description: "12000 DPI sensor with ergonomic design for gamers",
        price: 65.99,
        rating: 5,
        image: "/product-images/other-images/Razer%20Naga%20MMO%20Mouse.jpg"
    },
    {
        id: 3,
        name: "Wireless Gaming Mouse",
        description: "Lightspeed wireless technology with long battery life",
        price: 52.99,
        rating: 4,
        image: "/product-images/other-images/Logitech%20G502%20Lightspeed%20Wireless%20Gaming%20Mouse%20with%20Hero%2025K%20Sensor%2C.jpg"
    },
    {
        id: 4,
        name: "Professional Gaming Mouse",
        description: "Advanced sensors for competitive gaming performance",
        price: 58.99,
        rating: 4,
        image: "/product-images/other-images/Amazon_com_%20Logitech%20G300s%20Optical%20Ambidextrous%20Gaming%20Mouse%20%E2%80%93%209%20Programmable%20Buttons%2C%20Onboard%20Memory%20_%20Video%20Games.jpg"
    },
    {
        id: 5,
        name: "Budget Gaming Mouse",
        description: "Affordable gaming mouse with responsive controls",
        price: 39.99,
        rating: 5,
        image: "/product-images/hero-images/%2415_99.jpg"
    },
    {
        id: 6,
        name: "Premium Gaming Mouse",
        description: "Top tier gaming mouse with latest sensor technology",
        price: 72.99,
        rating: 5,
        image: "/product-images/other-images/lucitik.jpg"
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
