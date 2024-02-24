// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://13.211.236.206:5000/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    const categoryTabsContainer = document.getElementById('categoryTabs');
    categoryTabsContainer.innerHTML = ''; // Clear existing content to prevent duplication
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.innerText = category.name; // Assuming the category object has a 'name' property
        tab.onclick = () => fetchProductsByCategory(category.name);
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
        tab.onclick = () => fetchProductsForCategory(category.name);
        categoryTabsContainer.appendChild(tab);
    });
    document.body.insertBefore(categoryTabsContainer, document.getElementById('product-details'));
}

