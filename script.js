// JavaScript functionality for the website

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const form = document.getElementById('contact-form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // You can add your form submission logic here, like sending an AJAX request
    // For now, let's just log the form data
    const formData = new FormData(form);
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Reset form fields after submission
    form.reset();
});
