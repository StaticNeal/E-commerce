// Check if user is logged in and update navbar
async function checkUserLogin() {
    try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.success && data.user) {
            // User is logged in
            updateNavbarForLoggedInUser(data.user);
        } else {
            // User is not logged in
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
        loginBtn.innerHTML = `
            <div class="user-profile">
                <span class="user-name">${user.name}</span>
                <button class="logout-btn">Logout</button>
            </div>
        `;

        // Add logout functionality
        const logoutBtn = loginBtn.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await logout();
        });
    }
}

function updateNavbarForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<a href="/login">Login</a>`;
    }
}

async function logout() {
    try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            // Redirect to home page
            window.location.href = '/';
        } else {
            alert('Error logging out');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', checkUserLogin);
