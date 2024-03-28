import API_BASE_URL from './api-config.js'; // Import API_BASE_URL

// Function to fetch card details from the API
function fetchCardDetails(cardId) {
    // Convert cardId to a numeric value
    cardId = Number(cardId);
    // Replace the API_BASE_URL with your actual API base URL

    // Make AJAX request to the API for card details
    $.ajax({
        url: `${window.API_BASE_URL}:5000/getCardDetails`,
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
    const container = $('#card-detail-content');
    container.empty(); // Clear existing content

    // Create an image container
    const imageContainer = $('<div>').addClass('card-detail-image-container');
    const image = $('<img>').addClass('card-detail-image').attr('src', card.cx_image_url).attr('alt', 'Card Image');
    imageContainer.append(image);

    // Create a content container
    const contentDiv = $('<div>').addClass('card-detail-content');

    // Populate text content dynamically
    const name = $('<div>').addClass('card-detail-name').text(card.cx_name);
    const tagline = $('<div>').addClass('card-detail-tagline').text(card.cx_tagline);
    const description = $('<div>').addClass('card-detail-description').text(card.cx_description);

    contentDiv.append(name, tagline, description);

    // Append image and text content to the main container
    container.append(imageContainer, contentDiv);
}

// Get card_id from query parameter
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('card_id');

// Fetch card details when the document is ready
fetchCardDetails(cardId);
