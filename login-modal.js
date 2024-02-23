document.addEventListener('DOMContentLoaded', function() {
    var loginBtn = document.getElementById('loginBtn');
    var modalContainer = document.getElementById('modalContainer');

    // Open modal
    loginBtn.addEventListener('click', function() {
        // Fetch the login.html content
        fetch('login.html')
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML = html;
                var modal = document.getElementById('loginModal');
                var closeBtn = document.getElementById('closeModal');
                modal.style.display = 'block';

                // Close modal
                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });

                // Close modal if outside click
                window.addEventListener('click', function(event) {
                    if (event.target == modal) {
                        modal.style.display = 'none';
                    }
                });
            })
            .catch(error => {
                console.error('Error loading the login modal:', error);
            });
    });
});