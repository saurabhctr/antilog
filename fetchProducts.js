window.onload = function() {
    fetchCategoriesAndProducts(); // Fetch categories and initial products on page load
  };
  
  function fetchCategoriesAndProducts() {
    // Fetch categories logic here (e.g., populate category buttons)
    fetchFirstCategoryProducts(); // Fetch products for the first category
  }
  
  function fetchProductsByCategory(category) {
    fetch(`http://13.211.236.206:5000/products?category=${category}`)
      .then(response => response.json())
      .then(products => displayProducts(products))
      .catch(error => console.error('Error:', error));
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
  