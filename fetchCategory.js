// fetchCategories.js
async function fetchCategories() {
    const categoriesResponse = await fetch('http://13.211.236.206:5000/getCategories', { method: 'GET' });
    const categories = await categoriesResponse.json();
    sessionStorage.setItem('categories', JSON.stringify(categories));
    displayCategories(categories);
}