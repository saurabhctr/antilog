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
  
  
  function fetchProductsByCategory(category) {
    if (sessionStorage.getItem(category)) {
        displayProducts(JSON.parse(sessionStorage.getItem(category)));
    } else {
        fetch(`http://13.211.236.206:5000/products?category=${category}`)
            .then(response => response.json())
            .then(products => {
                sessionStorage.setItem(category, JSON.stringify(products));
                displayProducts(products);
            })
            .catch(error => console.error('Error:', error));
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
  