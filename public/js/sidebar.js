const sidebar = document.querySelector('.others');
const cartBtn = document.querySelector('.cart-btn');
const settingsBtn = document.querySelector('.menu-btn');
const cart = document.querySelector('.cart');
const settings = document.querySelector('.settings');

function togglePanel(panelToOpen, panelToHide) {
    const isHidden = panelToOpen.classList.contains('hidden');

    if (isHidden) {
        sidebar.classList.remove('hidden');
        panelToOpen.classList.remove('hidden');
        panelToHide.classList.add('hidden');
    } else {
        sidebar.classList.add('hidden');
        panelToOpen.classList.add('hidden');
    }
}

cartBtn.addEventListener('click', () => togglePanel(cart, settings));
settingsBtn.addEventListener('click', () => togglePanel(settings, cart));