console.log("PRODUCT PAGE LOADED");

const icons = {
    electronics: "android",
    fashion: "t-shirt",
    home: "sofa",
    appliances: "washing-machine"
};

const productId = localStorage.getItem("productId");

if (!productId) {
    alert("No product selected!");
    window.location.href = "index.html";
}

// ⭐ FETCH SINGLE PRODUCT
fetch(`/api/products/${productId}`)
.then(res => res.json())
.then(product => {

    console.log("Loaded Product:", product);

    const category = product.category.toLowerCase().trim();
    let img = icons[category] || "shopping-bag";

    document.getElementById("productImg").src =
        `https://img.icons8.com/fluency/300/${img}.png`;

    document.getElementById("productName").innerText = product.name;
    document.getElementById("productPrice").innerText = "₹" + product.price;

    document.getElementById("productDesc").innerText =
        getDescription(product.category, product.name);

    window.currentProduct = product;
})
.catch(err => {
    console.error("Product fetch error:", err);
});


// ⭐ DESCRIPTION
function getDescription(category, name){

    const descriptions = {

        Electronics:
        `Experience top performance with the ${name}. Built with advanced technology, powerful hardware, and sleek design — perfect for work, gaming, and entertainment.`,

        Fashion:
        `Upgrade your wardrobe with the stylish ${name}. Made from premium fabric for superior comfort.`,

        Home:
        `Enhance your living space with the elegant ${name}. Designed for comfort and durability.`,

        Appliances:
        `Make daily tasks easier with the reliable ${name}. Energy efficient and built to last.`
    };

    return descriptions[category] || 
    "High-quality product with excellent durability.";
}


// ⭐ ADD TO CART
function addToCart(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(window.currentProduct);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("✅ Added to cart!");
}
