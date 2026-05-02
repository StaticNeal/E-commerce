const sidebar = document.querySelector('.others');
const homeBtn = document.querySelector('.home-btn');
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

function togglePanel(panelToOpen, panelToHide, button) {
    const isHidden = panelToOpen.classList.contains('hidden');

    if (isHidden) {
        sidebar.classList.remove('hidden');
        panelToOpen.classList.remove('hidden');
        panelToHide.classList.add('hidden');
        
        // Remove active class from all menu buttons
        if (homeBtn) homeBtn.classList.remove('active-menu-item');
        if (cartBtn) cartBtn.classList.remove('active-menu-item');
        if (settingsBtn) settingsBtn.classList.remove('active-menu-item');
        
        // Add active class to current button
        if (button) {
            button.classList.add('active-menu-item');
        }
        
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
        
        // Remove active class from all menu buttons
        if (cartBtn) cartBtn.classList.remove('active-menu-item');
        if (settingsBtn) settingsBtn.classList.remove('active-menu-item');
        
        // Set home button as active when closing menu
        if (homeBtn) homeBtn.classList.add('active-menu-item');
        
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
    
    // Remove active class from all menu buttons when closing
    if (sidebar.classList.contains('hidden')) {
        if (cartBtn) cartBtn.classList.remove('active-menu-item');
        if (settingsBtn) settingsBtn.classList.remove('active-menu-item');
        
        // Set home button as active when closing
        if (homeBtn) homeBtn.classList.add('active-menu-item');
    }
    
    try{
        const overlay = document.querySelector('.overlay');
        if(overlay){
            overlay.classList.toggle('hidden');
        }
    }catch(error){
        console.error('Error toggling overlay:', error);
    }
}

cartBtn.addEventListener('click', () => togglePanel(cart, settings, cartBtn));
settingsBtn.addEventListener('click', () => togglePanel(settings, cart, settingsBtn));

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        sidebar.classList.add('hidden');
        cart.classList.add('hidden');
        settings.classList.add('hidden');
        
        if (cartBtn) cartBtn.classList.remove('active-menu-item');
        if (settingsBtn) settingsBtn.classList.remove('active-menu-item');
        if (homeBtn) homeBtn.classList.add('active-menu-item');
        
        try{
            const overlay = document.querySelector('.overlay');
            if(overlay){
                overlay.classList.add('hidden');
            }
        }catch(error){
            console.error('Error toggling overlay:', error);
        }
    });
}