const usernameForm = document.getElementById('usernameFormElement');
const usernameInput = document.getElementById('username');
const usernameMessage = document.getElementById('usernameMessage');


let currentUserEmail = '';

async function loadUserData() {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                showMessage('Please login first', 'error');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (data.success) {
            currentUserEmail = data.user.email;
            // Display existing username if available
            if (data.user.username) {
                usernameInput.value = data.user.username;
            } else {
                usernameInput.value = '';
            }
          
        }
    } catch (error) {
        showMessage('Error loading profile data', 'error');
    }
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {string|null} - Error message or null if valid
 */
function validateUsername(username) {
    if (!username || username.trim() === '') {
        return 'Username cannot be empty';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 50) {
        return 'Username must not exceed 50 characters';
    }
    return null;
}

/**
 * @param {string} message 
 * @param {string} type
 */
function showMessage(message, type = 'info') {
    usernameMessage.textContent = message;
    usernameMessage.className = `form-message ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            usernameMessage.textContent = '';
            usernameMessage.className = 'form-message';
        }, 3000);
    }
}


async function updateProfileUsername() {
    const username = usernameInput.value.trim();

    
    const validationError = validateUsername(username);
    if (validationError) {
        showMessage(validationError, 'error');
        return;
    }

    
    if (!currentUserEmail) {
        showMessage('Please login first', 'error');
        return;
    }

    try {
        
        const submitButton = usernameForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Updating...';
        submitButton.disabled = true;

        const response = await fetch('/api/auth/update-username', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: currentUserEmail,
                username: username
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Username updated successfully!', 'success');
            usernameInput.value = '';
            window.location.href = '/';
        } else {
            showMessage(data.message || 'Failed to update username', 'error');
        }
    } catch (error) {
        showMessage('Error updating username. Please try again.', 'error');
    } finally {
        
        const submitButton = usernameForm.querySelector('button[type="submit"]');
        submitButton.textContent = "Update";
        submitButton.disabled = false;
    }
}


if (usernameForm) {
    usernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProfileUsername();
    });
}

document.addEventListener('DOMContentLoaded', loadUserData);
