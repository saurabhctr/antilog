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

    // Additional components
    const additionalContent1 = $('<div>').addClass('additional-content').text('Additional Content 1');
    const additionalContent2 = $('<div>').addClass('additional-content-iframe');
    const iframe = $('<iframe>').attr('src', `${window.API_BASE_URL}:5006/gra`).attr('frameborder', '0');
    additionalContent2.append(iframe);

    // Append image and text content to the main container
    container.append(imageContainer, contentDiv);
    contentDiv.append(name, tagline, description, additionalContent1, additionalContent2);

    // Set the width of additionalContent2 dynamically based on content
    iframe.on('load', function() {
        const contentWidth = iframe.contents().width();
        additionalContent2.css('width', contentWidth + 'px');
    });


    // Create a script tag to include Bokeh library and your Bokeh application code
    const bokehScript = document.createElement('script');
    bokehScript.src = 'https://cdn.bokeh.org/bokeh/release/bokeh-2.3.3.min.js'; // Replace with the Bokeh CDN URL
    bokehScript.onload = function () {
        const bokehAppScript = document.createElement('script');
        const bokehAppUrl = `${window.API_BASE_URL}:5006/gra`; // Parameterized Bokeh application URL
        bokehAppScript.src = bokehAppUrl;
        additionalContent2.append(bokehAppScript);
    };
    document.body.appendChild(bokehScript);
}

// Get card_id from query parameter
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('card_id');

// Fetch card details when the document is ready
$(document).ready(function() {
    fetchCardDetails(cardId);
});
