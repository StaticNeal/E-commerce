
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