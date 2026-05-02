const sidebar = document.querySelector('.others');
const cartBtn = document.querySelector('.cart-btn');
const settingsBtn = document.querySelector('.menu-btn');
const cart = document.querySelector('.cart');
const settings = document.querySelector('.settings');

checkSidebar();

function checkSidebar() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        sidebar.classList.add('hidden');
    }
}

function togglePanel(panelToOpen, panelToHide) {
    const isHidden = panelToOpen.classList.contains('hidden');

    if (isHidden) {
        sidebar.classList.remove('hidden');
        panelToOpen.classList.remove('hidden');
        panelToHide.classList.add('hidden');
        try{
            const overlay = document.querySelector('.overlay');
            if(overlay){
                overlay.classList.remove('hidden');
            }        }catch(error){
            console.error('Error toggling overlay:', error);
        }
    } else {
        sidebar.classList.add('hidden');
        panelToOpen.classList.add('hidden');
        try{
            const overlay = document.querySelector('.overlay');
            if(overlay){
                overlay.classList.add('hidden');
            }
        }catch(error){
            console.error('Error toggling overlay:', error);
        }
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    try{
        const overlay = document.querySelector('.overlay');
        if(overlay){
            overlay.classList.toggle('hidden');
        }
    }catch(error){
        console.error('Error toggling overlay:', error);
    }
}

cartBtn.addEventListener('click', () => togglePanel(cart, settings));
settingsBtn.addEventListener('click', () => togglePanel(settings, cart));