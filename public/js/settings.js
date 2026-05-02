
async function updateSettingsVisibility() {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const isLoggedIn = data.success && data.user;

        // Get all elements with login-related classes
        const loggedInElements = document.querySelectorAll('.for-logged');
        const notLoggedInElements = document.querySelectorAll('.for-not-logged');

        // Show/hide based on login status
        loggedInElements.forEach(el => {
            el.style.display = isLoggedIn ? 'block' : 'none';
        });

        notLoggedInElements.forEach(el => {
            el.style.display = isLoggedIn ? 'none' : 'block';
        });
    } catch (error) {
        // If error, hide logged-in elements (assume not logged in)
        const loggedInElements = document.querySelectorAll('.for-logged');
        const notLoggedInElements = document.querySelectorAll('.for-not-logged');
        
        loggedInElements.forEach(el => {
            el.style.display = 'none';
        });

        notLoggedInElements.forEach(el => {
            el.style.display = 'block';
        });
    }
}

/**
 * Handle logout button click
 */
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to home page
                window.location.href = '/';
            } else {
                alert('Logout failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error during logout. Please try again.');
        }
    });
}

// Update visibility when page loads
document.addEventListener('DOMContentLoaded', updateSettingsVisibility);