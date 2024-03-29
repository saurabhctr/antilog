document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const emailInput = document.getElementById('email');
    const disclaimerCheckbox = document.getElementById('disclaimer');
    const continueToPaymentButton = document.getElementById('continueToPayment');

    // Function to enable/disable button based on checkbox state
    function toggleButtonState() {
        continueToPaymentButton.disabled = !disclaimerCheckbox.checked || !form.checkValidity();
    }

    // Add event listeners for input fields and checkbox
    nameInput.addEventListener('input', toggleButtonState);
    mobileInput.addEventListener('input', toggleButtonState);
    emailInput.addEventListener('input', toggleButtonState);
    disclaimerCheckbox.addEventListener('change', toggleButtonState);

    // Add submit event listener for the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        const orderId = generateOrderId(); // Function to generate order ID
        const checkoutUrl = `checkout.html?order_id=${orderId}`;
        window.location.href = checkoutUrl; // Redirect to checkout page with order ID
    });
});

// Function to generate a random order ID
function generateOrderId() {
    return Math.random().toString(36).substr(2, 9); // Example: "5a8bh7c9k"
}
