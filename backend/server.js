require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const Product = require("./Product");
const User = require("./User");
const Order = require("./Order");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

// Serve images
app.use("/images", express.static(path.join(__dirname, "images")));

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));


/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Error:", err));

mongoose.connection.once("open", () => {
  console.log("🔥 CONNECTED DATABASE:", mongoose.connection.name);
});

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, "images");
  },
  filename: function(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


/* ================= PRODUCTS ================= */

// GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).send("Server Error");
  }
});

// GET PRODUCTS BY CATEGORY
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

// GET SINGLE PRODUCT
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(500).send("Product Error");
  }
});

// ADD PRODUCT
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {

    const imageUrl =
      `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: imageUrl
    });

    await product.save();

    res.send("✅ Product Added!");

  } catch {
    res.status(500).send("Upload Error");
  }
});


/* ================= USER ================= */

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("✅ User Registered");
  } catch {
    res.status(500).send("Register Error");
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne(req.body);

    if (user) res.send("✅ Login Success");
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
    res.send("✅ Order Placed");
  } catch {
    res.status(500).send("Order Error");
  }
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});



/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
