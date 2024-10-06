document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Get form input values
    const usernameOrEmail = document.getElementById('username_or_email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Get elements for displaying error and success messages
    const errorMessage = document.getElementById('error-message');
    const loginMessage = document.getElementById('login-message');

    // Reset the messages
    resetMessages(errorMessage, loginMessage);

    // Basic validation to ensure both fields are filled
    if (!usernameOrEmail || !password) {
        displayMessage(errorMessage, 'Please fill in both fields.');
        return;
    }

    // Retrieve CSRF token from cookies
    const csrfToken = getCSRFTokenFromCookies();

    if (!csrfToken) {
        displayMessage(errorMessage, 'CSRF token not found. Please refresh the page and try again.');
        return;
    }

    try {
        // Send login request to the server
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken // Include CSRF token in headers
            },
            body: JSON.stringify({
                username_or_email: usernameOrEmail,
                password: password
            })
        });

        const result = await response.json();

        // Handle the response based on success, verification status, and errors
        if (response.ok && result.success) {
            // Successful login, save login information to local storage
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userEmail', result.email);

            // Redirect to dashboard
            displayMessage(loginMessage, 'Login successful! Redirecting to dashboard...', true);
            redirectWithDelay(result.redirectUrl || '/dashboard');
        } else if (result.verified === false) {
            // Account not verified, redirect to verification page
            displayMessage(loginMessage, 'Account not verified. Redirecting to verification page...', true);
            redirectWithDelay(result.redirectUrl || '/auth/verify');
        } else {
            // Login failed, show error message
            displayMessage(errorMessage, result.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error during login:', error);
        displayMessage(errorMessage, 'An error occurred. Please check your connection and try again.');
    }
});

// Helper function to get the CSRF token from cookies
function getCSRFTokenFromCookies() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];  // Safe navigation in case the token doesn't exist
}

// Helper function to display messages (success or error)
function displayMessage(element, message, isSuccess = false) {
    element.textContent = message;
    element.classList.remove('hidden');
    setMessageStyle(element, isSuccess);
}

// Helper function to set message styles
function setMessageStyle(element, isSuccess) {
    element.classList.toggle('text-green-500', isSuccess);  // Add green text for success messages
    element.classList.toggle('text-red-500', !isSuccess);  // Add red text for error messages
}

// Helper function to reset messages
function resetMessages(...elements) {
    elements.forEach(element => {
        element.classList.add('hidden');
        element.textContent = '';
    });
}

// Helper function to redirect with a delay
function redirectWithDelay(url, delay = 1000) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);  // Delay redirection for better user experience
}

// Helper function to save login information to local storage
function saveLoginInfo(token, usernameOrEmail, email) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('usernameOrEmail', usernameOrEmail);
    localStorage.setItem('email', email);
}

// Helper function to retrieve login information from local storage
function getLoginInfo() {
    return {
        token: localStorage.getItem('authToken'),
        usernameOrEmail: localStorage.getItem('usernameOrEmail'),
        email: localStorage.getItem('email')
    };
}

// Helper function to clear login information from local storage
function clearLoginInfo() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usernameOrEmail');
    localStorage.removeItem('email');
}