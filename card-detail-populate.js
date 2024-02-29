$(document).ready(function () {
    // Function to fetch cards from the API
    function fetchCards() {
        // Replace the API_BASE_URL with your actual API base URL
        const API_BASE_URL = 'https://your-api-base-url';
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
        const container = $('#cardDetailContainer');
        container.empty(); // Clear existing content

        cards.forEach((card, index) => {
            const cardDiv = $('<div>').addClass('card-detail-container');

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

            cardDiv.append(image, contentDiv);
            container.append(cardDiv); // Append each card detail to the container
        });
    }

    // Fetch cards when the document is ready
    fetchCards();
});
