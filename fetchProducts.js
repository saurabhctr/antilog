window.onload = function() {
    fetchCategoriesAndProducts(); // Ensure this also selects the first category by default
};

  
async function fetchCategoriesAndProducts() {
    await fetchCategories(); // This should populate the category buttons
    const categories = JSON.parse(sessionStorage.getItem('categories'));
    if (categories && categories.length > 0) {
      // Programmatically click the first category button
      document.querySelectorAll('button')[0].click();
    }
  }
  
  
  async function fetchProductsByCategory(categoryName) {
    if (sessionStorage.getItem(categoryName)) {
        displayProducts(JSON.parse(sessionStorage.getItem(categoryName)));
    } else {
        const response = await fetch('http://3.106.255.65:5000/getProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({categoryName: categoryName})
        });
        const products = await response.json();
        sessionStorage.setItem(categoryName, JSON.stringify(products)); // Cache the response
        displayProducts(products);
    }
}

  function fetchFirstCategoryProducts() {
    // Assuming the first category is fetched and stored
    // Call fetchProductsByCategory with the first category's ID or name
  }
  
  function displayProducts(products) {
    const container = document.getElementById('products');
    container.innerHTML = ''; // Clear existing products
    products.forEach(product => {
      const productCard = `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-details">
            <h3>${product.name}</h3>
            <p>${product.subtitle}</p>
            <p>${product.description}</p>
            <ul>
                  ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            <p>Services: ${product.services.join(', ')}</p>
            <p>Price: $${product.price}</p>
            <button class="buy-now-btn" onclick="location.href='payment-page.html';">Buy Now</button>
          </div>
        </div>`;
      container.innerHTML += productCard;
    });
  }
  