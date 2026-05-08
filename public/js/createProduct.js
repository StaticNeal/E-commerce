
const descriptionElement = document.querySelector('.description');

if (descriptionElement) {

    const fullText = descriptionElement.textContent.trim();

    const words = fullText.split(/\s+/);


    if (words.length > 35) {

        const truncatedText = words.slice(0, 35).join(' ');


        descriptionElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">... Read more</span>`;


        descriptionElement.addEventListener('click', (event) => {

            if (event.target.closest('.toggle-btn')) {
                const currentHtml = descriptionElement.innerHTML;

                if (currentHtml.includes('Read more')) {

                    descriptionElement.innerHTML = `${fullText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">Read less</span>`;
                } else {

                    descriptionElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">... Read more</span>`;
                }
            }
        });
    }
}
;

const productNameElement = document.querySelector('.product-name');

if (productNameElement) {

    const fullText = productNameElement.textContent.trim();

    const words = fullText.split(/\s+/);


    if (words.length > 6) {

        const truncatedText = words.slice(0, 6).join(' ');


        productNameElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">... Read more</span>`;


        productNameElement.addEventListener('click', (event) => {

            if (event.target.closest('.toggle-btn')) {
                const currentHtml = productNameElement.innerHTML;

                if (currentHtml.includes('Read more')) {

                    productNameElement.innerHTML = `${fullText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">Read less</span>`;
                } else {

                    productNameElement.innerHTML = `${truncatedText} <span class="toggle-btn" style="color: #4cacf5;  cursor: pointer;">... Read more</span>`;
                }
            }
        });
    }
}




const heroInput = document.getElementById('product-hero-img-wrapper');
const otherImagesContainer = document.getElementById('other-images-container');

function createThumbnail(imageSrc, isHeroTwin = false) {
    const div = document.createElement('div');
    div.className = 'thumb-tile';
    if (isHeroTwin) div.setAttribute('data-is-hero', 'true');

    div.innerHTML = `
        <img src="${imageSrc}">
        <button class="remove-btn">×</button>
    `;

    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.onclick = function () {
        if (div.getAttribute('data-is-hero') === 'true') {
            // Reset Hero
            heroInput.style.backgroundImage = '';
            heroInput.classList.remove('has-image');
            heroInput.value = '';
        }
        div.remove();
    };

    otherImagesContainer.appendChild(div);
}

heroInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            heroInput.style.backgroundImage = `url(${e.target.result})`;
            heroInput.classList.add('has-image');
            createThumbnail(e.target.result, true);
        }
        reader.readAsDataURL(file);
    }
});

const titleInput = document.getElementById('product-title');

// Auto-adjust height on load
function adjustHeight() {
    titleInput.style.height = 'auto';
    titleInput.style.height = titleInput.scrollHeight + 'px';
}

// Run on load and on every keystroke
window.addEventListener('load', adjustHeight);
titleInput.addEventListener('input', adjustHeight);