// Function to fetch cards by category from the API
function fetchCardsByCategory(category) {
    const noOfCards = 10; // Default number of cards

    // Make AJAX request to the API with category filter
    $.ajax({
        url: `${API_BASE_URL}:5000/getCards`,
        type: 'GET',
        data: { type: category, noOfCards: noOfCards },
        success: function (response) {
            displayCards(response.cards);
        },
        error: function (error) {
            console.log(`Error fetching ${category} cards:`, error);
        }
    });
}

// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://3.26.65.147:5000/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    const categoryTabsContainer = document.getElementById('categoryTabs');
    categoryTabsContainer.innerHTML = ''; // Clear existing content to prevent duplication
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.innerText = category; // Assuming the category object has a 'name' property
        tab.onclick = () => fetchCardsByCategory(category);
        categoryTabsContainer.appendChild(tab);
    });
}


// displayCategories.js
function displayCategories(categories) {
    const categoryTabsContainer = document.createElement('div');
    categoryTabsContainer.id = 'categoryTabs';
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.innerText = category;
        tab.onclick = () => fetchCardsByCategory(category);
        categoryTabsContainer.appendChild(tab);
    });
    document.body.insertBefore(categoryTabsContainer, document.getElementById('product-details'));
}

