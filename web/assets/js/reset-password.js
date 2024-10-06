document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loadingMessage = document.getElementById('loading-message');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    resetBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Hide previous messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
        loadingMessage.classList.add('hidden');

        if (newPassword !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Show loading message
        loadingMessage.classList.remove('hidden');

        const url = window.location.pathname; // Get the current URL path (including the token)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            });

            const result = await response.json();

            if (result.success) {
                loadingMessage.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                loadingMessage.classList.add('hidden');
                errorMessage.textContent = result.message || 'Error resetting password. Please try again.';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            loadingMessage.classList.add('hidden');
            errorMessage.textContent = 'Network error. Please try again.';
            errorMessage.classList.remove('hidden');
        }
    });
});
