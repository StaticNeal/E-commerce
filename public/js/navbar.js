// Check if user is logged in and update navbar
async function checkUserLogin() {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Auth check response:', data);

        if (data.success && data.user) {
            // User is logged in
            console.log('User logged in:', data.user.email);
            updateNavbarForLoggedInUser(data.user);
        } else {
            // User is not logged in
            console.log('User not logged in');
            updateNavbarForLoggedOutUser();
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        updateNavbarForLoggedOutUser();
    }
}

function updateNavbarForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (user.username) {
            // User has a username - show username
            loginBtn.innerHTML = `<span class="user-name">${user.username}</span>`;
            console.log('✓ Showing username:', user.username);
        } else if (user.name) {
            // User has a name - show name
            loginBtn.innerHTML = `<span class="user-name">${user.name}</span>`;
            console.log('✓ Showing name:', user.name);
        } else {
            // Show "Add Username" link
            loginBtn.innerHTML = `<a href="/update-profile" class="add-username-link"><b>Add Username</b></a>`;
            console.log('✓ Showing Add Username link');
        }
        loginBtn.style.display = 'block';
    }
}

function updateNavbarForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<a href="/login">Login</a>`;
        loginBtn.style.display = 'block';
        console.log('✓ Showing Login button');
    }
}

// Initialize navbar on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUserLogin);
} else {
    checkUserLogin();
}
