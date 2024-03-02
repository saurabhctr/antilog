// fetchCategoryOnPage.js

document.addEventListener("DOMContentLoaded", async function() {
    // Fetch category details based on query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');

    try {
        const cards = await fetchCardsByCategory(selectedCategory);
        displayCards(cards);
    } catch (error) {
        console.error(`Error fetching ${selectedCategory} cards:`, error);
    }
});

// Function to fetch cards by category from the API
async function fetchCardsByCategory(category) {
    const noOfCards = 10; // Default number of cards

    // Make AJAX request to the API with category filter
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: `${API_BASE_URL}:5000/getCards`,
            type: 'GET',
            data: {
                noOfCard: noOfCards,
                type: category
            },
            success: function(response) {
                resolve(response.cards);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Function to dynamically display cards on the HTML page
function displayCards(cards) {
    const container = $('#dummy-content');
    container.empty(); // Clear existing content

    cards.forEach((card, index) => {
        const cardDiv = $('<div>').addClass('card');
        // Set the data-card-id attribute
        cardDiv.attr('data-card-id', card.cx_id);
        // Make each card clickable and pass the card_id
        cardDiv.click(function() {
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
