$(document).ready(function () {
    // Function to fetch cards from the API
    ////?noOfCard=${noOfCards}&type=${cardType}&filters=${JSON.stringify(filters)}`,

    function fetchCards() {
        const noOfCards = 10;  // Default number of cards
        const cardType = 'web';  // Default card type
        // Additional filters if needed
        const filters = '';

        // Make AJAX request to the API
        $.ajax({
            url: `http://3.26.226.77:5000/getCards?`,
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
        container.empty();  // Clear existing content

        // Create a grid layout with a maximum of 3 cards per row and 5 rows
        for (let i = 0; i < 5; i++) {
            const rowDiv = $('<div>').addClass('dummy-content-row');

            // Create cards for the current row
            for (let j = 0; j < 3 && (i * 3 + j) < cards.length; j++) {
                const card = cards[i * 3 + j];
                const cardDiv = $('<div>').addClass('dummy-card');

                const image = $('<img>').attr('src', card.cx_image_url).attr('alt', 'Card Image');
                const name = $('<p>').text(card.cx_name);
                const tagline = $('<p>').text(card.cx_tagline);
                const description = $('<p>').text(card.cx_description);

                cardDiv.append(image, name, tagline, description);
                rowDiv.append(cardDiv);
            }

            container.append(rowDiv);
        }
    }

    // Fetch cards when the document is ready
    fetchCards();
});
