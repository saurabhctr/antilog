$(document).ready(function () {
    // Function to fetch cards from the API
    function fetchCards() {
        const noOfCards = 10; // Default number of cards
        const cardType = 'web'; // Default card type
        const filters = ''; // Additional filters if needed

        // Make AJAX request to the API
        $.ajax({
            url: `http://3.26.226.77:5000/getCards?noOfCard=${noOfCards}&type=${cardType}&filters=${JSON.stringify(filters)}`,
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

        let rowDiv = $('<div>').addClass('dummy-content-row');
        cards.forEach((card, index) => {
            if (index % 3 === 0 && index !== 0) { // Every 3 cards, start a new row
                container.append(rowDiv);
                rowDiv = $('<div>').addClass('dummy-content-row');
            }

            const cardDiv = $('<div>').addClass('dummy-card').css({ 'max-width': '30%', 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2)', 'margin': '10px' });
            const image = $('<img>').attr('src', card.cx_image_url).attr('alt', 'Card Image').css({ 'width': '100%', 'height': 'auto' });
            const name = $('<h3>').text(card.cx_name).css({ 'margin': '10px 0 0 0' });
            const tagline = $('<p>').text(card.cx_tagline).css({ 'font-style': 'italic' });
            const description = $('<p>').text(card.cx_description).css({ 'text-align': 'justify' });

            cardDiv.append(image, name, tagline, description);
            rowDiv.append(cardDiv);

            if ((index + 1) === cards.length) { // Append the last row if it's the end of the array
                container.append(rowDiv);
            }
        });
    }

    // Fetch cards when the document is ready
    fetchCards();
});
