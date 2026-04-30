document.addEventListener('DOMContentLoaded', () => {
    const variantList = document.querySelector('.varient-list');
    const expandBtn = document.querySelector('.variants .expand');
    const variantImages = document.querySelectorAll('.varient-img');

    let isExpanded = false;

    // Set first image as selected by default
    if (variantImages.length > 0) {
        variantImages[0].classList.add('selected-varient');
    }

    // Expand/collapse button functionality
    expandBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        variantList.classList.toggle('expanded', isExpanded);
        expandBtn.classList.toggle('rotated', isExpanded);
    });

    // Image selection functionality
    variantImages.forEach((img) => {
        img.addEventListener('click', () => {
            // Remove selected class from all
            variantImages.forEach((item) => item.classList.remove('selected-varient'));
            
            // Add selected class to clicked image
            img.classList.add('selected-varient');

            // Collapse after selection if expanded
            if (isExpanded) {
                isExpanded = false;
                variantList.classList.remove('expanded');
                expandBtn.classList.remove('rotated');
            }
        });
    });
});
