console.log("SCRIPT LOADED");

let allProducts = [];
const productsDiv = document.getElementById("products");

//////////////////////////////////////////////////
// LOAD ALL PRODUCTS
//////////////////////////////////////////////////

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    showProducts(data);
  })
  .catch(err => {
    console.error("Backend error:", err);
    productsDiv.innerHTML = "<h2>⚠ Backend not connected</h2>";
  });

//////////////////////////////////////////////////
// LOAD CATEGORY
//////////////////////////////////////////////////

function loadCategory(category) {

  fetch(`/api/products/category/${category}`)
    .then(res => res.json())
    .then(data => {
      showProducts(data);
    })
    .catch(err => console.error(err));
}

//////////////////////////////////////////////////
// VIEW PRODUCT
//////////////////////////////////////////////////

function viewProduct(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product.html";
}

//////////////////////////////////////////////////
// ADD TO CART
//////////////////////////////////////////////////

function addToCart(product) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("✅ Added to cart!");
}

//////////////////////////////////////////////////
// SHOW PRODUCTS
//////////////////////////////////////////////////

function showProducts(products) {

  productsDiv.innerHTML = "";

  products.forEach(p => {

    let img = "shopping-bag";

    if (p.category === "Electronics") img = "android";
    else if (p.category === "Fashion") img = "clothes";
    else if (p.category === "Home") img = "sofa";
    else if (p.category === "Appliances") img = "washing-machine";

    productsDiv.innerHTML += `
    
      <div class="card">

        <img 
          src="https://img.icons8.com/fluency/200/${img}.png"
          alt="${p.name}"
          onclick="viewProduct('${p._id}')"
          style="cursor:pointer"
          onerror="this.src='https://img.icons8.com/fluency/200/shopping-bag.png'"
        >

        <h4 onclick="viewProduct('${p._id}')" style="cursor:pointer">
            ${p.name}
        </h4>

        <p class="price">₹${p.price}</p>

        <button onclick='addToCart(${JSON.stringify(p)})'>
          Add to Cart
        </button>

      </div>
    `;
  });
}

//////////////////////////////////////////////////
// SEARCH
//////////////////////////////////////////////////

function searchProducts(text){

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(text.toLowerCase())
  );

  if(filtered.length === 0){
    productsDiv.innerHTML = "<h2>No products found 😔</h2>";
  }else{
    showProducts(filtered);
  }
}
