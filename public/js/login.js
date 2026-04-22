// API Configuration
const API_BASE_URL = '';
const REQUEST_OTP_ENDPOINT = '/api/auth/request-otp';
const VERIFY_OTP_ENDPOINT = '/api/auth/verify-otp';

// DOM Elements
const emailForm = document.getElementById('emailForm');
const otpForm = document.getElementById('otpForm');
const emailFormElement = document.getElementById('emailFormElement');
const otpFormElement = document.getElementById('otpFormElement');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const emailMessage = document.getElementById('emailMessage');
const otpMessage = document.getElementById('otpMessage');
const displayEmail = document.getElementById('displayEmail');
const backBtn = document.getElementById('backBtn');
const resendBtn = document.getElementById('resendBtn');
const resendTimer = document.getElementById('resendTimer');
const emailSubmitBtn = emailFormElement.querySelector('button[type="submit"]');
const otpSubmitBtn = otpFormElement.querySelector('button[type="submit"]');

let currentEmail = '';
let resendCooldown = 0;

// Email Form Submission
emailFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentEmail = emailInput.value.trim();

    if (!currentEmail) {
        showEmailMessage('Please enter an email address', 'error');
        return;
    }

    await requestOTP(currentEmail);
});

// Request OTP
async function requestOTP(email) {
    try {
        emailSubmitBtn.disabled = true;
        emailSubmitBtn.innerHTML = 'Sending...';
        emailMessage.textContent = 'Sending OTP...';
        emailMessage.className = 'form-message loading';

        const response = await fetch(REQUEST_OTP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            showEmailMessage('OTP sent successfully!', 'success');
            displayEmail.textContent = email;
            
            // Switch to OTP form
            setTimeout(() => {
                emailForm.classList.add('hidden');
                otpForm.classList.remove('hidden');
                otpInput.focus();
            }, 1000);
        } else {
            emailSubmitBtn.disabled = false;
            emailSubmitBtn.innerHTML = 'Next';
            showEmailMessage(data.message || 'Failed to send OTP', 'error');
        }
    } catch (error) {
        console.error('Request OTP Error:', error);
        emailSubmitBtn.disabled = false;
        emailSubmitBtn.innerHTML = 'Next';
        showEmailMessage('Error sending OTP. Please try again.', 'error');
    }
}

// OTP Form Submission
otpFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = otpInput.value.trim();

    if (!otp || otp.length !== 6) {
        showOTPMessage('Please enter a valid 6-digit OTP', 'error');
        return;
    }

    await verifyOTP(currentEmail, otp);
});

// Verify OTP
async function verifyOTP(email, otp) {
    try {
        otpSubmitBtn.disabled = true;
        otpSubmitBtn.innerHTML = 'Verifying...';
        otpMessage.textContent = 'Verifying OTP...';
        otpMessage.className = 'form-message loading';

        const response = await fetch(VERIFY_OTP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (data.success) {
            showOTPMessage('Login successful!', 'success');
            
            // Store user data if needed
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // Redirect to home page after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            otpSubmitBtn.disabled = false;
            otpSubmitBtn.innerHTML = 'Verify';
            showOTPMessage(data.message || 'Invalid OTP', 'error');
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        otpSubmitBtn.disabled = false;
        otpSubmitBtn.innerHTML = 'Verify';
        showOTPMessage('Error verifying OTP. Please try again.', 'error');
    }
}

// Back Button
backBtn.addEventListener('click', () => {
    otpForm.classList.add('hidden');
    emailForm.classList.remove('hidden');
    otpInput.value = '';
    emailInput.value = '';
    emailInput.focus();
    emailMessage.textContent = '';
    emailMessage.className = 'form-message';
    otpMessage.textContent = '';
    otpMessage.className = 'form-message';
});


// Show Email Message
function showEmailMessage(message, type) {
    emailMessage.textContent = message;
    emailMessage.className = `form-message ${type}`;
}

// Show OTP Message
function showOTPMessage(message, type) {
    otpMessage.textContent = message;
    otpMessage.className = `form-message ${type}`;
}

// Auto-format OTP input (numbers only)
otpInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
});

// Email validation on input
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email && !isValid) {
        showEmailMessage('Please enter a valid email address', 'error');
    } else {
        showEmailMessage('', '');
    }
});
