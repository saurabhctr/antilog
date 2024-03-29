// checkout.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const emailInput = document.getElementById('email');
    const disclaimerCheckbox = document.getElementById('disclaimer');
    const continueToPaymentButton = document.getElementById('continueToPayment');

    // Define placeholder text for input fields
    const placeholders = {
        name: 'Turiya Matata',
        mobile: '9870956783',
        email: 'testYourLimits@sensitation.rj',
    };

    // Set initial placeholder text
    setInitialPlaceholders();

    // Function to set initial placeholder text
    function setInitialPlaceholders() {
        nameInput.placeholder = placeholders.name;
        mobileInput.placeholder = placeholders.mobile;
        emailInput.placeholder = placeholders.email;
    }

    // Function to toggle button state based on checkbox and input fields
    function toggleButtonState() {
        const name = nameInput.value.trim();
        const mobile = mobileInput.value.trim();
        const email = emailInput.value.trim();
        const disclaimerChecked = disclaimerCheckbox.checked;

        // Enable button if all mandatory fields are filled and disclaimer is checked
        if (name && mobile && email && disclaimerChecked) {
            continueToPaymentButton.classList.add('enabled');
            continueToPaymentButton.disabled = false;
        } else {
            continueToPaymentButton.classList.remove('enabled');
            continueToPaymentButton.disabled = true;
        }
    }

    // Add event listeners for input fields and checkbox
    nameInput.addEventListener('input', function() {
        togglePlaceholder(nameInput);
        toggleButtonState();
    });
    mobileInput.addEventListener('input', function() {
        togglePlaceholder(mobileInput);
        toggleButtonState();
    });
    emailInput.addEventListener('input', function() {
        togglePlaceholder(emailInput);
        toggleButtonState();
    });
    disclaimerCheckbox.addEventListener('change', toggleButtonState);

    // Add submit event listener for the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        createOrder(); // Call the function to create the order
    });
});

// Function to toggle placeholder text based on input
function togglePlaceholder(input) {
    if (input.value.trim()) {
        input.placeholder = '';
    } else {
        const fieldName = input.id;
        input.placeholder = placeholders[fieldName];
    }
}

// Function to create the order
// Function to create the order
// Function to create the order
function createOrder() {
    const orderId = generateOrderId(); // Generate a random order ID
    const paymentDetailsUrl = `payment-details.html?order_id=${orderId}`; // Construct the URL for payment details page
    // Redirect to the payment details page
    window.location.href = paymentDetailsUrl;
}


// Function to generate a random order ID
function generateOrderId() {
    return Math.random().toString(36).substr(2, 9); // Example: "5a8bh7c9k"
}
