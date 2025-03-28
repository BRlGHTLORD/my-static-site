// script.js

// Function to fetch products from the proxy endpoint
function fetchProducts(query = 'drone', limit = 3, nextUrl = null) {
  // Replace with your actual backend proxy URL from Render:
  const backendUrl = 'https://ebay-backend-5f1o.onrender.com';
  // Build the full URL using the backend URL
  const apiUrl = nextUrl || `${backendUrl}/api/ebay-search?q=${encodeURIComponent(query)}&limit=${limit}`;

  fetch(apiUrl, {
    method: 'GET'
    // No need for Authorization header here because our backend handles it.
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

// Function to parse and display product data on the page
function displayProducts(data, query, limit) {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = ''; // Clear previous results

  data.itemSummaries.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    // Product title
    const title = document.createElement('h3');
    title.textContent = item.title;

    // Product image
    const img = document.createElement('img');
    img.src = item.image.imageUrl;
    img.alt = item.title;

    // Product price
    const price = document.createElement('p');
    price.textContent = `Price: ${item.price.value} ${item.price.currency}`;

    // Append elements
    itemDiv.appendChild(img);
    itemDiv.appendChild(title);
    itemDiv.appendChild(price);
    productsDiv.appendChild(itemDiv);
  });

  // Handle pagination
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = ''; // Clear previous pagination
  if (data.next) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      fetchProducts(query, limit, data.next);
    });
    paginationDiv.appendChild(nextButton);
  }
}

// Attach event listener to the search button
document.getElementById('searchBtn').addEventListener('click', () => {
  const searchInput = document.getElementById('search').value;
  console.log("Search query:", searchInput); // Debug: log the search query
  document.getElementById('pagination').innerHTML = '';
  fetchProducts(searchInput);
});

// Fetch default products on page load
fetchProducts();
