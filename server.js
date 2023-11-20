const express = require("express");
const app = express();
const ProductController = require("./controllers/productController");
const FeedbackController = require("./controllers/feedbackController")
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { authenticateToken } = require("./utils/authenticateToken");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/productImages", express.static("productImages"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "productImages");
  },
  filename: (req, file, cb) => {
    const originalExt = path.extname(file.originalname);
    cb(null, Date.now() + originalExt);
  },
});
const upload = multer({
  storage: storage,
  preservePath: true, // Preserve the original file extension
});





app.get("/", (_, res) => {
  res.json("Hello, World!");
});

app.get("/home", authenticateToken, (req, res) => {
  res.json("Hello, Home!");
});

app.post(
  "/createProduct",
  authenticateToken,
  upload.single("image"),
  ProductController.create
);
app.get("/getCategories", ProductController.getCategories);
app.get("/listProducts", ProductController.listAll);
app.get("/listProducts/:productId", ProductController.listProduct);
app.get(
  "/listPersonalProducts/:seller_id",
  ProductController.listPersonalProducts
);


// FEEDBACKS

app.post("/createFeedback", authenticateToken, FeedbackController.create)
app.get("/getFeedbacks/:productId", FeedbackController.getFeedbacks)
app.delete("/deleteFeedback/:feedbackId", authenticateToken, FeedbackController.deleteFeedback)


app.listen(4000, () => {
  console.log("Main server is running.");
});
