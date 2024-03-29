
function createOrder(cardId) {
    // Make AJAX request to create the order
    $.ajax({
        url: `${window.API_BASE_URL}:5000/createOrder`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ cardId: cardId }),
        success: function(response) {
            if (response && response.message === 'Order created successfully') {
                // Extract the order data from the response
                const orderData = response.order_data; // Adjust this based on your response structure

                // Check if the order data is valid
                if (orderData && orderData.order_id) {
                    // Construct URL for checkout page with order ID as query parameter
                    const checkoutUrl = `checkout.html?order_id=${orderData.order_id}`;

                    // Redirect user to the checkout page
                    window.location.href = checkoutUrl;
                } else {
                    console.log('Invalid order data received:', orderData);
                    alert('Error processing order data. Please try again.');
                }
            } else {
                console.log('Error creating order:', response.error);
                alert('Error creating order. Please try again.');
            }
        },
        error: function(error) {
            console.log('Error creating order:', error);
            alert('Error creating order. Please try again.');
        }
    });
}
