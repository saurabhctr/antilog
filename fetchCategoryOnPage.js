// Change from fetchCategoriesByCats.js to fetchCategoryOnPage.js

// Function to fetch cards by category from the API
async function fetchCardsByCategory(category) {
    try {
        const noOfCards = 10; // Default number of cards
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
    console.log("Displaying cards:", cards); // Log cards to console
    const container = $('#dummy-content');
    container.empty(); // Clear existing content

    cards.forEach((card, index) => {
        // Display logic for cards...
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
