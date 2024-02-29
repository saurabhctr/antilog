$(document).ready(function () {
    // Function to fetch card details from the API
    function fetchCardDetails(cardId) {
        // Replace the API_BASE_URL with your actual API base URL
        const API_BASE_URL = 'http://3.25.164.137';

        // Make AJAX request to the API for card details
        $.ajax({
            url: `${API_BASE_URL}:5000/getCardDetails`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ cardIds: [cardId] }),
            success: function (response) {
                displayCardDetails(response.cardsDetails[0]); // Assuming the response contains an array of card details
            },
            error: function (error) {
                console.log('Error fetching card details:', error);
            }
        });
    }

    // Function to dynamically display card details on the HTML page
    function displayCardDetails(card) {
        const container = $('#cardDetailContainer');
        container.empty(); // Clear existing content

        // Create an image element
        const image = $('<img>').addClass('card-detail-image').attr('src', card.cx_image_url).attr('alt', 'Card Image');

        // Create content container
        const contentDiv = $('<div>').addClass('card-detail-content');

        // Populate content dynamically
        Object.keys(card).forEach(key => {
            if (key !== 'cx_image_url') {
                const element = $('<p>').addClass(`card-detail-${key}`).text(`${key}: ${card[key]}`);
                contentDiv.append(element);
            }
        });

        container.append(image, contentDiv);
    }

    // Get card_id from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card_id');

    // Check if cardId is present before making the API call
    if (cardId) {
        // Fetch card details when the document is ready
        fetchCardDetails(cardId);
    } else {
        console.log('Card ID not found in the URL');
        // Handle the case where cardId is not present
        // You can redirect to an error page or handle it as needed
    }
});
