document.addEventListener('DOMContentLoaded', () => {
    const verifyBtn = document.getElementById('verify-btn');
    const confirmationMessage = document.getElementById('confirmation-message');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');
    const userEmailDisplay = document.getElementById('user-email-display');

    // Retrieve user email from local storage
    const userEmail = localStorage.getItem('userEmail');

    // Display user email if available
    if (userEmail) {
        userEmailDisplay.textContent = userEmail;
    }

    // Helper function to get CSRF token from cookies
    const getCSRFTokenFromCookies = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];  // Extract CSRF token from cookies
    };

    // Event listener for verifying email
    verifyBtn.addEventListener('click', async () => {
        toggleMessages('loading');
        const csrfToken = getCSRFTokenFromCookies();  // Get the CSRF token from cookies

        try {
            const response = await fetch('/auth/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,  // Include CSRF token in headers
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toggleMessages('success');
            } else {
                toggleMessages('error', result.message || 'No user found with that email address.');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            toggleMessages('error', 'An error occurred while sending the verification email.');
        }
    });

    // Helper function to toggle feedback messages (loading, success, error)
    function toggleMessages(state, message = '') {
        loadingMessage.classList.toggle('hidden', state !== 'loading');
        confirmationMessage.classList.toggle('hidden', state !== 'success');
        errorMessage.classList.toggle('hidden', state !== 'error');

        if (state === 'error') {
            errorMessage.textContent = message;
        }
    }
});