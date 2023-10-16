const express = require("express");
const app = express();
const ProductController = require("./controllers/productController");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const { authenticateToken } = require("./utils/authenticateToken");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (_, res) => {
  res.json("Hello, World!");
});

app.get("/home", authenticateToken, (req, res) => {
  res.json("Hello, Home!");
});

app.post("/createProduct", authenticateToken, ProductController.create);
app.get("/listProducts", ProductController.listAll);
app.get("/listProducts/:productId", ProductController.listProduct);

//EXAMPLE USING MIDDLEWARE OF MULTER. REMEMBER THAT THE NAME OF INPUT MUST BE THE SAME OF THE UPLOAD.SINGLE
app.post("/upload", upload.single("image"), (req, res) => {
  res.send("IMAGE UPLOADED");
});

app.listen(4000, () => {
  console.log("Main server is running.");
});
