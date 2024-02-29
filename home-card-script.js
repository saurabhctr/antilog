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

             // Make each card clickable and pass the card_id
             cardDiv.click(function () {
                window.location.href = `card-detail.html?card_id=${card.card_id}`;
            });
                    
            // Make the image clickable with the 'enlargeable' class
            const image = $('<img>').addClass('card-image enlargeable').attr('src', card.cx_image_url).attr('alt', 'Card Image');
            
            // Create a secondary image with the same src as the primary image
            const secondaryImage = $('<img>').addClass('card-secondary-image').attr('src', card.cx_image_url).attr('alt', 'Secondary Image');
            
            // Make the content clickable with the 'popupable' class
            const contentDiv = $('<div>').addClass('card-content popupable');
            
            const name = $('<h3>').addClass('card-title').text(card.cx_name);
            const description = $('<p>').addClass('card-description').text(card.cx_description);

            contentDiv.append(name, description);
            cardDiv.append(image, secondaryImage, contentDiv); // Append both images and the content to the card
            container.append(cardDiv); // Append each card to the container

            // Add click event to open card detail page
            cardDiv.click(function () {
                window.location.href = `card-detail.html?id=${card.card_id}`;
            });
        });
    }

    // Fetch cards when the document is ready
    fetchCards();
});
