const API_URL = window.location.origin + '/api';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = '/login';
        } else {
            if (data.errors) {
                errorMessage.textContent = data.errors.map(e => e.msg).join(', ');
            } else {
                errorMessage.textContent = data.error || 'Registration failed';
            }
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Network error. Please try again.';
        errorMessage.classList.add('show');
    }
});
