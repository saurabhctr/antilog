// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://3.25.164.137:5000/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    const categoryTabsContainer = document.getElementById('categoryTabs');
    categoryTabsContainer.innerHTML = ''; // Clear existing content to prevent duplication
    categories.forEach(category => {
        const tab = document.createElement('button');
    
        categoryTabsContainer.appendChild(tab);
    });
}


// displayCategories.js
function displayCategories(categories) {
    const categoryTabsContainer = document.createElement('div');
    categoryTabsContainer.id = 'categoryTabs';
    categories.forEach(category => {
        const tab = document.createElement('button');

        categoryTabsContainer.appendChild(tab);
    });
    document.body.insertBefore(categoryTabsContainer, document.getElementById('product-details'));
}
