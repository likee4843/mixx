// Admin password
const ADMIN_PASSWORD = 'Brian4843';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (password === ADMIN_PASSWORD) {
        // Store session token
        sessionStorage.setItem('adminLoggedIn', 'true');
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        errorMessage.textContent = '❌ Neno Siri si sahihi!';
        errorMessage.style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
});
