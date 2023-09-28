require("dotenv").config();

const express = require("express");
const app = express();
const UserController = require("./controllers/userController");
const cors = require("cors");
const { authenticateToken } = require("./utils/authenticateToken");

app.use(express.json());
app.use(cors());

app.post("/token", UserController.refreshToken)
app.post("/signup", UserController.createUser);
app.post("/login", UserController.loginUser);
app.get("/user", authenticateToken, UserController.getUserData);
app.delete("/logout", UserController.logout)


app.listen(4001, () => {
  console.log("Auth Server is running.");
});
