const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Product = require("./Product");
const User = require("./User");
const Order = require("./Order");

const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

// ⭐ MAKE IMAGES PUBLIC
app.use("/images", express.static("images"));

app.use(express.static(path.join(__dirname, "frontend")));

// ⭐ MULTER STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, "images");
  },
  filename: function(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });



/* ================= DATABASE ================= */

mongoose.connect("mongodb://127.0.0.1:27017/smartshop")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));


/* ================= PRODUCTS ================= */

/* ⭐ GET ALL PRODUCTS (BEST DEALS) */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).send("Server Error");
  }
});


/* ⭐ GET PRODUCTS BY CATEGORY */
app.get("/api/products/category/:cat", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.cat
    });

    res.json(products);
  } catch {
    res.status(500).send("Category Error");
  }
});


/* ⭐🔥 VERY IMPORTANT — GET SINGLE PRODUCT */
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(500).send("Product Error");
  }
});


/* ⭐ ADD PRODUCT */
app.post("/api/products", upload.single("image"), async (req, res) => {

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: `http://localhost:5000/images/${req.file.filename}`
    });

    await product.save();

    res.send("Product Added with Image!");
});



/* ================= USER ================= */

app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User registered");
  } catch {
    res.status(500).send("Register Error");
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne(req.body);

    if (user) res.send("Login success");
    else res.status(401).send("Invalid credentials");

  } catch {
    res.status(500).send("Login Error");
  }
});


/* ================= ORDER ================= */

app.post("/api/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.send("Order placed");
  } catch {
    res.status(500).send("Order Error");
  }
});


/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
