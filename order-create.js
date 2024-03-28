// Function to create an order
function createOrder(cardId) {
    // API endpoint for order creation
    const createOrderUrl = `${window.API_BASE_URL}:5000/createOrder`;

    // Data to be sent in the request body
    const requestData = {
        cardId: cardId
    };

    // Options for the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };

    // Send the fetch request to create the order
    fetch(createOrderUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful order creation
            console.log('Order created successfully:', data);
            // You can perform additional actions here, such as showing a success message to the user
        })
        .catch(error => {
            // Handle errors
            console.error('Error creating order:', error);
            // You can display an error message to the user or perform other error handling actions
        });
}
