
const descriptionElement = document.querySelector('.description');
if (descriptionElement) {
    const fullText = descriptionElement.textContent.trim();
    const words = fullText.split(/\s+/);

    if (words.length > 35) {
        const truncatedText = words.slice(0, 35).join(' ');
        descriptionElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... Read more</span>`;

        descriptionElement.addEventListener('click', (event) => {
            if (event.target.closest('.toggle-btn')) {
                const isTruncated = descriptionElement.innerHTML.includes('Read more');
                descriptionElement.innerHTML = isTruncated 
                    ? `${fullText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">Read less</span>`
                    : `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... Read more</span>`;
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
        productNameElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... Read more</span>`;

        productNameElement.addEventListener('click', (event) => {
            if (event.target.closest('.toggle-btn')) {
                const isTruncated = productNameElement.innerHTML.includes('Read more');
                productNameElement.innerHTML = isTruncated 
                    ? `${fullText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">Read less</span>`
                    : `${truncatedText} <span class="toggle-btn" style="color: #4cacf5; cursor: pointer;">... Read more</span>`;
            }
        });
    }
}


const heroInput = document.getElementById('product-hero-img-wrapper');
const otherImgInput = document.getElementById('product-other-img-input');
const otherImagesContainer = document.getElementById('other-images-container');
const uploadLabel = document.getElementById('upload-label');

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

    
    div.addEventListener('click', function(e) {
        
        if (e.target.classList.contains('remove-btn')) return;

        heroInput.style.backgroundImage = `url(${imageSrc})`;
        heroInput.classList.add('has-image');
        
        
        document.querySelectorAll('.thumb-tile').forEach(t => t.style.borderColor = '#ccc');
        div.style.borderColor = '#4cacf5';
    });

    
    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.onclick = function (e) {
        e.stopPropagation(); 
        if (div.getAttribute('data-is-hero') === 'true' || heroInput.style.backgroundImage.includes(imageSrc)) {
            heroInput.style.backgroundImage = '';
            heroInput.classList.remove('has-image');
        }
        div.remove();
    };

    otherImagesContainer.insertBefore(div, uploadLabel);
}


heroInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            heroInput.style.backgroundImage = `url(${e.target.result})`;
            heroInput.classList.add('has-image');
            
            const existingHero = otherImagesContainer.querySelector('[data-is-hero="true"]');
            if (existingHero) existingHero.remove();
            
            createThumbnail(e.target.result, true);
        }
        reader.readAsDataURL(file);
    }
});



otherImgInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            createThumbnail(e.target.result, false);
            otherImgInput.value = '';
        }
        reader.readAsDataURL(file);
    }
});


const titleInput = document.getElementById('product-title');
function adjustHeight() {
    if (titleInput) {
        titleInput.style.height = 'auto';
        titleInput.style.height = titleInput.scrollHeight + 'px';
    }
}
window.addEventListener('load', adjustHeight);
if (titleInput) titleInput.addEventListener('input', adjustHeight);


