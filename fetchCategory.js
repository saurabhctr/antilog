// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://localhost:5001/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    sessionStorage.setItem('categories', JSON.stringify(categories));
    displayCategories(categories);
}
