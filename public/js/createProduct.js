
const descriptionElement = document.querySelector('.description');
if (descriptionElement) {
    const fullText = descriptionElement.textContent.trim();
    const words = fullText.split(/\s+/);

    if (words.length > 35) {
        const truncatedText = words.slice(0, 35).join(' ');
        descriptionElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... ...Read More</span>`;

        descriptionElement.addEventListener('click', (event) => {
            if (event.target.closest('.toggle-btn')) {
                const isTruncated = descriptionElement.innerHTML.includes('...Read More');
                descriptionElement.innerHTML = isTruncated
                    ? `${fullText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">Read Less</span>`
                    : `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... ...Read More</span>`;
            }
        });
    }
}

const productNameElement = document.querySelector('.product-name');
if (productNameElement) {
    const fullText = productNameElement.textContent.trim();
    const words = fullText.split(/\s+/);

    if (words.length > 6) {
        const truncatedText = words.slice(0, 6).join(' ');
        productNameElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... ...Read More</span>`;

        productNameElement.addEventListener('click', (event) => {
            if (event.target.closest('.toggle-btn')) {
                const isTruncated = productNameElement.innerHTML.includes('...Read More');
                productNameElement.innerHTML = isTruncated
                    ? `${fullText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">Read Less</span>`
                    : `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... ...Read More</span>`;
            }
        });
    }
}


const heroInput = document.getElementById('product-hero-img-wrapper');
const otherImgInput = document.getElementById('product-other-img-input');
const otherImagesContainer = document.getElementById('other-images-container');
const uploadLabel = document.getElementById('upload-label');

// File size limit: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Validates file size
 */
function validateFileSize(file) {
    if (file.size > MAX_FILE_SIZE) {
        const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        alert(`File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB`);
        return false;
    }
    return true;
}

/**
 * Creates a thumbnail and adds it to the container.
 */
function createThumbnail(imageSrc, isHeroTwin = false) {
    const div = document.createElement('div');
    div.className = 'thumb-tile';
    if (isHeroTwin) div.setAttribute('data-is-hero', 'true');

    div.innerHTML = `
        <img src="${imageSrc}">
        <button type="button" class="remove-btn">×</button>
    `;


    div.addEventListener('click', function (e) {

        if (e.target.classList.contains('remove-btn')) return;

        heroInput.style.backgroundImage = `url(${imageSrc})`;
        heroInput.classList.add('has-image');


        document.querySelectorAll('.thumb-tile').forEach(t => t.style.borderColor = '#ccc');
        div.style.borderColor = '#4cacf5';
    });


    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.onclick = function (e) {
        e.stopPropagation();
        const isHeroImage = div.getAttribute('data-is-hero') === 'true' || heroInput.style.backgroundImage.includes(imageSrc);

        if (isHeroImage) {
            heroInput.style.backgroundImage = '';
            heroInput.classList.remove('has-image');

            // Remove the hero variant
            const heroVariant = document.querySelector('[data-is-hero-variant="true"]');
            if (heroVariant) heroVariant.remove();
        }

        div.remove();

        // If hero was deleted, automatically select the next available image
        if (isHeroImage) {
            const nextImage = otherImagesContainer.querySelector('.thumb-tile:not([data-is-hero])');
            if (nextImage) {
                const nextImageSrc = nextImage.querySelector('img').src;
                // Simulate click to select it as hero
                nextImage.click();
                // Create variant for it
                createVariantWithImage(nextImageSrc);
            }
        }
    };

    otherImagesContainer.insertBefore(div, uploadLabel);
}


heroInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        // Validate file size
        if (!validateFileSize(file)) {
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            heroInput.style.backgroundImage = `url(${e.target.result})`;
            heroInput.classList.add('has-image');

            const existingHero = otherImagesContainer.querySelector('[data-is-hero="true"]');
            if (existingHero) existingHero.remove();

            createThumbnail(e.target.result, true);

            // Create a variant with the hero image
            createVariantWithImage(e.target.result);
        }
        reader.readAsDataURL(file);
    }
});

/**
 * Creates a variant with the given image
 */
