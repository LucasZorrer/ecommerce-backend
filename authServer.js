require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const UserController = require("./controllers/userController");
const { User } = require("./models");
const bcrypt = require("bcrypt");

app.use(express.json());

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ user_id: user.id });
    res.json({ accessToken: accessToken });
  });
});

app.post("/signup", UserController.createUser);

let refreshTokens = [];

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined) {
    res.status(201).json({ success: false, message: "Enter an email" });
  }
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || user === undefined) {
      res.status(201).json({ success: false, message: "Email not registered" });
    }

    const hashedPassword = user.password;
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        return err;
      }
      if (isMatch) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = jwt.sign(
          user.id,
          process.env.REFRESH_TOKEN_SECRET
        );
        refreshTokens.push(refreshToken);
        res.status(201).json({
          success: true,
          message: "Successfully Logged",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.status(201).json({ success: false, message: "Wrong Password." });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function generateAccessToken(user) {
  return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "100s",
  });
}

app.listen(4001, () => {
  console.log("Auth Server is running.");
});
