function fetchProductsByCategory(category) {
    fetch(`yourApiEndpoint/products?category=${category}`)
      .then(response => response.json())
      .then(data => displayProducts(data))
      .catch(error => console.error('Error:', error));
  }
  
  function displayProducts(products) {
    const container = document.getElementById('products');
    container.innerHTML = ''; // Clear existing products
    products.forEach(product => {
      const productCard = `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <ul>
            <li>Benefits: ${product.benefits.join(', ')}</li>
            <li>Services: ${product.services.join(', ')}</li>
          </ul>
          <p>Price: $${product.price}</p>
          <button onclick="location.href='payment-page.html';">Buy Now</button>
        </div>
      </div>`;
      container.innerHTML += productCard;
    });
  }
  