function createVariantWithImage(imageSrc) {
    const variantList = document.querySelector('.varient-list');
    const variantNameInput = document.getElementById('product-variant-name');

    if (!variantList) return;

    // Remove existing hero variant if any
    const existingVariant = variantList.querySelector('[data-is-hero-variant="true"]');
    if (existingVariant) existingVariant.remove();

    // Create variant item
    const variantItem = document.createElement('li');
    variantItem.setAttribute('data-is-hero-variant', 'true');
    variantItem.className = 'variant-item selected';

    variantItem.innerHTML = `
        <img src="${imageSrc}" alt="Variant" class="variant-thumbnail">
        <button type="button" class="variant-remove-btn">×</button>
    `;

    // Click to select this variant
    variantItem.addEventListener('click', function (e) {
        if (e.target.classList.contains('variant-remove-btn')) return;

        // Remove selection from all variants
        document.querySelectorAll('.variant-item').forEach(item => {
            item.classList.remove('selected');
            item.style.borderColor = '#ccc';
        });

        // Select this variant
        variantItem.classList.add('selected');
        variantItem.style.borderColor = '#4cacf5';
    });

    // Remove button
    const removeBtn = variantItem.querySelector('.variant-remove-btn');
    removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isHeroVariant = variantItem.getAttribute('data-is-hero-variant') === 'true';
        variantItem.remove();
        variantNameInput.value = '';

        // If hero variant is removed, auto-select next image
        if (isHeroVariant) {
            const nextImage = otherImagesContainer.querySelector('.thumb-tile:not([data-is-hero])');
            if (nextImage) {
                const nextImageSrc = nextImage.querySelector('img').src;
                // Simulate click to select it as hero
                nextImage.click();
                // Create variant for it
                createVariantWithImage(nextImageSrc);
            } else {
                // Clear hero if no other images
                heroInput.style.backgroundImage = '';
                heroInput.classList.remove('has-image');
            }
        }
    });

    // Add to list before upload button
    const uploadButton = variantList.querySelector('#upload-varient');
    variantList.insertBefore(variantItem, uploadButton);

    // Set as selected
    variantItem.style.borderColor = '#4cacf5';
}




try {
    otherImgInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            // Validate file size
            if (!validateFileSize(file)) {
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                createThumbnail(e.target.result, false);
                otherImgInput.value = '';
            }
            reader.readAsDataURL(file);
        }
    });

} catch (error) {
    console.log('mobile view activated')
}



const titleInput = document.getElementById('product-title');
function adjustHeight() {
    if (titleInput) {
        titleInput.style.height = 'auto';
        titleInput.style.height = titleInput.scrollHeight + 'px';
    }
}
window.addEventListener('load', adjustHeight);
if (titleInput) titleInput.addEventListener('input', adjustHeight);


const varientButton = document.getElementById('upload-varient');

// Get product ID from URL query parameters
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

let editingProductId = null;

