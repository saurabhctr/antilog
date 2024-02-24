// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('getCategoriesAPIEndpoint', { method: 'GET' });
    const categories = await categoriesResponse.json();
    sessionStorage.setItem('categories', JSON.stringify(categories));
    displayCategories(categories);
}
