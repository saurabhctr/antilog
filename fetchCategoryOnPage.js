// fetchCategoriesByCats.js

// Function to fetch cards by category from the API
function fetchCardsByCategory(category) {
    return new Promise(function(resolve, reject) {
        const noOfCards = 10; // Default number of cards

        // Make AJAX request to the API with category filter
        $.ajax({
            url: `${API_BASE_URL}:5000/getCards`,
            type: 'GET',
            data: {
                noOfCard: noOfCards,
                type: category
            },
            success: function (response) {
                resolve(response.cards);
            },
            error: function (error) {
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
        cardDiv.attr('data-card-id', card[0].cx_id);
        // Make each card clickable and pass the card_id
        cardDiv.click(function () {
            window.location.href = `card-detail.html?card_id=${card[0].cx_id}`;
        });

        // Make the image clickable with the 'enlargeable' class
        const image = $('<img>').addClass('card-image enlargeable').attr('src', card[0].cx_image_url).attr('alt', 'Card Image');

        // Create a secondary image with the same src as the primary image
        const secondaryImage = $('<img>').addClass('card-secondary-image').attr('src', card[0].cx_image_url).attr('alt', 'Secondary Image');

        // Make the content clickable with the 'popupable' class
        const contentDiv = $('<div>').addClass('card-content popupable');

        const name = $('<h3>').addClass('card-title').text(card[0].cx_name);
        const description = $('<p>').addClass('card-description').text(card[0].cx_description);

        contentDiv.append(name, description);
        cardDiv.append(image, secondaryImage, contentDiv); // Append both images and the content to the card
        container.append(cardDiv); // Append each card to the container
    });
}
// Click handler for category tabs
$('body').on('click', '#categoryTabs button', async function () {
    const category = $(this).text(); // Get the category text
    try {
        const cards = await fetchCardsByCategory(category);
        displayCards(cards);
        navigateToCategoryPage(category); // Redirect to the category page
    } catch (error) {
        console.log(`Error fetching ${category} cards:`, error);
    }
});

// Function to navigate to the category page with a query parameter
function navigateToCategoryPage(category) {
    window.location.href = `category.html?category=${encodeURIComponent(category)}`;
}

const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('category');

const cards =  fetchCardsByCategory(selectedCategory).then((response)=>{
    console.log(response)
    // displayCards(cards);
});
