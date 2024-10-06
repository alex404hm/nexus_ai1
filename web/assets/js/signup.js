document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    const showErrorMessage = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    };

    const hideErrorMessage = () => {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim(),
            fullName: document.getElementById('fullName').value.trim(),
        };

        // Basic client-side validation
        if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
            return showErrorMessage('Please fill in all required fields.');
        }

        hideErrorMessage();

        try {
            const csrfToken = getCSRFTokenFromCookies();
            if (!csrfToken) {
                return showErrorMessage('CSRF token not found. Please refresh the page and try again.');
            }

            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken // Include CSRF token in headers
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Signup successful! Please check your email to verify your account.');
                window.location.href = '/auth/login'; // Redirect to login page after successful signup
            } else {
                const errorData = await response.json();
                showErrorMessage(errorData.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    signupForm.addEventListener('submit', handleFormSubmit);
});

// Helper function to get the CSRF token from cookies
function getCSRFTokenFromCookies() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]; // Safe navigation in case the token doesn't exist
}