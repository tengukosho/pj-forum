// Authentication utilities
const API_URL = window.location.origin + '/api';

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function isAuthenticated() {
    return !!getToken();
}

function updateAuthUI() {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (isAuthenticated()) {
        const user = getUser();
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = user.username + (user.role !== 'user' ? ` (${user.role})` : '');

        // Show admin/moderator buttons
        if (user.role === 'admin') {
            const createCategoryBtn = document.getElementById('create-category-btn');
            if (createCategoryBtn) createCategoryBtn.style.display = 'inline-block';
        }

        // Show create topic button if on category page
        const createTopicBtn = document.getElementById('create-topic-btn');
        if (createTopicBtn) createTopicBtn.style.display = 'inline-block';

        // Show reply section if on topic page
        const replySection = document.getElementById('reply-section');
        if (replySection) replySection.style.display = 'block';

        // Show topic actions if moderator/admin on topic page
        const topicActions = document.getElementById('topic-actions');
        if (topicActions && (user.role === 'moderator' || user.role === 'admin')) {
            topicActions.style.display = 'block';
        }
    } else {
        if (authLinks) authLinks.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

function logout() {
    removeToken();
    window.location.href = '/';
}

// Set up logout button
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// Fetch with auth token
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return fetch(url, options);
}
