import { displayProfilePage } from "./profile.js";

export const displayLoginPage = () => {
    const mainContainer = document.getElementById('app');

    mainContainer.innerHTML = `
        <div class="login-container">
            <h1 class="login-title">Login</h1>
            <form class="login-form">
                <div class="form-group">
                    <label for="username">Username or Email</label>
                    <input type="text" id="username" placeholder="Enter your username or email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password">
                </div>
                <div class="error-message" id="error-message"></div>
                <button id="login-button" class="login-button">Sign In</button>
            </form>
        </div>
    `;

    document.querySelector('.login-form').addEventListener('submit', (e) => {
        e.preventDefault()
        handleLogin()
    }
    );
}

const handleLogin = async () => {
    const identifier = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessageEl = document.getElementById('error-message');

    if (!identifier || !password) {
        errorMessageEl.textContent = 'Please enter both username/email and password';
        return;
    }

    errorMessageEl.textContent = '';

    try {
        const encodedCredentials = btoa(`${identifier}:${password}`);

        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid credentials. Please try again.');
        }

        const jwt = await response.json();

        localStorage.setItem('token', jwt);
        displayProfilePage();
    } catch (error) {
        errorMessageEl.textContent = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
    }
}

export const logout = () => {
    localStorage.removeItem('token');

    displayLoginPage();
}
