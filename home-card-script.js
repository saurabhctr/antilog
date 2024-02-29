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
    const container = $('#dummy-content'); // Adjust this selector based on your actual container
    const image = card.find('.card-image');
    const secondaryImage = card.find('.card-secondary-image');
    const content = card.find('.card-content');

    // Create elements for enlarged image view
    const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
    const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', image.attr('src')).attr('alt', 'Enlarged Image');
    
    // Create elements for enlarged content view
    const enlargedContent = $('<div>').addClass('enlarged-content');
    const closeButton = $('<span>').addClass('close-button').text('✖');
    
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

                // Remove the second click event listener
                enlargedImageContainer.off('click');
                // Re-attach the initial click event listener
                handleCardClick(card);
            });
        }, 500); // Adjust the duration based on your animation time
    });

    // Handling text description click
    description.click(function () {
        // Populate enlarged content
        enlargedContent.append(content.html());
        enlargedContent.append(closeButton);
        container.append(enlargedContent);

        // Remove event listener after the animation is complete
        setTimeout(function () {
            content.off('click');
            closeButton.click(function () {
                // Restore the original size
                enlargedContent.remove();

                // Remove the second click event listener
                closeButton.off('click');
                // Re-attach the initial click event listener
                handleCardClick(card);
            });
        }, 500); // Adjust the duration based on your animation time
    });

    // Handling white part click
    card.click(function (event) {
        if (event.target === card[0]) {
            // Redirect to the product detail page
            window.location.href = 'your_product_detail_page_url';
        }
    });
}





    // Fetch cards when the document is ready
    fetchCards();
});