// Load product data for editing
async function loadProductForEditing(productId) {
    try {
        console.log('Loading product:', productId);
        const response = await fetch(`/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load product');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to load product');
        }

        const productData = result.data;
        console.log('Product data loaded:', productData);
        editingProductId = productId;

        // Populate form with product data
        document.getElementById('product-title').value = productData.name || '';
        document.getElementById('product-description').value = productData.description || '';
        document.getElementById('product-variant-type').value = productData.category || productData.variantType || '';
        adjustHeight();

        // Load the first variation's data
        if (productData.variations && productData.variations.length > 0) {
            const firstVariation = productData.variations[0];
            console.log('First variation:', firstVariation);

            const priceInput = document.querySelector('.product-price');
            console.log('Price input element:', priceInput);
            console.log('Price value to set:', firstVariation.price);

            if (priceInput) {
                priceInput.value = firstVariation.price || '';
                console.log('Price set to:', priceInput.value);
            } else {
                console.error('Price input element not found!');
            }

            // Load hero image first
            if (firstVariation.heroImage) {
                const heroImageUrl = `/uploads/${firstVariation.heroImage}`;

                // Set hero image background
                heroInput.style.backgroundImage = `url('${heroImageUrl}')`;
                heroInput.classList.add('has-image');

                // Create thumbnail for hero image
                const heroThumbnail = document.createElement('div');
                heroThumbnail.className = 'thumb-tile';
                heroThumbnail.setAttribute('data-is-hero', 'true');
                heroThumbnail.style.borderColor = '#4cacf5';
                heroThumbnail.innerHTML = `
                    <img src="${heroImageUrl}" alt="Hero">
                    <button type="button" class="remove-btn">×</button>
                `;

                heroThumbnail.addEventListener('click', function (e) {
                    if (e.target.classList.contains('remove-btn')) return;
                    heroInput.style.backgroundImage = `url('${heroImageUrl}')`;
                    heroInput.classList.add('has-image');
                    document.querySelectorAll('.thumb-tile').forEach(t => t.style.borderColor = '#ccc');
                    heroThumbnail.style.borderColor = '#4cacf5';
                });

                const removeBtn = heroThumbnail.querySelector('.remove-btn');
                removeBtn.onclick = function (e) {
                    e.stopPropagation();
                    heroInput.style.backgroundImage = '';
                    heroInput.classList.remove('has-image');
                    heroThumbnail.remove();
                };

                const uploadLabel = document.getElementById('upload-label');
                otherImagesContainer.insertBefore(heroThumbnail, uploadLabel);
            }

            // Load other images (all images except hero)
            if (firstVariation.images && Array.isArray(firstVariation.images)) {
                firstVariation.images.forEach(imgName => {
                    // Skip if this is the hero image
                    if (imgName !== firstVariation.heroImage) {
                        const imgUrl = `/uploads/${imgName}`;

                        const thumbnail = document.createElement('div');
                        thumbnail.className = 'thumb-tile';
                        thumbnail.innerHTML = `
                            <img src="${imgUrl}" alt="Product">
                            <button type="button" class="remove-btn">×</button>
                        `;

                        thumbnail.addEventListener('click', function (e) {
                            if (e.target.classList.contains('remove-btn')) return;
                            heroInput.style.backgroundImage = `url('${imgUrl}')`;
                            heroInput.classList.add('has-image');
                            document.querySelectorAll('.thumb-tile').forEach(t => t.style.borderColor = '#ccc');
                            thumbnail.style.borderColor = '#4cacf5';
                        });

                        const removeBtn = thumbnail.querySelector('.remove-btn');
                        removeBtn.onclick = function (e) {
                            e.stopPropagation();
                            const isHeroImage = heroInput.style.backgroundImage.includes(imgUrl);

                            if (isHeroImage) {
                                heroInput.style.backgroundImage = '';
                                heroInput.classList.remove('has-image');
                            }

                            thumbnail.remove();
                        };

                        const uploadLabel = document.getElementById('upload-label');
                        otherImagesContainer.insertBefore(thumbnail, uploadLabel);
                    }
                });
            }

            // Create variant item for editing
            const variantList = document.querySelector('.varient-list');
            if (variantList) {
                const variantItem = document.createElement('li');
                variantItem.setAttribute('data-is-hero-variant', 'true');
                variantItem.className = 'variant-item selected';
                variantItem.style.borderColor = '#4cacf5';

                const variantImageUrl = `/uploads/${firstVariation.heroImage}`;
                variantItem.innerHTML = `
                    <img src="${variantImageUrl}" alt="Variant" class="variant-thumbnail">
                    <button type="button" class="variant-remove-btn">×</button>
                `;

                variantItem.addEventListener('click', function (e) {
                    if (e.target.classList.contains('variant-remove-btn')) return;
                    document.querySelectorAll('.variant-item').forEach(item => {
                        item.classList.remove('selected');
                        item.style.borderColor = '#ccc';
                    });
                    variantItem.classList.add('selected');
                    variantItem.style.borderColor = '#4cacf5';
                });

                const removeBtn = variantItem.querySelector('.variant-remove-btn');
                removeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    variantItem.remove();
                    document.getElementById('product-variant-name').value = '';
                });

                const uploadButton = variantList.querySelector('#upload-varient');
                variantList.insertBefore(variantItem, uploadButton);
            }
        }

        // Update button text to indicate editing
        const saveButton = document.querySelector('.buy-now-btn');
        if (saveButton) {
            saveButton.textContent = 'Update Product';
        }

        console.log('Product loaded successfully');

    } catch (error) {
        console.error('Error loading product:', error);
        alert('Error loading product: ' + error.message);
    }
}

// Save Product Functionality
const saveButton = document.querySelector('.buy-now-btn');
const productPriceInput = document.querySelector('.product-price');

function validateProductForm() {
    const errors = [];

    // Get form values
    const title = document.getElementById('product-title').value.trim();
    const price = productPriceInput.value.trim();
    const description = document.getElementById('product-description').value.trim();
    const hasHeroImage = heroInput.classList.contains('has-image');
    const hasVariant = document.querySelector('[data-is-hero-variant="true"]') !== null;

    // Validate required fields
    if (!title) errors.push('Product name is required');
    if (!price) errors.push('Product price is required');
    if (!description) errors.push('Product description is required');
    if (!hasHeroImage) errors.push('Hero image is required');
    if (!hasVariant) errors.push('At least one variant (with image) is required');

    return { isValid: errors.length === 0, errors };
}

function saveProduct() {
    const validation = validateProductForm();

    if (!validation.isValid) {
        alert('Please fill all required fields:\n' + validation.errors.join('\n'));
        return;
    }

    // Collect product data
    const price = productPriceInput.value.trim();
    const productData = {
        title: document.getElementById('product-title').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        variantType: document.getElementById('product-variant-type').value.trim() || '',
        variants: []
    };

    // Collect all thumbnail images (both hero and other images)
    const thumbnails = document.querySelectorAll('.thumb-tile img');
    const allImages = [];
    let heroImage = null;

    thumbnails.forEach((img, index) => {
        if (img && img.src) {
            allImages.push(img.src);
            // First image is the hero image
            if (index === 0) {
                heroImage = img.src;
            }
        }
    });

    // Validate we have images to save
    if (allImages.length === 0) {
        alert('Please add at least one product image');
        return;
    }

    // Create a single variant with all images
    productData.variants.push({
        images: allImages,
        heroImage: heroImage,
        type: productData.variantType || 'Original',
        price: parseFloat(price) || 0
    });

    // Determine if creating new or updating existing
    const isEditing = editingProductId !== null;
    const endpoint = isEditing ? `/products/${editingProductId}` : '/products/new';
    const method = isEditing ? 'PUT' : 'POST';

    // Send to server
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const message = isEditing ? 'Product updated successfully!' : 'Product saved successfully!';
                alert(message);

                if (isEditing) {
                    // Redirect back to manage products after update
                    window.location.href = '/manage-products';
                } else {
                    // Reset form for new products
                    document.getElementById('product-title').value = '';
                    productPriceInput.value = '';
                    document.getElementById('product-description').value = '';
                    document.getElementById('product-variant-type').value = '';
                    heroInput.style.backgroundImage = '';
                    heroInput.classList.remove('has-image');
                    document.querySelectorAll('[data-is-hero-variant="true"]').forEach(v => v.remove());
                    document.querySelectorAll('.thumb-tile').forEach(t => t.remove());
                }
            } else {
                alert('Error saving product: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving product: ' + error.message);
        });
}

if (saveButton) {
    saveButton.addEventListener('click', saveProduct);
}

// Initialize - Load product if editing
document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductIdFromUrl();
    if (productId) {
        loadProductForEditing(productId);
        
        // Show delete button only when editing
        const deleteBtn = document.querySelector('.add-to-wishlist-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                deleteCurrentProduct(productId);
            });
        }
    } else {
        // Hide delete button when creating new product
        const deleteBtn = document.querySelector('.add-to-wishlist-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'none';
        }
    }
});

// Delete product handler
async function deleteCurrentProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            alert('Product deleted successfully!');
            window.location.href = '/manage-products';
        } else {
            alert('Error deleting product: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
    }
}