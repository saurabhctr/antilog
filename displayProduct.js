function displayProducts(products) {
    const productsContainer = document.querySelector('.product-container');
    productsContainer.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Pricing: $${product.price}</p>
            <a href="checkout.html" class="buy-now">Buy Product</a>
        `;
        productsContainer.appendChild(productCard);
    });
}