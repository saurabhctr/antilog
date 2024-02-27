$(document).ready(function () {
    // Function to fetch cards from the API
    function fetchCards() {
        const noOfCards = 10; // Default number of cards
        const cardType = 'web'; // Default card type
        const filters = ''; // Additional filters if needed

        // Make AJAX request to the API
        $.ajax({
            url: `http://3.26.226.77:5000/getCards`,
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


    // Fetch cards when the document is ready
    fetchCards();
});
