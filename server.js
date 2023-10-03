const express = require("express");
const app = express();
const ProductController = require("./controllers/productController");
const cors = require("cors");
const { authenticateToken } = require("./utils/authenticateToken");
require("dotenv").config();
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.json("Hello, World!");
});

app.get("/home", authenticateToken, (req, res) => {
  res.json("Hello, Home!");
});

app.post("/createProduct", authenticateToken, ProductController.create);
app.get("/listProducts", ProductController.listAll);

app.listen(4000, () => {
  console.log("Main server is running.");
});
