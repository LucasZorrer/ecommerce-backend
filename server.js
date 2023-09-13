const express = require("express");
const UserController = require("./controllers/userController");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, World!");
});

app.post("/signup", UserController.createUser);

app.listen(4000, () => {
  console.log("server is running.");
});
