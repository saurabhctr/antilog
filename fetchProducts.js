// fetchProducts.js
async function fetchProductsForCategory(categoryName) {
    const productsResponse = await fetch('productCallAPIEndpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName }),
    });
    const products = await productsResponse.json();
    displayProducts(products);
}
