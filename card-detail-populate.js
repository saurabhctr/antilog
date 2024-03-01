$(document).ready(function () {
    // Function to fetch card details from the API
    function fetchCardDetails(cardId) {
        // Convert cardId to a numeric value
        cardId = Number(cardId);
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

        // Create an image container
        const imageContainer = $('<div>').addClass('card-detail-image-container');
        const image = $('<img>').addClass('card-detail-image').attr('src', card.cx_image_url).attr('alt', 'Card Image');
        imageContainer.append(image);

        // Create content container
        const contentDiv = $('<div>').addClass('card-detail-content');

        // Populate content dynamically
        const nameDiv = $('<div>').addClass('card-detail-name').text(card.cx_name);
        const taglineDiv = $('<div>').addClass('card-detail-tagline').text(card.cx_tagline);
        const descriptionDiv = $('<div>').addClass('card-detail-description').text(card.cx_description);

        contentDiv.append(nameDiv, taglineDiv, descriptionDiv);

        // Append image container and content div to the main container
        container.append(imageContainer, contentDiv);
    }

    // Get card_id from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card_id');

    // Fetch card details when the document is ready
    fetchCardDetails(cardId);
});
