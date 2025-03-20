let productsData = [];
let currentPage = 1;
const itemsPerPage = 20;
// Change the filename here for different websites (e.g., data1.json or data2.json)
const jsonFile = "Toy.json";

document.addEventListener("DOMContentLoaded", () => {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      productsData = data;
      displayProducts();
      setupPagination();
    })
    .catch(error => console.error("Error loading JSON:", error));
    
  document.getElementById("searchBtn").addEventListener("click", () => {
    currentPage = 1;
    displayProducts();
    setupPagination();
  });

  document.getElementById("search").addEventListener("keypress", event => {
    if (event.key === "Enter") {
      currentPage = 1;
      displayProducts();
      setupPagination();
    }
  });
});

function displayProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";
  
  let filteredData = filterProducts(productsData);
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let paginatedItems = filteredData.slice(start, end);
  
  paginatedItems.forEach(product => {
    let productHTML = `
      <div class="product">
        <a href="${product.link}" target="_blank">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <h3>${product.name}</h3>
        <p class="rating">⭐ ${product.ratings} (${product.no_of_ratings})</p>
        <p class="price">₹${product.discount_price} <span class="actual-price">₹${product.actual_price}</span></p>
      </div>
    `;
    productsContainer.innerHTML += productHTML;
  });
}

function setupPagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  let filteredData = filterProducts(productsData);
  let totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      displayProducts();
      setupPagination();
    });
    paginationContainer.appendChild(btn);
  }
}

function filterProducts(data) {
  let query = document.getElementById("search").value.toLowerCase();
  return data.filter(product => product.name.toLowerCase().includes(query));
}
