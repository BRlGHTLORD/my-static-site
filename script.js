// Step 3: Fetch product data from the API endpoint with optional URL parameter
function fetchProducts(query = 'drone', limit = 3, nextUrl = null) {
  // If a nextUrl is provided, use that; otherwise, build the URL using the query and limit.
  const apiUrl = nextUrl || `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your valid token or use backend proxy for security
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API Data:', data);
      displayProducts(data, query, limit);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}

// Step 3: Update displayProducts to handle pagination
function displayProducts(data, query, limit) {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = ''; // Clear previous content

  data.itemSummaries.forEach(item => {
    // Create a container for each product
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    // Create product title element
    const title = document.createElement('h3');
    title.textContent = item.title;

    // Create product image element
    const img = document.createElement('img');
    img.src = item.image.imageUrl;
    img.alt = item.title;

    // Create price element
    const price = document.createElement('p');
    price.textContent = `Price: ${item.price.value} ${item.price.currency}`;

    // Append the elements to the item container
    itemDiv.appendChild(img);
    itemDiv.appendChild(title);
    itemDiv.appendChild(price);

    // Append the item container to the products div
    productsDiv.appendChild(itemDiv);
  });

  // Handle pagination
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = ''; // Clear previous pagination buttons

  if (data.next) {
    // Create a "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      // When clicked, fetch the next page using the next URL provided by eBay
      fetchProducts(query, limit, data.next);
    });
    paginationDiv.appendChild(nextButton);
  }
}

// Attach event listener to the search button
document.getElementById('searchBtn').addEventListener('click', () => {
  const searchInput = document.getElementById('search').value;
  // When new search is initiated, clear pagination as well
  document.getElementById('pagination').innerHTML = '';
  fetchProducts(searchInput);
});

// On page load, fetch default products
fetchProducts();
