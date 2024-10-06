document.getElementById('generate-2fa-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/generate-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('qr-code').src = data.qrCode;
            document.getElementById('qr-code-container').classList.remove('hidden');
            document.getElementById('verify-2fa-container').classList.remove('hidden');
        } else {
            document.getElementById('message').textContent = data.message;
        }
    } catch (error) {
        console.error('Error generating 2FA:', error);
        document.getElementById('message').textContent = 'Failed to generate 2FA. Please try again.';
    }
});

document.getElementById('verify-2fa-btn').addEventListener('click', async () => {
    const token = document.getElementById('2fa-token').value.trim();
    if (!token) {
        document.getElementById('message').textContent = 'Please enter the 2FA code.';
        return;
    }

    try {
        const response = await fetch('/auth/verify-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('message').textContent = '2FA setup successfully!';
        } else {
            document.getElementById('message').textContent = data.message;
        }
    } catch (error) {
        console.error('Error verifying 2FA:', error);
        document.getElementById('message').textContent = 'Failed to verify 2FA. Please try again.';
    }
});