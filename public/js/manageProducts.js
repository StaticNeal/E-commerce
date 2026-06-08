// Fetch and display user's products
async function loadUserProducts() {
    try {
        const response = await fetch('/products/my-products/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Error fetching products:', result.message);
            return;
        }

        displayProducts(result.data);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the container
function displayProducts(products) {
    const productsContainer = document.querySelector('.products-created-container');

    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }

    // Remove only the created-product divs (preserve .components div for sidebar)
    const existingProducts = productsContainer.querySelectorAll('.created-product');
    existingProducts.forEach(product => product.remove());

    // If no products, show a message in the container
    if (products.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'created-product';
        emptyMessage.innerHTML = '<p style="padding: 20px;">No products created yet.</p>';
        productsContainer.insertBefore(emptyMessage, productsContainer.querySelector('.components'));
        return;
    }

    // Create product elements and insert before .components
    const componentsDiv = productsContainer.querySelector('.components');
    products.forEach(product => {
        const productElement = createProductElement(product);
        productsContainer.insertBefore(productElement, componentsDiv);
    });
}

// Create a product element
function createProductElement(product) {
    // Get first variation for display info (image, price)
    const firstVariation = product.variations && product.variations.length > 0
        ? product.variations[0]
        : null;

    const heroImage = firstVariation?.heroImage
        ? `/uploads/${firstVariation.heroImage}`
        : '/tempimages/vasewhite(1).png';

    const price = firstVariation?.price
        ? `$${firstVariation.price.toFixed(2)}`
        : 'N/A';

    const variantType = firstVariation?.type || firstVariation?.name || 'Standard';

    const div = document.createElement('div');
    div.className = 'created-product';
    div.style.cursor = 'pointer';
    div.innerHTML = `
        <div class="product-image">
            <img src="${heroImage}" alt="${product.name}">
        </div>
        <div class="product-details">
            <h2 class="product-name">${product.name}</h2>
         
            <p class="description">
                ${product.description}
            </p>
            <div class="price" style="padding: 0px 0px 0px !important; margin-top: 1.2rem;">
                ${price}
            </div>
        </div>
    `;
    
    // Add click event to open product for editing
    div.addEventListener('click', function() {
        window.location.href = `/create-product?id=${product._id}`;
    });
    
    return div;
}

// Load products when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserProducts);
} else {
    loadUserProducts();
}

