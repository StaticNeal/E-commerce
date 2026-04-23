

function getTrimmedName(name) {
    const maxChars = 10;
    if (name.length > maxChars) {
        return name.substring(0, maxChars) + '...';
    }
    return name;
}

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
            
            console.log('User logged in:', data.user.email);
            updateNavbarForLoggedInUser(data.user);
        } else {
            
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
            const trimmedUsername = getTrimmedName(user.username);
            loginBtn.innerHTML = `<span class="user-name">${trimmedUsername}</span>`;
            console.log('✓ Showing username:', user.username, '→', trimmedUsername);
        } else if (user.name) {
            const trimmedName = getTrimmedName(user.name);
            loginBtn.innerHTML = `<span class="user-name">${trimmedName}</span>`;
            console.log('✓ Showing name:', user.name, '→', trimmedName);
        } else {
            
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUserLogin);
} else {
    checkUserLogin();
}
