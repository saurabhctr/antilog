// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://http://0.0.0.0/:5000/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    sessionStorage.setItem('categories', JSON.stringify(categories));
    displayCategories(categories);
}
