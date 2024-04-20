// Change from fetchCategoriesByCats.js to fetchCategoryOnPage.js

// Function to fetch cards by category from the API
async function fetchCardsByCategory(category) {
    try {
        const noOfCards = 20; // Default number of cards
        const response = await $.ajax({
            url: `${window.API_BASE_URL}:5000/getCards`,
            type: 'GET',
            data: {
                noOfCard: noOfCards,
                type: category
            }
        });
        return response.cards;
    } catch (error) {
        console.log(`Error fetching ${category} cards:`, error);
        throw error;
    }
}

 // Function to dynamically display cards on the HTML page
 function displayCards(cards) {
    console.log('Displaying Cards')
    const container = $('category-content');
    container.empty(); // Clear existing content

    cards.forEach((card, index) => {
        const cardDiv = $('<div>').addClass('card');
    // Set the data-card-id attribute
        cardDiv.attr('data-card-id', card.cx_id);
        // Make each card clickable and pass the card_id
        cardDiv.click(function () {
            window.location.href = `card-detail.html?card_id=${card.cx_id}`;
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
    });
}

// Function to navigate to the category page with a query parameter
function navigateToCategoryPage(category) {
    window.location.href = `category.html?category=${encodeURIComponent(category)}`;
}

// Update this part to use the correct function name
$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');
    try {
        const cards = await fetchCardsByCategory(selectedCategory);
        displayCards(cards);
    } catch (error) {
        console.log('Error:', error);
    }
});
