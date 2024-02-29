$(document).ready(function () {
    // Function to fetch cards from the API
    function fetchCards() {
        const noOfCards = 10; // Default number of cards
        const cardType = 'web'; // Default card type
        const filters = ''; // Additional filters if needed

        // Make AJAX request to the API
        $.ajax({
            url: `${API_BASE_URL}:5000/getCards`,
            /*?noOfCard=${noOfCards}&type=${cardType}&filters=${JSON.stringify(filters)}*/
            type: 'GET',
            success: function (response) {
                displayCards(response.cards);
            },
            error: function (error) {
                console.log('Error fetching cards:', error);
            }
        });
    }

   // Function to dynamically display cards on the HTML page
   function displayCards(cards) {
    const container = $('#dummy-content');
    container.empty(); // Clear existing content

    cards.forEach((card, index) => {
        const cardDiv = $('<div>').addClass('card');
        const image = $('<img>').addClass('card-image').attr('src', card.cx_image_url).attr('alt', 'Card Image');
        // Create a secondary image with the same src as the primary image
        const secondaryImage = $('<img>').addClass('card-secondary-image').attr('src', card.cx_image_url).attr('alt', 'Secondary Image');
        const contentDiv = $('<div>').addClass('card-content');
        const name = $('<h3>').addClass('card-title').text(card.cx_name);
        const description = $('<p>').addClass('card-description').text(card.cx_description);

        contentDiv.append(name, description);
        cardDiv.append(image, secondaryImage, contentDiv); // Append both images and the content to the card
        container.append(cardDiv); // Append each card to the container
    });
    }
// Function to handle card click events
function handleCardClick(card) {
    const container = $('#dummy-content');
    const image = card.find('.card-image');

    // Create an element for enlarged image view
    const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
    const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', image.attr('src')).attr('alt', 'Enlarged Image');

    // Handling image click
    image.click(function () {
        // Enlarge the image
        enlargedImageContainer.append(enlargedImage);
        container.append(enlargedImageContainer);

        // Remove event listener after the animation is complete
        setTimeout(function () {
            image.off('click');
            enlargedImageContainer.click(function () {
                // Restore the original size
                enlargedImageContainer.remove();

                // Re-attach the initial click event listener
                handleCardClick(card);
            });
        }, 500); // Adjust the duration based on your animation time
    });
}

// Ensure that the click event is attached to the card when the document is ready
$(document).ready(function () {
    handleCardClick($('.card')); // Adjust the selector based on your actual card structure
});





    // Fetch cards when the document is ready
    fetchCards();
});
