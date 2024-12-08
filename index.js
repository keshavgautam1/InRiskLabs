const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

let products = [];

const fetchProducts = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    products = response.data.products;
  } catch (error) {
    console.error(
      "Error fetching products from Dummy JSON API:",
      error.message
    );
  }
};

fetchProducts();

app.get("/products", (req, res) => {
  if (products.length === 0) {
    return res.status(500).json({
      error: "Products could not be fetched. Please try again later.",
    });
  }
  res.json(products);
});

app.post("/products", (req, res) => {
  const { title, price, category } = req.body;

  if (!title || !price || !category) {
    return res
      .status(400)
      .json({ error: "Product must include title, price, and category." });
  }

  const newProduct = {
    id: products.length + 1,
    title,
    price,
    category,
  };
  products.push(newProduct);

  res.status(201).json(products);
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
