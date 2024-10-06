// Reset Password Modal Logic

const resetModal = document.getElementById('reset-password-modal');
const resetErrorMessage = document.getElementById('reset-error-message');

document.getElementById('forgot-password-link').addEventListener('click', () => toggleModal(true));
document.getElementById('close-reset-modal').addEventListener('click', () => toggleModal(false));

document.getElementById('send-reset-btn').addEventListener('click', async () => {
    const resetUsernameOrEmail = document.getElementById('reset-username-or-email').value.trim();

    clearResetError();

    if (!resetUsernameOrEmail) {
        displayResetErrorMessage('Please enter your username or email.');
        return;
    }

    try {
        const response = await fetch('/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username_or_email: resetUsernameOrEmail }),
        });

        const result = await handleResponse(response);
        if (result.success) {
            alert('A reset password link has been sent to your email.');
            toggleModal(false);
        } else {
            displayResetErrorMessage(result.message || 'Failed to send reset link. Please try again.');
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        displayResetErrorMessage('Network error. Please check your connection and try again.');
    }
});

// Toggle Modal Visibility
function toggleModal(isVisible) {
    resetModal.classList.toggle('hidden', !isVisible);
    resetModal.classList.toggle('flex', isVisible);
}

// Clear previous error messages
function clearResetError() {
    resetErrorMessage.classList.add('hidden');
}

// Display error messages
function displayResetErrorMessage(message) {
    resetErrorMessage.textContent = message;
    resetErrorMessage.classList.remove('hidden');
}

// Handle server response
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Failed to reach server.');
    }
    return response.json();
}
