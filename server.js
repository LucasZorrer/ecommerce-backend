const express = require("express");
const app = express();
const ProductController = require("./controllers/productController");
const jwt = require("jsonwebtoken");
require("dotenv").config();
app.use(express.json());

app.get("/", (_, res) => {
  res.json("Hello, World!");
});

app.get("/home", authenticateToken, (req, res) => {
  res.json("Hello, Home!");
});

app.post("/createProduct", authenticateToken, ProductController.create);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(4000, () => {
  console.log("Main server is running.");
});
