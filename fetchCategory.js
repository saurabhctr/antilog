// fetchCategories.js
async function fetchCategories() {
    const url ='${window.API_BASE_URL}:5000/getCategories'

    const categoriesResponse = await fetch(url, { method: 'GET' });
    const categories = await categoriesResponse.json();
    const categoryTabsContainer = document.getElementById('categoryTabs');
    categoryTabsContainer.innerHTML = ''; // Clear existing content to prevent duplication
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.innerText = category; // Assuming the category object has a 'name' property
        tab.onclick = () => navigateToCategoryPage(category);
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
        tab.onclick = () => navigateToCategoryPage(category);
        categoryTabsContainer.appendChild(tab);
    });
    document.body.insertBefore(categoryTabsContainer, document.getElementById('product-details'));
}

// Function to navigate to the category page with query parameter
function navigateToCategoryPage(category) {
    window.location.href = `category.html?category=${encodeURIComponent(category)}`;
}