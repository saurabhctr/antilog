// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
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

// Click event handling for Buy Now buttons
const buyNowButtons = document.querySelectorAll('.buy-now');

buyNowButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Simulate section redirection by scrolling to the product catalog section
        const productCatalogSection = document.getElementById('product-catalog');
        productCatalogSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
