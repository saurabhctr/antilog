// success-page.js

document.addEventListener('DOMContentLoaded', function() {
    // Go to Dashboard button click event
    particlesJS.load('particles-js', 'particlesjs-config.json', function() {
        console.log('callback - particles.js config loaded');
    });
    document.getElementById('goToDashboardBtn').addEventListener('click', function() {
        // Navigate to the home page (replace 'index.html' with your actual home page URL)
        window.location.href = 'index.html';
    });
});
